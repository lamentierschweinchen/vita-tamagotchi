#![no_std]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();


#[type_abi]
#[derive(TopEncode, TopDecode, NestedEncode, NestedDecode, Clone, PartialEq, Debug, Copy)]
pub enum MonState {
    Happy,
    Hungry,
    Critical,
    Dead,
}

#[multiversx_sc::contract]
pub trait VitaTamagotchi {
    #[init]
    fn init(&self) {
        let current_time = self.blockchain().get_block_timestamp_seconds();
        self.last_fed_timestamp().set(current_time);
        self.total_feeds().set(0);
    }

    #[payable("EGLD")]
    #[endpoint]
    fn feed(&self) {
        let payment = self.call_value().egld();
        require!(*payment >= 5000000000000000u64, "Feed cost is 0.005 EGLD"); // 0.005 EGLD

        let current_state = self.get_mon_state();
        require!(current_state != MonState::Dead, "Mon is dead. RIP.");

        let current_time = self.blockchain().get_block_timestamp_seconds();
        self.last_fed_timestamp().set(current_time);
        self.total_feeds().update(|v| *v += 1);
        
        // Emit event (must match signature)
        self.feed_event(self.blockchain().get_caller(), current_time.as_u64_seconds());
    }

    #[view(getMonState)]
    fn get_mon_state(&self) -> MonState {
        let last_fed = self.last_fed_timestamp().get();
        let current_time = self.blockchain().get_block_timestamp_seconds();
        
        if current_time < last_fed {
            return MonState::Happy; // Should not happen ideally
        }
        
        
        let elapsed = current_time - last_fed; // Returns DurationSeconds
        
        // Compare DurationSeconds with DurationSeconds
        if elapsed <= DurationSeconds::new(6 * 3600) {
            MonState::Happy
        } else if elapsed <= DurationSeconds::new(18 * 3600) {
            MonState::Hungry
        } else if elapsed <= DurationSeconds::new(24 * 3600) {
            MonState::Critical
        } else {
            MonState::Dead
        }
    }

    #[endpoint]
    fn issue_mon_sft(&self, _token_display_name: ManagedBuffer, _token_ticker: ManagedBuffer) {
        // Only owner can call
        self.blockchain().check_caller_is_owner();
        
        // Actual issuing logic skipped for MVP simplicity, just storing intent
        // In real implementations, would call ECDTSystemSCAddress
    }

    // Storage
    #[view(getLastFedTimestamp)]
    #[storage_mapper("lastFedTimestamp")]
    fn last_fed_timestamp(&self) -> SingleValueMapper<TimestampSeconds>;

    #[view(getTotalFeeds)]
    #[storage_mapper("totalFeeds")]
    fn total_feeds(&self) -> SingleValueMapper<u64>;

    // Events
    #[event("feedEvent")]
    fn feed_event(&self, #[indexed] caller: ManagedAddress, timestamp: u64);

}


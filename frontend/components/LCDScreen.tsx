
import { PropsWithChildren } from 'react';

// Using a Google Font for pixel look - ensure to import 'Press Start 2P' in globals.css or layout
export default function LCDScreen({ children }: PropsWithChildren) {
    return (
        <div className="w-full aspect-square bg-[#9ea783] rounded-sm relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] flex items-center justify-center">

            {/* Pixel Grid Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                               linear-gradient(to bottom, #000 1px, transparent 1px)`,
                    backgroundSize: '4px 4px'
                }}
            />

            {/* Active Content Layer */}
            <div className="relative z-10 w-full h-full p-4 font-pixel text-[#2c3318]">
                {children}
            </div>

        </div>
    );
}

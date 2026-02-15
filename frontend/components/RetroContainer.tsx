
interface RetroContainerProps {
    children: React.ReactNode;
}

export default function RetroContainer({ children }: RetroContainerProps) {
    return (
        <div className="relative bg-purple-500 rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_-10px_20px_rgba(0,0,0,0.2),inset_0_10px_20px_rgba(255,255,255,0.4)] border-b-8 border-r-8 border-purple-700 w-full max-w-sm mx-auto aspect-[3/4] flex flex-col items-center justify-between">

            {/* Glossy Reflection */}
            <div className="absolute top-4 left-4 right-12 h-12 bg-white/20 rounded-full blur-xl pointer-events-none" />

            {/* Screen Area */}
            <div className="w-full bg-gray-800 rounded-xl p-6 shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] border-4 border-gray-600 relative">
                {/* Screen Reflection */}
                <div className="absolute top-2 right-2 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none rounded-lg" />
                {children}
            </div>

            {/* Branding */}
            <div className="text-purple-900 font-bold tracking-widest text-lg opacity-60">VITA</div>

            {/* Buttons */}
            <div className="flex gap-6 mb-8">
                {['A', 'B', 'C'].map((label) => (
                    <div key={label} className="group flex flex-col items-center gap-1">
                        <button className="w-12 h-12 rounded-full bg-purple-400 shadow-[0_4px_0_rgb(107,33,168),0_5px_10px_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-none transition-all border-2 border-purple-300"></button>
                        <span className="text-purple-900 font-bold text-xs">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

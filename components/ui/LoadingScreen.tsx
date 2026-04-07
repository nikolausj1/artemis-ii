"use client";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#000008] flex flex-col items-center justify-center z-50">
      <div className="relative mb-6">
        <div className="w-16 h-16 border-2 border-cyan-400/20 rounded-full animate-spin">
          <div className="absolute top-0 left-1/2 w-1 h-1 -ml-0.5 rounded-full bg-cyan-400" />
        </div>
      </div>
      <h1 className="text-lg font-semibold text-white/80 tracking-wider mb-2">
        ARTEMIS II
      </h1>
      <p className="text-xs text-white/30 tracking-widest uppercase">
        Loading mission data...
      </p>
    </div>
  );
}

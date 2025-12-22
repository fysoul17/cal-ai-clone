export interface PhoneMockupProps {
  scale?: number;
  className?: string;
}

export function PhoneMockup({ className = "" }: PhoneMockupProps) {
  return (
    <div
      className={`relative mx-auto border-slate-800 bg-slate-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl ${className}`}
    >
      {/* Side buttons */}
      <div className="h-[32px] w-[3px] bg-slate-700 absolute -left-[17px] top-[72px] rounded-l-lg" />
      <div className="h-[46px] w-[3px] bg-slate-700 absolute -left-[17px] top-[124px] rounded-l-lg" />
      <div className="h-[46px] w-[3px] bg-slate-700 absolute -left-[17px] top-[178px] rounded-l-lg" />
      <div className="h-[64px] w-[3px] bg-slate-700 absolute -right-[17px] top-[142px] rounded-r-lg" />

      {/* Screen with app preview */}
      <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-gradient-to-br from-slate-900 to-slate-950">
        {/* Simplified app UI mockup */}
        <div className="p-6 pt-12 space-y-4">
          {/* Status bar placeholder */}
          <div className="flex justify-between items-center mb-4">
            <div className="h-2 w-12 bg-slate-700 rounded" />
            <div className="h-2 w-16 bg-slate-700 rounded" />
          </div>

          {/* Camera capture area */}
          <div className="aspect-square bg-slate-800 rounded-2xl flex items-center justify-center">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-orange-500 rounded-full" />
            </div>
          </div>

          {/* Nutrition result card */}
          <div className="bg-slate-800/50 rounded-2xl p-4 space-y-2">
            <div className="h-4 bg-slate-700 rounded w-3/4" />
            <div className="h-6 bg-orange-500/30 rounded w-full" />
            <div className="flex gap-2">
              <div className="h-3 bg-slate-700 rounded w-1/4" />
              <div className="h-3 bg-slate-700 rounded w-1/4" />
              <div className="h-3 bg-slate-700 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

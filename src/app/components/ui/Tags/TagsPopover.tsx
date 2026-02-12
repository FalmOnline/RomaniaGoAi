import TagList from "./TagList";

interface TagsPopoverProps {
  remaining: string[];
  total: number;
}

export default function TagsPopover({ remaining, total }: TagsPopoverProps) {
  return (
    <div className="relative group">
      <button
        type="button"
        className="text-rg-black-90 font-medium text-sm bg-rg-black-5 px-3 py-1 rounded-2xl hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        +{total - 2}
      </button>

      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-5 bg-white/95 backdrop-blur-md rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 pointer-events-none group-hover:pointer-events-auto">
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 border-b border-r border-gray-100 rotate-45"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Extra Categories
            </h4>
            <span className="text-[10px] font-bold text-rg-primary-amber bg-yellow-50 px-2 py-0.5 rounded-md">
              +{total - 2} more
            </span>
          </div>

          {/* changed: uses TagList */}
          <TagList tags={remaining} className="flex-wrap gap-2" />
        </div>
      </div>
    </div>
  );
}

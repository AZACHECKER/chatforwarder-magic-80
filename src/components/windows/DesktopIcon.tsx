import React from 'react';
import { Terminal } from 'lucide-react';

interface DesktopIconProps {
  onClick: () => void;
  title: string;
  icon?: string;
}

export const DesktopIcon = ({ onClick, title, icon }: DesktopIconProps) => {
  return (
    <div 
      onClick={onClick}
      className="win98-icon group cursor-move"
      draggable="true"
    >
      {icon ? (
        <img src={icon} alt={title} className="w-16 h-16" />
      ) : (
        <Terminal className="w-16 h-16 text-[#9b87f5]" />
      )}
      <span className="text-[#D6BCFA] text-sm mt-1 bg-[#221F26] group-hover:bg-[#2a2533] px-2 py-1 rounded border border-[#9b87f5]">
        {title}
      </span>
    </div>
  );
};
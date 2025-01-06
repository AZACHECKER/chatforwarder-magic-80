import React from 'react';

interface DesktopIconProps {
  onClick: () => void;
  title: string;
  icon: string;
}

export const DesktopIcon = ({ onClick, title, icon }: DesktopIconProps) => {
  return (
    <div 
      onClick={onClick}
      className="win98-icon group"
    >
      <img src={icon} alt={title} className="w-12 h-12" />
      <span className="text-white text-sm mt-1 bg-[#000080] group-hover:bg-[#000080] px-1">
        {title}
      </span>
    </div>
  );
};
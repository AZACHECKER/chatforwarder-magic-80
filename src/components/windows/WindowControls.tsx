import React from 'react';
import { Minus, Square, X } from 'lucide-react';

interface WindowControlsProps {
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

export const WindowControls = ({ onMinimize, onMaximize, onClose }: WindowControlsProps) => {
  return (
    <div className="flex gap-1">
      <button 
        onClick={onMinimize} 
        className="win98-button px-2 py-0.5 min-w-[24px] flex items-center justify-center hover:bg-blue-700"
      >
        <Minus className="h-3 w-3 text-white" />
      </button>
      <button 
        onClick={onMaximize} 
        className="win98-button px-2 py-0.5 min-w-[24px] flex items-center justify-center hover:bg-blue-700"
      >
        <Square className="h-3 w-3 text-white" />
      </button>
      <button 
        onClick={onClose} 
        className="win98-button px-2 py-0.5 min-w-[24px] flex items-center justify-center hover:bg-red-700"
      >
        <X className="h-3 w-3 text-white" />
      </button>
    </div>
  );
};
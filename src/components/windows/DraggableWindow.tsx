import React, { useState, useRef, useEffect } from 'react';
import { WindowControls } from './WindowControls';

interface DraggableWindowProps {
  children: React.ReactNode;
  title: string;
  icon?: string;
  isMinimized: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

export const DraggableWindow = ({
  children,
  title,
  icon = "/favicon.ico",
  isMinimized,
  onMinimize,
  onMaximize,
  onClose
}: DraggableWindowProps) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousPosition, setPreviousPosition] = useState({ x: 50, y: 50 });
  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || isMaximized) return;
      
      setPosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isMaximized]);

  const handleMaximize = () => {
    if (!isMaximized) {
      setPreviousPosition(position);
      setPosition({ x: 0, y: 0 });
    } else {
      setPosition(previousPosition);
    }
    setIsMaximized(!isMaximized);
    onMaximize();
  };

  const windowStyle = isMaximized
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        transform: 'none'
      } as React.CSSProperties
    : {
        position: 'fixed',
        top: position.y,
        left: position.x,
        transform: isMinimized ? 'scale(0.1)' : 'scale(1)',
        opacity: isMinimized ? 0 : 1,
        pointerEvents: isMinimized ? 'none' : 'auto'
      } as React.CSSProperties;

  return (
    <div
      ref={dragRef}
      className={`win98-window ${isMinimized ? 'minimize-animation' : 'maximize-animation'}`}
      style={windowStyle}
    >
      <div
        className="win98-titlebar cursor-move"
        onMouseDown={() => !isMaximized && setIsDragging(true)}
        onDoubleClick={handleMaximize}
      >
        <div className="flex items-center gap-2">
          <img src={icon} alt="icon" className="w-4 h-4" />
          <span className="font-montserrat">{title}</span>
        </div>
        <WindowControls
          onMinimize={onMinimize}
          onMaximize={handleMaximize}
          onClose={onClose}
        />
      </div>
      <div className="p-6 space-y-6 bg-gray-200/70 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
};
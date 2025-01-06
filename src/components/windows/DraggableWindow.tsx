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
  className?: string;
}

export const DraggableWindow = ({
  children,
  title,
  icon = "/favicon.ico",
  isMinimized,
  onMinimize,
  onMaximize,
  onClose,
  className
}: DraggableWindowProps) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousPosition, setPreviousPosition] = useState({ x: 20, y: 20 });
  const dragRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setIsMaximized(true);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const windowStyle = isMaximized || isMobile
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        transform: 'none',
        transition: 'all 0.3s ease'
      } as React.CSSProperties
    : {
        position: 'fixed',
        top: position.y,
        left: position.x,
        transform: isMinimized ? 'scale(0.1)' : 'scale(1)',
        opacity: isMinimized ? 0 : 1,
        pointerEvents: isMinimized ? 'none' : 'auto',
        transition: 'all 0.3s ease'
      } as React.CSSProperties;

  return (
    <div
      ref={dragRef}
      className={`win98-window ${isMinimized ? 'minimize-animation' : 'maximize-animation'} ${className}`}
      style={windowStyle}
    >
      <div
        className="win98-titlebar cursor-move"
        onMouseDown={() => !isMaximized && !isMobile && setIsDragging(true)}
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
      <div className="overflow-auto h-[calc(100%-2.5rem)] bg-gray-200/70 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
};
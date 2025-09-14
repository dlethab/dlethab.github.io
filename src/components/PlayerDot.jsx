import React from "react";
import { useDraggable } from "@dnd-kit/core";

export default function PlayerDot({
  id,
  xPct,
  yPct,
  label,
  badge,
  icon = "•",
  color = "bg-indigo-500",
  logo,                    // <-- NEW
  onClick,
  emphasized = false,
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  const style = {
    left: `${xPct}%`,
    top: `${yPct}%`,
    transform: `translate(-50%, -50%) translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
    WebkitTransform: `translate(-50%, -50%) translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
    zIndex: isDragging ? 60 : 10,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="absolute touch-none select-none no-native-dnd"
      data-id={id}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      {...attributes}
      {...listeners}
    >
      <button
        onClick={onClick}
        className="block no-native-dnd"
        aria-label={label}
        title={label}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
      >
        <Dot icon={icon} color={color} badge={badge} dragging={isDragging} emphasized={emphasized} logo={logo} />
      </button>
    </div>
  );
}

export function Dot({ icon = "•", color = "bg-indigo-500", badge, dragging = false, emphasized = false, logo }) {
  return (
    <div className="relative will-change-transform">
      <div
        className={`h-6 w-6 ${color} rounded-full ring-2 ring-white grid place-items-center text-[10px] text-white transition-transform duration-150
          ${dragging ? "scale-110" : emphasized ? "scale-[1.12]" : ""} ${emphasized ? "shadow-[0_0_0_3px_rgba(250,204,21,0.9)]" : "shadow-lg"}`}
      >
        {logo ? (
          <img
            src={logo}
            alt=""
            className="h-4 w-4 object-contain rounded-[4px] pointer-events-none"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />
        ) : (
          icon
        )}
      </div>
      {badge && (
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap
            ${emphasized ? "bg-yellow-500 text-black" : "bg-black/60 text-white"}`}
        >
          {badge}
        </div>
      )}
    </div>
  );
}

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { ReactNode } from 'react';

interface SortableWidgetProps {
  id: string;
  children: ReactNode;
  enabled?: boolean;
}

export function SortableWidget({ id, children, enabled = true }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative' as const,
  };

  if (!enabled) {
    return <div className="relative">{children}</div>;
  }

  return (
    <div ref={setNodeRef} style={style} className={`relative group touch-none ${isDragging ? 'opacity-50' : ''}`}>
      <div
        {...attributes}
        {...listeners}
        className="absolute top-3 right-3 p-1.5 rounded-md cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/30 text-white z-20 backdrop-blur-sm"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      {children}
    </div>
  );
}

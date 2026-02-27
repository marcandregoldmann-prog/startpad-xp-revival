import { useState, useEffect, useMemo } from 'react';
import { loadTasks, loadCompletions, getTodaysTasks, isTaskCompletedToday, checkStreakReset, getTodaysXP } from '@/lib/tasks';
import { loadWissen, getRunningMedia } from '@/lib/wissen';
import { loadWochenfokus, getKontextHinweise } from '@/lib/focus';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableWidget } from '@/components/dashboard/SortableWidget';
import { HeaderWidget } from '@/components/dashboard/HeaderWidget';
import LinksWidget from '@/components/LinksWidget';
import { MediaWidget } from '@/components/dashboard/MediaWidget';
import { ProgressWidget } from '@/components/dashboard/ProgressWidget';
import { FocusGoalWidget } from '@/components/dashboard/FocusGoalWidget';
import { HintsWidget } from '@/components/dashboard/HintsWidget';
import { ReflectionWidget } from '@/components/dashboard/ReflectionWidget';
import { ChallengeWidget } from '@/components/dashboard/ChallengeWidget';
import FocusWidget from '@/components/FocusWidget';
import { QuickCapture } from '@/components/dashboard/QuickCapture';
import { Pencil } from 'lucide-react';

export default function StartPage() {
  const [updateKey, setUpdateKey] = useState(0);
  const [items, setItems] = useState([
    'header', 'links', 'challenge', 'media', 'progress', 'focus_goal', 'hints', 'timer', 'reflection'
  ]);
  const [editLinks, setEditLinks] = useState(false);
  const [wochenfokus, setWochenfokus] = useState(loadWochenfokus());

  // Load order
  useEffect(() => {
    const savedOrder = localStorage.getItem('clearmind-widget-order');
    if (savedOrder) {
      try {
        setItems(JSON.parse(savedOrder));
      } catch { /* ignore */ }
    }
  }, []);

  // Data Loading
  // We reload these when updateKey changes (re-render)
  const stats = useMemo(() => checkStreakReset(), [updateKey]);
  const tasks = useMemo(() => loadTasks(), [updateKey]);
  const completions = useMemo(() => loadCompletions(), [updateKey]);
  const todaysTasks = useMemo(() => getTodaysTasks(tasks), [tasks]);
  const completedCount = useMemo(() => todaysTasks.filter(t => isTaskCompletedToday(t.id, completions)).length, [todaysTasks, completions]);
  const todaysXP = useMemo(() => getTodaysXP(completions, tasks), [completions, tasks]);
  const wissenEntries = useMemo(() => loadWissen(), [updateKey]);
  const runningMedia = useMemo(() => getRunningMedia(wissenEntries), [wissenEntries]);
  const hints = useMemo(() => getKontextHinweise(), [updateKey]);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);
        const newItems = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem('clearmind-widget-order', JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  const renderWidget = (id: string) => {
    switch(id) {
      case 'header':
        return <HeaderWidget stats={stats} todaysXP={todaysXP} openTasksCount={todaysTasks.length - completedCount} />;
      case 'links':
        return (
          <section>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Links</h2>
              <button onClick={() => setEditLinks(!editLinks)}
                className={`rounded-full px-3 py-1 text-[10px] font-medium transition-all ${editLinks ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/25' : 'text-muted-foreground hover:bg-muted/10 hover:text-foreground'}`}>
                <Pencil className="h-3 w-3 inline mr-1.5" />{editLinks ? 'Fertig' : 'Bearbeiten'}
              </button>
            </div>
            <LinksWidget editMode={editLinks} />
          </section>
        );
      case 'challenge': return <ChallengeWidget />;
      case 'media': return <MediaWidget runningMedia={runningMedia} />;
      case 'progress': return <ProgressWidget completed={completedCount} total={todaysTasks.length} />;
      case 'focus_goal': return <FocusGoalWidget wochenfokus={wochenfokus} setWochenfokus={setWochenfokus} />;
      case 'hints': return <HintsWidget hints={hints} />;
      case 'timer': return <FocusWidget />;
      case 'reflection': return <ReflectionWidget />;
      default: return null;
    }
  };

  return (
    <div key={updateKey} className="space-y-6 pb-8 animate-in fade-in duration-500">
       <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
         <SortableContext items={items} strategy={verticalListSortingStrategy}>
           <div className="space-y-8">
             {items.map(id => (
               <SortableWidget key={id} id={id} enabled={!editLinks}>
                 {renderWidget(id)}
               </SortableWidget>
             ))}
           </div>
         </SortableContext>
       </DndContext>
       <QuickCapture onCreated={() => setUpdateKey(k => k + 1)} />
    </div>
  );
}

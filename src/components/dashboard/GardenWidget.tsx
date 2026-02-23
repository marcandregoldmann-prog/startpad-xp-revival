import { useState, useEffect } from 'react';
import { loadGarden, PLANT_TYPES, Plant } from '@/lib/garden';
import { RefreshCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function GardenWidget() {
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    setPlants(loadGarden());
  }, []);

  const getEmoji = (p: Plant) => {
    const type = PLANT_TYPES[p.type] || PLANT_TYPES['sunflower'];
    return type[p.stage] || '🌱';
  };

  const getProgress = (p: Plant) => {
    let threshold = 25;
    if (p.stage === 'sprout') threshold = 50;
    if (p.stage === 'small') threshold = 75;
    if (p.stage === 'mature') threshold = 100;
    if (p.stage === 'blooming') return 100;
    return Math.min(100, Math.round((p.growthProgress / threshold) * 100));
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fokus Garten</h2>
        <button onClick={() => setPlants(loadGarden())} className="text-muted-foreground hover:text-foreground p-1">
          <RefreshCcw className="h-3 w-3" />
        </button>
      </div>

      {plants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/30 p-8 text-center">
          <p className="text-sm text-muted-foreground">Dein Garten ist leer. Fokussiere dich, um Pflanzen wachsen zu lassen! 🌱</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-card p-4 border border-border shadow-sm grid grid-cols-4 gap-4">
          {plants.map(plant => (
            <TooltipProvider key={plant.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors cursor-help relative group">
                    <span className="text-3xl filter drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">
                      {getEmoji(plant)}
                    </span>
                    {plant.stage !== 'blooming' && (
                      <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${getProgress(plant)}%` }} />
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-bold capitalize">{plant.type} ({plant.stage})</p>
                  <p className="text-xs text-muted-foreground">Gepflanzt: {new Date(plant.plantedAt).toLocaleDateString()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          {/* Empty slots placeholders if < 12 */}
          {Array.from({ length: Math.max(0, 12 - plants.length) }).map((_, i) => (
             <div key={i} className="aspect-square rounded-xl border border-dashed border-border/50 bg-transparent flex items-center justify-center opacity-30">
               <span className="text-xl grayscale opacity-20">🌱</span>
             </div>
          ))}
        </div>
      )}
    </section>
  );
}

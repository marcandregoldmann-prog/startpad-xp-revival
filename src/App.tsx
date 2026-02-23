import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Home, ListChecks, Scale, BookOpen, Repeat, Settings as SettingsIcon } from "lucide-react";
import StartPage from "./pages/StartPage";
import Tasks from "./pages/Tasks";
import Decisions from "./pages/Decisions";
import Wissen from "./pages/Wissen";
import Habits from "./pages/Habits";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { CommandPalette } from "./components/CommandPalette";
import { useEffect } from "react";

const queryClient = new QueryClient();

const navItems = [
  { path: '/', icon: Home, label: 'Start' },
  { path: '/tasks', icon: ListChecks, label: 'Aufgaben' },
  { path: '/habits', icon: Repeat, label: 'Gewohnheiten' },
  { path: '/decisions', icon: Scale, label: 'Entscheidungen' },
  { path: '/wissen', icon: BookOpen, label: 'Wissen' },
];

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isFocusMode = location.pathname === '/focus';

  useEffect(() => {
    const savedAccent = localStorage.getItem('clearmind-accent');
    if (savedAccent) {
      document.documentElement.style.setProperty('--accent', savedAccent);
    }
  }, []);

  if (isFocusMode) {
    return (
      <Routes>
        <Route path="/focus" element={<FocusPage />} />
      </Routes>
    );
  }

  useEffect(() => {
    const savedAccent = localStorage.getItem('clearmind-accent');
    if (savedAccent) {
      document.documentElement.style.setProperty('--accent', savedAccent);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans transition-colors duration-300">
      <CommandPalette />
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="mx-auto flex max-w-lg items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-accent transition-colors duration-300">ClearMind</span> <span className="text-muted-foreground font-normal text-base">OS</span>
          </h1>
          <button onClick={() => navigate('/settings')}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50">
             <SettingsIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-4 pb-28 animate-in fade-in duration-300">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/decisions" element={<Decisions />} />
          <Route path="/wissen" element={<Wissen />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-10 bg-background/90 backdrop-blur-md pt-2 pb-6 border-t border-border/40 transition-colors duration-300">
        <div className="mx-auto max-w-lg flex items-center justify-around px-6">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-accent text-accent-foreground font-medium shadow-lg shadow-accent/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}>
                <item.icon className={`h-5 w-5 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] tracking-wide uppercase ${isActive ? 'opacity-100' : 'opacity-70'}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

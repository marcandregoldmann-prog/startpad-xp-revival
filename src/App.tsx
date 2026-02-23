import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Home, ListChecks, Scale, BookOpen } from "lucide-react";
import StartPage from "./pages/StartPage";
import Tasks from "./pages/Tasks";
import Decisions from "./pages/Decisions";
import Wissen from "./pages/Wissen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const navItems = [
  { path: '/', icon: Home, label: 'Start' },
  { path: '/tasks', icon: ListChecks, label: 'Aufgaben' },
  { path: '/decisions', icon: Scale, label: 'Entscheidungen' },
  { path: '/wissen', icon: BookOpen, label: 'Wissen' },
];

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-accent">ClearMind</span> <span className="text-muted-foreground font-normal text-base">OS</span>
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-4 pb-28">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/decisions" element={<Decisions />} />
          <Route path="/wissen" element={<Wissen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-10 bg-background/90 backdrop-blur-md pt-2 pb-6 border-t border-white/5">
        <div className="mx-auto max-w-lg flex items-center justify-around px-6">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-accent text-white font-medium shadow-lg shadow-accent/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}>
                <item.icon className={`h-5 w-5 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && <span className="text-xs tracking-wide uppercase">{item.label}</span>}
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

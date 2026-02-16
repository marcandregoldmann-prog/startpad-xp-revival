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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            ClearMind <span className="text-muted-foreground font-normal text-sm">OS</span>
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 pb-24">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/decisions" element={<Decisions />} />
          <Route path="/wissen" element={<Wissen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-lg flex">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
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

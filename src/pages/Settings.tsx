import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor, Download, Upload, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { exportData, importData } from '@/lib/data';
import { toast } from 'sonner';

const ACCENT_COLORS = [
  { name: 'Lila (Standard)', value: '262 80% 50%', hex: '#8b5cf6' },
  { name: 'Blau', value: '221 83% 53%', hex: '#3b82f6' },
  { name: 'Grün', value: '142 76% 36%', hex: '#22c55e' },
  { name: 'Orange', value: '24 95% 53%', hex: '#f97316' },
  { name: 'Pink', value: '330 81% 60%', hex: '#ec4899' },
  { name: 'Rot', value: '0 84% 60%', hex: '#ef4444' },
];

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [accentColor, setAccentColor] = useState('262 80% 50%');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const savedAccent = localStorage.getItem('clearmind-accent');
    if (savedAccent) {
      setAccentColor(savedAccent);
      document.documentElement.style.setProperty('--accent', savedAccent);
    }

    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  const handleAccentChange = (colorValue: string) => {
    setAccentColor(colorValue);
    document.documentElement.style.setProperty('--accent', colorValue);
    localStorage.setItem('clearmind-accent', colorValue);
  };

  const handleExport = () => {
    try {
      exportData();
      toast.success('Daten erfolgreich exportiert');
    } catch (e) {
      toast.error('Fehler beim Exportieren');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importData(file);
      toast.success('Daten erfolgreich importiert. Seite wird neu geladen...');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error('Fehler beim Importieren: Ungültige Datei');
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Dieser Browser unterstützt keine Benachrichtigungen');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      new Notification('ClearMind OS', { body: 'Benachrichtigungen aktiviert!' });
    } else {
      setNotificationsEnabled(false);
      toast.error('Benachrichtigungen wurden nicht erlaubt');
    }
  };

  const resetApp = () => {
    if (confirm('Bist du sicher? Alle Daten werden unwiderruflich gelöscht!')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Einstellungen</h1>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Erscheinungsbild</CardTitle>
          <CardDescription>Passe das Design an deine Vorlieben an.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Design-Modus</Label>
            <div className="flex flex-wrap gap-4">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" /> Hell
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" /> Dunkel
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                onClick={() => setTheme('system')}
                className="flex items-center gap-2"
              >
                <Monitor className="h-4 w-4" /> System
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Akzentfarbe</Label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleAccentChange(color.value)}
                  className={`group relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-xl transition-all hover:scale-105 ${
                    accentColor === color.value ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : ''
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {accentColor === color.value && (
                    <CheckCircle2 className="h-6 w-6 text-white drop-shadow-md animate-in zoom-in duration-200" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Datenverwaltung</CardTitle>
          <CardDescription>
            Alle Daten liegen lokal in deinem Browser. Exportiere sie regelmäßig, um sie zu sichern oder auf ein anderes Gerät zu übertragen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleExport} className="flex-1 gap-2">
              <Download className="h-4 w-4" /> Exportieren (.json)
            </Button>
            <div className="relative flex-1">
              <Input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="w-full gap-2 pointer-events-none">
                <Upload className="h-4 w-4" /> Importieren
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4">
            <Button variant="destructive" onClick={resetApp} className="w-full sm:w-auto gap-2">
              <AlertCircle className="h-4 w-4" /> App zurücksetzen (Alle Daten löschen)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Benachrichtigungen</CardTitle>
          <CardDescription>Erlaube Browser-Benachrichtigungen für Timer und Erinnerungen.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Browser-Benachrichtigungen</Label>
                <p className="text-sm text-muted-foreground">Für Timer-Ablauf und tägliche Erinnerungen</p>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={requestNotificationPermission} disabled={notificationsEnabled} />
           </div>
        </CardContent>
      </Card>

      {/* About */}
      <div className="text-center text-sm text-muted-foreground pt-8">
        <p>ClearMind OS v0.2.0</p>
        <p className="mt-1">Built with React, Vite & Tailwind</p>
      </div>
    </div>
  );
};

export default Settings;

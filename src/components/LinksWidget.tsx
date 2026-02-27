import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Plus, Trash2, X } from 'lucide-react';
import {
  LinkGroup,
  loadLinks,
  toggleGroupCollapse,
  addLinkToGroup,
  removeLinkFromGroup,
  deleteLinkGroup,
  addLinkGroup,
  reorderGroups,
} from '@/lib/links';

interface LinksWidgetProps {
  editMode: boolean;
}

const LinksWidget = ({ editMode }: LinksWidgetProps) => {
  const [groups, setGroups] = useState<LinkGroup[]>(loadLinks);
  const [addingLink, setAddingLink] = useState<string | null>(null);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkEmoji, setNewLinkEmoji] = useState('🔗');
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newGroupEmoji, setNewGroupEmoji] = useState('📁');

  const refresh = () => setGroups(loadLinks());

  const handleToggle = (id: string) => {
    toggleGroupCollapse(id);
    refresh();
  };

  const handleAddLink = (groupId: string) => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
    addLinkToGroup(groupId, newLinkTitle.trim(), newLinkUrl.trim(), newLinkEmoji);
    setNewLinkTitle('');
    setNewLinkUrl('');
    setNewLinkEmoji('🔗');
    setAddingLink(null);
    refresh();
  };

  const handleRemoveLink = (groupId: string, linkId: string) => {
    removeLinkFromGroup(groupId, linkId);
    refresh();
  };

  const handleDeleteGroup = (groupId: string) => {
    deleteLinkGroup(groupId);
    refresh();
  };

  const handleAddGroup = () => {
    if (!newGroupTitle.trim()) return;
    addLinkGroup(newGroupTitle.trim(), newGroupEmoji, '--xp');
    setNewGroupTitle('');
    setNewGroupEmoji('📁');
    setShowAddGroup(false);
    refresh();
  };

  const handleMoveGroup = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= groups.length) return;
    reorderGroups(index, newIndex);
    refresh();
  };

  return (
    <div className="space-y-3">
      {groups.map((group, gIdx) => (
        <div key={group.id} className="group/card overflow-hidden rounded-2xl bg-card border border-white/5 shadow-sm transition-all hover:border-white/10 hover:shadow-md">
          <div
            onClick={() => handleToggle(group.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleToggle(group.id); }}
            className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-white/5 cursor-pointer"
          >
            {editMode && (
              <div className="flex flex-col gap-0.5 mr-1">
                <button onClick={(e) => { e.stopPropagation(); handleMoveGroup(gIdx, 'up'); }}
                  className="text-muted-foreground hover:text-accent p-0.5" disabled={gIdx === 0}>
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleMoveGroup(gIdx, 'down'); }}
                  className="text-muted-foreground hover:text-accent p-0.5" disabled={gIdx === groups.length - 1}>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            )}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-lg">
              {group.emoji}
            </div>
            <span className="text-sm font-semibold text-foreground flex-1 tracking-tight">{group.title}</span>
            <span className="text-xs font-medium text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">{group.links.length}</span>
            {group.collapsed ?
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-hover/card:text-foreground" /> :
              <ChevronUp className="h-4 w-4 text-muted-foreground transition-transform group-hover/card:text-foreground" />
            }
            {editMode && (
              <button onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.id); }}
                className="text-muted-foreground hover:text-red-400 transition-colors ml-2 p-1">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          {!group.collapsed && (
            <div className="px-5 pb-4 pt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
              <div className="h-px bg-white/5 mb-2 mx-1" />
              {group.links.map((link) => (
                <div key={link.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-accent/10 hover:text-accent transition-all group/link">
                  <span className="text-sm opacity-70 group-hover/link:opacity-100 transition-opacity">{link.emoji}</span>
                  <a href={link.url} target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-sm font-medium text-muted-foreground group-hover/link:text-foreground transition-colors truncate">
                    {link.title}
                  </a>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover/link:opacity-100 transition-all -translate-x-2 group-hover/link:translate-x-0" />
                  {editMode && (
                    <button onClick={() => handleRemoveLink(group.id, link.id)}
                      className="text-muted-foreground hover:text-red-400 transition-colors p-1">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {editMode && addingLink === group.id ? (
                <div className="mt-3 rounded-xl bg-black/20 p-3 space-y-2 border border-white/5">
                  <div className="flex gap-2">
                    <input value={newLinkEmoji} onChange={(e) => setNewLinkEmoji(e.target.value)}
                      className="w-10 rounded-lg border border-white/10 bg-background/50 px-1 py-1.5 text-center text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
                    <input value={newLinkTitle} onChange={(e) => setNewLinkTitle(e.target.value)} placeholder="Titel"
                      className="flex-1 rounded-lg border border-white/10 bg-background/50 px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                  <div className="flex gap-2">
                    <input value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} placeholder="https://..."
                      className="flex-1 rounded-lg border border-white/10 bg-background/50 px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent" />
                    <button onClick={() => handleAddLink(group.id)}
                      className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent/90">Hinzufügen</button>
                    <button onClick={() => setAddingLink(null)} className="text-muted-foreground hover:text-foreground px-1">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : editMode ? (
                <button onClick={() => setAddingLink(group.id)}
                  className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/10 py-2 text-xs font-medium text-muted-foreground hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all">
                  <Plus className="h-3.5 w-3.5" /> Link hinzufügen
                </button>
              ) : null}
            </div>
          )}
        </div>
      ))}

      {editMode && (
        showAddGroup ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-card/50 p-4 space-y-3 animate-in fade-in zoom-in-95">
            <h3 className="text-xs font-medium uppercase text-muted-foreground">Neue Gruppe</h3>
            <div className="flex gap-2">
              <input value={newGroupEmoji} onChange={(e) => setNewGroupEmoji(e.target.value)}
                className="w-10 rounded-lg border border-white/10 bg-background/50 px-1 py-1.5 text-center text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
              <input value={newGroupTitle} onChange={(e) => setNewGroupTitle(e.target.value)} placeholder="Gruppenname"
                className="flex-1 rounded-lg border border-white/10 bg-background/50 px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddGroup(false)} className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">Abbrechen</button>
              <button onClick={handleAddGroup}
                className="rounded-lg bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:bg-foreground/90">Erstellen</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddGroup(true)}
            className="w-full rounded-2xl border border-dashed border-white/10 py-3 text-xs font-medium text-muted-foreground hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all flex items-center justify-center gap-1.5">
            <Plus className="h-4 w-4" /> Neue Gruppe
          </button>
        )
      )}
    </div>
  );
};

export default LinksWidget;

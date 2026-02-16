import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Plus, Trash2, GripVertical, X, Pencil } from 'lucide-react';
import {
  LinkGroup,
  loadLinks,
  saveLinks,
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
    <div className="space-y-2">
      {groups.map((group, gIdx) => (
        <div key={group.id} className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            onClick={() => handleToggle(group.id)}
            className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-accent/50 transition-colors"
          >
            {editMode && (
              <div className="flex flex-col gap-0.5 mr-1">
                <button onClick={(e) => { e.stopPropagation(); handleMoveGroup(gIdx, 'up'); }}
                  className="text-muted-foreground hover:text-foreground" disabled={gIdx === 0}>
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleMoveGroup(gIdx, 'down'); }}
                  className="text-muted-foreground hover:text-foreground" disabled={gIdx === groups.length - 1}>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            )}
            <span className="text-base">{group.emoji}</span>
            <span className="text-sm font-medium text-foreground flex-1">{group.title}</span>
            <span className="text-xs text-muted-foreground font-mono">{group.links.length}</span>
            {group.collapsed ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronUp className="h-4 w-4 text-muted-foreground" />}
            {editMode && (
              <button onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.id); }}
                className="text-muted-foreground hover:text-contra transition-colors ml-1">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </button>

          {!group.collapsed && (
            <div className="px-4 pb-3 space-y-1">
              {group.links.map((link) => (
                <div key={link.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent/30 transition-colors group">
                  <span className="text-sm">{link.emoji}</span>
                  <a href={link.url} target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-sm text-foreground hover:text-xp transition-colors truncate">
                    {link.title}
                  </a>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  {editMode && (
                    <button onClick={() => handleRemoveLink(group.id, link.id)}
                      className="text-muted-foreground hover:text-contra transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}

              {editMode && addingLink === group.id ? (
                <div className="space-y-2 pt-1">
                  <div className="flex gap-2">
                    <input value={newLinkEmoji} onChange={(e) => setNewLinkEmoji(e.target.value)}
                      className="w-10 rounded border border-border bg-background/50 px-1 py-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                    <input value={newLinkTitle} onChange={(e) => setNewLinkTitle(e.target.value)} placeholder="Titel"
                      className="flex-1 rounded border border-border bg-background/50 px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <div className="flex gap-2">
                    <input value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} placeholder="https://..."
                      className="flex-1 rounded border border-border bg-background/50 px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                    <button onClick={() => handleAddLink(group.id)}
                      className="rounded bg-foreground px-3 py-1 text-xs font-medium text-background">Hinzufügen</button>
                    <button onClick={() => setAddingLink(null)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : editMode ? (
                <button onClick={() => setAddingLink(group.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors pt-1">
                  <Plus className="h-3 w-3" /> Link hinzufügen
                </button>
              ) : null}
            </div>
          )}
        </div>
      ))}

      {editMode && (
        showAddGroup ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-3 space-y-2">
            <div className="flex gap-2">
              <input value={newGroupEmoji} onChange={(e) => setNewGroupEmoji(e.target.value)}
                className="w-10 rounded border border-border bg-background/50 px-1 py-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
              <input value={newGroupTitle} onChange={(e) => setNewGroupTitle(e.target.value)} placeholder="Gruppenname"
                className="flex-1 rounded border border-border bg-background/50 px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              <button onClick={handleAddGroup}
                className="rounded bg-foreground px-3 py-1 text-xs font-medium text-background">Erstellen</button>
              <button onClick={() => setShowAddGroup(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddGroup(true)}
            className="w-full rounded-xl border border-dashed border-border py-2 text-xs text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors flex items-center justify-center gap-1">
            <Plus className="h-3 w-3" /> Neue Gruppe
          </button>
        )
      )}
    </div>
  );
};

export default LinksWidget;

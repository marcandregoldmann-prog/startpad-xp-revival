import { generateId } from './decisions';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  emoji: string;
}

export interface LinkGroup {
  id: string;
  title: string;
  emoji: string;
  color: string; // HSL accent color variable name
  links: LinkItem[];
  collapsed: boolean;
  order: number;
}

const LINKS_KEY = 'clearmind-links';

export function loadLinks(): LinkGroup[] {
  try {
    const data = localStorage.getItem(LINKS_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return getDefaultLinks();
}

export function saveLinks(groups: LinkGroup[]): void {
  localStorage.setItem(LINKS_KEY, JSON.stringify(groups));
}

function getDefaultLinks(): LinkGroup[] {
  return [
    {
      id: generateId(),
      title: 'Produktivität',
      emoji: '⚡',
      color: '--xp',
      links: [
        { id: generateId(), title: 'Kalender', url: 'https://calendar.google.com', emoji: '📅' },
        { id: generateId(), title: 'Notizen', url: 'https://notion.so', emoji: '📝' },
      ],
      collapsed: false,
      order: 0,
    },
    {
      id: generateId(),
      title: 'Lernen',
      emoji: '📚',
      color: '--wissen',
      links: [
        { id: generateId(), title: 'YouTube', url: 'https://youtube.com', emoji: '▶️' },
      ],
      collapsed: false,
      order: 1,
    },
    {
      id: generateId(),
      title: 'Tools',
      emoji: '🛠️',
      color: '--streak',
      links: [
        { id: generateId(), title: 'GitHub', url: 'https://github.com', emoji: '🐙' },
      ],
      collapsed: false,
      order: 2,
    },
  ];
}

export function addLinkGroup(title: string, emoji: string, color: string): LinkGroup[] {
  const groups = loadLinks();
  const group: LinkGroup = {
    id: generateId(),
    title,
    emoji,
    color,
    links: [],
    collapsed: false,
    order: groups.length,
  };
  groups.push(group);
  saveLinks(groups);
  return groups;
}

export function addLinkToGroup(groupId: string, title: string, url: string, emoji: string): LinkGroup[] {
  const groups = loadLinks();
  const group = groups.find(g => g.id === groupId);
  if (group) {
    group.links.push({ id: generateId(), title, url, emoji });
    saveLinks(groups);
  }
  return groups;
}

export function removeLinkFromGroup(groupId: string, linkId: string): LinkGroup[] {
  const groups = loadLinks();
  const group = groups.find(g => g.id === groupId);
  if (group) {
    group.links = group.links.filter(l => l.id !== linkId);
    saveLinks(groups);
  }
  return groups;
}

export function deleteLinkGroup(groupId: string): LinkGroup[] {
  const groups = loadLinks().filter(g => g.id !== groupId);
  saveLinks(groups);
  return groups;
}

export function toggleGroupCollapse(groupId: string): LinkGroup[] {
  const groups = loadLinks();
  const group = groups.find(g => g.id === groupId);
  if (group) {
    group.collapsed = !group.collapsed;
    saveLinks(groups);
  }
  return groups;
}

export function reorderGroups(fromIndex: number, toIndex: number): LinkGroup[] {
  const groups = loadLinks();
  const [moved] = groups.splice(fromIndex, 1);
  groups.splice(toIndex, 0, moved);
  groups.forEach((g, i) => g.order = i);
  saveLinks(groups);
  return groups;
}

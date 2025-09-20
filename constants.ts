export interface NavLink {
    name: string;
    id: string;
    type: 'scroll' | 'view';
}

export const NAV_LINKS: NavLink[] = [
    { name: 'Home', id: 'home', type: 'scroll' },
    { name: 'Government', id: 'government', type: 'scroll' },
    { name: 'Laws', id: 'laws', type: 'scroll' },
    { name: 'Honors', id: 'honors', type: 'scroll' },
    { name: 'Ministries', id: 'ministries', type: 'scroll' },
    { name: 'Library', id: 'library', type: 'view' },
    { name: 'Royal Office', id: 'royalOffice', type: 'view' },
    { name: 'Minister Panel', id: 'ministersPanel', type: 'view' },
    { name: 'Parliament', id: 'parliament', type: 'view' },
    { name: 'Bureau Office', id: 'bureauOffice', type: 'view' },
];
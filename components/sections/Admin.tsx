
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Section from '../Section';
import BookIcon from '../icons/BookIcon';
import { initDB, getAll, get, put, putAll, remove } from '../db';

interface BaseCitizen { id: number; name: string; }
interface Peer extends BaseCitizen { title: 'Peer'; description: string; }
interface Reader extends BaseCitizen { title: 'Reader'; }
type Citizen = Peer | Reader;

interface Minister {
    id: number;
    name: string;
    ministry: string;
    description: string;
}

interface Book {
    id: number;
    title: string;
    pdfFile: File;
}

interface PollOption {
    text: string;
    votes: number;
}

interface Poll {
    id: string;
    question: string;
    options: PollOption[];
}

const initialCitizens: Citizen[] = [
  { id: 1, name: 'Lord Tiberius Blackwood', title: 'Peer', description: 'A venerable historian and keeper of the ancient lore of Novelia.' },
  { id: 2, name: 'Lady Seraphina Quill', title: 'Peer', description: 'A master calligrapher and patron of the literary arts.' },
  { id: 3, name: 'Elara Vance', title: 'Reader' },
];

const initialMinisters: Minister[] = [
    { id: 1, name: 'Cancellarius Maximus', ministry: 'Prime Minister', description: 'The supreme head of government and chair of the Cabinet.' },
    { id: 2, name: 'Vacant', ministry: 'Ministry of Foreign Affairs & Cultural Exchange', description: 'The Chancellery of Embassies, operating under this Ministry, is tasked with establishing diplomatic ties with friendly micronations, fostering cultural exchange programs, and representing Novelia on the global stage. Its primary tools are not treaties of trade or war, but "Literary Treaties"—agreements to share and preserve great works of literature.' },
    { id: 3, name: 'Vacant', ministry: 'Ministry of Justice & the Codex', description: 'This Ministry is the guardian of the Codex of Novelia. It upholds the laws of the land, ensuring that justice is administered with wisdom and fairness. The High Court of Scribes convenes here to adjudicate on matters of law, with a special focus on protecting intellectual property and upholding the "Law of the Written Word."' },
    { id: 4, name: 'Vacant', ministry: 'Ministry of Internal Affairs & Citizenry', description: 'Responsible for the well-being of Novelia\'s citizenry, this Ministry manages the Registry of Readers, organizes national events such as the "Festival of the First Edition," and promotes civic engagement. It ensures the Principality remains a harmonious and thriving community for all its members.' },
    { id: 5, name: 'Vacant', ministry: 'The Bureau of Government Workings', description: 'The administrative heart of the Principality. The Bureau is the keeper of the Codex, the manager of the state archives in The Great Library, and the overseer of all parliamentary procedures and elections. Its diligent Clerks ensure that the machinery of government runs smoothly and transparently.' },
    { id: 6, name: 'Vacant', ministry: 'Ministry of Research & Scholarship', description: 'Dedicated to the pursuit of knowledge, this Ministry champions intellectual discovery and academic excellence. It administers the prestigious "Laurel of Scholarship," funds research projects that expand the horizons of understanding, and curates new acquisitions for the national archives, ensuring Novelia remains at the forefront of thought and wisdom.' }
];


const initialPoll: Poll = {
  id: 'main_poll',
  question: 'What genre should be the focus for the next Royal Reading Month?',
  options: [
    { text: 'Classic Fantasy', votes: 152 },
    { text: 'Historical Fiction', votes: 98 },
    { text: 'Science Fiction', votes: 115 },
  ],
};

const MINISTRY_TITLES = [
    "Prime Minister",
    "Ministry of Foreign Affairs & Cultural Exchange",
    "Ministry of Justice & the Codex",
    "Ministry of Internal Affairs & Citizenry",
    "The Bureau of Government Workings",
    "Ministry of Research & Scholarship"
];

const CORRECT_ACCESS_CODE = '1032';

const RoyalOffice: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');

    const [citizens, setCitizens] = useState<Citizen[]>([]);
    const [editingCitizenId, setEditingCitizenId] = useState<number | null>(null);
    const defaultCitizenForm = { name: '', title: 'Reader' as 'Reader' | 'Peer', description: '' };
    const [formCitizen, setFormCitizen] = useState(defaultCitizenForm);
    
    const [ministers, setMinisters] = useState<Minister[]>([]);
    const [editingMinisterId, setEditingMinisterId] = useState<number | null>(null);
    const [newMinisterName, setNewMinisterName] = useState('');
    const [newMinisterTitle, setNewMinisterTitle] = useState(MINISTRY_TITLES[0]);
    const [newMinisterDescription, setNewMinisterDescription] = useState('');

    const [books, setBooks] = useState<Book[]>([]);
    const [newBookTitle, setNewBookTitle] = useState('');
    const [newBookFile, setNewBookFile] = useState<File | null>(null);

    const [poll, setPoll] = useState<Poll | null>(null);
    const [newPollQuestion, setNewPollQuestion] = useState('');
    const [newPollOptions, setNewPollOptions] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                await initDB();
                const isSeeded = await get('kv', 'seeded');
    
                if (!isSeeded) {
                    await Promise.all([
                        putAll('citizens', initialCitizens),
                        putAll('ministers', initialMinisters),
                        put('poll', initialPoll),
                        put('kv', { key: 'seeded', value: true })
                    ]);
                }
                
                const [citizensData, ministersData, booksData, pollData] = await Promise.all([
                    getAll<Citizen>('citizens'),
                    getAll<Minister>('ministers'),
                    getAll<Book>('books'),
                    get<Poll>('poll', 'main_poll')
                ]);
    
                setCitizens(citizensData.length ? citizensData : initialCitizens);
                setMinisters(ministersData.length ? ministersData : initialMinisters);
                setBooks(booksData || []);
                setPoll(pollData || initialPoll);
            } catch (e) {
                console.error("Failed to load data from IndexedDB", e);
                setCitizens(initialCitizens);
                setPoll(initialPoll);
                setMinisters(initialMinisters);
                setBooks([]);
            }
        };
        loadData();
    }, []);

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        if (accessCode === CORRECT_ACCESS_CODE) setIsLoggedIn(true);
        else setError('Incorrect access code.');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setAccessCode('');
    };

    const handleSaveCitizen = async (e: FormEvent) => {
        e.preventDefault();
        if (!formCitizen.name.trim()) return;
    
        const id = editingCitizenId || Date.now();
        const name = formCitizen.name.trim();
        let citizenToSave: Citizen;
    
        if (formCitizen.title === 'Peer') {
            citizenToSave = { id, name, title: 'Peer', description: formCitizen.description.trim() };
        } else {
            citizenToSave = { id, name, title: 'Reader' };
        }
    
        await put('citizens', citizenToSave);
        
        if (editingCitizenId) {
            setCitizens(citizens.map(c => c.id === editingCitizenId ? citizenToSave : c));
        } else {
            setCitizens([...citizens, citizenToSave]);
        }
    
        handleCancelEditCitizen();
    };

    const handleEditCitizen = (citizen: Citizen) => {
        setEditingCitizenId(citizen.id);
        setFormCitizen({
            name: citizen.name,
            title: citizen.title,
            description: citizen.title === 'Peer' ? citizen.description : ''
        });
    };
    const handleCancelEditCitizen = () => {
        setEditingCitizenId(null);
        setFormCitizen(defaultCitizenForm);
    };
    const handleRemoveCitizen = async (id: number) => {
        await remove('citizens', id);
        setCitizens(citizens.filter(c => c.id !== id));
    };
    
    const handleSaveMinister = async (e: FormEvent) => {
        e.preventDefault();
        if (!newMinisterName.trim()) return;

        const id = editingMinisterId || Date.now();
        const ministerToSave = {
            id,
            name: newMinisterName.trim(),
            ministry: newMinisterTitle,
            description: newMinisterDescription.trim()
        };
        
        await put('ministers', ministerToSave);

        if (editingMinisterId) {
            setMinisters(ministers.map(m => m.id === editingMinisterId ? ministerToSave : m));
        } else {
            const existingMinisterIndex = ministers.findIndex(m => m.ministry === newMinisterTitle);
            if (existingMinisterIndex > -1) {
                setMinisters(ministers.map((m, i) => i === existingMinisterIndex ? ministerToSave : m));
            } else {
                setMinisters([...ministers, ministerToSave]);
            }
        }
        handleCancelEditMinister();
    };

    const handleEditMinister = (minister: Minister) => {
        setEditingMinisterId(minister.id);
        setNewMinisterName(minister.name);
        setNewMinisterTitle(minister.ministry);
        setNewMinisterDescription(minister.description);
    };

    const handleCancelEditMinister = () => {
        setEditingMinisterId(null);
        setNewMinisterName('');
        setNewMinisterTitle(MINISTRY_TITLES[0]);
        setNewMinisterDescription('');
    };

    const handleRemoveMinister = async (id: number) => {
        await remove('ministers', id);
        setMinisters(ministers.filter(m => m.id !== id));
    };

    const handleAddBook = async (e: FormEvent) => {
        e.preventDefault();
        if (!newBookTitle.trim() || !newBookFile) return;

        const newBook: Book = { id: Date.now(), title: newBookTitle.trim(), pdfFile: newBookFile };
        await put('books', newBook);
        setBooks([...books, newBook]);
        setNewBookTitle('');
        setNewBookFile(null);
        (e.target as HTMLFormElement).reset();
    };
    const handleRemoveBook = async (id: number) => {
        await remove('books', id);
        setBooks(books.filter(b => b.id !== id));
    };

    const handleUpdatePoll = async (e: FormEvent) => {
        e.preventDefault();
        if(!newPollQuestion.trim() || !newPollOptions.trim()) return;
        const options = newPollOptions.split(',').map(opt => ({ text: opt.trim(), votes: 0 }));
        const newPollData: Poll = { id: 'main_poll', question: newPollQuestion.trim(), options };
        await put('poll', newPollData);
        setPoll(newPollData);
        setNewPollQuestion('');
        setNewPollOptions('');
    };
    
    const totalVotes = poll ? poll.options.reduce((sum, opt) => sum + opt.votes, 0) || 1 : 1;

    return (
        <Section id="royalOffice" title="Royal Office">
            {!isLoggedIn ? (
                <div className="max-w-md mx-auto text-center p-8 admin-card rounded-lg">
                    <h3 className="font-display text-3xl text-brand-gold mb-4">Authorization Required</h3>
                    <form onSubmit={handleLogin}>
                        <input type="password" aria-label="Access Code" placeholder="Enter Access Code" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} className="w-full custom-input text-brand-parchment rounded px-4 py-3 mb-4"/>
                        <button type="submit" className="w-full custom-btn custom-btn-violet font-display py-3 rounded">Authenticate</button>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                    </form>
                </div>
            ) : (
                <div className="space-y-12">
                    <div className="flex justify-between items-center">
                        <h3 className="font-display text-4xl text-brand-gold">Control Panel</h3>
                        <button onClick={handleLogout} className="custom-btn bg-red-800 text-brand-parchment font-display px-6 py-2 rounded hover:bg-red-700">Logout</button>
                    </div>

                    <AdminPanel title="Manage National Library">
                        <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <input type="text" placeholder="Book Title" value={newBookTitle} onChange={(e) => setNewBookTitle(e.target.value)} className="md:col-span-2 custom-input text-brand-parchment rounded px-4 py-2"/>
                            <input type="file" accept=".pdf" onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files && setNewBookFile(e.target.files[0])} className="text-sm text-brand-silver file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-violet file:text-brand-gold hover:file:bg-opacity-80 cursor-pointer"/>
                            <button type="submit" className="md:col-span-3 custom-btn custom-btn-violet font-display py-2 rounded">Upload Document</button>
                        </form>
                        <AdminTable headers={["Title", "Action"]}>
                            {books.map(book => (
                                <tr key={book.id}>
                                    <td className="py-3">
                                        <div className="flex items-center space-x-3">
                                            <BookIcon className="w-5 h-5 text-brand-gold flex-shrink-0" />
                                            <span className="font-body">{book.title}</span>
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        <button onClick={() => handleRemoveBook(book.id)} className="text-red-500 hover:text-red-400 font-bold">Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </AdminTable>
                    </AdminPanel>

                    <AdminPanel title="Manage Ministers">
                        <form onSubmit={handleSaveMinister} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                             <input type="text" placeholder="Full Name & Title" value={newMinisterName} onChange={(e) => setNewMinisterName(e.target.value)} className="custom-input text-brand-parchment rounded px-4 py-2"/>
                             <select value={newMinisterTitle} onChange={(e) => setNewMinisterTitle(e.target.value)} className="custom-input text-brand-parchment rounded px-4 py-2" disabled={!!editingMinisterId}>{MINISTRY_TITLES.map(t => <option key={t} value={t}>{t}</option>)}</select>
                            <textarea placeholder="Ministry Description" value={newMinisterDescription} onChange={e => setNewMinisterDescription(e.target.value)} className="md:col-span-2 custom-input text-brand-parchment rounded px-4 py-2 h-24" rows={4} aria-label="Ministry Description"/>
                            <div className="md:col-span-2 flex gap-4">
                                <button type="submit" className="flex-grow custom-btn custom-btn-violet font-display py-2 rounded">{editingMinisterId ? 'Update Minister' : 'Appoint Minister'}</button>
                                {editingMinisterId && (<button type="button" onClick={handleCancelEditMinister} className="custom-btn bg-gray-600 text-brand-parchment font-display px-4 py-2 rounded hover:bg-gray-500">Cancel</button>)}
                            </div>
                        </form>
                        <AdminTable headers={["Name", "Ministry", "Actions"]}>
                            {ministers.map(minister => (<tr key={minister.id}><td className="font-body">{minister.name}</td><td className="font-body">{minister.ministry}</td><td className="text-right space-x-4"><button onClick={() => handleEditMinister(minister)} className="text-brand-gold hover:text-yellow-300 font-bold">Edit</button></td></tr>))}
                        </AdminTable>
                    </AdminPanel>
                    
                    <AdminPanel title="Manage Peers & Residents">
                        <form onSubmit={handleSaveCitizen} className="space-y-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Full Name" value={formCitizen.name} onChange={(e) => setFormCitizen({...formCitizen, name: e.target.value})} className="custom-input text-brand-parchment rounded px-4 py-2"/>
                                <select value={formCitizen.title} onChange={(e) => setFormCitizen({...formCitizen, title: e.target.value as 'Peer' | 'Reader'})} className="custom-input text-brand-parchment rounded px-4 py-2">
                                    <option value="Reader">Reader</option><option value="Peer">Peer</option>
                                </select>
                            </div>
                            {formCitizen.title === 'Peer' && <textarea placeholder="Description (for Peers only)" value={formCitizen.description} onChange={(e) => setFormCitizen({...formCitizen, description: e.target.value})} className="w-full custom-input text-brand-parchment rounded px-4 py-2 h-24"/>}
                            <div className="flex gap-4">
                                <button type="submit" className="flex-grow custom-btn custom-btn-violet font-display py-2 rounded">{editingCitizenId ? 'Update Citizen' : 'Add Citizen'}</button>
                                {editingCitizenId && <button type="button" onClick={handleCancelEditCitizen} className="custom-btn bg-gray-600 text-brand-parchment font-display px-4 py-2 rounded hover:bg-gray-500">Cancel</button>}
                            </div>
                        </form>
                        <AdminTable headers={["Name", "Title", "Action"]}>
                            {citizens.map(citizen => (<tr key={citizen.id}><td className="font-body">{citizen.name}</td><td className="font-body">{citizen.title}</td><td className="text-right space-x-4"><button onClick={() => handleEditCitizen(citizen)} className="text-brand-gold hover:text-yellow-300 font-bold">Edit</button><button onClick={() => handleRemoveCitizen(citizen.id)} className="text-red-500 hover:text-red-400 font-bold">Remove</button></td></tr>))}
                        </AdminTable>
                    </AdminPanel>

                    <AdminPanel title="View National Poll Results">
                        {poll && (
                            <div className="mb-6">
                                <h5 className="text-brand-gold mb-4 text-xl font-body italic">"{poll.question}"</h5>
                                <div className="space-y-4">
                                    {poll.options.map((opt, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between text-sm mb-1 font-body"><span>{opt.text}</span><span>{opt.votes} Votes ({(opt.votes / totalVotes * 100).toFixed(1)}%)</span></div>
                                            <div className="w-full bg-brand-violet rounded-full h-3"><div className="bg-brand-gold h-3 rounded-full" style={{ width: `${(opt.votes / totalVotes) * 100}%` }}></div></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <form onSubmit={handleUpdatePoll}>
                            <input type="text" placeholder="New Poll Question" value={newPollQuestion} onChange={(e) => setNewPollQuestion(e.target.value)} className="w-full custom-input text-brand-parchment rounded px-4 py-2 mb-4"/>
                            <input type="text" placeholder="Comma-separated options (e.g., Option A, Option B)" value={newPollOptions} onChange={(e) => setNewPollOptions(e.target.value)} className="w-full custom-input text-brand-parchment rounded px-4 py-2 mb-4"/>
                            <button type="submit" className="w-full custom-btn custom-btn-violet font-display py-2 rounded">Create / Update Poll</button>
                        </form>
                    </AdminPanel>
                </div>
            )}
        </Section>
    );
};

const AdminPanel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="admin-card p-6 rounded-lg">
        <h4 className="font-display text-2xl text-brand-gold mb-6">{title}</h4>
        {children}
    </div>
);

const AdminTable: React.FC<{ headers: string[]; children: React.ReactNode }> = ({ headers, children }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="border-b-2 border-brand-violet"><tr>{headers.map(h => <th key={h} className="p-2 pb-3 font-display text-brand-silver tracking-wider">{h}</th>)}</tr></thead>
            <tbody>{children}</tbody>
        </table>
    </div>
);

export default RoyalOffice;
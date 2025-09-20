
import React, { useState, useEffect, FormEvent } from 'react';
import Section from '../Section';
import { initDB, getAll, get, put, remove } from '../db';

interface AgendaItem {
    id: number;
    title: string;
    description: string;
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

const CORRECT_ACCESS_CODE = '1002';

const MinisterPanel: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');

    const [agendas, setAgendas] = useState<AgendaItem[]>([]);
    const [newAgendaTitle, setNewAgendaTitle] = useState('');
    const [newAgendaDescription, setNewAgendaDescription] = useState('');

    const [poll, setPoll] = useState<Poll | null>(null);
    const [newPollQuestion, setNewPollQuestion] = useState('');
    const [newPollOptions, setNewPollOptions] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                await initDB();
                const [agendasData, pollData] = await Promise.all([
                    getAll<AgendaItem>('agendas'),
                    get<Poll>('poll', 'main_poll')
                ]);

                setAgendas(agendasData || []);

                if (pollData) {
                    setPoll(pollData);
                    setNewPollQuestion(pollData.question);
                    setNewPollOptions(pollData.options.map((o: PollOption) => o.text).join(', '));
                }
            } catch (e) {
                console.error("Failed to load data from IndexedDB", e);
            }
        };

        if (isLoggedIn) {
            loadData();
        }
    }, [isLoggedIn]);

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        if (accessCode === CORRECT_ACCESS_CODE) setIsLoggedIn(true);
        else setError('Incorrect access code.');
    };
    
    const handleLogout = () => {
        setIsLoggedIn(false);
        setAccessCode('');
        setError('');
    };

    const handleAddAgenda = async (e: FormEvent) => {
        e.preventDefault();
        if (!newAgendaTitle.trim() || !newAgendaDescription.trim()) return;
        const newAgenda = {
            id: Date.now(),
            title: newAgendaTitle.trim(),
            description: newAgendaDescription.trim(),
        };
        await put('agendas', newAgenda);
        setAgendas([...agendas, newAgenda]);
        setNewAgendaTitle('');
        setNewAgendaDescription('');
    };
    const handleRemoveAgenda = async (id: number) => {
        await remove('agendas', id);
        setAgendas(agendas.filter(a => a.id !== id));
    };

    const handleUpdatePoll = async (e: FormEvent) => {
        e.preventDefault();
        if(!newPollQuestion.trim() || !newPollOptions.trim()) return;
        
        const currentOptions = poll ? poll.options : [];
        const newOptionTexts = newPollOptions.split(',').map(opt => opt.trim());

        const options = newOptionTexts.map(text => {
            const existingOption = currentOptions.find(opt => opt.text === text);
            return existingOption || { text, votes: 0 };
        });

        const newPollData: Poll = { id: 'main_poll', question: newPollQuestion.trim(), options };
        await put('poll', newPollData);
        setPoll(newPollData);
        alert('Poll has been updated successfully!');
    };

    return (
        <Section id="ministersPanel" title="Minister's Office">
            {!isLoggedIn ? (
                 <div className="max-w-md mx-auto text-center p-8 admin-card rounded-lg">
                    <h3 className="font-display text-3xl text-brand-gold mb-4">Authorization Required</h3>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            aria-label="Access Code"
                            placeholder="Enter Access Code"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            className="w-full custom-input text-brand-parchment rounded px-4 py-3 mb-4"
                        />
                        <button type="submit" className="w-full custom-btn custom-btn-violet font-display py-3 rounded">
                            Authenticate
                        </button>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                    </form>
                </div>
            ) : (
                 <div className="space-y-12">
                    <div className="flex justify-between items-center">
                        <h3 className="font-display text-4xl text-brand-gold">Ministerial Panel</h3>
                        <button onClick={handleLogout} className="custom-btn bg-red-800 text-brand-parchment font-display px-6 py-2 rounded hover:bg-red-700">
                            Logout
                        </button>
                    </div>

                    <AdminPanel title="Manage Meeting Agenda">
                        <form onSubmit={handleAddAgenda} className="space-y-4 mb-6">
                             <input type="text" placeholder="Agenda Title" value={newAgendaTitle} onChange={(e) => setNewAgendaTitle(e.target.value)} className="w-full custom-input text-brand-parchment rounded px-4 py-2"/>
                             <textarea placeholder="Agenda Description" value={newAgendaDescription} onChange={(e) => setNewAgendaDescription(e.target.value)} className="w-full custom-input text-brand-parchment rounded px-4 py-2 h-24" />
                            <button type="submit" className="w-full custom-btn custom-btn-violet font-display py-2 rounded">Add Agenda Item</button>
                        </form>
                         <AdminTable headers={["Title", "Description", "Action"]}>
                            {agendas.map(item => (
                                <tr key={item.id}>
                                    <td className="w-1/3 font-body">{item.title}</td>
                                    <td className="w-2/3 font-body">{item.description}</td>
                                    <td className="text-right"><button onClick={() => handleRemoveAgenda(item.id)} className="text-red-500 hover:text-red-400 font-bold">Remove</button></td>
                                </tr>
                            ))}
                        </AdminTable>
                    </AdminPanel>
                    
                     <AdminPanel title="Manage National Poll">
                        <form onSubmit={handleUpdatePoll} className="space-y-4">
                            <input type="text" placeholder="Poll Question" value={newPollQuestion} onChange={(e) => setNewPollQuestion(e.target.value)} className="w-full custom-input text-brand-parchment rounded px-4 py-2"/>
                            <input type="text" placeholder="Comma-separated options" value={newPollOptions} onChange={(e) => setNewPollOptions(e.target.value)} className="w-full custom-input text-brand-parchment rounded px-4 py-2"/>
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
            <thead className="border-b-2 border-brand-violet">
                <tr>
                    {headers.map(h => <th key={h} className="p-2 pb-3 font-display text-brand-silver tracking-wider">{h}</th>)}
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
    </div>
);

export default MinisterPanel;

import React, { useState, useEffect, FormEvent } from 'react';
import Section from '../Section';
import { initDB, get, put, getAll } from '../db';

interface PollOption { text: string; votes: number; }
interface Poll { id: string; question: string; options: PollOption[]; }
interface BaseCitizen { id: number; name: string; }
interface Peer extends BaseCitizen { title: 'Peer'; description: string; }
interface Reader extends BaseCitizen { title: 'Reader'; }
type Citizen = Peer | Reader;

const CODE_READERS = '1004';
const CODE_PEERS = '1005';

const ParliamentPanel: React.FC = () => {
    const [accessCode, setAccessCode] = useState('');
    const [house, setHouse] = useState<'readers' | 'peers' | null>(null);
    const [error, setError] = useState('');

    const [poll, setPoll] = useState<Poll | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState<Peer | null | undefined>(undefined);
    
    const storageKeyVoted = house === 'readers' ? 'voted_readers' : 'voted_peers';

    useEffect(() => {
        const loadData = async () => {
            try {
                await initDB();
                const [pollData, votedData] = await Promise.all([
                    get<Poll>('poll', 'main_poll'),
                    get<{key: string, value: boolean}>('kv', storageKeyVoted)
                ]);
                setPoll(pollData || null);
                setHasVoted(votedData?.value || false);
            } catch (e) {
                console.error("Failed to load data from IndexedDB", e);
            }
        };

        if (house) {
            loadData();
        }
    }, [house, storageKeyVoted]);

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        if (accessCode === CODE_READERS) {
            setHouse('readers');
            setError('');
        } else if (accessCode === CODE_PEERS) {
            setHouse('peers');
            setError('');
        } else {
            setError('Incorrect access code.');
            setAccessCode('');
        }
    };

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const citizens = await getAll<Citizen>('citizens');
            const peers = citizens.filter((c): c is Peer => c.title === 'Peer');
            const foundPeer = peers.find(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
            setSearchResult(foundPeer || null);
        } catch (e) {
            console.error("Failed to search peers", e);
            setSearchResult(null);
        }
    };

    const handleVote = async (optionIndex: number) => {
        if (!poll || hasVoted) return;
        const updatedPoll = { ...poll };
        updatedPoll.options[optionIndex].votes += 1;
        
        await put('poll', updatedPoll);
        await put('kv', { key: storageKeyVoted, value: true });

        setPoll(updatedPoll);
        setHasVoted(true);
    };

    const totalVotes = poll ? poll.options.reduce((sum, opt) => sum + opt.votes, 0) || 1 : 1;

    const renderVotingPanel = () => {
        const borderClass = house === 'peers' ? "mt-8 pt-8 border-t border-brand-violet" : "";

        if (!poll) {
            return <div className={borderClass}><p className="font-body text-lg">There is no active poll at this time.</p></div>;
        }

        if (hasVoted) {
            return (
                <div className={borderClass}>
                    <h4 className="font-display text-2xl text-brand-gold mb-4">Results: "{poll.question}"</h4>
                    <div className="space-y-4 font-body">
                        {poll.options.map((opt, index) => (
                             <div key={index}>
                                <div className="flex justify-between text-base mb-1"><span>{opt.text}</span><span>{opt.votes} Votes ({(opt.votes / totalVotes * 100).toFixed(1)}%)</span></div>
                                <div className="w-full bg-brand-violet rounded-full h-4"><div className="bg-brand-gold h-4 rounded-full" style={{ width: `${(opt.votes / totalVotes) * 100}%` }}></div></div>
                            </div>
                        ))}
                    </div>
                     <p className="mt-8 text-brand-gold italic font-body text-lg">Your vote has been cast in this session.</p>
                </div>
            );
        }

        return (
            <div className={borderClass}>
                <h3 className="font-display text-3xl text-brand-gold mb-6">{poll.question}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {poll.options.map((opt, index) => (
                         <button key={index} onClick={() => handleVote(index)} className="w-full text-left p-4 admin-card rounded-lg hover:border-brand-gold transition-all duration-300 transform hover:scale-105">
                           <span className="font-body text-lg">{opt.text}</span>
                         </button>
                    ))}
                </div>
            </div>
        );
    };
    
    const renderPeersContent = () => (
        <>
            <h3 className="font-display text-3xl text-brand-gold mb-4">House of Peers: Registry</h3>
            <form onSubmit={handleSearch} className="flex gap-4 mb-6">
                <input type="text" placeholder="Search for your name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-grow custom-input text-brand-parchment rounded px-4 py-2" />
                <button type="submit" className="custom-btn custom-btn-violet font-display px-6 py-2 rounded">Search</button>
            </form>
            {searchResult === undefined && <p className="text-brand-silver italic font-body">Enter your name to search the peerage registry.</p>}
            {searchResult === null && <p className="text-red-400 font-body">No peer found with that name.</p>}
            {searchResult && (
                <div className="p-6 border border-brand-gold bg-black bg-opacity-20 rounded-lg">
                    <h4 className="text-2xl text-brand-gold font-display">{searchResult.name}</h4>
                    <p className="text-brand-parchment mt-2 font-body text-lg">{searchResult.description}</p>
                </div>
            )}
            {renderVotingPanel()}
        </>
    );

    return (
        <Section id="parliament" title="Parliament of Novelia">
             {!house ? (
                <div className="max-w-md mx-auto text-center p-8 admin-card rounded-lg">
                    <h3 className="font-display text-3xl text-brand-gold mb-4">Authorization Required</h3>
                    <p className="text-brand-silver mb-4 font-body">Enter the access code for your designated House.</p>
                    <form onSubmit={handleLogin}>
                        <input type="password" aria-label="Access Code" placeholder="Enter Access Code" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} className="w-full custom-input text-brand-parchment rounded px-4 py-3 mb-4"/>
                        <button type="submit" className="w-full custom-btn custom-btn-violet font-display py-3 rounded">Enter Chamber</button>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                    </form>
                </div>
            ) : (
                <div className="admin-card p-8 rounded-lg">
                   {house === 'peers' ? renderPeersContent() : renderVotingPanel()}
                </div>
            )}
        </Section>
    );
};

export default ParliamentPanel;
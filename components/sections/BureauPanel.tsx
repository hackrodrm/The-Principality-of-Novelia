
import React, { useState, useEffect, FormEvent } from 'react';
import Section from '../Section';
import { initDB, getAll, put, remove } from '../db';

interface ArchiveRecord {
    id: number;
    title: string;
    content: string;
    lastModified: string;
    file?: File;
}

const CORRECT_ACCESS_CODE = '1006';

const BureauPanel: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');

    const [records, setRecords] = useState<ArchiveRecord[]>([]);
    const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
    const defaultForm = { title: '', content: '' };
    const [formRecord, setFormRecord] = useState(defaultForm);
    const [formFile, setFormFile] = useState<File | null>(null);
    const [isFileRemoved, setIsFileRemoved] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadRecords = async () => {
            try {
                await initDB();
                const storedRecords = await getAll<ArchiveRecord>('archive');
                setRecords(storedRecords || []);
            } catch (e) {
                console.error("Failed to load archive from IndexedDB", e);
            }
        };
        loadRecords();
    }, []);

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

    const handleSaveRecord = async (e: FormEvent) => {
        e.preventDefault();
        if (!formRecord.title.trim() || !formRecord.content.trim()) return;

        const now = new Date().toLocaleString();
        if (editingRecordId) {
            const originalRecord = records.find(r => r.id === editingRecordId)!;
            const updatedRecord: ArchiveRecord = {
                ...originalRecord,
                title: formRecord.title,
                content: formRecord.content,
                lastModified: now,
            };
            if (isFileRemoved) {
                delete updatedRecord.file;
            } else if (formFile) {
                updatedRecord.file = formFile;
            }
            await put('archive', updatedRecord);
            setRecords(records.map(r => r.id === editingRecordId ? updatedRecord : r));
        } else {
            const newRecord: ArchiveRecord = {
                id: Date.now(),
                ...formRecord,
                lastModified: now,
            };
            if (formFile) {
                newRecord.file = formFile;
            }
            await put('archive', newRecord);
            setRecords([...records, newRecord]);
        }
        handleCancelEdit();
    };

    const handleEditRecord = (record: ArchiveRecord) => {
        setEditingRecordId(record.id);
        setFormRecord({ title: record.title, content: record.content });
        setFormFile(null);
        setIsFileRemoved(false);
    };

    const handleCancelEdit = () => {
        setEditingRecordId(null);
        setFormRecord(defaultForm);
        setFormFile(null);
        setIsFileRemoved(false);
        const fileInput = document.getElementById('recordFile') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    };

    const handleRemoveRecord = async (id: number) => {
        if (window.confirm('Are you sure you want to remove this record from the archive?')) {
            await remove('archive', id);
            setRecords(records.filter(r => r.id !== id));
        }
    };

    const filteredRecords = records.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.content.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => b.id - a.id);

    return (
        <Section id="bureauOffice" title="Bureau Office">
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
                        <h3 className="font-display text-4xl text-brand-gold">Clerk's Panel</h3>
                        <button onClick={handleLogout} className="custom-btn bg-red-800 text-brand-parchment font-display px-6 py-2 rounded hover:bg-red-700">Logout</button>
                    </div>

                    <AdminPanel title="Manage National Archives">
                        <form onSubmit={handleSaveRecord} className="space-y-4 mb-8">
                            <input type="text" placeholder="Record Title" value={formRecord.title} onChange={(e) => setFormRecord({ ...formRecord, title: e.target.value })} className="w-full custom-input text-brand-parchment rounded px-4 py-2"/>
                            <textarea placeholder="Record Content" value={formRecord.content} onChange={(e) => setFormRecord({ ...formRecord, content: e.target.value })} className="w-full custom-input text-brand-parchment rounded px-4 py-2 h-32" />
                            <div className="custom-input p-3 rounded-lg">
                                <label htmlFor="recordFile" className="block text-sm font-body text-brand-silver mb-2">Attach File (Optional)</label>
                                {editingRecordId && records.find(r => r.id === editingRecordId)?.file && !isFileRemoved && (
                                    <div className="flex justify-between items-center bg-black bg-opacity-20 p-2 rounded mb-2">
                                        <span className="text-brand-parchment text-sm truncate">{records.find(r => r.id === editingRecordId)?.file?.name}</span>
                                        <button type="button" onClick={() => {setIsFileRemoved(true); setFormFile(null);}} className="text-red-500 hover:text-red-400 text-xs font-bold ml-4">REMOVE</button>
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    id="recordFile"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setFormFile(e.target.files[0]);
                                            setIsFileRemoved(false);
                                        }
                                    }}
                                    className="w-full text-sm text-brand-silver file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-violet file:text-brand-gold hover:file:bg-opacity-80 cursor-pointer"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button type="submit" className="flex-grow custom-btn custom-btn-violet font-display py-2 rounded">{editingRecordId ? 'Update Record' : 'Add Record'}</button>
                                {editingRecordId && (<button type="button" onClick={handleCancelEdit} className="custom-btn bg-gray-600 text-brand-parchment font-display px-4 py-2 rounded hover:bg-gray-500">Cancel</button>)}
                            </div>
                        </form>
                        
                        <div className="mb-4">
                            <input type="text" placeholder="Search archives..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full custom-input text-brand-parchment rounded px-4 py-2" />
                        </div>
                        
                        <AdminTable headers={["Title", "Last Modified", "Actions"]}>
                            {filteredRecords.map(record => (
                                <tr key={record.id}>
                                    <td className="font-body align-top py-2 pr-4 w-1/3">
                                        <details>
                                            <summary className="cursor-pointer hover:text-brand-gold">{record.title}</summary>
                                            <div className="mt-2 space-y-3">
                                                <p className="text-sm text-brand-silver whitespace-pre-wrap">{record.content}</p>
                                                {record.file && (
                                                    <a href={URL.createObjectURL(record.file)} download={record.file.name} className="inline-block custom-btn custom-btn-gold text-xs px-3 py-1 rounded">
                                                        Download Attachment
                                                    </a>
                                                )}
                                            </div>
                                        </details>
                                    </td>
                                    <td className="font-body align-top py-2 pr-4">{record.lastModified}</td>
                                    <td className="text-right align-top py-2 space-x-4">
                                        <button onClick={() => handleEditRecord(record)} className="text-brand-gold hover:text-yellow-300 font-bold">Edit</button>
                                        <button onClick={() => handleRemoveRecord(record.id)} className="text-red-500 hover:text-red-400 font-bold">Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </AdminTable>
                        {filteredRecords.length === 0 && <p className="text-center mt-4 text-brand-silver font-body">No records found.</p>}
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
                <tr>{headers.map(h => <th key={h} className="p-2 pb-3 font-display text-brand-silver tracking-wider">{h}</th>)}</tr>
            </thead>
            <tbody>{children}</tbody>
        </table>
    </div>
);

export default BureauPanel;
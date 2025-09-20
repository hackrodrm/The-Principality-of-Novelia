
import React, { useState, useEffect } from 'react';
import Section from '../Section';
import BookIcon from '../icons/BookIcon';
import { getAll } from '../db';

interface Book {
    id: number;
    title: string;
    pdfFile: File;
}

const NationalLibrary: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const storedBooks = await getAll<Book>('books');
                setBooks(storedBooks || []);
            } catch (e) {
                console.error("Failed to load books from IndexedDB", e);
                setBooks([]);
            }
        };
        loadBooks();
    }, []);

    return (
        <Section id="library" title="The National Library">
            <p className="text-center mb-12 text-xl font-body italic text-brand-silver">
                Welcome to the archives of Novelia. Herein lie the collected works, royal decrees, and scholarly texts of the Principality. Peruse these volumes to deepen your understanding of our realm.
            </p>
            {books.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {books.map((book) => (
                        <a
                            key={book.id}
                            href={URL.createObjectURL(book.pdfFile)}
                            download={book.pdfFile.name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block p-6 card rounded-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-gold-glow"
                            aria-label={`Download ${book.title}`}
                        >
                            <div className="flex items-center space-x-4">
                                <BookIcon className="w-12 h-12 text-brand-gold group-hover:text-brand-parchment transition-colors duration-300" />
                                <div>
                                    <h3 className="font-display text-2xl text-brand-gold group-hover:text-white transition-colors duration-300">{book.title}</h3>
                                    <p className="text-sm text-brand-silver mt-1 font-body">Click to view or download</p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 card rounded-lg">
                    <h3 className="font-display text-3xl text-brand-silver">The Archives Are Quiet</h3>
                    <p className="mt-4 text-brand-parchment font-body text-lg">No documents have been accessioned yet. Please check back later.</p>
                </div>
            )}
        </Section>
    );
};

export default NationalLibrary;
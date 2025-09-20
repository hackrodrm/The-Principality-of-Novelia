
import React from 'react';
import Section from '../Section';
import CoatOfArmsIcon from '../icons/CoatOfArmsIcon';
import FlagIcon from '../icons/FlagIcon';

const Home: React.FC = () => {
    return (
        <Section id="home" title="The Principality of Novelia">
            <div className="text-center">
                <p className="text-xl md:text-2xl mb-12 font-body italic text-brand-silver">
                    This solemn charter, enacted by Royal Decree, establishes the foundational principles, governmental structure, and national symbols of the Principality of Novelia. It is a sovereign micronation founded by and for book readers, dedicated to the pursuit of knowledge, wisdom, and virtue.
                </p>

                <div className="card max-w-4xl mx-auto p-6 rounded-lg my-12 border-brand-gold shadow-gold-glow">
                    <blockquote className="text-center font-body text-xl text-brand-parchment italic relative">
                        <span className="absolute -top-4 -left-4 text-6xl text-brand-gold opacity-20 font-display">“</span>
                        By the hand and seal of His Majesty, Prince Ritobrata Mondal, this Principality is established as a bastion of wisdom, a sanctuary for the learned, and a testament to the enduring power of the written word. Let all who enter find fellowship in letters and virtue in knowledge.
                        <span className="absolute -bottom-4 -right-4 text-6xl text-brand-gold opacity-20 font-display">”</span>
                    </blockquote>
                    <p className="text-right mt-4 font-display text-brand-gold text-lg">- The Monarch's Founding Decree</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-16 items-center my-12">
                    <div className="text-center">
                        <h3 className="font-display text-4xl text-brand-gold mb-4">Coat of Arms</h3>
                        <CoatOfArmsIcon />
                    </div>
                    <div className="text-center">
                        <h3 className="font-display text-4xl text-brand-gold mb-4">Flag</h3>
                        <FlagIcon className="w-64 h-auto mx-auto filter drop-shadow-lg" />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 text-center mt-16">
                    <MottoCard title="Per Litteras et Virtutem" subtitle="Through Letters and Virtue" />
                    <AnthemCard />
                    <MottoCard title="Sapientia et Fides" subtitle="Wisdom and Faith" />
                </div>
            </div>
        </Section>
    );
};

const MottoCard: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
    <div className="card p-6 rounded-lg h-full flex flex-col justify-center">
        <h3 className="font-display text-3xl text-brand-gold">{title}</h3>
        <p className="italic text-brand-silver mt-2 font-body text-lg">{subtitle}</p>
    </div>
);

const AnthemCard: React.FC = () => (
    <div className="card p-6 rounded-lg">
        <h3 className="font-display text-3xl text-brand-gold">Anthem</h3>
        <p className="italic text-brand-silver mt-2 font-body text-lg">"Toward the Stars, Novelia"</p>
        <blockquote className="mt-4 text-left text-brand-parchment space-y-2 text-base md:text-lg font-body">
            <p>Toward the stars, O Novelia,</p>
            <p>In wisdom shall we rise.</p>
            <p>Through letters and through virtue,</p>
            <p>Our crown shall touch the skies.</p>
            <p>In faith we stand united,</p>
            <p>In honor we remain.</p>
            <p>Forever, free Novelia,</p>
            <p>Eternal be thy name.</p>
        </blockquote>
    </div>
);

export default Home;
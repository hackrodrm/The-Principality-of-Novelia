
import React from 'react';
import Section from '../Section';

const InfoBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="card mb-8 p-8 rounded-lg">
        <h3 className="font-display text-3xl text-brand-gold mb-4">{title}</h3>
        <div className="space-y-4 text-brand-parchment font-body text-lg">
            {children}
        </div>
    </div>
);

const Laws: React.FC = () => {
    return (
        <Section id="laws" title="The Codex and Laws">
             <InfoBlock title="Article III: The Constitution of Readers and Citizens' Rights">
                <p>This constitution enshrines the fundamental laws that govern the lives of all Readers in Novelia, ensuring the preservation of knowledge and the integrity of the community.</p>
                <ol className="list-decimal list-inside mt-4 space-y-3">
                    <li><span className="font-bold text-brand-gold">Law of the Written Word:</span> The written word is sacred. Plagiarism and misattribution are considered grave offenses.</li>
                    <li><span className="font-bold text-brand-gold">Law of Open Discourse:</span> Debate must be conducted with respect, logical reasoning, and a commitment to truth.</li>
                    <li><span className="font-bold text-brand-gold">Law of the Archive:</span> All knowledge, once declared public, must be preserved in the national archives.</li>
                    <li><span className="font-bold text-brand-gold">Law of Civic Duty:</span> Every Reader is expected to contribute to the well-being of the community.</li>
                    <li><span className="font-bold text-brand-gold">Citizens' Rights:</span> Citizens are guaranteed rights of free speech, fair trial, and participation in cultural life. Nobles and Royals shall not be above the law of Novelia.</li>
                </ol>
             </InfoBlock>
             <InfoBlock title="Article IV: The Codex and Legislative Process">
                <p>Laws shall be drafted in Parliament, passed by their respective House, confirmed by the Cabinet where applicable, and ratified by the Monarch through Royal Assent. No law shall be binding without entry into the Codex of Novelia, which is the official body of laws for the nation.</p>
                 <ul className="list-disc list-inside mt-4 space-y-3">
                    <li><span className="font-bold text-brand-gold">Citizen Laws:</span> Proposed and voted on in the House of Readers.</li>
                    <li><span className="font-bold text-brand-gold">Policy Laws:</span> Proposed and voted on in the House of Peers, with Cabinet oversight.</li>
                </ul>
                <p className="mt-4">The Bureau of Government Workings maintains all official archives, registers all members, oversees elections, and is the keeper of the Codex of Laws.</p>
             </InfoBlock>
        </Section>
    );
};

export default Laws;
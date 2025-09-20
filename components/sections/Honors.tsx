
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

const Honors: React.FC = () => {
    return (
        <Section id="honors" title="Honors and Our Legacy">
            <InfoBlock title="Article VII: System of Honors and Prizes">
                <p>All honors are bestowed directly by the Monarch as a mark of supreme distinction.</p>
                <ul className="list-disc list-inside mt-4 space-y-3">
                    <li><span className="font-bold text-brand-gold">The Laurel of Scholarship:</span> For outstanding intellectual and research contributions.</li>
                    <li><span className="font-bold text-brand-gold">The Silver Quill:</span> For exceptional literary or cultural achievement.</li>
                    <li><span className="font-bold text-brand-gold">The Golden Lamp:</span> For exemplary service to the governance and administration of the Principality.</li>
                    <li><span className="font-bold text-brand-gold">The Order of the Crowned Reader:</span> The highest honor, for extraordinary loyalty and service.</li>
                    <li><span className="font-bold text-brand-gold">Royal Commendation:</span> A personal letter or scroll from the Monarch, recognizing a noble deed.</li>
                </ul>
            </InfoBlock>
            <InfoBlock title="Article VI: The Declaration of Peaceful Coexistence and Safeguards">
                <p className="italic border-l-4 border-brand-gold pl-6">
                Novelia is a peaceful micronation, dedicating its resources and efforts to internal matters. It holds no territorial ambitions and will not engage in armed conflict with any other nation, virtual or otherwise. The Principality of Novelia is a literary and cultural project and <span className="font-bold">not a sovereign state in reality.</span> It makes no claim of land, taxation, military, or political dominion outside its voluntary membership. All citizens remain loyal subjects of their real-world nations. This Constitution is intended for the enrichment of creativity, governance experience, and fellowship only.
                </p>
            </InfoBlock>
        </Section>
    );
};

export default Honors;
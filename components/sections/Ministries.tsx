
import React, { useState, useEffect } from 'react';
import Section from '../Section';
import { getAll } from '../db';

const InfoBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="card mb-8 p-8 rounded-lg">
        <h3 className="font-display text-3xl text-brand-gold mb-4">{title}</h3>
        <div className="space-y-4 text-brand-parchment font-body text-lg">
            {children}
        </div>
    </div>
);

interface Minister {
    id: number;
    name: string;
    ministry: string;
    description: string;
}

const initialMinisters: Minister[] = [
    { id: 1, name: 'Cancellarius Maximus', ministry: 'Prime Minister', description: 'The supreme head of government and chair of the Cabinet.' },
    { id: 2, name: 'Vacant', ministry: 'Ministry of Foreign Affairs & Cultural Exchange', description: 'The Chancellery of Embassies, operating under this Ministry, is tasked with establishing diplomatic ties with friendly micronations, fostering cultural exchange programs, and representing Novelia on the global stage. Its primary tools are not treaties of trade or war, but "Literary Treaties"—agreements to share and preserve great works of literature.' },
    { id: 3, name: 'Vacant', ministry: 'Ministry of Justice & the Codex', description: 'This Ministry is the guardian of the Codex of Novelia. It upholds the laws of the land, ensuring that justice is administered with wisdom and fairness. The High Court of Scribes convenes here to adjudicate on matters of law, with a special focus on protecting intellectual property and upholding the "Law of the Written Word."' },
    { id: 4, name: 'Vacant', ministry: 'Ministry of Internal Affairs & Citizenry', description: 'Responsible for the well-being of Novelia\'s citizenry, this Ministry manages the Registry of Readers, organizes national events such as the "Festival of the First Edition," and promotes civic engagement. It ensures the Principality remains a harmonious and thriving community for all its members.' },
    { id: 5, name: 'Vacant', ministry: 'The Bureau of Government Workings', description: 'The administrative heart of the Principality. The Bureau is the keeper of the Codex, the manager of the state archives in The Great Library, and the overseer of all parliamentary procedures and elections. Its diligent Clerks ensure that the machinery of government runs smoothly and transparently.' },
    { id: 6, name: 'Vacant', ministry: 'Ministry of Research & Scholarship', description: 'Dedicated to the pursuit of knowledge, this Ministry champions intellectual discovery and academic excellence. It administers the prestigious "Laurel of Scholarship," funds research projects that expand the horizons of understanding, and curates new acquisitions for the national archives, ensuring Novelia remains at the forefront of thought and wisdom.' }
];

const Ministries: React.FC = () => {
    const [ministers, setMinisters] = useState<Minister[]>([]);

    useEffect(() => {
        const loadMinisters = async () => {
            try {
                const storedMinisters = await getAll<Minister>('ministers');
                setMinisters(storedMinisters.length > 0 ? storedMinisters : initialMinisters);
            } catch (e) {
                console.error("Failed to parse ministers from IndexedDB", e);
                setMinisters(initialMinisters);
            }
        };
        loadMinisters();
    }, []);

    return (
        <Section id="ministries" title="The Royal Ministries">
             <p className="text-center mb-12 text-xl font-body italic text-brand-silver">The day-to-day governance of Novelia is executed by the Royal Ministries, each headed by a High Minister. These bodies are responsible for implementing policy, managing state affairs, and serving the citizens of the Principality.</p>

            {ministers.length > 0 ? (
                ministers.map(minister => (
                    <InfoBlock key={minister.id} title={minister.ministry}>
                        <p className="font-bold text-brand-silver mb-2">Minister: {minister.name}</p>
                        <p>{minister.description}</p>
                    </InfoBlock>
                ))
            ) : (
                <div className="card text-center py-12 px-6 rounded-lg">
                    <h3 className="font-display text-2xl text-brand-silver">The Ministries Are Being Formed</h3>
                    <p className="mt-2 text-brand-parchment font-body text-lg">Information on government ministries will be available soon.</p>
                </div>
            )}
        </Section>
    );
};

export default Ministries;
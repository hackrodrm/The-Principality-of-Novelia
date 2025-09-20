
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

const Government: React.FC = () => {
    return (
        <Section id="government" title="The Crown and Government">
            <InfoBlock title="Article I: The Sovereignty of the Crown">
                <p>The Monarch is the head of state and the font of all dignity and honor in Novelia. All authority flows from the Crown, which is the ultimate protector of the nation's heritage and the guardian of its people. The Monarch's Royal Assent is the final and sacred act that transforms a legislative proposal into the law of the land.</p>
            </InfoBlock>
            <InfoBlock title="Article II: The Parliament of Novelia">
                <p>The Parliament is the legislative body, serving as a council to the Crown. It is comprised of two houses, each with a distinct purpose and composition.</p>
                <ul className="list-disc list-inside mt-4 space-y-3">
                    <li><span className="font-bold text-brand-gold">The House of Readers:</span> This house serves as the voice of the citizens, known as the Readers of the nation. Any citizen may propose a Citizen Law to be debated and voted upon. The Speaker of the House of Readers, appointed by the Crown, maintains order and decorum.</li>
                    <li><span className="font-bold text-brand-gold">The House of Peers:</span> An assembly of esteemed individuals, appointed by the Monarch in recognition of their exceptional service, significant financial contribution, and invaluable skill. These Peers are entrusted with the solemn duty of advising the Crown and proposing Policy Laws.</li>
                </ul>
            </InfoBlock>
            <InfoBlock title="Article VIII: System of Ministries and Ranks">
                <p>The government of Novelia is led by five ministries, with a structured hierarchy to ensure order and efficiency. The day-to-day working of government offices is overseen by these officials:</p>
                 <ul className="list-disc list-inside mt-4 space-y-3">
                    <li><span className="font-bold text-brand-gold">Prime Minister (Cancellarius Regni):</span> The supreme head of government and chair of the Cabinet.</li>
                    <li><span className="font-bold text-brand-gold">High Ministers (Magistri Regni):</span> The heads of the five ministries.</li>
                    <li><span className="font-bold text-brand-gold">Deputy Ministers (Vicarii Magistri):</span> Seconds-in-command for each ministry.</li>
                    <li><span className="font-bold text-brand-gold">Secretaries of Office (Notarii):</span> Executive officers and scribes, responsible for managing official communications.</li>
                    <li><span className="font-bold text-brand-gold">Clerks of the Bureau (Clerici Regni):</span> Archivists and keepers of state records.</li>
                </ul>
            </InfoBlock>
        </Section>
    );
};

export default Government;
import * as React from 'react';

type PinguMood = 'happy' | 'studying' | 'pencil' | 'neutral' | 'sleepy';

interface PinguProps {
    mood?: PinguMood;
    size?: number;
    className?: string;
}

export const Pingu: React.FC<PinguProps> = ({ mood = 'neutral', size = 150, className = '' }) => {
    // Colors based on the user's image (Dark Navy, Yellow/Blue Scarf)
    const c = {
        body: '#1e293b', // Slate 800 - Navy-ish
        belly: '#ffffff',
        beak: '#f59e0b', // Amber 500
        feet: '#f59e0b',
        eyeBg: 'white',
        pupil: 'black',
        scarf1: '#0ea5e9', // Sky 500
        scarf2: '#eab308', // Yellow 500
        blush: '#fca5a5', // Red 300
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-all duration-300 ${className}`}
        >
            {/* --- BODY GROUP --- */}
            <g className="animate-[bounce_3s_infinite]">

                {/* Feet */}
                <ellipse cx="70" cy="185" rx="25" ry="12" fill={c.feet} />
                <ellipse cx="130" cy="185" rx="25" ry="12" fill={c.feet} />

                {/* Main Body */}
                <path d="M50 190C20 190 10 120 20 80C30 30 60 10 100 10C140 10 170 30 180 80C190 120 180 190 150 190H50Z" fill={c.body} />

                {/* White Belly */}
                <path d="M55 185C35 185 35 120 45 90C55 50 75 40 100 40C125 40 145 50 155 90C165 120 165 185 145 185H55Z" fill={c.belly} />

                {/* Eyes */}
                <g transform={mood === 'studying' ? 'translate(0, 5)' : ''}>
                    {/* Left Eye */}
                    <ellipse cx="70" cy="75" rx="18" ry="22" fill={c.eyeBg} />
                    <circle cx="72" cy="75" r="8" fill={c.pupil} />
                    <circle cx="75" cy="72" r="3" fill="white" />

                    {/* Right Eye */}
                    {mood === 'pencil' ? ( // Winking eye
                        <path d="M112 75Q130 65 148 75" stroke={c.body} strokeWidth="4" strokeLinecap="round" />
                    ) : (
                        <>
                            <ellipse cx="130" cy="75" rx="18" ry="22" fill={c.eyeBg} />
                            <circle cx="128" cy="75" r="8" fill={c.pupil} />
                            <circle cx="125" cy="72" r="3" fill="white" />
                        </>
                    )}
                </g>

                {/* Beak */}
                <path d="M85 95 Q100 110 115 95 Q100 85 85 95" fill={c.beak} />

                {/* Blush */}
                {(mood === 'happy' || mood === 'neutral') && (
                    <>
                        <ellipse cx="50" cy="95" rx="8" ry="5" fill={c.blush} opacity="0.6" />
                        <ellipse cx="150" cy="95" rx="8" ry="5" fill={c.blush} opacity="0.6" />
                    </>
                )}

                {/* --- SCARF --- */}
                <path d="M35 110 Q100 130 165 110" stroke={c.scarf1} strokeWidth="18" strokeLinecap="round" />
                <path d="M40 111 Q100 131 160 111" stroke={c.scarf2} strokeWidth="18" strokeLinecap="round" strokeDasharray="15 15" strokeDashoffset="0" />
                {/* Scarf Tail */}
                <path d="M155 110 L165 140 L185 135 L165 110" fill={c.scarf1} />
                <path d="M160 120 L163 130" stroke={c.scarf2} strokeWidth="5" />

                {/* --- ARMS / FLIPPERS --- */}
                {/* Left Arm */}
                {mood === 'happy' ? (
                    <path d="M25 100 Q-10 60 10 40" stroke={c.body} strokeWidth="18" strokeLinecap="round" />
                ) : (
                    <path d="M25 100 Q10 130 25 150" stroke={c.body} strokeWidth="18" strokeLinecap="round" />
                )}

                {/* Right Arm */}
                {mood === 'happy' ? (
                    <path d="M175 100 Q210 60 190 40" stroke={c.body} strokeWidth="18" strokeLinecap="round" />
                ) : (
                    <path d="M175 100 Q190 130 175 150" stroke={c.body} strokeWidth="18" strokeLinecap="round" />
                )}
            </g>

            {/* --- PROPS & ACCESSORIES --- */}

            {/* BOOKS (Studying) */}
            {mood === 'studying' && (
                <g transform="translate(40, 160)">
                    <rect x="0" y="0" width="120" height="15" fill="#ef4444" rx="2" />
                    <rect x="5" y="15" width="110" height="15" fill="#3b82f6" rx="2" />
                    <rect x="10" y="30" width="100" height="15" fill="#22c55e" rx="2" />
                    {/* Open Book in hands logic would require complex arm re-rigging, simplified to sitting on books */}
                </g>
            )}

            {/* PENCIL (Writing) */}
            {mood === 'pencil' && (
                <g transform="translate(140, 80) rotate(-15)">
                    <rect x="0" y="0" width="20" height="80" fill="#facc15" rx="2" />
                    <polygon points="0,0 20,0 10,-20" fill="#fde047" /> {/* Tip wood */}
                    <polygon points="7,-20 13,-20 10,-26" fill="black" /> {/* Lead */}
                    <rect x="0" y="80" width="20" height="10" fill="#f87171" rx="2" /> {/* Eraser */}
                </g>
            )}

        </svg>
    );
};

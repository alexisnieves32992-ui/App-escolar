import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import Header from './Header';
import { IconEditSquare, IconTrash, IconX, IconCheck, IconArrowLeft, IconCamera, IconImage, IconPencil, IconDownload, IconMagic } from './Icons';
import { Subject, Evaluation, ColorKey, AppSettings } from '../types';
// @ts-ignore
import html2canvas from 'html2canvas';
import Modal from './Modal';

// --- CONFIGURATION ---

export const COLOR_PALETTE: Record<ColorKey, { bg: string, border: string, text: string, ring: string, checkBg: string, hex: string }> = {
    green: { bg: 'bg-[#96E068]', border: 'border-[#7BC550]', text: 'text-[#1A380F]', ring: '#B2E893', checkBg: '#7BC550', hex: '#96E068' },
    mint: { bg: 'bg-[#99F6D6]', border: 'border-[#7ACCC2]', text: 'text-[#0F3830]', ring: '#C8FBE9', checkBg: '#7ACCC2', hex: '#99F6D6' },
    red: { bg: 'bg-[#FF8A75]', border: 'border-[#E06A58]', text: 'text-[#4A1810]', ring: '#FFC1B6', checkBg: '#E06A58', hex: '#FF8A75' },
    orange: { bg: 'bg-[#FDBA74]', border: 'border-[#EA580C]', text: 'text-[#7C2D12]', ring: '#FED7AA', checkBg: '#EA580C', hex: '#FDBA74' },
    yellow: { bg: 'bg-[#FDE047]', border: 'border-[#CA8A04]', text: 'text-[#713F12]', ring: '#FEF08A', checkBg: '#CA8A04', hex: '#FDE047' },
    lime: { bg: 'bg-[#BEF264]', border: 'border-[#65A30D]', text: 'text-[#365314]', ring: '#D9F99D', checkBg: '#65A30D', hex: '#BEF264' },
    cyan: { bg: 'bg-[#67E8F9]', border: 'border-[#0891B2]', text: 'text-[#164E63]', ring: '#A5F3FC', checkBg: '#0891B2', hex: '#67E8F9' },
    blue: { bg: 'bg-[#93C5FD]', border: 'border-[#2563EB]', text: 'text-[#1E3A8A]', ring: '#BFDBFE', checkBg: '#2563EB', hex: '#93C5FD' },
    indigo: { bg: 'bg-[#A5B4FC]', border: 'border-[#4F46E5]', text: 'text-[#312E81]', ring: '#C7D2FE', checkBg: '#4F46E5', hex: '#A5B4FC' },
    violet: { bg: 'bg-[#C4B5FD]', border: 'border-[#7C3AED]', text: 'text-[#4C1D95]', ring: '#DDD6FE', checkBg: '#7C3AED', hex: '#C4B5FD' },
    fuchsia: { bg: 'bg-[#F0ABFC]', border: 'border-[#C026D3]', text: 'text-[#701A75]', ring: '#F5D0FE', checkBg: '#C026D3', hex: '#F0ABFC' },
    pink: { bg: 'bg-[#F9A8D4]', border: 'border-[#DB2777]', text: 'text-[#831843]', ring: '#FBCFE8', checkBg: '#DB2777', hex: '#F9A8D4' },
    rose: { bg: 'bg-[#FDA4AF]', border: 'border-[#E11D48]', text: 'text-[#881337]', ring: '#FECDD3', checkBg: '#E11D48', hex: '#FDA4AF' },
    slate: { bg: 'bg-[#CBD5E1]', border: 'border-[#475569]', text: 'text-[#0F172A]', ring: '#E2E8F0', checkBg: '#475569', hex: '#CBD5E1' },
    stone: { bg: 'bg-[#D6D3D1]', border: 'border-[#57534E]', text: 'text-[#1C1917]', ring: '#E7E5E4', checkBg: '#57534E', hex: '#D6D3D1' },
};

type FilterType = 'all' | 'risk' | 'passed';

// Helper for formatting
const fmt = (n: number) => Number.isInteger(n) ? n.toString() : n.toFixed(1).replace('.', ',');

// --- SUB-COMPONENTS ---

interface SubjectCardProps {
    subject: Subject;
    onEdit: (e: any, subject: Subject) => void;
    onClick: (subject: Subject) => void;
}

const SubjectCard = React.memo(({ subject, onEdit, onClick }: SubjectCardProps) => {
    const { color, name, prof, score, minScore } = subject;
    const theme = COLOR_PALETTE[color] || COLOR_PALETTE.green;
    const isCheck = score >= minScore;
    const pointsStr = fmt(score);

    let evalStatusColor = '#EF4444';
    if (score >= minScore) {
        evalStatusColor = '#22C55E';
    } else if (score > 0) {
        evalStatusColor = '#FBBF24';
    }

    return (
        <div
            className={`w-full ${theme.bg} rounded-[2rem] p-4 relative shadow-xl border-b-4 ${theme.border} flex justify-between cursor-pointer hover-lift spring-press`}
            onClick={() => onClick(subject)}
        >
            <div className="flex flex-col flex-1 relative">
                <div className="flex items-center mb-1">
                    <h2 className="text-2xl font-[800] tracking-tight mr-2 text-black line-clamp-1">{name}</h2>
                    <div
                        className="opacity-60 flex items-center justify-center cursor-pointer hover:opacity-100 transition-opacity p-1"
                        onClick={(e) => onEdit(e, subject)}
                    >
                        <IconEditSquare className="w-6 h-6" />
                    </div>
                </div>

                <div className="mb-0 text-sm font-[700] text-black leading-tight">
                    profesor <span className="opacity-60 ml-1 font-[600]">{prof}</span>
                </div>
                <div className="mb-2 text-sm font-[700] text-black leading-tight">
                    puntos acumulados <span className="opacity-60 ml-1 font-[600]">{pointsStr}</span>
                </div>

                <div className="mt-2 relative">
                    <div className="bg-white/40 rounded-full border-2 border-black/50 px-4 py-1 inline-flex items-center justify-between min-w-[150px]">
                        <span className="font-[800] text-black text-sm">evaluaciones</span>
                        <div
                            className="w-4 h-4 rounded-full border border-black/20 shadow-xl ml-4 flex items-center justify-center font-bold text-[10px]"
                            style={{ backgroundColor: evalStatusColor }}
                        >
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative w-24 h-24 flex-shrink-0 ml-2">
                <div className="w-full h-full bg-white/40 rounded-full flex items-center justify-center relative">
                    <div className={`absolute inset-2 rounded-full border-[6px]`} style={{ borderColor: theme.ring }}></div>
                    <svg className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] transform -rotate-90">
                        {score > 0 && (
                            <circle
                                cx="50%" cy="50%" r="42%"
                                stroke={color === 'red' ? '#C53030' : '#559434'}
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray="200"
                                strokeDashoffset={Math.max(0, 200 - (score / subject.maxScore) * 200)}
                                strokeLinecap="round"
                            />
                        )}
                    </svg>
                    {/* Calculate Average on the fly */}
                    {(() => {
                        const wTotal = subject.evaluations.reduce((acc, ev) => {
                            if (ev.isGraded) {
                                const wStr = ev.weight ? ev.weight.toString() : '20';
                                const weightVal = parseFloat(wStr.replace(',', '.'));
                                return acc + (isNaN(weightVal) ? 0 : weightVal);
                            }
                            return acc;
                        }, 0);
                        const avg = wTotal > 0 ? (subject.score / (wTotal / 100)) : 0;
                        const avgStr = Number.isInteger(avg) ? avg.toString() : avg.toFixed(1).replace('.', ',');
                        return <span className="text-2xl font-[900] text-black z-10">{avgStr}</span>;
                    })()}

                    <div className={`absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-4 ${theme.border}`} style={{ backgroundColor: theme.checkBg }}>
                        {isCheck ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

// --- SUBJECT DETAIL VIEW ---
interface DetailViewProps {
    subject: Subject;
    onBack: () => void;
    onUpdateEvaluations: (subjectId: number, evals: Evaluation[]) => void;
    darkMode: boolean;
    settings: AppSettings;
    onNotify: (msg: string, type?: 'success' | 'info') => void;
    initialOpenEvalId?: number | string | null;
}

const SubjectDetailView = React.memo(({ subject, onBack, onUpdateEvaluations, onNotify, settings, darkMode, initialOpenEvalId }: DetailViewProps) => {
    // Scroll state management to ensure we are always at top
    const detailRef = useRef<HTMLDivElement>(null);

    const theme = COLOR_PALETTE[subject.color] || COLOR_PALETTE.green;
    // Dynamic Evaluaciones State
    const [evals, setEvals] = useState<Evaluation[]>(subject.evaluations || []);
    const [isAdding, setIsAdding] = useState(false);
    const [viewingImage, setViewingImage] = useState<string | null>(null);
    const detailContentRef = useRef<HTMLDivElement>(null);
    const singleExportRef = useRef<HTMLDivElement>(null);

    // Sync evals when subject prop changes
    useEffect(() => {
        setEvals(subject.evaluations || []);
    }, [subject]);

    // Handle initial evaluation open from search
    useEffect(() => {
        if (initialOpenEvalId) {
            const ev = evals.find(e => String(e.id) === String(initialOpenEvalId));
            if (ev) {
                // We use a small timeout to let the view render first
                setTimeout(() => {
                    handleEditClick(ev);
                }, 100);
            }
        }
    }, [initialOpenEvalId, evals.length]);

    // AI Scanning State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const scanInputRef = useRef<HTMLInputElement>(null);

    const [newEval, setNewEval] = useState<{
        id?: number;
        name: string;
        isGraded: boolean;
        score: string;
        weight: string;
        date: string;
        comment: string;
        image?: string;
    }>({ name: '', isGraded: false, score: '', weight: '', date: '', comment: '' });

    const [deletingId, setDeletingId] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reuse helper for detail download
    const handleDownloadDetail = async () => {
        if (!singleExportRef.current) return;
        onNotify("Generando archivo...", "info");

        try {
            const canvas = await html2canvas(singleExportRef.current, {
                backgroundColor: '#0F172A',
                scale: 2,
                useCORS: true,
                logging: false,
                imageTimeout: 0
            });

            const base64data = canvas.toDataURL('image/png');

            if ((window as any).Capacitor?.isNativePlatform()) {
                const { Filesystem, Directory } = await import('@capacitor/filesystem');

                const fileName = `materia-${subject.id}-${Date.now()}.png`;
                await Filesystem.writeFile({
                    path: `AppEscolar/${fileName}`,
                    data: base64data,
                    directory: Directory.Documents,
                    recursive: true
                });

                onNotify("Imagen guardada en Documentos/AppEscolar", "success");
            } else {
                const link = document.createElement('a');
                link.download = `materia-${subject.name}.png`;
                link.href = base64data;
                link.click();
            }
            onNotify("Imagen guardada", "success");
        } catch (err) {
            console.error("Export detail failed", err);
            onNotify("Error al exportar", "info");
        }
    };

    const handleAddNew = () => {
        const today = new Date().toISOString().split('T')[0];
        setNewEval({
            name: '',
            isGraded: false,
            score: '',
            weight: settings.defaultEvalWeight,
            date: today,
            comment: '',
            image: undefined,
            id: undefined
        });
        setIsAdding(true);
    };

    const [targetEvaluationId, setTargetEvaluationId] = useState<number | string | null>(null);

    const handleSaveEvaluation = () => {
        if (!newEval.name) {
            onNotify('Nombre obligatorio', 'info');
            return;
        }

        // Validate score range if graded
        if (newEval.isGraded && newEval.score) {
            const scoreValue = parseFloat(newEval.score.toString().replace(',', '.'));
            if (isNaN(scoreValue) || scoreValue < 1 || scoreValue > 20) {
                onNotify('Nota debe ser 01-20', 'info');
                return;
            }
        }

        // Validate weight
        const weightValue = parseFloat(newEval.weight.toString().replace(',', '.'));
        if (isNaN(weightValue) || weightValue <= 0) {
            onNotify('Peso inválido', 'info');
            return;
        }

        // Calculate total weight (excluding current eval if editing)
        const otherEvals = newEval.id
            ? evals.filter(e => e.id !== newEval.id)
            : evals;

        const currentTotalWeight = otherEvals.reduce((sum, ev) => {
            const w = parseFloat(ev.weight.toString().replace(',', '.'));
            return sum + (isNaN(w) ? 0 : w);
        }, 0);

        const newTotalWeight = currentTotalWeight + weightValue;

        if (newTotalWeight > 100) {
            onNotify('Excede 100%', 'info');
            return;
        }

        let formattedDate = newEval.date;
        if (formattedDate && formattedDate.includes('-')) {
            const [y, m, d] = formattedDate.split('-');
            formattedDate = `${d}/${m}`;
        }

        if (newEval.id) {
            const updated = evals.map(e => e.id === newEval.id ? {
                ...e,
                name: newEval.name,
                isGraded: newEval.isGraded,
                score: newEval.isGraded ? newEval.score : '',
                weight: newEval.weight,
                date: formattedDate,
                comment: newEval.comment,
                image: newEval.image
            } : e);
            setEvals(updated);
            onUpdateEvaluations(subject.id, updated);
            onNotify('Evaluación actualizada');
        } else {
            const newItem: Evaluation = {
                id: Date.now(),
                name: newEval.name,
                isGraded: newEval.isGraded,
                score: newEval.isGraded ? newEval.score : '',
                weight: newEval.weight,
                date: formattedDate || 'No definida',
                comment: newEval.comment,
                image: newEval.image
            };
            const updated = [...evals, newItem];
            setEvals(updated);
            onUpdateEvaluations(subject.id, updated);
            onNotify('¡Evaluación agregada!');
        }
        setIsAdding(false);
    };

    const handleEditClick = (ev: Evaluation) => {
        let dateForInput = '';
        if (ev.date && ev.date.includes('/')) {
            const [d, m] = ev.date.split('/');
            const year = new Date().getFullYear();
            dateForInput = `${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        }
        setNewEval({
            id: ev.id,
            name: ev.name,
            isGraded: ev.isGraded,
            score: ev.score,
            weight: ev.weight,
            date: dateForInput,
            comment: ev.comment || '',
            image: ev.image
        });
        setIsAdding(true);
    };

    const handleImageUpload = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewEval(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleScanPlan = (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Data = reader.result as string;
            const base64Content = base64Data.split(',')[1];

            try {
                // @ts-ignore
                const { GoogleGenAI } = await import("@google/genai");

                const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;

                if (!apiKey) {
                    onNotify("Configura la API Key en Ajustes", "info");
                    setIsAnalyzing(false);
                    return;
                }

                const genAI = new (GoogleGenAI as any)(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const prompt = `Analiza esta imagen de un plan de evaluación escolar. 
                Extrae una lista de evaluaciones en formato JSON puro.
                REGLAS CRÍTICAS:
                - "name": Nombre corto de la evaluación.
                - "date": Fecha en formato DD/MM (ej: 15/05). Usa "No definida" si no hay.
                - "weight": SOLO EL NÚMERO del porcentaje. Sin el símbolo %, sin texto. Si dice "(10.00% nots 20.00%)", extrae el valor real (ej: 20).
                - "isGraded": false.
                - "score": "".
                - "id": número incremental empezando en 1.
                
                Retorna UNICAMENTE un array JSON como este: [{"id":1,"name":"Examen","date":"12/10","weight":"20","isGraded":false,"score":""}]`;

                const result = await model.generateContent([
                    prompt,
                    { inlineData: { data: base64Content, mimeType: file.type } }
                ]);

                const responseText = await result.response.text();

                // Cleanup JSON response
                let cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                const startIdx = cleanJson.indexOf('[');
                const endIdx = cleanJson.lastIndexOf(']');
                if (startIdx !== -1 && endIdx !== -1) {
                    cleanJson = cleanJson.substring(startIdx, endIdx + 1);
                }

                const rawEvals = JSON.parse(cleanJson);

                // Post-AI Sanitization
                const sanitizedEvals = (Array.isArray(rawEvals) ? rawEvals : []).map((ev: any) => {
                    // Extract only numbers from weight
                    let cleanWeight = String(ev.weight).replace(/[^0-9.]/g, '');
                    if (!cleanWeight || isNaN(parseFloat(cleanWeight))) cleanWeight = settings.defaultEvalWeight;

                    return {
                        ...ev,
                        id: Date.now() + Math.random(),
                        name: String(ev.name).substring(0, 40),
                        date: String(ev.date).includes('/') ? ev.date : "No definida",
                        weight: cleanWeight,
                        isGraded: false,
                        score: "",
                        comment: ""
                    };
                });

                if (sanitizedEvals.length > 0) {
                    const updatedEvals = [...evals, ...sanitizedEvals];
                    setEvals(updatedEvals);
                    onUpdateEvaluations(subject.id, updatedEvals);
                    onNotify(`¡${sanitizedEvals.length} evaluaciones añadidas!`, 'success');
                } else {
                    onNotify("No se detectaron evaluaciones claras", "info");
                }

            } catch (error) {
                console.error("AI Scan Error:", error);
                onNotify("Error al analizar imagen", "info");
            } finally {
                setIsAnalyzing(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const executeDelete = (id: number) => {
        const updated = evals.filter(e => e.id !== id);
        setEvals(updated);
        onUpdateEvaluations(subject.id, updated);
        setDeletingId(null);
        onNotify('Evaluación eliminada', 'info');
    };

    const exportTheme = COLOR_PALETTE[subject.color] || COLOR_PALETTE.green;

    return (
        <div ref={detailContentRef} className={`flex flex-col w-full h-full pb-32 animate-[fadeIn_0.2s_ease-out] ${darkMode ? 'bg-slate-900' : 'bg-[#F3EBFF]'} min-h-screen relative touch-action-pan-y`}>

            {/* --- HIDDEN SINGLE SUBJECT EXPORT TEMPLATE --- */}
            <div style={{ position: 'absolute', top: -9999, left: -9999 }}>
                <div ref={singleExportRef} style={{
                    width: '600px',
                    padding: '40px',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: '#0F172A',
                    color: '#F8FAFC',
                    boxSizing: 'border-box',
                    borderRadius: '24px'
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ color: '#A78BFA', fontSize: '20px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', lineHeight: 1 }}>Resumen de Calificaciones</h2>
                        <p style={{ color: '#64748B', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px' }}>Periodo: {settings.currentPeriod}</p>

                        <div style={{ marginBottom: '10px' }}>
                            <p style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Promedio Materia</p>
                            <h1 style={{ color: '#A78BFA', fontSize: '64px', fontWeight: '900', lineHeight: 1, margin: 0 }}>{fmt(subject.score)}</h1>
                        </div>
                    </div>

                    {/* Subject Card */}
                    <div style={{
                        border: `2px solid ${exportTheme.hex}`,
                        borderRadius: '20px',
                        padding: '24px',
                        backgroundColor: 'transparent',
                        boxShadow: `0 0 25px -10px ${exportTheme.hex}60`,
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Glow Effect */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', backgroundColor: exportTheme.hex, boxShadow: `0 0 15px 2px ${exportTheme.hex}` }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{ color: exportTheme.hex, fontSize: '26px', fontWeight: '800', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{subject.name}</h3>
                                <p style={{ color: '#94A3B8', fontSize: '14px', fontWeight: '600' }}>Profesor: {subject.prof}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ color: '#64748B', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>Acumulado</p>
                                <p style={{ color: '#F8FAFC', fontSize: '28px', fontWeight: '900', lineHeight: 1, margin: 0 }}>{fmt(subject.score)}</p>
                            </div>
                        </div>

                        {/* Table */}
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', color: '#F8FAFC', padding: '12px 0', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', borderBottom: '1px solid #334155', letterSpacing: '0.5px' }}>Evaluación</th>
                                    <th style={{ textAlign: 'center', color: '#F8FAFC', padding: '12px 0', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', borderBottom: '1px solid #334155', letterSpacing: '0.5px' }}>Peso</th>
                                    <th style={{ textAlign: 'right', color: '#F8FAFC', padding: '12px 0', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', borderBottom: '1px solid #334155', letterSpacing: '0.5px' }}>Calificación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {evals.map((ev: any, idx: number) => (
                                    <tr key={idx}>
                                        <td style={{ padding: '14px 0', color: '#CBD5E1', fontSize: '13px', fontWeight: '600', borderBottom: '1px solid #1E293B' }}>{ev.name}</td>
                                        <td style={{ padding: '14px 0', textAlign: 'center', color: '#64748B', fontSize: '13px', fontWeight: '600', borderBottom: '1px solid #1E293B' }}>{ev.weight ? ev.weight + '%' : '-'}</td>
                                        <td style={{ padding: '14px 0', textAlign: 'right', color: '#F8FAFC', fontSize: '14px', fontWeight: '800', borderBottom: '1px solid #1E293B' }}>
                                            {ev.isGraded ? ev.score : <span style={{ color: '#334155' }}>-</span>}
                                        </td>
                                    </tr>
                                ))}
                                {evals.length === 0 && (
                                    <tr>
                                        <td colSpan={3} style={{ textAlign: 'center', padding: '20px', color: '#475569', fontStyle: 'italic', fontSize: '12px' }}>Sin evaluaciones registradas</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer - Verification Info */}
                    <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ textAlign: 'left' }}>
                            <p style={{ color: '#64748B', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Validado por</p>
                            <p style={{ color: '#F8FAFC', fontSize: '12px', fontWeight: '700' }}>{settings.studentName}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ color: '#64748B', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Fecha de Emisión</p>
                            <p style={{ color: '#F8FAFC', fontSize: '12px', fontWeight: '700' }}>{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>{/* --- END HIDDEN TEMPLATE --- */}

            {viewingImage && (
                <div
                    className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]"
                    onClick={() => setViewingImage(null)}
                >
                    {/* Close Area / Header */}
                    <div className="absolute top-0 left-0 w-full p-6 flex justify-end">
                        <button
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-xl p-3 rounded-2xl text-white transition-all transform hover:scale-110 active:scale-95 shadow-2xl border border-white/20"
                            onClick={() => setViewingImage(null)}
                        >
                            <IconX width="28" height="28" />
                        </button>
                    </div>

                    {/* Image Container */}
                    <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center animate-[zoomIn_0.3s_ease-out]">
                        <img
                            src={viewingImage}
                            alt="Evidencia"
                            className="max-w-full max-h-[85vh] object-contain rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-white/10 ring-1 ring-white/5"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Subtitle / Decoration */}
                        <div className="mt-6 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white/80 font-bold text-sm tracking-wide shadow-xl">
                            Vista previa de evaluación
                        </div>
                    </div>
                </div>
            )}

            {/* --- LOADING OVERLAY --- */}
            {/* Usamos absolute en lugar de fixed porque el carrusel tiene transforms que rompen fixed */}
            {isAnalyzing && (
                <div className="absolute inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                    <div className="relative mb-6">
                        <div className="w-24 h-24 border-[10px] border-purple-500/20 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-24 h-24 border-[10px] border-t-purple-500 rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-white text-2xl font-[900] animate-pulse tracking-tight mb-2">Escaneando con IA...</h3>
                    <p className="text-gray-300 text-base font-medium max-w-[280px] leading-relaxed">
                        La inteligencia artificial está leyendo tu imagen para extraer las evaluaciones.
                    </p>
                </div>
            )}

            <div className="mt-8 px-4 flex items-center mb-4">
                <button
                    onClick={onBack}
                    data-html2canvas-ignore="true"
                    className={`w-12 h-12 rounded-2xl shadow-xl border-2 flex items-center justify-center mr-4 active:scale-90 transition-transform ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}
                >
                    <IconArrowLeft color={darkMode ? 'white' : 'black'} />
                </button>
                <div className={`flex-1 h-14 rounded-2xl flex items-center justify-center shadow-xl border-b-4 ${theme.bg} ${theme.border}`}>
                    <h1 className="text-xl font-[900] text-black">{subject.name}</h1>
                </div>
                <button
                    onClick={handleDownloadDetail}
                    data-html2canvas-ignore="true"
                    className={`ml-3 w-12 h-12 rounded-2xl shadow-xl border-2 flex items-center justify-center active:scale-90 transition-transform ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-100 text-gray-700'}`}
                >
                    <IconDownload width="24" />
                </button>
            </div>

            <div className="px-4 mb-6">
                <div className={`w-full rounded-[2rem] p-5 shadow-xl border-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className={`font-[800] text-xs uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Profesor</span>
                        <span className={`font-[900] ${darkMode ? 'text-white' : 'text-black'}`}>{subject.prof}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className={`font-[800] text-xs uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Puntos Acumulados</span>
                        <div className={`px-3 py-1 rounded-lg ${theme.bg} font-[900] text-black shadow-xl`}>
                            {fmt(subject.score)} / {subject.maxScore}
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 flex-1 pb-32">
                <div className="flex justify-between items-end mb-3 px-2">
                    <h2 className={`text-xl font-[800] italic ${darkMode ? 'text-white' : 'text-[#002B5B]'}`}>Plan de evaluación</h2>
                </div>

                {!isAdding && (
                    <div className="flex space-x-2 mb-4">
                        <button
                            onClick={handleAddNew}
                            data-html2canvas-ignore="true"
                            className="flex-1 bg-[#C484F6] hover:bg-[#A855F7] text-white font-[900] text-lg py-3 rounded-2xl shadow-[0_4px_0_#9333EA] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center relative overflow-hidden"
                        >
                            + Añadir
                        </button>
                        <button
                            onClick={() => scanInputRef.current?.click()}
                            data-html2canvas-ignore="true"
                            className="w-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-[0_4px_0_#4C1D95] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center"
                            title="Escanear plan con IA"
                        >
                            <IconMagic width="24" height="24" />
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={scanInputRef}
                            className="hidden"
                            onChange={handleScanPlan}
                        />
                    </div>
                )}

                {isAdding && (
                    <div className={`rounded-2xl p-4 shadow-xl mb-4 border-2 animate-[fadeIn_0.2s] ${darkMode ? 'bg-slate-800 border-purple-500/30' : 'bg-white border-purple-100'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-[900] text-purple-500 text-sm uppercase">{newEval.id ? 'Editar Evaluación' : 'Nueva Evaluación'}</h3>
                            <button onClick={() => setIsAdding(false)}><IconX width="20" color={darkMode ? '#999' : '#999'} /></button>
                        </div>

                        <div className="mb-3">
                            <label className="block text-[10px] font-[800] text-gray-400 uppercase mb-1 ml-1">Nombre</label>
                            <input
                                placeholder="Ej. Examen Teórico"
                                className={`w-full rounded-xl px-3 py-3 font-bold text-sm border outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                value={newEval.name}
                                onChange={e => setNewEval({ ...newEval, name: e.target.value })}
                            />
                        </div>

                        <div className="flex space-x-3 mb-3">
                            <div className="w-1/2">
                                <label className="block text-[10px] font-[800] text-gray-400 uppercase mb-1 ml-1">Fecha</label>
                                <input
                                    type="date"
                                    className={`w-full rounded-xl px-3 py-3 font-bold text-sm border outline-none focus:border-purple-400 cursor-pointer ${darkMode ? 'bg-slate-900 border-slate-700 text-white scheme-dark' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                    value={newEval.date}
                                    onChange={e => setNewEval({ ...newEval, date: e.target.value })}
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-[10px] font-[800] text-gray-400 uppercase mb-1 ml-1">Valor (%)</label>
                                <input
                                    placeholder="20"
                                    type="number"
                                    className={`w-full rounded-xl px-3 py-3 font-bold text-sm border outline-none focus:border-purple-400 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                    value={newEval.weight}
                                    onChange={e => setNewEval({ ...newEval, weight: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className={`rounded-xl p-3 mb-3 border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                            <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => setNewEval({ ...newEval, isGraded: !newEval.isGraded })}>
                                <span className={`font-[800] text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>¿Ya calificada?</span>
                                <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${newEval.isGraded ? 'bg-purple-500' : 'bg-gray-300'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-xl transform transition-transform ${newEval.isGraded ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            {newEval.isGraded && (
                                <div className="animate-[fadeIn_0.2s]">
                                    <input
                                        placeholder="Nota obtenida (Ej. 18)"
                                        type="number"
                                        className={`w-full rounded-lg px-3 py-2 font-bold text-lg text-center border-2 border-purple-200 outline-none focus:border-purple-500 ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}`}
                                        value={newEval.score}
                                        onChange={e => setNewEval({ ...newEval, score: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="block text-[10px] font-[800] text-gray-400 uppercase mb-1 ml-1">Comentarios</label>
                            <textarea
                                placeholder="Notas adicionales sobre la evaluación..."
                                className={`w-full rounded-xl px-3 py-2 font-bold text-sm border outline-none focus:border-purple-400 min-h-[60px] ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                value={newEval.comment}
                                onChange={e => setNewEval({ ...newEval, comment: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            {newEval.image ? (
                                <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-gray-200 group cursor-pointer" onClick={() => setViewingImage(newEval.image!)}>
                                    <img src={newEval.image} alt="Adjunto" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setNewEval(prev => ({ ...prev, image: undefined }))}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-xl"
                                    >
                                        <IconX width="16" />
                                    </button>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                        <span className="text-white font-bold text-sm">Cambiar Imagen</span>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`w-full border-2 border-dashed rounded-xl py-3 flex items-center justify-center font-bold text-sm transition-colors ${darkMode ? 'border-slate-600 text-gray-400 hover:bg-slate-700' : 'border-gray-300 text-gray-400 hover:bg-gray-50 hover:border-gray-400'}`}
                                >
                                    <div className="mr-2"><IconCamera width="20" /></div>
                                    Adjuntar foto de evaluación
                                </button>
                            )}
                        </div>

                        <button
                            onClick={handleSaveEvaluation}
                            className="w-full bg-[#C484F6] text-white font-[900] py-3 rounded-xl shadow-xl active:scale-95 transition-transform"
                        >
                            {newEval.id ? 'Actualizar Evaluación' : 'Guardar Evaluación'}
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-12 gap-1 px-4 mb-2 text-gray-500 text-[10px] font-[900] uppercase tracking-wide">
                    <div className="col-span-5">Evaluación</div>
                    <div className="col-span-2 text-center">Nota</div>
                    <div className="col-span-2 text-center">Peso</div>
                    <div className="col-span-3 text-right pr-2">Acciones</div>
                </div>

                <div className="space-y-2 pb-24">
                    {evals.map((ev, idx) => (
                        <div key={ev.id}
                            style={{ animationDelay: `${idx * 0.05}s` }}
                            className={`rounded-xl p-3 shadow-xl border relative animate-fade-in-up ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}
                        >
                            <div className="grid grid-cols-12 gap-1 items-center">
                                <div className={`col-span-5 font-[800] text-sm leading-tight pr-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                    <div className="flex flex-col">
                                        <div className="flex items-center">
                                            <span className="truncate block font-[800] text-sm" title={ev.name}>{ev.name}</span>
                                        </div>
                                        <div className="flex items-center mt-0.5 space-x-2">
                                            <span className="text-[10px] text-gray-400 font-[800] uppercase tracking-tighter">{ev.date}</span>
                                            {ev.comment && <span className="text-[10px] text-purple-400/60 font-bold truncate">• {ev.comment}</span>}
                                        </div>
                                        {ev.image && (
                                            <div
                                                className="mt-2 w-16 h-10 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all shadow-sm"
                                                onClick={() => setViewingImage(ev.image!)}
                                            >
                                                <img src={ev.image} alt="Miniatura" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-span-2 flex justify-center">
                                    {ev.isGraded ? (
                                        <span className={`font-[900] px-2 py-1 rounded-lg text-xs ${darkMode ? 'bg-slate-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>{ev.score}</span>
                                    ) : (
                                        <span className={`w-3 h-3 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-300'}`}></span>
                                    )}
                                </div>
                                <div className={`col-span-2 text-center font-[700] text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {ev.weight ? `${ev.weight}%` : '-'}
                                </div>
                                <div className="col-span-3 flex justify-end items-center space-x-1 pr-1">
                                    <button onClick={() => handleEditClick(ev)} data-html2canvas-ignore="true" className="text-purple-400 p-2 rounded-lg active:scale-90 transition-transform">
                                        <IconPencil width="18" height="18" />
                                    </button>
                                    <button onClick={() => setDeletingId(ev.id)} data-html2canvas-ignore="true" className="bg-red-50 dark:bg-red-900/20 text-red-400 p-2 rounded-lg active:scale-90 transition-transform">
                                        <IconTrash width="18" height="18" strokeWidth="2.5" />
                                    </button>
                                </div>
                            </div>
                            <div className={`absolute inset-0 z-10 rounded-xl flex items-center justify-end px-4 space-x-3 transition-all duration-300 ${deletingId === ev.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'} ${darkMode ? 'bg-slate-800/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'}`}>
                                <span className={`font-[800] text-xs uppercase tracking-wide mr-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>¿Eliminar?</span>

                                <button
                                    onClick={(e) => { e.stopPropagation(); setDeletingId(null); }}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                >
                                    <IconX width="16" strokeWidth="3" />
                                </button>

                                <button
                                    onClick={(e) => { e.stopPropagation(); executeDelete(ev.id); }}
                                    className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 active:scale-90 transition-all"
                                >
                                    <IconCheck width="16" strokeWidth="3" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {evals.length === 0 && (
                        <div className="text-center py-8 opacity-40 font-bold italic text-sm">
                            No hay evaluaciones registradas
                        </div>
                    )}

                    {/* Pingu con Reloj Decoration */}
                    <div className="flex flex-col items-center justify-center py-10 opacity-90 mt-4">
                        <img src="/pingu con reloj.png" alt="Tiempo" className="w-56 h-56 object-contain" />
                    </div>
                </div>
            </div>
        </div>
    );
});


// --- MAIN VIEW ---

interface MateriasViewProps {
    subjects: Subject[];
    onUpdateSubjects: (subjects: Subject[]) => void;
    darkMode: boolean;
    activeSubjectId: number | null;
    clearActiveSubject: () => void;
    settings: AppSettings;
    onNotify: (msg: string, type?: 'success' | 'info') => void;
    onAddDefaultSubjects: () => void;
}

const MateriasView = React.memo(({ subjects, onUpdateSubjects, darkMode, activeSubjectId, clearActiveSubject, settings, onNotify, onAddDefaultSubjects }: MateriasViewProps) => {
    // UI State
    const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
    const [targetEvaluationId, setTargetEvaluationId] = useState<number | string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Omit<Subject, 'id' | 'score' | 'evaluations'>>({
        name: '',
        prof: '',
        minScore: settings.defaultMinScore,
        maxScore: settings.defaultMaxScore,
        color: 'green'
    });

    // Refs
    const listContentRef = useRef<HTMLDivElement>(null);
    const exportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeSubjectId !== null) {
            setSelectedSubjectId(activeSubjectId);
            // Scroll to top when entering a subject
            setTimeout(() => {
                if (listContentRef.current) {
                    const parent = listContentRef.current.parentElement;
                    if (parent) parent.scrollTop = 0;
                }
            }, 50);
        }
    }, [activeSubjectId]);

    useEffect(() => {
        if (selectedSubjectId !== null) {
            if (listContentRef.current) {
                const parent = listContentRef.current.parentElement;
                if (parent) parent.scrollTop = 0;
            }
        }
    }, [selectedSubjectId]);

    const handleBack = React.useCallback(() => {
        setSelectedSubjectId(null);
        setTargetEvaluationId(null);
        clearActiveSubject();
        if (listContentRef.current) {
            const parent = listContentRef.current.parentElement;
            if (parent) parent.scrollTop = 0;
        }
    }, [clearActiveSubject]);

    const handleUpdateEvaluations = React.useCallback((id: number, evals: Evaluation[]) => {
        const newScore = evals.reduce((sum, ev) => {
            if (ev.isGraded) {
                const sStr = ev.score ? ev.score.toString() : '0';
                const wStr = ev.weight ? ev.weight.toString() : '20';
                const scoreVal = parseFloat(sStr.replace(',', '.'));
                const weightVal = parseFloat(wStr.replace(',', '.'));
                if (!isNaN(scoreVal) && !isNaN(weightVal)) {
                    return sum + (scoreVal * (weightVal / 100));
                }
            }
            return sum;
        }, 0);

        const roundedScore = Math.round(newScore * 100) / 100;
        const updated = subjects.map(s => s.id === id ? { ...s, evaluations: evals, score: roundedScore } : s);
        onUpdateSubjects(updated);
    }, [subjects, onUpdateSubjects]);

    const handleDownloadExport = React.useCallback(async () => {
        if (!exportRef.current) return;
        onNotify("Generando resumen...", "info");

        try {
            const canvas = await html2canvas(exportRef.current, {
                backgroundColor: '#0F172A',
                scale: 2,
                useCORS: true,
                logging: false,
                imageTimeout: 0
            });

            const base64data = canvas.toDataURL('image/png');

            if ((window as any).Capacitor?.isNativePlatform()) {
                const { Filesystem, Directory } = await import('@capacitor/filesystem');
                const fileName = `resumen-escolar-${Date.now()}.png`;
                await Filesystem.writeFile({
                    path: `AppEscolar/${fileName}`,
                    data: base64data,
                    directory: Directory.Documents,
                    recursive: true
                });
                onNotify("Imagen guardada en Documentos/AppEscolar", "success");
            } else {
                const link = document.createElement('a');
                link.download = `resumen-calificaciones.png`;
                link.href = base64data;
                link.click();
            }
            onNotify("Resumen exportado", "success");
        } catch (err) {
            console.error("Export failed", err);
            onNotify("Error al exportar", "info");
        }
    }, [onNotify]);

    const filteredSubjects = React.useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        return subjects.filter((sub: Subject) => {
            let passesFilter = true;
            if (filter === 'risk') passesFilter = sub.score < sub.minScore;
            if (filter === 'passed') passesFilter = sub.score >= sub.minScore;
            if (!passesFilter) return false;
            if (!query) return true;
            return sub.name.toLowerCase().includes(query) || sub.prof.toLowerCase().includes(query);
        });
    }, [subjects, searchQuery, filter]);

    const filteredEvaluations = React.useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return [];
        return subjects.flatMap(sub =>
            (sub.evaluations || [])
                .filter(ev => ev.name.toLowerCase().includes(q))
                .map(ev => ({ ...ev, subjectName: sub.name, subjectId: sub.id, subjectColor: sub.color }))
        );
    }, [subjects, searchQuery]);

    const query = searchQuery.toLowerCase().trim();

    const handleOpenEdit = React.useCallback((e: any, subject: Subject) => {
        e.stopPropagation();
        setEditingId(subject.id);
        setFormData({
            name: subject.name,
            prof: subject.prof,
            minScore: subject.minScore,
            maxScore: subject.maxScore,
            color: subject.color
        });
        setIsModalOpen(true);
    }, []);

    const handleOpenAdd = React.useCallback(() => {
        setEditingId(null);
        setFormData({
            name: '',
            prof: '',
            minScore: settings.defaultMinScore,
            maxScore: settings.defaultMaxScore,
            color: 'green'
        });
        setIsModalOpen(true);
    }, [settings.defaultMinScore, settings.defaultMaxScore]);

    const handleSave = React.useCallback(() => {
        if (!formData.name) {
            onNotify('El nombre es obligatorio', 'info');
            return;
        }
        if (editingId) {
            const updated = subjects.map(s => s.id === editingId ? { ...s, ...formData } : s);
            onUpdateSubjects(updated);
            onNotify('Materia actualizada');
        } else {
            const newId = Date.now();
            const newSubject: Subject = { id: newId, score: 0, evaluations: [], ...formData };
            onUpdateSubjects([...subjects, newSubject]);
            onNotify('Materia creada');
        }
        setIsModalOpen(false);
    }, [formData, editingId, subjects, onUpdateSubjects, onNotify]);

    const handleDelete = React.useCallback(() => {
        if (editingId) {
            const subjectToDelete = subjects.find((s: Subject) => s.id === editingId);
            const confirmed = window.confirm(
                `¿Estás seguro de que quieres eliminar la materia "${subjectToDelete?.name}"?\n\n` +
                `⚠️ Se perderán todas las evaluaciones asociadas.`
            );
            if (!confirmed) return;
            const updated = subjects.filter((s: Subject) => s.id !== editingId);
            onUpdateSubjects(updated);
            setIsModalOpen(false);
            onNotify('Materia eliminada');
        }
    }, [editingId, subjects, onUpdateSubjects, onNotify]);

    const filterLabels: Record<FilterType, string> = {
        'all': 'todas las materias',
        'risk': 'materias en riesgo',
        'passed': 'materias aprobadas'
    };

    // Calculate General Average for Export
    const totalScore = subjects.reduce((sum: number, s: Subject) => sum + s.score, 0);
    const averageScore = subjects.length > 0 ? (totalScore / subjects.length) : 0;

    // --- RENDER DETAIL VIEW IF SELECTED ---
    if (selectedSubjectId !== null) {
        const subject = subjects.find((s: Subject) => s.id === selectedSubjectId);
        if (subject) {
            return (
                <SubjectDetailView
                    subject={subject}
                    onBack={handleBack}
                    onUpdateEvaluations={handleUpdateEvaluations}
                    darkMode={darkMode}
                    settings={settings}
                    onNotify={onNotify}
                    initialOpenEvalId={targetEvaluationId}
                />
            );
        }
    }

    // --- RENDER LIST VIEW ---
    return (
        <div ref={listContentRef} className={`flex flex-col w-full min-h-screen pb-32 relative ${darkMode ? 'bg-slate-900' : 'bg-transparent'}`}>

            {/* --- HIDDEN EXPORT TEMPLATE --- */}
            <div style={{ position: 'absolute', top: -9999, left: -9999 }}>
                <div ref={exportRef} style={{
                    width: '600px',
                    padding: '40px',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: '#0F172A',
                    color: '#F8FAFC',
                    boxSizing: 'border-box',
                    borderRadius: '24px'
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ color: '#A78BFA', fontSize: '20px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', lineHeight: 1 }}>Resumen de Calificaciones</h2>
                        <p style={{ color: '#64748B', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px' }}>Periodo: {settings.currentPeriod}</p>

                        <div style={{ marginBottom: '10px' }}>
                            <p style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Promedio General</p>
                            <h1 style={{ color: '#A78BFA', fontSize: '64px', fontWeight: '900', lineHeight: 1, margin: 0 }}>{fmt(averageScore)}</h1>
                        </div>
                    </div>

                    {/* Subjects */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {subjects.map((sub: Subject) => {
                            const theme = COLOR_PALETTE[sub.color] || COLOR_PALETTE.green;
                            return (
                                <div key={sub.id} style={{
                                    border: `2px solid ${theme.hex}`,
                                    borderRadius: '20px',
                                    padding: '24px',
                                    backgroundColor: 'transparent',
                                    boxShadow: `0 0 25px -10px ${theme.hex}60`,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {/* Grip/Line */}
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', backgroundColor: theme.hex, boxShadow: `0 0 15px 2px ${theme.hex}` }}></div>

                                    {/* Subject Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                        <div>
                                            <h3 style={{ color: theme.hex, fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{sub.name}</h3>
                                            <p style={{ color: '#94A3B8', fontSize: '13px', fontWeight: '600' }}>Profesor: {sub.prof}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ color: '#64748B', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>Acumulado</p>
                                            <p style={{ color: '#F8FAFC', fontSize: '24px', fontWeight: '900', lineHeight: 1, margin: 0 }}>{fmt(sub.score)}</p>
                                        </div>
                                    </div>

                                    {/* Evaluations Table */}
                                    <div style={{}}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: 'left', color: '#F8FAFC', padding: '10px 0', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', borderBottom: '1px solid #334155', letterSpacing: '0.5px', width: '50%' }}>Evaluación</th>
                                                    <th style={{ textAlign: 'center', color: '#F8FAFC', padding: '10px 0', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', borderBottom: '1px solid #334155', letterSpacing: '0.5px' }}>Peso</th>
                                                    <th style={{ textAlign: 'right', color: '#F8FAFC', padding: '10px 0', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', borderBottom: '1px solid #334155', letterSpacing: '0.5px' }}>Calificación</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sub.evaluations.map((ev: any, idx: number) => (
                                                    <tr key={idx}>
                                                        <td style={{ padding: '12px 0 12px 0', color: '#CBD5E1', fontSize: '13px', fontWeight: '600', borderBottom: '1px solid #1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>{ev.name}</td>
                                                        <td style={{ padding: '12px 0', textAlign: 'center', color: '#64748B', fontSize: '13px', fontWeight: '600', borderBottom: '1px solid #1E293B' }}>{ev.weight ? ev.weight + '%' : '-'}</td>
                                                        <td style={{ padding: '12px 0 12px 0', textAlign: 'right', color: '#F8FAFC', fontSize: '13px', fontWeight: '800', borderBottom: '1px solid #1E293B' }}>{ev.isGraded ? ev.score : <span style={{ color: '#334155' }}>-</span>}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    {/* Footer - Verification Info */}
                    <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ textAlign: 'left' }}>
                            <p style={{ color: '#64748B', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Validado por</p>
                            <p style={{ color: '#F8FAFC', fontSize: '12px', fontWeight: '700' }}>{settings.studentName}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ color: '#64748B', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Fecha de Emisión</p>
                            <p style={{ color: '#F8FAFC', fontSize: '12px', fontWeight: '700' }}>{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>{/* --- END HIDDEN EXPORT TEMPLATE --- */}

            <div className="mt-8 flex justify-between items-center px-2">
                <div className="flex-1 mr-2">
                    <Header title="materias" />
                </div>
            </div>

            {/* --- SEARCH BAR --- */}
            <div className="px-6 mt-2 relative z-20">
                <div className={`relative flex items-center rounded-2xl shadow-inner transition-all border-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <div className="pl-4">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#94a3b8' : '#6b7280'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar materia o evaluación..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full bg-transparent border-none outline-none focus:ring-0 px-3 py-3 text-sm font-[800] capitalize ${darkMode ? 'text-white' : 'text-gray-800'}`}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="pr-4 opacity-50 hover:opacity-100">
                            <IconX width="16" height="16" />
                        </button>
                    )}
                </div>
            </div>

            <div className="px-6 py-2">
                <p className={`font-bold text-lg opacity-80 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    periodo: {settings.currentPeriod}
                </p>
            </div>


            <div className="px-6 py-2 flex items-center justify-between mb-2 relative z-10">
                <div className="relative">
                    <div
                        data-html2canvas-ignore="true"
                        className={`px-4 py-2 rounded-xl flex items-center shadow-inner cursor-pointer select-none active:scale-95 transition-transform ${darkMode ? 'bg-slate-800' : 'bg-[#E5E7EB]'}`}
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <span className={`font-[800] text-sm mr-2 capitalize ${darkMode ? 'text-white' : 'text-black'}`}>{filterLabels[filter]}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={darkMode ? 'white' : 'black'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}>
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                    {isFilterOpen && (
                        <div className={`absolute top-full left-0 mt-2 w-56 rounded-2xl shadow-xl border-2 overflow-hidden flex flex-col p-1 animate-[fadeIn_0.1s] ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                            {(['all', 'risk', 'passed'] as FilterType[]).map((f) => (
                                <div
                                    key={f}
                                    onClick={() => { setFilter(f); setIsFilterOpen(false); }}
                                    className={`px-4 py-3 rounded-xl font-[800] text-sm cursor-pointer capitalize ${filter === f
                                        ? (darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-[#F3EBFF] text-[#9333EA]')
                                        : (darkMode ? 'text-gray-400 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-50')
                                        }`}
                                >
                                    {filterLabels[f]}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex space-x-3">
                    <div
                        onClick={handleDownloadExport}
                        data-html2canvas-ignore="true"
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xl cursor-pointer active:scale-90 transition-transform ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-[#E5E7EB] hover:bg-[#d1d5db]'}`}
                    >
                        <IconDownload width="20" height="20" strokeWidth="2.5" color={darkMode ? 'white' : 'black'} />
                    </div>

                    <div
                        data-html2canvas-ignore="true"
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xl cursor-pointer active:scale-90 transition-transform ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-[#E5E7EB] hover:bg-[#d1d5db]'}`}
                        onClick={handleOpenAdd}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={darkMode ? 'white' : 'black'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="px-4 space-y-4">
                {/* Section for Evaluations if searching */}
                {query && filteredEvaluations.length > 0 && (
                    <div className="space-y-3 mb-6">
                        <div className={`flex items-center space-x-2 px-2 mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                            <IconCheck width="16" />
                            <span className="text-xs font-[900] uppercase tracking-widest">Evaluaciones encontradas</span>
                        </div>
                        {filteredEvaluations.map((ev, idx) => (
                            <div
                                key={`ev-${ev.subjectId}-${idx}`}
                                onClick={() => {
                                    setSelectedSubjectId(ev.subjectId);
                                    setTargetEvaluationId(ev.id);
                                }}
                                className={`p-4 rounded-[1.5rem] flex items-center justify-between border-2 transition-all active:scale-95 shadow-md animate-slide-up ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-indigo-100 text-indigo-900'}`}
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                <div className="flex flex-col">
                                    <span className="font-[900] text-base leading-tight">{ev.name}</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider opacity-60 mt-0.5`}>
                                        En {ev.subjectName} • {ev.date}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-[900] ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                                        {ev.weight}%
                                    </div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="h-px bg-gray-300/20 mx-2 my-6"></div>
                    </div>
                )}

                {/* Subject Results */}
                {query && filteredSubjects.length > 0 && (
                    <div className={`flex items-center space-x-2 px-2 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span className="text-xs font-[900] uppercase tracking-widest">Materias encontradas</span>
                    </div>
                )}

                {filteredSubjects.map((sub, idx) => (
                    <div key={sub.id} className="animate-slide-up" style={{ animationDelay: `${idx * 0.06}s` }}>
                        <SubjectCard
                            subject={sub}
                            onEdit={handleOpenEdit}
                            onClick={(s: Subject) => setSelectedSubjectId(s.id)}
                        />
                    </div>
                ))}

                {filteredSubjects.length === 0 && filteredEvaluations.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 opacity-70 space-y-4">
                        <div className="font-bold italic text-gray-400 text-center px-6">No se encontraron materias ni evaluaciones que coincidan con "{searchQuery}".</div>
                        {subjects.length === 0 && (
                            <button
                                onClick={onAddDefaultSubjects}
                                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-2 rounded-xl shadow-lg active:scale-95 transition-transform"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="23 4 23 10 17 10"></polyline>
                                    <polyline points="1 20 1 14 7 14"></polyline>
                                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                </svg>
                                <span className="font-bold text-sm">Restaurar materias por defecto</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} darkMode={darkMode}>
                <div className={`flex justify-between items-center px-6 py-4 z-10 sticky top-0 border-b ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <h2 className={`text-2xl font-[900] tracking-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {editingId ? 'Editar materia' : 'Nueva materia'}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className={`p-2 rounded-full ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                        <IconX color={darkMode ? '#ccc' : '#666'} />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-xs font-[800] text-gray-500 uppercase mb-1 ml-2">Nombre de materia</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? 'bg-slate-900 text-white' : 'bg-[#F3F4F6] text-gray-800'}`}
                            placeholder="Ej. Matemática"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-[800] text-gray-500 uppercase mb-1 ml-2">Profesor</label>
                        <input
                            type="text"
                            value={formData.prof}
                            onChange={(e) => setFormData({ ...formData, prof: e.target.value })}
                            className={`w-full rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? 'bg-slate-900 text-white' : 'bg-[#F3F4F6] text-gray-800'}`}
                            placeholder="Ej. Hector"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-[800] text-gray-500 uppercase mb-1 ml-2">Mínima</label>
                            <input
                                type="number"
                                value={formData.minScore}
                                onChange={(e) => setFormData({ ...formData, minScore: Number(e.target.value) })}
                                className={`w-full rounded-xl px-4 py-3 font-bold text-center focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? 'bg-slate-900 text-white' : 'bg-[#F3F4F6] text-gray-800'}`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-[800] text-gray-500 uppercase mb-1 ml-2">Máxima</label>
                            <input
                                type="number"
                                value={formData.maxScore}
                                onChange={(e) => setFormData({ ...formData, maxScore: Number(e.target.value) })}
                                className={`w-full rounded-xl px-4 py-3 font-bold text-center focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? 'bg-slate-900 text-white' : 'bg-[#F3F4F6] text-gray-800'}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-[800] text-gray-500 uppercase mb-2 ml-2">Color asignado</label>
                        <div className={`grid grid-cols-5 gap-3 p-4 rounded-2xl ${darkMode ? 'bg-slate-900' : 'bg-[#F3F4F6]'}`}>
                            {(Object.keys(COLOR_PALETTE) as ColorKey[]).map((c) => (
                                <div
                                    key={c}
                                    onClick={() => setFormData({ ...formData, color: c })}
                                    className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center transition-transform ${formData.color === c ? 'scale-110 shadow-xl ring-2 ring-gray-400' : 'opacity-80 hover:opacity-100'}`}
                                    style={{
                                        backgroundColor: COLOR_PALETTE[c].checkBg,
                                    }}
                                >
                                    {formData.color === c && <IconCheck color="white" width="18" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={`p-6 pt-2 pb-12 flex space-x-3 z-10 border-t ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-50'}`}>
                    {editingId && (
                        <button
                            onClick={handleDelete}
                            className="bg-[#FEE2E2] text-[#DC2626] p-4 rounded-xl flex-shrink-0 hover:bg-[#FECACA] active:scale-95 transition-transform"
                        >
                            <IconTrash width="24" strokeWidth="2.5" />
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-[#C484F6] text-white font-[900] text-lg rounded-xl py-3 shadow-[0_4px_0_#985CC4] active:shadow-none active:translate-y-[4px] transition-all"
                    >
                        {editingId ? 'Guardar Cambios' : 'Crear Materia'}
                    </button>
                </div>
            </Modal>
        </div>
    );
});

export default MateriasView;
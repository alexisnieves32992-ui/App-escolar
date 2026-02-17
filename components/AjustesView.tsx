import * as React from 'react';
import { useState } from 'react';
import Header from './Header';
import { IconPencil, IconUser, IconCalendar, IconChevronDown, IconGearFilled, IconChartSm, IconSun, IconMoon, IconTrash, IconCheck, IconX, IconProfile, IconStonks, IconShare, IconYoutube } from './Icons';
import { AppSettings } from '../types';

interface AjustesViewProps {
    darkMode: boolean;
    themeAuto: boolean;
    setThemeAuto: (auto: boolean) => void;
    toggleDarkMode: () => void;
    settings: AppSettings;
    onUpdateSettings: (s: AppSettings) => void;
    onNotify: (message: string, type?: 'success' | 'info') => void;
}

const AjustesView = React.memo(({ darkMode, themeAuto, setThemeAuto, toggleDarkMode, settings, onUpdateSettings, onNotify }: AjustesViewProps) => {

    const [editingProfile, setEditingProfile] = useState(false);
    const [tempProfile, setTempProfile] = useState({ name: settings.studentName, section: settings.section });

    const [editingDefaults, setEditingDefaults] = useState(false);
    const [tempDefaults, setTempDefaults] = useState({
        weight: settings.defaultEvalWeight,
        max: settings.defaultMaxScore,
        min: settings.defaultMinScore
    });

    const [showPeriodSelector, setShowPeriodSelector] = useState(false);
    const [newPeriodName, setNewPeriodName] = useState('');
    const [isAddingPeriod, setIsAddingPeriod] = useState(false);

    // --- HANDLERS ---

    const handleShare = async () => {
        const shareData = {
            title: 'Ruta Académica',
            text: 'Descarga la app oficial de Ruta Académica para gestionar tus notas.',
            url: 'https://rutaacademicadescargala.netlify.app/'
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                onNotify("Link copiado al portapapeles", "success");
            }
        } catch (err) {
            console.log("Share skipped or failed");
        }
    };

    const saveProfile = () => {
        onUpdateSettings({ ...settings, studentName: tempProfile.name, section: tempProfile.section });
        setEditingProfile(false);
    };

    const saveDefaults = () => {
        onUpdateSettings({
            ...settings,
            defaultEvalWeight: tempDefaults.weight,
            defaultMaxScore: tempDefaults.max,
            defaultMinScore: tempDefaults.min
        });
        setEditingDefaults(false);
    };

    const handleSelectPeriod = (p: string) => {
        onUpdateSettings({ ...settings, currentPeriod: p });
        setShowPeriodSelector(false);
    };

    const handleAddPeriod = () => {
        if (newPeriodName.trim()) {
            const newPeriods = [...settings.periods, newPeriodName.trim()];
            onUpdateSettings({ ...settings, periods: newPeriods, currentPeriod: newPeriodName.trim() });
            setNewPeriodName('');
            setIsAddingPeriod(false);
        }
    };

    const handleDeletePeriod = (e: React.MouseEvent, p: string) => {
        e.stopPropagation();
        if (settings.periods.length <= 1) return alert("Debe haber al menos un periodo.");

        // Confirmation dialog
        const confirmed = window.confirm(
            `¿Estás seguro de que quieres eliminar el periodo "${p}"?\n\n` +
            `⚠️ Se perderán todas las materias y evaluaciones de este periodo.`
        );

        if (!confirmed) return;

        const newPeriods = settings.periods.filter(period => period !== p);
        let newCurrent = settings.currentPeriod;
        if (settings.currentPeriod === p) {
            newCurrent = newPeriods[0];
        }
        onUpdateSettings({ ...settings, periods: newPeriods, currentPeriod: newCurrent });
    };

    return (
        <div className="flex flex-col w-full min-h-screen pb-32">
            <div className="mt-8">
                <Header title="ajustes" />
            </div>

            <div className="px-8 mt-2 mb-6">
                <p className={`font-[800] text-lg text-center leading-tight italic opacity-90 transition-colors ${darkMode ? 'text-gray-300' : 'text-[#002B5B]'}`}>
                    personaliza tus datos personales y valores por defecto
                </p>
            </div>

            <div className="px-4 space-y-4">

                {/* Appearance Card */}
                <div className="w-full bg-[#A855F7] rounded-[2rem] p-5 relative shadow-xl border-b-4 border-[#7E22CE] animate-slide-up">
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-[#F3E8FF] text-2xl font-[800] tracking-tight">Tema Automático</h2>
                            <div
                                onClick={() => setThemeAuto(!themeAuto)}
                                className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors duration-300 ${themeAuto ? 'bg-white/40' : 'bg-black/20'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-xl transform transition-transform duration-300 ${themeAuto ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-white/10">
                            <div>
                                <h2 className="text-[#F3E8FF] text-xl font-[800] tracking-tight">Modo {darkMode ? 'Oscuro' : 'Claro'}</h2>
                                {themeAuto && <p className="text-[#F3E8FF]/60 text-xs font-bold leading-none mt-1">Sigue el sistema</p>}
                            </div>
                            <div
                                onClick={toggleDarkMode}
                                className={`w-16 h-8 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-300 ${darkMode ? 'bg-slate-800 border border-slate-600' : 'bg-white/30 border border-white/50'}`}
                            >
                                <div className={`w-6 h-6 rounded-full shadow-xl flex items-center justify-center transform transition-transform duration-300 ${darkMode ? 'translate-x-8 bg-indigo-500 text-white' : 'translate-x-0 bg-yellow-400 text-yellow-900'}`}>
                                    {darkMode ? <IconMoon width="14" height="14" /> : <IconSun width="14" height="14" />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Green Card - Perfil de estudiante */}
                <div className="w-full bg-[#96E068] rounded-[2rem] p-5 relative shadow-xl border-b-4 border-[#7BC550] animate-slide-up delay-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                            <h2 className="text-[#3A631F] text-2xl font-[800] tracking-tight">perfil de estudiante</h2>
                        </div>
                        <div className="flex items-center space-x-2 text-[#2F5218]">
                            {!editingProfile ? (
                                <button onClick={() => setEditingProfile(true)} className="p-1 hover:bg-white/20 rounded-lg"><IconPencil className="w-6 h-6" /></button>
                            ) : (
                                <div className="flex space-x-1">
                                    <button onClick={() => setEditingProfile(false)} className="p-1 bg-red-400 text-white rounded-lg"><IconX width="18" /></button>
                                    <button onClick={saveProfile} className="p-1 bg-green-600 text-white rounded-lg"><IconCheck width="18" /></button>
                                </div>
                            )}
                            <IconProfile className="w-8 h-8" />

                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="font-[800] text-black text-sm w-28">estudiante</span>
                            {editingProfile ? (
                                <input
                                    className="flex-1 bg-white rounded-full h-8 px-4 font-bold text-sm outline-none focus:ring-2 ring-green-500"
                                    value={tempProfile.name}
                                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                                />
                            ) : (
                                <div className="flex-1 bg-[#F0FDF4] rounded-full h-8 px-4 flex items-center shadow-inner truncate">
                                    <span className="font-[800] text-black text-sm">{settings.studentName}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-[800] text-black text-sm w-28">año y sección</span>
                            {editingProfile ? (
                                <input
                                    className="flex-1 bg-white rounded-full h-8 px-4 font-bold text-sm outline-none focus:ring-2 ring-green-500"
                                    value={tempProfile.section}
                                    onChange={(e) => setTempProfile({ ...tempProfile, section: e.target.value })}
                                />
                            ) : (
                                <div className="flex-1 bg-[#F0FDF4] rounded-full h-8 px-4 flex items-center shadow-inner truncate">
                                    <span className="font-[800] text-black text-sm">{settings.section}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Blue Card - Periodo academico (Accordion style like ResumenView) */}
                <div className="w-full bg-[#64C6F4] rounded-[2rem] p-5 relative shadow-xl border-b-4 border-[#4BA6D2] cursor-pointer transition-all duration-300 animate-slide-up delay-2">
                    <div
                        className="flex items-center justify-between"
                        onClick={() => setShowPeriodSelector(!showPeriodSelector)}
                    >
                        <div className="flex items-center">
                            <span className="text-[#1A5C7A] text-xl font-[800] mr-2">periodo academico</span>
                            <span className="text-[#1A5C7A] text-lg font-[900] bg-white/30 px-3 py-1 rounded-xl">{settings.currentPeriod}</span>
                            <div className="ml-3 opacity-80 text-[#1A5C7A]">
                                <IconCalendar className="w-[26px] h-[26px]" />
                            </div>
                        </div>
                        <div className={`transform transition-transform duration-300 ${showPeriodSelector ? 'rotate-180' : ''}`}>
                            <IconChevronDown stroke="#1A5C7A" />
                        </div>
                    </div>

                    {/* Expanded Content - Accordion (same pattern as ResumenView) */}
                    <div className={`grid transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${showPeriodSelector ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                        <div className="overflow-hidden">
                            <div className="space-y-2">
                                {settings.periods.map((p: string, idx: number) => (
                                    <div
                                        key={p}
                                        onClick={() => handleSelectPeriod(p)}
                                        className={`bg-[#D6EFF9] rounded-xl p-3 flex justify-between items-center shadow-xl cursor-pointer hover:bg-[#C2E5F5] transition-all active:scale-95 ${showPeriodSelector ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                                        style={{ transitionDelay: showPeriodSelector ? `${idx * 0.06}s` : '0s', transitionDuration: '0.3s' }}
                                    >
                                        <span className={`font-[800] text-sm ${settings.currentPeriod === p ? 'text-[#1A5C7A]' : 'text-[#1A5C7A]/70'}`}>{p}</span>
                                        <div className="flex items-center space-x-2">
                                            {settings.currentPeriod === p && <IconCheck width="16" />}
                                            {settings.currentPeriod !== p && settings.periods.length > 1 && (
                                                <button
                                                    onClick={(e) => handleDeletePeriod(e, p)}
                                                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <IconTrash width="14" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add new period */}
                            <div className="mt-3">
                                {isAddingPeriod ? (
                                    <div className="flex items-center space-x-2 animate-fade-in">
                                        <input
                                            autoFocus
                                            className="flex-1 bg-white border border-blue-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                                            placeholder="Nombre del periodo..."
                                            value={newPeriodName}
                                            onChange={(e) => setNewPeriodName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddPeriod()}
                                        />
                                        <button onClick={handleAddPeriod} className="p-2 bg-white text-[#1A5C7A] rounded-xl shadow-lg active:scale-90 transition-transform">
                                            <IconCheck width="18" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsAddingPeriod(true)}
                                        className="w-full py-3 rounded-xl border-2 border-dashed border-white/50 text-white font-[800] text-sm hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <span>+ Crear Nuevo Periodo</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orange Card - Valores predeterminados */}
                <div className="w-full bg-[#FFAD5C] rounded-[2rem] p-5 relative shadow-xl border-b-4 border-[#E69344] animate-slide-up delay-3">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <div className="text-[#92400E] mr-2">
                                <IconGearFilled width="28" height="28" />
                            </div>
                            <h2 className="text-[#8F4F1D] text-xl font-[800] tracking-tight">valores por defecto</h2>
                            <IconStonks className="ml-2 w-8 h-8" />
                        </div>

                        {!editingDefaults ? (
                            <button onClick={() => setEditingDefaults(true)} className="p-1 hover:bg-white/20 rounded-lg text-[#8F4F1D]"><IconPencil className="w-6 h-6" /></button>
                        ) : (
                            <div className="flex space-x-1">
                                <button onClick={() => setEditingDefaults(false)} className="p-1 bg-red-400 text-white rounded-lg"><IconX width="18" /></button>
                                <button onClick={saveDefaults} className="p-1 bg-green-600 text-white rounded-lg"><IconCheck width="18" /></button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="font-[800] text-black text-xs sm:text-sm">porcentaje de evaluaciones</span>
                            {editingDefaults ? (
                                <div className="flex items-center w-24">
                                    <input
                                        type="number"
                                        className="w-full bg-white rounded-full h-8 px-2 text-center font-bold text-lg outline-none focus:ring-2 ring-orange-400"
                                        value={tempDefaults.weight}
                                        onChange={(e) => setTempDefaults({ ...tempDefaults, weight: e.target.value })}
                                    />
                                    <span className="ml-1 font-bold text-[#8F4F1D]">%</span>
                                </div>
                            ) : (
                                <div className="w-24 bg-[#FFF0DB] rounded-full h-8 px-4 flex items-center justify-end shadow-inner">
                                    <span className="font-[800] text-black text-lg">{settings.defaultEvalWeight}%</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-[800] text-black text-xs sm:text-sm">nota máxima</span>
                            {editingDefaults ? (
                                <input
                                    type="number"
                                    className="w-24 bg-white rounded-full h-8 px-4 text-center font-bold text-lg outline-none focus:ring-2 ring-orange-400"
                                    value={tempDefaults.max}
                                    onChange={(e) => setTempDefaults({ ...tempDefaults, max: Number(e.target.value) })}
                                />
                            ) : (
                                <div className="w-24 bg-[#FFF0DB] rounded-full h-8 px-4 flex items-center justify-end shadow-inner">
                                    <span className="font-[800] text-black text-lg">{settings.defaultMaxScore}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-[800] text-black text-xs sm:text-sm">nota mínima (aprobar)</span>
                            {editingDefaults ? (
                                <input
                                    type="number"
                                    className="w-24 bg-white rounded-full h-8 px-4 text-center font-bold text-lg outline-none focus:ring-2 ring-orange-400"
                                    value={tempDefaults.min}
                                    onChange={(e) => setTempDefaults({ ...tempDefaults, min: Number(e.target.value) })}
                                />
                            ) : (
                                <div className="w-24 bg-[#FFF0DB] rounded-full h-8 px-4 flex items-center justify-end shadow-inner">
                                    <span className="font-[800] text-black text-lg">{settings.defaultMinScore}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>



                {/* Compartir App Button */}
                <div className="pt-4 animate-slide-up delay-4">
                    <button
                        onClick={handleShare}
                        className={`w-full flex items-center justify-center space-x-3 py-5 rounded-[2rem] font-[900] text-lg uppercase tracking-wider transition-all active:scale-95 shadow-xl border-b-4 ${darkMode ? 'bg-indigo-600 border-indigo-800 text-white' : 'bg-[#C484F6] border-[#A855F7] text-white hover:bg-[#A855F7]'}`}
                    >
                        <IconShare width="24" height="24" strokeWidth="3" />
                        <span>Compartir App</span>
                    </button>
                    <p className={`text-center text-[10px] font-bold uppercase tracking-widest mt-3 opacity-50 ${darkMode ? 'text-gray-400' : 'text-[#1A5C7A]'}`}>
                        Ayuda a otros a mejorar sus notas
                    </p>
                </div>

                {/* Créditos y Versión */}
                <div className="mt-12 mb-8 flex flex-col items-center justify-center space-y-4 px-6 animate-slide-up delay-4">
                    <div className={`text-center space-y-1 ${darkMode ? 'text-gray-400' : 'text-[#1A5C7A]'}`}>
                        <p className="font-[900] text-sm uppercase tracking-widest opacity-60">Hecha por Alexis N 2026</p>
                        <p className="font-[800] text-lg">Versión 2.6</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                        <a
                            href="https://www.instagram.com/art_alexis360?igsh=bGk3ZGlmYWNtaGJm"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group flex items-center space-x-3 px-6 py-3 rounded-2xl font-[800] text-base transition-all active:scale-95 shadow-lg hover:shadow-xl flex-1 justify-center sm:justify-start ${darkMode ? 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700' : 'bg-white text-[#E1306C] border-2 border-[#E1306C]/10 hover:border-[#E1306C]/30'}`}
                        >
                            <div className={`p-2 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-[#E1306C]/10'} group-hover:scale-110 transition-transform`}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </div>
                            <span className="truncate">Instagram</span>
                        </a>

                        <a
                            href="https://youtube.com/@ultimate-snow?si=NO1VyetD8V04l7Xm"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group flex items-center space-x-3 px-6 py-3 rounded-2xl font-[800] text-base transition-all active:scale-95 shadow-lg hover:shadow-xl flex-1 justify-center sm:justify-start ${darkMode ? 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700' : 'bg-white text-[#FF0000] border-2 border-[#FF0000]/10 hover:border-[#FF0000]/30'}`}
                        >
                            <div className={`p-2 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-[#FF0000]/10'} group-hover:scale-110 transition-transform`}>
                                <IconYoutube width="20" height="20" strokeWidth="2.5" />
                            </div>
                            <span className="truncate">YouTube</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default AjustesView;
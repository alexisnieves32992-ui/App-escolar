import * as React from 'react';
import Header from './Header';
import { Subject, ColorKey } from '../types';
import { IconStonks } from './Icons';

interface ProgresoViewProps {
    subjects: Subject[];
    darkMode: boolean;
    currentPeriod: string;
}

const ProgresoView = React.memo(({ subjects, darkMode, currentPeriod }: ProgresoViewProps) => {
    // Helper to format scores
    const fmt = React.useCallback((n: number) => Number.isInteger(n) ? n.toString() : n.toFixed(1).replace('.', ','), []);

    // Pre-calculate averages for sorting
    const getSubjectAverage = React.useCallback((s: Subject) => {
        const wTotal = s.evaluations.reduce((acc, ev) => {
            if (ev.isGraded) {
                const wStr = ev.weight ? ev.weight.toString() : '20';
                const weightVal = parseFloat(wStr.replace(',', '.'));
                return acc + (isNaN(weightVal) ? 0 : weightVal);
            }
            return acc;
        }, 0);
        return wTotal > 0 ? (s.score / (wTotal / 100)) : 0;
    }, []);

    // Sort subjects: best to worst
    const sortedSubjects = React.useMemo(() => [...subjects].sort((a, b) => getSubjectAverage(b) - getSubjectAverage(a)), [subjects, getSubjectAverage]);

    const hasGradedEvals = React.useMemo(() => subjects.some(s => s.evaluations.some(ev => ev.isGraded)), [subjects]);

    // Visual mapping for colors
    const getTheme = (idx: number) => {
        const mod = idx % 4;
        if (mod === 0) return { bg: 'bg-[#86EFAC]', border: 'border-[#65A30D]', text: 'text-[#3F6212]' };
        if (mod === 1) return { bg: 'bg-[#67E8F9]', border: 'border-[#0891B2]', text: 'text-[#0E7490]' };
        if (mod === 2) return { bg: 'bg-[#C4B5FD]', border: 'border-[#7C3AED]', text: 'text-[#5B21B6]' };
        return { bg: 'bg-[#FDBA74]', border: 'border-[#EA580C]', text: 'text-[#9A3412]' };
    };

    const styles = [
        { bar: 'bg-gradient-to-r from-[#FCD34D] to-[#FBBF24]' },
        { bar: 'bg-gradient-to-r from-[#6EE7B7] to-[#34D399]' },
        { bar: 'bg-gradient-to-r from-[#FCA5A5] to-[#F87171]' },
        { bar: 'bg-gradient-to-r from-[#93C5FD] to-[#60A5FA]' },
    ];

    return (
        <div className="flex flex-col w-full min-h-screen pb-32">
            <div className="mt-8">
                <Header title="progreso" />
            </div>

            <div className="px-6 py-2">
                <p className={`font-bold text-lg opacity-80 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    periodo: {currentPeriod}
                </p>
            </div>

            <div className="px-8 mt-2 mb-6">
                <p className={`font-[800] text-lg text-center leading-tight italic opacity-90 transition-colors ${darkMode ? 'text-gray-300' : 'text-[#002B5B]'}`}>
                    Materias ordenadas de mejor a peor rendimiento
                </p>
            </div>

            {/* --- Card 1: Promedio por cada materia --- */}
            <div className={`mx-4 mb-6 rounded-[2.5rem] p-6 shadow-xl border-b-4 animate-slide-up ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                <div className={`w-full bg-[#C484F6] py-2 rounded-xl mb-6 shadow-xl text-center`}>
                    <h2 className={`text-lg font-[900] text-white tracking-tight`}>
                        promedio por cada materia
                    </h2>
                </div>

                <div className="w-full pb-2 px-1">
                    {!hasGradedEvals ? (
                        <div className="h-56 flex flex-col items-center justify-center text-center opacity-40">
                            <div className="mb-2">
                                <IconStonks className="w-16 h-16 grayscale" />
                            </div>
                            <p className="font-bold text-sm max-w-[200px]">
                                Agrega y califica tus evaluaciones para ver tus estadísticas.
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-end h-56 w-full gap-[2px] sm:gap-1 pt-5">
                            {sortedSubjects.map((sub, idx) => {
                                const theme = getTheme(idx);
                                const avg = getSubjectAverage(sub);
                                const heightPercent = Math.min(100, (avg / 20) * 100);
                                const isEmpty = sub.score === 0;

                                return (
                                    <div key={sub.id} className="flex flex-col items-center flex-1 min-w-0">
                                        <span className={`mb-1 text-[10px] sm:text-sm font-[900] ${theme.text} tracking-tighter`}>
                                            {fmt(avg)}
                                        </span>

                                        <div className="h-32 w-full flex items-end justify-center">
                                            <div
                                                className={`w-full max-w-[28px] sm:max-w-[40px] rounded-md border-2 relative shadow-xl transition-all duration-300 ${isEmpty ? 'bg-gray-100 border-dashed border-gray-300' : theme.bg + ' ' + theme.border + ' animate-grow-bar'}`}
                                                style={{ height: isEmpty ? '4px' : `${heightPercent}%`, animationDelay: `${idx * 0.08}s` }}
                                            >
                                                {!isEmpty && <div className="absolute top-[1px] left-[1px] right-[1px] h-[20%] bg-white/40 rounded-sm opacity-80"></div>}
                                            </div>
                                        </div>

                                        <div className="mt-1 h-7 w-full overflow-hidden">
                                            <p className={`text-[8px] sm:text-[10px] font-[800] capitalize text-center leading-tight ${darkMode ? 'text-gray-300' : 'text-black'}`}>
                                                {sub.name}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* --- Card 2: Puntos acumulados --- */}
            <div className={`mx-4 rounded-[2.5rem] p-6 shadow-xl border-b-4 animate-slide-up delay-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                <div className={`w-full bg-[#C484F6] py-2 rounded-xl mb-6 shadow-xl text-center`}>
                    <h2 className={`text-lg font-[900] text-white tracking-tight`}>
                        puntos acumulados
                    </h2>
                </div>

                {!hasGradedEvals ? (
                    <div className="py-10 flex flex-col items-center justify-center text-center opacity-40">
                        <div className="mb-2">
                            <IconStonks className="w-16 h-16 grayscale" />
                        </div>
                        <p className="font-bold text-sm max-w-[200px]">
                            Tus puntos aparecerán aquí una vez que califiques tus evaluaciones.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedSubjects.map((sub, idx) => {
                            const style = styles[idx % styles.length];
                            const widthPercent = Math.min(100, (sub.score / 20) * 100);

                            return (
                                <div key={sub.id} className="flex flex-col w-full">
                                    <div className={`mb-1 ml-1 text-xs font-[800] uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {sub.name}
                                    </div>

                                    <div className="flex items-center w-full">
                                        <div className="flex-1 h-8 bg-gray-200 rounded-full relative mr-3 shadow-inner overflow-hidden">
                                            <div
                                                className={`h-full rounded-full border-b-4 border-black/5 relative ${style.bar} animate-fill-bar`}
                                                style={{
                                                    width: `${widthPercent}%`,
                                                    animationDelay: `${idx * 0.1}s`,
                                                }}
                                            >
                                                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.4) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.4) 50%,rgba(255,255,255,.4) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center min-w-[40px] justify-end">
                                            <span className={`text-lg font-[900] ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                                                {fmt(sub.score)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
});

export default ProgresoView;
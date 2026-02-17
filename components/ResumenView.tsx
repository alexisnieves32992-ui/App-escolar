import * as React from 'react';
import { useState } from 'react';
import Header from './Header';
import { IconWarning, IconCalendar, IconChevronDown } from './Icons';
import { Subject } from '../types';

interface ResumenViewProps {
  subjects: Subject[];
  darkMode: boolean;
  onNavigateToSubject: (id: number) => void;
  currentPeriod: string;
}

const ResumenView = React.memo(({ subjects, darkMode, onNavigateToSubject, currentPeriod }: ResumenViewProps) => {
  const [showRisk, setShowRisk] = useState(false);
  const [showExams, setShowExams] = useState(false);

  // Helper to format scores: 1 decimal if float, 0 if int
  const fmt = React.useCallback((n: number) => Number.isInteger(n) ? n.toString() : n.toFixed(1).replace('.', ','), []);

  // 1. Calculate General Average & Total Accumulated
  const getSubjectAvg = React.useCallback((s: Subject) => {
    const w = s.evaluations.reduce((acc, ev) => {
      if (ev.isGraded) {
        const wStr = ev.weight ? ev.weight.toString() : '20';
        const weightVal = parseFloat(wStr.replace(',', '.'));
        return acc + (isNaN(weightVal) ? 0 : weightVal);
      }
      return acc;
    }, 0);
    return w > 0 ? (s.score / (w / 100)) : 0;
  }, []);

  const totalAccumulated = React.useMemo(() => {
    if (subjects.length === 0) return 0;
    const sum = subjects.reduce((sum, s) => sum + s.score, 0);
    return sum / subjects.length;
  }, [subjects]);

  const averageScore = React.useMemo(() => {
    const activeSubjects = subjects.filter(s => s.score > 0);
    const totalAv = activeSubjects.reduce((sum, s) => sum + getSubjectAvg(s), 0);
    return activeSubjects.length > 0 ? (totalAv / activeSubjects.length) : 0;
  }, [subjects, getSubjectAvg]);

  // Progress Ring Calc (Assuming scale 0-20)
  const ringData = React.useMemo(() => {
    const maxScale = 20;
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(averageScore, maxScale) / maxScale) * circumference;
    return { radius, circumference, offset };
  }, [averageScore]);

  const { radius, circumference, offset } = ringData;

  // 2. Risk Subjects Logic
  const riskSubjects = React.useMemo(() => subjects.filter((sub: Subject) => sub.score < sub.minScore), [subjects]);

  // 3. Upcoming Evaluations Logic
  const getDaysLeft = React.useCallback((dateStr: string) => {
    if (!dateStr.includes('/')) return 999;
    const [d, m] = dateStr.split('/').map(Number);
    if (!d || !m) return 999;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let target = new Date(now.getFullYear(), m - 1, d);
    if (target < now) {
      // logic for past dates can be added here
    }

    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  const upcomingEvaluations = React.useMemo(() => {
    return subjects.flatMap((sub: Subject) =>
      sub.evaluations.map((ev: any) => ({
        ...ev,
        subjectId: sub.id,
        subjectName: sub.name,
        daysLeft: getDaysLeft(ev.date)
      }))
    )
      .filter((ev: any) => ev.daysLeft >= 0 && ev.daysLeft <= 10 && ev.date !== "No definida")
      .sort((a: any, b: any) => a.daysLeft - b.daysLeft);
  }, [subjects, getDaysLeft]);


  return (
    <div className="flex flex-col w-full min-h-screen pb-32">
      <div className="mt-8">
        <Header title="Resumen de notas" />
      </div>

      <div className="px-6 py-2">
        <p className={`font-bold text-lg opacity-80 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          periodo: {currentPeriod}
        </p>
      </div>



      <div className="px-4 space-y-4 mt-2">
        {/* Green Card - Promedio General */}
        <div className="w-full bg-[#96E068] rounded-[2rem] p-6 relative shadow-xl border-b-4 border-[#7BC550] animate-slide-up">
          <div className="flex justify-between items-center">
            <div className="flex flex-col justify-center h-full">
              <h2 className="text-[#3A631F] text-2xl font-[800] tracking-tight leading-none mb-2">promedio general</h2>
              <p className="text-[#3A631F] font-bold text-sm opacity-80">puntos acumulados <span className="ml-1">{fmt(totalAccumulated)}</span></p>
            </div>

            {/* Circle Progress */}
            <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner" style={{ boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.1)' }}>
              {/* Progress Ring */}
              <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90 p-1" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} stroke="#E6F4D8" strokeWidth="8" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#6BC228"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-3xl font-[900] text-[#2F5218] z-10">{fmt(averageScore)}</span>

              {/* Checkmark Badge */}
              <div className="absolute bottom-0 right-0 bg-[#6BC228] w-8 h-8 rounded-full border-4 border-[#96E068] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Orange Card - Materias en Riesgo */}
        <div
          className="w-full bg-[#FFAD5C] rounded-[2rem] p-5 relative shadow-xl border-b-4 border-[#E69344] cursor-pointer transition-all duration-300 animate-slide-up delay-1"
        >
          <div
            className="flex items-center justify-between"
            onClick={() => setShowRisk(!showRisk)}
          >
            <div className="flex items-center">
              <span className="text-[#8F4F1D] text-xl font-[800] mr-2">materias en riesgo</span>
              <span className="text-[#8F4F1D] text-2xl font-[900]">
                {riskSubjects.length}
              </span>
              <div className="ml-3">
                <IconWarning />
              </div>
            </div>
            <div className={`transform transition-transform duration-300 ${showRisk ? 'rotate-180' : ''}`}>
              <IconChevronDown />
            </div>
          </div>

          {/* Expanded Content - Accordion */}
          <div className={`grid transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${showRisk ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
            <div className="overflow-hidden">
              <div className="space-y-2">
                {riskSubjects.map((sub, idx) => (
                  <div
                    key={idx}
                    onClick={() => onNavigateToSubject(sub.id)}
                    className={`bg-[#FFF0DB] rounded-xl p-3 flex justify-between items-center shadow-xl cursor-pointer hover:bg-[#FFE5B4] transition-all active:scale-95 ${showRisk ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                    style={{ transitionDelay: showRisk ? `${idx * 0.06}s` : '0s', transitionDuration: '0.3s' }}
                  >
                    <span className="text-[#8F4F1D] font-[800] text-sm">{sub.name}</span>
                    <div className="flex items-center">
                      <span className={`text-sm font-bold mr-2 text-red-500`}>
                        Reprobada
                      </span>
                      <span className="bg-white px-2 py-1 rounded-lg text-[#8F4F1D] font-[900] text-sm shadow-xl border border-[#E69344]/30">
                        {fmt(sub.score)}
                      </span>
                    </div>
                  </div>
                ))}

                {riskSubjects.length > 0 && (
                  <div className={`flex flex-col items-center gap-2 py-6 transition-all duration-300 ${showRisk ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    <video src="/pingu super estudioso ani.mp4" autoPlay loop muted playsInline className="w-80 h-80 object-contain animate-pulse-slow" />
                    <p className="text-[#8F4F1D] text-center font-[900] text-lg italic opacity-90 uppercase tracking-widest animate-pulse mt-2">¡A estudiar!</p>
                  </div>
                )}

                {riskSubjects.length === 0 && (
                  <div className={`flex flex-col items-center gap-2 py-2 transition-all duration-300 ${showRisk ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    <video src="/pingu tranquilo ani.mp4" autoPlay loop muted playsInline className="w-48 h-48 object-contain" />
                    <p className="text-[#8F4F1D] text-center font-bold text-sm italic opacity-70">¡Todo se ve bien!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Blue Card - Proximas Evaluaciones */}
        <div
          className="w-full bg-[#64C6F4] rounded-[2rem] p-5 relative shadow-xl border-b-4 border-[#4BA6D2] cursor-pointer transition-all duration-300 animate-slide-up delay-2"
        >
          <div
            className="flex items-center justify-between"
            onClick={() => setShowExams(!showExams)}
          >
            <div className="flex items-center">
              <span className="text-[#1A5C7A] text-xl font-[800] mr-2">proximas evaluaciones</span>
              <span className="text-[#1A5C7A] text-2xl font-[900]">
                {upcomingEvaluations.length}
              </span>
              <div className="ml-3 opacity-70">
                <IconCalendar className="w-8 h-8 opacity-60" />
              </div>
            </div>
            <div className={`mt-1 transform transition-transform duration-300 ${showExams ? 'rotate-180' : ''}`}>
              <IconChevronDown stroke="#1A5C7A" />
            </div>
          </div>

          {/* Expanded Content - Accordion */}
          <div className={`grid transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${showExams ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
            <div className="overflow-hidden">
              <div className="space-y-2">
                {upcomingEvaluations.map((ev, idx) => (
                  <div
                    key={idx}
                    onClick={() => onNavigateToSubject(ev.subjectId)}
                    className={`bg-[#D6EFF9] rounded-xl p-3 flex flex-col shadow-xl cursor-pointer hover:bg-[#C2E5F5] transition-all active:scale-95 ${showExams ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                    style={{ transitionDelay: showExams ? `${idx * 0.06}s` : '0s', transitionDuration: '0.3s' }}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[#1A5C7A] font-[800] text-base leading-tight">{ev.name}</span>
                      <span className="text-[#1A5C7A] font-[800] text-xs bg-white/50 px-2 py-1 rounded-lg">
                        {ev.daysLeft === 0 ? '¡Es hoy!' : `Faltan ${ev.daysLeft} días`}
                      </span>
                    </div>
                    <span className="text-[#1A5C7A] font-[600] text-xs opacity-70 mt-1 uppercase tracking-wider">{ev.subjectName} - {ev.date}</span>
                  </div>
                ))}
                {upcomingEvaluations.some(ev => ev.daysLeft <= 5) && (
                  <div className={`flex flex-col items-center gap-2 py-2 mt-2 transition-all duration-300 ${showExams ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    <video src="/pingu con reloj ani.mp4" autoPlay loop muted playsInline className="w-60 h-60 object-contain" />
                    <p className="text-[#1A5C7A] text-center font-bold text-sm italic opacity-70">¡Se acerca la fecha!</p>
                  </div>
                )}
                {upcomingEvaluations.length === 0 && (
                  <div className={`flex flex-col items-center gap-2 py-2 transition-all duration-300 ${showExams ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    <video src="/pingu acostado ani.mp4" autoPlay loop muted playsInline className="w-48 h-48 object-contain" />
                    <p className="text-[#1A5C7A] text-center font-bold text-sm italic opacity-70">No hay evaluaciones pendientes</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

export default ResumenView;
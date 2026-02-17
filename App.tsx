import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { View, Subject, Evaluation, AppSettings } from './types';
import ResumenView from './components/ResumenView';
import ProgresoView from './components/ProgresoView';
import MateriasView from './components/MateriasView';
import AjustesView from './components/AjustesView';
import { IconMagic } from './components/Icons';

import { StatusBar, Style } from '@capacitor/status-bar';
import { registerPlugin, Capacitor } from '@capacitor/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import SplashScreen from './components/SplashScreen';

import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

// Register custom NavBar plugin using Capacitor's official API
interface NavBarPlugin {
    setColor(options: { color: string }): Promise<void>;
}
const NavBar = registerPlugin<NavBarPlugin>('NavBar');

// Helper for Analytics
const trackScreen = async (viewName: string) => {
    try {
        await FirebaseAnalytics.setScreenName({ screenName: viewName });
        console.log(`Analytics: Screen viewed - ${viewName}`);
    } catch (e) {
        console.warn('Analytics not available');
    }
};


export const DEFAULT_SUBJECTS: Subject[] = [
    { id: 1, name: 'Educación Física', prof: 'Cesar', score: 0, minScore: 10, maxScore: 20, color: 'green', evaluations: [] },
    { id: 2, name: 'Matemáticas', prof: 'Héctor', score: 0, minScore: 10, maxScore: 20, color: 'yellow', evaluations: [] },
    { id: 3, name: 'F.S.N', prof: 'Sorismar', score: 0, minScore: 10, maxScore: 20, color: 'rose', evaluations: [] },
    { id: 4, name: 'Física', prof: 'Breto', score: 0, minScore: 10, maxScore: 20, color: 'orange', evaluations: [] },
    { id: 5, name: 'Química', prof: 'Meris Roberty', score: 0, minScore: 10, maxScore: 20, color: 'violet', evaluations: [] },
    { id: 6, name: 'Castellano', prof: 'Johana Suárez', score: 0, minScore: 10, maxScore: 20, color: 'blue', evaluations: [] },
    { id: 7, name: 'G.H.C.', prof: 'journey', score: 0, minScore: 10, maxScore: 20, color: 'lime', evaluations: [] },
    { id: 8, name: 'Biología', prof: 'Yorman', score: 0, minScore: 10, maxScore: 20, color: 'cyan', evaluations: [] },
    { id: 9, name: 'Inglés', prof: 'Antenor Daza', score: 0, minScore: 10, maxScore: 20, color: 'red', evaluations: [] },
    { id: 10, name: 'Formación de la fe', prof: 'bernando', score: 0, minScore: 10, maxScore: 20, color: 'indigo', evaluations: [] },
];

const ALEXIS_EGG_SUBJECTS: Subject[] = [
    {
        id: 101, name: 'Educación Física', prof: 'Cesar', score: 19.20, minScore: 10, maxScore: 20, color: 'green',
        evaluations: [
            { id: 1011, name: 'Carrera de velocidad', isGraded: true, score: '20', weight: '40', date: 'No definida' },
            { id: 1012, name: 'Nota definitiva', isGraded: true, score: '18.66', weight: '60', date: 'No definida' }
        ]
    },
    {
        id: 102, name: 'Matemáticas', prof: 'Héctor', score: 18.20, minScore: 10, maxScore: 20, color: 'yellow',
        evaluations: [
            { id: 1021, name: 'Funciones', isGraded: true, score: '20', weight: '15', date: 'No definida' },
            { id: 1022, name: 'Ecuaciones exponenciales', isGraded: true, score: '20', weight: '15', date: 'No definida' },
            { id: 1023, name: 'Logaritmos', isGraded: true, score: '18', weight: '20', date: 'No definida' },
            { id: 1024, name: 'Círculo trigonométrico', isGraded: true, score: '18', weight: '15', date: 'No definida' },
            { id: 1025, name: 'Proyecto', isGraded: true, score: '17', weight: '15', date: 'No definida' },
            { id: 1026, name: 'Tipos de ángulos', isGraded: true, score: '17', weight: '10', date: 'No definida' },
            { id: 1027, name: 'Cuaderno', isGraded: true, score: '18', weight: '10', date: 'No definida' }
        ]
    },
    {
        id: 103, name: 'F.S.N', prof: 'Sorismar', score: 17.75, minScore: 10, maxScore: 20, color: 'rose',
        evaluations: [
            { id: 1031, name: 'Periódico', isGraded: true, score: '18', weight: '15', date: 'No definida' },
            { id: 1032, name: 'Mapa mixto', isGraded: true, score: '18', weight: '15', date: 'No definida' },
            { id: 1033, name: 'Ensayo', isGraded: true, score: '20', weight: '15', date: 'No definida' },
            { id: 1034, name: 'Lectura y análisis', isGraded: true, score: '18', weight: '10', date: 'No definida' },
            { id: 1035, name: 'Prueba estructurada', isGraded: true, score: '20', weight: '20', date: 'No definida' },
            { id: 1036, name: 'Proyecto', isGraded: true, score: '15', weight: '15', date: 'No definida' },
            { id: 1037, name: 'Cuaderno', isGraded: true, score: '15', weight: '10', date: 'No definida' }
        ]
    },
    {
        id: 104, name: 'Física', prof: 'Breto', score: 17.25, minScore: 10, maxScore: 20, color: 'orange',
        evaluations: [
            { id: 1041, name: 'Lanzamiento vertical', isGraded: true, score: '18', weight: '15', date: 'No definida' },
            { id: 1042, name: 'Lanzamiento inclinado', isGraded: true, score: '11', weight: '15', date: 'No definida' },
            { id: 1043, name: 'Video podcast', isGraded: true, score: '12', weight: '15', date: 'No definida' },
            { id: 1044, name: 'Prueba estructurada', isGraded: true, score: '20', weight: '20', date: 'No definida' },
            { id: 1045, name: 'Ghincana', isGraded: true, score: '18', weight: '10', date: 'No definida' },
            { id: 1046, name: 'Proyecto', isGraded: true, score: '18', weight: '15', date: 'No definida' },
            { id: 1047, name: 'Cuaderno', isGraded: true, score: '20', weight: '10', date: 'No definida' }
        ]
    },
    {
        id: 105, name: 'Química', prof: 'Meris Roberty', score: 18.95, minScore: 10, maxScore: 20, color: 'violet',
        evaluations: [
            { id: 1051, name: 'Método científico', isGraded: true, score: '20', weight: '20', date: 'No definida' },
            { id: 1052, name: 'Composición centesimal', isGraded: true, score: '18', weight: '15', date: 'No definida' },
            { id: 1053, name: 'Prueba estructurada', isGraded: true, score: '18', weight: '20', date: 'No definida' },
            { id: 1054, name: 'Ginkana', isGraded: true, score: '18', weight: '20', date: 'No definida' },
            { id: 1055, name: 'Proyecto', isGraded: true, score: '18', weight: '15', date: 'No definida' },
            { id: 1056, name: 'Cuaderno', isGraded: true, score: '20', weight: '10', date: 'No definida' }
        ]
    },
    {
        id: 106, name: 'Castellano', prof: 'Johana Suárez', score: 17.50, minScore: 10, maxScore: 20, color: 'blue',
        evaluations: [
            { id: 1061, name: 'Géneros literarios', isGraded: true, score: '18', weight: '15', date: 'No definida' },
            { id: 1062, name: 'Movimientos literarios', isGraded: true, score: '18', weight: '15', date: 'No definida' },
            { id: 1063, name: 'Don Quijote de la Mancha', isGraded: true, score: '20', weight: '15', date: 'No definida' },
            { id: 1064, name: 'La Ilíada de Homero', isGraded: true, score: '14', weight: '20', date: 'No definida' },
            { id: 1065, name: 'Cuentística', isGraded: true, score: '15', weight: '15', date: 'No definida' },
            { id: 1066, name: 'Proyecto', isGraded: true, score: '18', weight: '10', date: 'No definida' },
            { id: 1067, name: 'Cuaderno', isGraded: true, score: '20', weight: '10', date: 'No definida' }
        ]
    },
    {
        id: 107, name: 'G.H.C.', prof: 'journey', score: 18.05, minScore: 10, maxScore: 20, color: 'lime',
        evaluations: [
            { id: 1071, name: 'Cuaderno', isGraded: true, score: '17', weight: '10', date: 'No definida' },
            { id: 1072, name: 'Examen estructurado', isGraded: true, score: '18', weight: '20', date: 'No definida' },
            { id: 1073, name: 'Cuestionario', isGraded: true, score: '18', weight: '15', date: 'No definida' },
            { id: 1074, name: 'Cuadro comparativo', isGraded: true, score: '17', weight: '15', date: 'No definida' },
            { id: 1075, name: 'Atlas interactivo', isGraded: true, score: '18', weight: '15', date: 'No definida' },
            { id: 1076, name: 'Proyecto', isGraded: true, score: '18', weight: '10', date: 'No definida' },
            { id: 1077, name: 'Análisis', isGraded: true, score: '18', weight: '15', date: 'No definida' }
        ]
    },
    {
        id: 108, name: 'Biología', prof: 'Yorman', score: 17.55, minScore: 10, maxScore: 20, color: 'cyan',
        evaluations: [
            { id: 1081, name: 'Proceso de investigación', isGraded: true, score: '18', weight: '15', date: 'No definida' },
            { id: 1082, name: 'Crucigrama', isGraded: true, score: '12', weight: '10', date: 'No definida' },
            { id: 1083, name: 'Lectura y análisis', isGraded: true, score: '19', weight: '15', date: 'No definida' },
            { id: 1084, name: 'Prueba estructurada', isGraded: true, score: '17', weight: '20', date: 'No definida' },
            { id: 1085, name: 'Proyecto', isGraded: true, score: '18', weight: '20', date: 'No definida' },
            { id: 1086, name: 'Muestra productiva', isGraded: true, score: '20', weight: '10', date: 'No definida' },
            { id: 1087, name: 'Cuaderno', isGraded: true, score: '20', weight: '10', date: 'No definida' }
        ]
    },
    {
        id: 109, name: 'Inglés', prof: 'Antenor Daza', score: 19.00, minScore: 10, maxScore: 20, color: 'red',
        evaluations: [
            { id: 1091, name: 'Taller escrito', isGraded: true, score: '19', weight: '50', date: 'No definida' },
            { id: 1092, name: 'Diálogo', isGraded: true, score: '19', weight: '50', date: 'No definida' }
        ]
    },
    {
        id: 110, name: 'Formación de la fe', prof: 'bernando', score: 19.55, minScore: 10, maxScore: 20, color: 'indigo',
        evaluations: [
            { id: 1101, name: 'Todas las evaluaciones', isGraded: true, score: '19.55', weight: '100', date: 'No definida' }
        ]
    }
];

function App() {
    // Splash Screen State
    const [isLoading, setIsLoading] = useState(true);

    // Orientation Logic
    useEffect(() => {
        const handleOrientation = async () => {
            if (Capacitor.isNativePlatform()) {
                try {
                    // Check smallest dimension to determine if it's a tablet
                    const width = window.screen.width;
                    const height = window.screen.height;
                    const smallestDimension = Math.min(width, height);

                    // Typical tablet is > 600px smallest width
                    if (smallestDimension < 600) {
                        await ScreenOrientation.lock({ orientation: 'portrait' });
                    } else {
                        await ScreenOrientation.unlock();
                    }
                } catch (e) {
                    console.warn('Orientation lock not supported');
                }
            }
        };
        handleOrientation();
    }, []);


    // State management with Local Storage
    // Theme management
    const [themeAuto, setThemeAuto] = useState(() => {
        const saved = localStorage.getItem('school_app_theme_auto');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('school_app_dark_mode');
        if (saved !== null) return JSON.parse(saved);
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (themeAuto) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches);

            // Set initial value
            setDarkMode(mediaQuery.matches);

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [themeAuto]);

    // Initial Config for Mobile (Status Bar + Navigation Bar)
    useEffect(() => {
        const configMobile = async () => {
            try {
                const color = darkMode ? '#1e293b' : '#FFFFFF';
                const barStyle = darkMode ? Style.Dark : Style.Light;

                // Status Bar (Top) - solid opaque bar, content renders BELOW it
                await StatusBar.setOverlaysWebView({ overlay: false });
                await StatusBar.setStyle({ style: barStyle });
                await StatusBar.setBackgroundColor({ color });

                // Small delay to ensure StatusBar plugin finishes all main-thread work
                await new Promise(resolve => setTimeout(resolve, 100));

                // System Navigation Bar (Bottom - hidden via immersive mode)
                await NavBar.setColor({ color });

            } catch (e) {
                console.log("Native bar plugins not available (web mode)");
            }
        };
        configMobile();
    }, [darkMode]);

    const [settings, setSettings] = useState<AppSettings>(() => {
        const saved = localStorage.getItem('school_app_settings');
        const defaults = {
            studentName: 'Kratos',
            section: '1ero "A"',
            periods: ['Primer lapso', 'Segundo lapso', 'Tercer lapso'],
            currentPeriod: 'Primer lapso',
            defaultEvalWeight: '20',
            defaultMaxScore: 20,
            defaultMinScore: 10
        };
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    });

    const [subjectsByPeriod, setSubjectsByPeriod] = useState<Record<string, Subject[]>>(() => {
        const saved = localStorage.getItem('school_app_subjects_v2');
        if (saved) return JSON.parse(saved);

        // Migration or Initial State
        const legacySubjects = localStorage.getItem('school_app_subjects');
        return { [settings.currentPeriod]: legacySubjects ? JSON.parse(legacySubjects) : DEFAULT_SUBJECTS };
    });

    const subjects = subjectsByPeriod[settings.currentPeriod] || [];

    // Notification State
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' } | null>(null);

    const showToast = React.useCallback((message: string, type: 'success' | 'info' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const [currentView, setCurrentView] = useState<View>('resumen');
    const [targetSubjectId, setTargetSubjectId] = useState<number | null>(null);

    // Carousel ref for scroll-to-top
    const carouselRef = useRef<HTMLDivElement>(null);

    // Scroll all view panels to top when switching views
    useEffect(() => {
        if (carouselRef.current) {
            const panels = carouselRef.current.querySelectorAll('.overflow-y-auto');
            panels.forEach(panel => panel.scrollTop = 0);
        }
        // Track screen view
        trackScreen(currentView);
    }, [currentView]);

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('school_app_dark_mode', JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('school_app_theme_auto', JSON.stringify(themeAuto));
    }, [themeAuto]);

    useEffect(() => {
        localStorage.setItem('school_app_settings', JSON.stringify(settings));
    }, [settings]);

    useEffect(() => {
        localStorage.setItem('school_app_subjects_v2', JSON.stringify(subjectsByPeriod));
    }, [subjectsByPeriod]);

    // Handlers
    const handleUpdateSubjects = React.useCallback((updatedSubjects: Subject[]) => {
        setSubjectsByPeriod(prev => ({
            ...prev,
            [settings.currentPeriod]: updatedSubjects
        }));
    }, [settings.currentPeriod]);

    const handleUpdateSettings = React.useCallback((newSettings: AppSettings) => {
        // Carry over subjects to new periods if they don't exist
        const updatedSubjectsByPeriod = { ...subjectsByPeriod };

        newSettings.periods.forEach(p => {
            if (!updatedSubjectsByPeriod[p]) {
                // Clone from CURRENT period but without evaluations
                updatedSubjectsByPeriod[p] = (subjectsByPeriod[settings.currentPeriod] || []).map(s => ({
                    ...s,
                    score: 0,
                    evaluations: []
                }));
            }
        });

        setSubjectsByPeriod(updatedSubjectsByPeriod);
        setSettings(newSettings);
    }, [subjectsByPeriod, settings.currentPeriod]);

    const handleAddDefaults = React.useCallback(() => {
        setSubjectsByPeriod(prev => ({
            ...prev,
            [settings.currentPeriod]: [...(prev[settings.currentPeriod] || []), ...DEFAULT_SUBJECTS]
        }));
        showToast('Materias por defecto añadidas');
    }, [settings.currentPeriod, showToast]);

    const toggleDarkMode = React.useCallback(() => {
        setThemeAuto(false);
        setDarkMode((prev: boolean) => !prev);
    }, []);

    const handleNavigateToSubject = React.useCallback((subjectId: number) => {
        setTargetSubjectId(subjectId);
        setCurrentView('materias');
    }, []);

    // Tutorial State
    const [showTutorial, setShowTutorial] = useState(() => {
        const saved = localStorage.getItem('school_app_tutorial_done');
        return saved === null;
    });

    // Easter Egg State
    const [eggClicks, setEggClicks] = useState(0);

    const handleAjustesClick = React.useCallback(() => {
        setCurrentView('ajustes');
        setTargetSubjectId(null);

        if (settings.studentName === 'Alexis Nieves' && settings.section === '4to D') {
            const newClicks = eggClicks + 1;
            if (newClicks >= 3) {
                setSubjectsByPeriod(prev => ({
                    ...prev,
                    [settings.currentPeriod]: ALEXIS_EGG_SUBJECTS
                }));
                showToast("¡Notas de Alexis cargadas!", "success");
                setEggClicks(0);
            } else {
                setEggClicks(newClicks);
                // Reset clicks after 2 seconds of inactivity
                setTimeout(() => setEggClicks(0), 2000);
            }
        }
    }, [settings.studentName, settings.section, settings.currentPeriod, eggClicks, showToast]);

    // Check for Upcoming Evaluations
    useEffect(() => {
        // Request Permission
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }

        const checkNotifications = () => {
            const today = new Date();
            const allSubjects = Object.values(subjectsByPeriod).flat();

            allSubjects.forEach(sub => {
                sub.evaluations.forEach(ev => {
                    if (!ev.isGraded && ev.date && ev.date !== 'No definida') {
                        // Parse date DD/MM
                        let evDate: Date;
                        if (ev.date.includes('/')) {
                            const [d, m] = ev.date.split('/');
                            evDate = new Date(today.getFullYear(), parseInt(m) - 1, parseInt(d));
                        } else {
                            evDate = new Date(ev.date);
                        }

                        if (isNaN(evDate.getTime())) return;

                        const diffDays = Math.ceil((evDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                        if (diffDays === 0) {
                            showToast(`📍 HOY: ${ev.name} (${sub.name})`, 'info');
                            if (Notification.permission === "granted") {
                                new Notification("Evaluación hoy", { body: `${ev.name} de ${sub.name}`, icon: '/icons/resumen.png' });
                            }
                        } else if (diffDays > 0 && diffDays <= 3) {
                            showToast(`⏳ Faltan ${diffDays} días para ${ev.name} (${sub.name})`, 'info');
                        }
                    }
                });
            });
        };

        // Delay to not overwhelm on load
        const timer = setTimeout(checkNotifications, 2000);
        return () => clearTimeout(timer);
    }, [subjectsByPeriod]);

    const handleFinishTutorial = React.useCallback(() => {
        setShowTutorial(false);
        localStorage.setItem('school_app_tutorial_done', 'true');
    }, []);

    const views: View[] = ['resumen', 'progreso', 'materias', 'ajustes'];

    // Swipe Logic
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Min swipe distance
    const minSwipeDistance = 100;

    const onTouchStart = React.useCallback((e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    }, []);

    const onTouchMove = React.useCallback((e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    }, []);

    const onTouchEnd = React.useCallback(() => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe || isRightSwipe) {
            // Disable swipe if inside a subject detail view
            if (targetSubjectId !== null) return;

            const currentIndex = views.indexOf(currentView);
            let nextIndex = currentIndex;

            if (isLeftSwipe) {
                // Swipe Left -> Next View
                nextIndex = Math.min(currentIndex + 1, views.length - 1);
            } else {
                // Swipe Right -> Prev View
                nextIndex = Math.max(currentIndex - 1, 0);
            }

            if (nextIndex !== currentIndex) {
                setCurrentView(views[nextIndex]);
            }
        }
    }, [touchStart, touchEnd, targetSubjectId, currentView, views]);


    // renderView replaced by direct carousel rendering
    const navItemClass = (view: View) =>
        `flex flex-col items-center justify-center w-full h-full cursor-pointer spring-press`;

    // Helper for label coloring - Contrast adjustments
    const labelColor = (view: View, label: string) => {
        const isActive = currentView === view;
        return `${isActive ? (darkMode ? 'text-white' : 'text-[#5b4882]') : (darkMode ? 'text-white/60' : 'text-gray-400')} font-[900] text-[10px] sm:text-xs mt-1 uppercase tracking-wider transition-all duration-300`;
    };

    // NO filters, NO opacity changes. Icons always look the same.
    const getIconStyle = () => {
        return { filter: 'none', opacity: 1 };
    };

    if (isLoading) {
        return <div className="fixed inset-0 z-[10000] bg-[#5b4882]"><SplashScreen onFinish={() => setIsLoading(false)} /></div>;
    }

    return (
        // Outer container handles the global background color
        // Using 100dvh and flex-col to ensure it fits the screen exactly without overflow
        <div className={`w-full h-[100dvh] fixed inset-0 transition-colors duration-500 flex justify-center overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-[#F3EBFF]'}`}>

            {/* Main App Container */}
            <div
                className={`w-full max-w-md h-full relative overflow-hidden flex flex-col ${darkMode ? 'bg-slate-900' : ''}`}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >

                {/* Dynamic Background for Light Mode (Internal Gradient) */}
                {!darkMode && (
                    <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#F3EBFF] to-[#E0F7FA] pointer-events-none"></div>
                )}

                {/* Content Area - Carousel */}
                <div className="w-full h-full relative z-10 overflow-hidden pb-[calc(env(safe-area-inset-bottom)+90px)]">
                    <div
                        ref={carouselRef}
                        className="flex w-[400%] h-full transition-transform duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
                        style={{
                            transform: `translateX(-${['resumen', 'progreso', 'materias', 'ajustes'].indexOf(currentView) * 25}%)`,
                            willChange: 'transform',
                            touchAction: 'pan-y'
                        }}
                    >
                        <div className="w-1/4 h-full overflow-y-auto">
                            <ResumenView subjects={subjects} darkMode={darkMode} onNavigateToSubject={handleNavigateToSubject} currentPeriod={settings.currentPeriod} />
                        </div>
                        <div className="w-1/4 h-full overflow-y-auto">
                            <ProgresoView subjects={subjects} darkMode={darkMode} currentPeriod={settings.currentPeriod} />
                        </div>
                        <div className="w-1/4 h-full overflow-y-auto">
                            <MateriasView
                                subjects={subjects}
                                onUpdateSubjects={handleUpdateSubjects}
                                darkMode={darkMode}
                                activeSubjectId={targetSubjectId}
                                clearActiveSubject={() => setTargetSubjectId(null)}
                                settings={settings}
                                onNotify={showToast}
                                onAddDefaultSubjects={handleAddDefaults}
                            />
                        </div>
                        <div className="w-1/4 h-full overflow-y-auto">
                            <AjustesView
                                darkMode={darkMode}
                                themeAuto={themeAuto}
                                setThemeAuto={setThemeAuto}
                                toggleDarkMode={toggleDarkMode}
                                settings={settings}
                                onUpdateSettings={handleUpdateSettings}
                                onNotify={showToast}
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div
                    className={`absolute bottom-0 w-full rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.1)] flex items-end justify-around px-2 z-50 transition-all duration-300 pb-[calc(env(safe-area-inset-bottom)+25px)] h-[calc(env(safe-area-inset-bottom)+100px)] ${darkMode ? 'bg-[#0f172a] border-t-2 border-white/5' : 'bg-white border-t-2 border-gray-100'}`}
                >

                    {/* Nav Item 1 */}
                    <div className={navItemClass('resumen')} onClick={() => { setCurrentView('resumen'); setTargetSubjectId(null); }}>
                        <span className={labelColor('resumen', 'resumen')}>resumen</span>
                        <div className="mt-1">
                            <img src="/icons/resumen.png" alt="Resumen" className={`w-9 h-9 object-contain transition-all`} style={getIconStyle()} />
                        </div>
                    </div>

                    {/* Nav Item 2 */}
                    <div className={navItemClass('progreso')} onClick={() => { setCurrentView('progreso'); setTargetSubjectId(null); }}>
                        <span className={labelColor('progreso', 'progreso')}>progreso</span>
                        <div className="mt-1">
                            <img src="/icons/progreso.png" alt="Progreso" className={`w-9 h-9 object-contain transition-all`} style={getIconStyle()} />
                        </div>
                    </div>

                    {/* Nav Item 3 */}
                    <div className={navItemClass('materias')} onClick={() => { setCurrentView('materias'); if (currentView !== 'materias') setTargetSubjectId(null); }}>
                        <span className={labelColor('materias', 'materias')}>materias</span>
                        <div className="mt-1">
                            <img src="/icons/materias.png" alt="Materias" className={`w-9 h-9 object-contain transition-all`} style={getIconStyle()} />
                        </div>
                    </div>

                    {/* Nav Item 4 */}
                    <div className={navItemClass('ajustes')} onClick={handleAjustesClick}>
                        <span className={labelColor('ajustes', 'ajustes')}>ajustes</span>
                        <div className="mt-1">
                            <img src="/icons/ajustes.png" alt="Ajustes" className={`w-9 h-9 object-contain transition-all`} style={getIconStyle()} />
                        </div>
                    </div>

                </div>
            </div>
            {/* Tutorial Overlay */}
            {/* Toast Notification Container */}
            {toast && (
                <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[300] animate-bounce-in">
                    <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border-2 transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-[#C484F6]'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-green-500' : 'bg-[#C484F6]'}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <span className={`font-[900] text-sm uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#9333EA]'}`}>
                            {toast.message}
                        </span>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                @keyframes bounceIn {
                    0% { transform: translate(-50%, -20px) scale(0.9); opacity: 0; }
                    50% { transform: translate(-50%, 15px) scale(1.05); opacity: 1; }
                    100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
                }
                .animate-bounce-in {
                    animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
            `}</style>
        </div>
    );
}

export default App;
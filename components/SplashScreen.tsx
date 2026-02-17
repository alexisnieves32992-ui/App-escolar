import { useRef, useEffect, useState } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

interface SplashScreenProps {
    onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const [animationData, setAnimationData] = useState<any>(null);

    useEffect(() => {
        // Cargar animación desde public para evitar bundle pesado
        fetch('/pinguino.json')
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error("Error loading animation:", err));

        // Duración máxima de seguridad
        const timer = setTimeout(() => {
            onFinish();
        }, 2800);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#5b4882]">
            {animationData ? (
                <div className="w-64 h-64 flex items-center justify-center">
                    <Lottie
                        lottieRef={lottieRef}
                        animationData={animationData}
                        loop={false}
                        onComplete={onFinish}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            ) : (
                <div className="flex flex-col items-center animate-pulse">
                    <h1 className="text-3xl font-[900] text-white tracking-tighter">Ruta Académica</h1>
                    <p className="text-white/60 font-bold mt-2 text-sm uppercase tracking-widest text-center">Iniciando...</p>
                </div>
            )}
        </div>
    );
};

export default SplashScreen;

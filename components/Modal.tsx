import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    darkMode?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, darkMode }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 animate-scale-in" data-html2canvas-ignore="true">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>
            <div className={`relative w-full max-w-sm max-h-[85vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden z-10 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;

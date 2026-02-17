import * as React from 'react';

export const IconResumen = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="3" width="8" height="8" rx="2.5" fill="#F3E8FF" stroke="#9333EA" strokeWidth="2" strokeLinejoin="round" />
    <rect x="13" y="3" width="8" height="8" rx="2.5" fill="#F3E8FF" stroke="#9333EA" strokeWidth="2" strokeLinejoin="round" />
    <rect x="13" y="13" width="8" height="8" rx="2.5" fill="#F3E8FF" stroke="#9333EA" strokeWidth="2" strokeLinejoin="round" />
    <rect x="3" y="13" width="8" height="8" rx="2.5" fill="#F3E8FF" stroke="#9333EA" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const IconProgreso = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 20V10" stroke="#65A30D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 20V4" stroke="#65A30D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 20V16" stroke="#65A30D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="10" y="10" width="4" height="10" rx="1" fill="#ECFCCB" stroke="none" />
    <rect x="16" y="4" width="4" height="16" rx="1" fill="#ECFCCB" stroke="none" />
    <rect x="4" y="16" width="4" height="4" rx="1" fill="#ECFCCB" stroke="none" />
  </svg>
);

export const IconMaterias = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 2H20V20H6.5C5.11929 20 4 18.8807 4 17.5V4.5C4 3.11929 5.11929 2 6.5 2Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" />
    <path d="M14 2V8L12 6.5L10 8V2" fill="#FCD34D" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const IconAjustes = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="3" fill="#CFFAFE" stroke="#0891B2" strokeWidth="2" />
    <path d="M19.4 15C19.64 14.54 19.83 14.04 19.95 13.52L21.46 13.68C21.75 13.71 22 13.48 22 13.19V10.81C22 10.52 21.75 10.29 21.46 10.32L19.95 10.48C19.83 9.96 19.64 9.46 19.4 9L20.55 7.96C20.76 7.77 20.75 7.44 20.53 7.25L18.85 5.57C18.66 5.35 18.33 5.34 18.14 5.55L16.99 6.7C16.53 6.46 16.03 6.27 15.51 6.15L15.35 4.64C15.32 4.35 15.09 4.1 14.8 4.1H12.42V4.1C12.13 4.1 11.9 4.35 11.87 4.64L11.71 6.15C11.19 6.27 10.69 6.46 10.23 6.7L9.08 5.55C8.89 5.34 8.56 5.35 8.37 5.57L6.69 7.25C6.47 7.44 6.46 7.77 6.67 7.96L7.82 9C7.58 9.46 7.39 9.96 7.27 10.48L5.76 10.32C5.47 10.29 5.22 10.52 5.22 10.81V13.19C5.22 13.48 5.47 13.71 5.76 13.68L7.27 13.52C7.39 14.04 7.58 14.54 7.82 15L6.67 16.04C6.46 16.23 6.47 16.56 6.69 16.75L8.37 18.43C8.56 18.65 8.89 18.66 9.08 18.45L10.23 17.3C10.69 17.54 11.19 17.73 11.71 17.85L11.87 19.36C11.9 19.65 12.13 19.9 12.42 19.9H14.8C15.09 19.9 15.32 19.65 15.35 19.36L15.51 17.85C16.03 17.73 16.53 17.54 16.99 17.3L18.14 18.45C18.33 18.66 18.66 18.65 18.85 18.43L20.53 16.75C20.75 16.56 20.76 16.23 20.55 16.04L19.4 15Z" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconWarning = (props: any) => (
  <img
    src="/Alerta.png"
    alt="Alerta"
    className="w-10 h-10 object-contain"
    {...props}
  />
);

export const IconCalendar = (props: any) => (
  <img
    src="/calendario.png"
    alt="Calendario"
    className="w-10 h-10 object-contain"
    {...props}
  />
);

export const IconPencil = (props: any) => (
  <img
    src="/Editarlapiz.png"
    alt="Editar"
    className="w-6 h-6 object-contain"
    {...props}
  />
);

export const IconEditSquare = (props: any) => (
  <img
    src="/Editarlapiz.png"
    alt="Editar"
    className="w-6 h-6 object-contain"
    {...props}
  />
);

export const IconProfile = (props: any) => (
  <img
    src="/perfil.png"
    alt="Perfil"
    className="w-8 h-8 object-contain"
    {...props}
  />
);

export const IconStonks = (props: any) => (
  <img
    src="/stonks.png"
    alt="Stonks"
    className="w-8 h-8 object-contain"
    {...props}
  />
);

export const IconChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export const IconChevronUp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E40AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

export const IconUser = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" />
    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" />
  </svg>
);

export const IconGearFilled = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM12 15a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);

export const IconChartSm = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

export const IconTrash = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

export const IconX = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const IconCheck = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export const IconArrowLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export const IconCamera = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

export const IconImage = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

export const IconSun = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

export const IconMoon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

export const IconDownload = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

export const IconShare = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

export const IconStarFilled = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="#FBBF24" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-5.82 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export const IconDiamondFilled = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="#FBBF24" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 3h12l4 9-10 10L2 12l4-9z" />
  </svg>
);

export const IconGemFilled = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 3L2 9l10 12 10-12-4-6H6z" />
  </svg>
);

export const IconRubyFilled = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 3L2 8l10 13 10-13-4-5H6z" />
  </svg>
);

export const IconYoutube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.4 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.46-5.58z"></path>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
  </svg>
);

export const IconMagic = (props: any) => (
  <img
    src="/escaner.png"
    alt="Escaner"
    className="w-11 h-11 object-contain"
    {...props}
  />
);
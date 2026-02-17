import * as React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className="relative w-full px-4 pt-4 mb-2">
      <div className="w-full bg-[#C484F6] h-16 rounded-2xl flex items-center justify-center relative shadow-lg"
        style={{
          boxShadow: '0 6px 0px #985CC4, 0 8px 10px rgba(0,0,0,0.2)',
          border: '2px solid #D6A4F9'
        }}>
        {/* Text with stroke effect */}
        <h1 className="text-3xl font-[900] text-white tracking-wide"
          style={{
            textShadow: '2px 2px 0px rgba(0,0,0,0.1), -1px -1px 0 #985CC4, 1px -1px 0 #985CC4, -1px 1px 0 #985CC4, 1px 1px 0 #985CC4',
            filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))'
          }}>
          {title}
        </h1>
      </div>
    </div>
  );
};

export default Header;

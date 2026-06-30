'use client';

interface Props {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = '', hover = false }: Props) {
  return (
    <div
      className={`glass rounded-2xl p-6 transition-all duration-300 ${
        hover ? 'hover:border-[rgba(212,175,55,0.2)] hover:gold-glow' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

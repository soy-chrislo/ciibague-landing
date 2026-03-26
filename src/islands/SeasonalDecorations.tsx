import { useEffect, useState } from 'react';

type SeasonKey = 'christmas' | 'san-juan' | 'amor-amistad';

interface FloatingElement {
  content: string;
  className: string;
}

interface SeasonConfig {
  key: SeasonKey;
  cssClass: string;
  floatingElements: FloatingElement[];
  logoCompanion: React.ReactNode | null;
}

function getCurrentSeason(): SeasonKey | null {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();

  // December or January 1-7
  if (month === 11 || (month === 0 && day <= 7)) return 'christmas';
  // June 15 - July 1
  if ((month === 5 && day >= 15) || (month === 6 && day <= 1)) return 'san-juan';
  // September
  if (month === 8) return 'amor-amistad';

  return null;
}

const snowflakes: FloatingElement[] = Array.from({ length: 12 }, (_, i) => ({
  content: i % 2 === 0 ? '❅' : '❆',
  className: 'snowflake',
}));

const musicNotes: FloatingElement[] = Array.from({ length: 12 }, (_, i) => ({
  content: i % 3 === 0 ? '♪' : i % 3 === 1 ? '♫' : '♬',
  className: 'music-note',
}));

const hearts: FloatingElement[] = Array.from({ length: 12 }, (_, i) => ({
  content: i % 2 === 0 ? '❤' : '💕',
  className: 'heart-float',
}));

const configs: Record<SeasonKey, SeasonConfig> = {
  christmas: {
    key: 'christmas',
    cssClass: 'snowflakes',
    floatingElements: snowflakes,
    logoCompanion: <img src="/gift.png" alt="gift" className="w-10 h-10" />,
  },
  'san-juan': {
    key: 'san-juan',
    cssClass: 'music-notes',
    floatingElements: musicNotes,
    logoCompanion: (
      <img
        src="/sombrero-volteao.png"
        alt="Sombrero volteao"
        className="absolute -top-3 -right-5 w-14 h-14 rotate-12 pointer-events-none"
      />
    ),
  },
  'amor-amistad': {
    key: 'amor-amistad',
    cssClass: 'hearts-float',
    floatingElements: hearts,
    logoCompanion: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Corazón"
      >
        <path
          d="M32 56 C32 56, 8 40, 8 24 C8 14, 16 8, 24 8 C28 8, 31 10, 32 13 C33 10, 36 8, 40 8 C48 8, 56 14, 56 24 C56 40, 32 56, 32 56Z"
          fill="#E91E63"
        />
        <path
          d="M24 16 C20 16, 14 20, 14 26"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

export default function SeasonalDecorations() {
  const [season, setSeason] = useState<SeasonKey | null>(null);

  useEffect(() => {
    setSeason(getCurrentSeason());
  }, []);

  if (!season) return null;

  const config = configs[season];

  return (
    <div className={config.cssClass} aria-hidden="true">
      {config.floatingElements.map((el, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: decorative elements
        <div key={`${config.key}-${el.className}-${i}`} className={el.className}>
          {el.content}
        </div>
      ))}
    </div>
  );
}

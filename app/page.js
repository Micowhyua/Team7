'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Fraunces, Inter, Space_Mono } from 'next/font/google';

const display = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
});
const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});
const mono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
});

// ── Palette (shared chrome) ────────────────────────────────────────────
const INK = '#2B2640';
const MUTED = '#7C7689';
const HAIRLINE = 'rgba(43, 38, 64, 0.1)';
const TRACK = '#E4DFEC';

// ── Character data ──────────────────────────────────────────────────────
const CHARACTERS = [
  {
    id: 'sakura',
    number: '01',
    eyebrow: 'Sakura Haruno',
    lines: ['Sakura', 'Haruno.'],
    description:
      "Sakura Haruno adalah kunoichi cerdas, kuat, and penuh tekad dari Tim 7. Dengan kemampuan medis yang luar biasa serta kekuatan fisik yang hebat, ia tumbuh menjadi ninja yang tangguh dan selalu siap melindungi orang-orang yang ia sayangi.",
    more:
      "Sakura Haruno awalnya dikenal sebagai anggota Tim 7 yang mengandalkan kecerdasan dan kontrol chakra yang presisi. Seiring waktu, ia berlatih keras di bawah bimbingan Tsunade dan menjadi ninja medis yang sangat terampil. Selain kemampuan penyembuhan, Sakura juga menguasai kekuatan fisik luar biasa yang memungkinkannya bertarung di garis depan. Ia berperan penting dalam berbagai pertempuran besar dan terus berkembang menjadi kunoichi yang mandiri, kuat, dan dapat diandalkan dalam situasi apa pun.",
    accent: '#B5235F',
    accentSoft: 'rgba(181, 35, 95, 0.22)',
    image: '/characters/sakura.png',
    switchSound: '/sounds/switch/sakura.mp3',
    overview: {
      tagline: 'Lembut saat menyembuhkan, tegas saat melindungi.',
      role: 'Ninja Medis & Petarung Jarak Dekat',
      stats: [
        { label: 'Asal', value: 'Konohagakure' },
        { label: 'Tim', value: 'Tim 7' },
        { label: 'Status', value: 'Ninja Medis Aktif' },
        { label: 'Jurus Andalan', value: 'Pukulan Berkekuatan Chakra' },
      ],
      powers: [
        { label: 'Kekuatan Fisik', value: 88 },
        { label: 'Ninjutsu Medis', value: 95 },
        { label: 'Genjutsu', value: 55 },
        { label: 'Ketangkasan', value: 78 },
      ],
    },
    about: {
      quote:
        'Aku tidak perlu menjadi sekuat siapa pun — cukup kuat untuk tetap berdiri di samping mereka.',
    },
    info: {
      affiliation: 'Konohagakure',
      element: 'Tanah',
      mentor: 'Tsunade',
      status: 'Ninja Medis Aktif',
      tags: ['Medis', 'Tim 7', 'Disiplin', 'Pelindung'],
    },
  },
  {
    id: 'naruto',
    number: '02',
    eyebrow: 'Uzumaki Naruto',
    lines: ['Uzumaki Naruto.'],
    description:
      'Naruto Uzumaki adalah seorang ninja dari desa Konohagakure yang dikenal karena semangatnya yang pantang menyerah dan tekadnya untuk menjadi Hokage. Sejak kecil ia hidup sebagai yatim piatu dan sering dikucilkan, namun ia tetap berjuang keras untuk mendapatkan pengakuan dari orang-orang di sekitarnya.',
    more:
      "Naruto Uzumaki tumbuh sebagai ninja yang sering diremehkan dan dijauhi oleh penduduk desa. Meski begitu, ia tidak pernah menyerah dan terus berusaha membuktikan kemampuannya melalui kerja keras dan latihan tanpa henti. Seiring waktu, Naruto menjadi semakin kuat berkat tekadnya serta kekuatan Kurama yang ada di dalam dirinya. Ia berhasil menguasai berbagai teknik kuat seperti Rasengan dan Sage Mode, serta memainkan peran penting dalam banyak pertempuran besar.",
    accent: '#C2570B',
    accentSoft: 'rgba(194, 87, 11, 0.22)',
    image: '/characters/naruto.png',
    switchSound: '/sounds/switch/naruto.mp3',
    overview: {
      tagline: 'Tekad yang tak pernah padam, walau dunia meragukannya.',
      role: 'Jinchuriki & Calon Pemimpin Desa',
      stats: [
        { label: 'Asal', value: 'Konohagakure' },
        { label: 'Tim', value: 'Tim 7' },
        { label: 'Status', value: 'Jinchuriki Kurama' },
        { label: 'Jurus Andalan', value: 'Rasengan' },
      ],
      powers: [
        { label: 'Chakra', value: 97 },
        { label: 'Stamina', value: 95 },
        { label: 'Ninjutsu', value: 90 },
        { label: 'Strategi', value: 62 },
      ],
    },
    about: {
      quote: 'Aku tidak pernah menarik kembali ucapanku — itulah caraku menjalani hidup.',
    },
    info: {
      affiliation: 'Konohagakure',
      element: 'Angin',
      mentor: 'Jiraiya',
      status: 'Hokage',
      tags: ['Jinchuriki', 'Tim 7', 'Pantang Menyerah', 'Karismatik'],
    },
  },
  {
    id: 'sasuke',
    number: '03',
    eyebrow: 'Uchiha Sasuke',
    lines: ['Uchiha', 'Sasuke'],
    description:
      'Sasuke Uchiha adalah ninja jenius dari klan Uchiha yang dikenal memiliki kemampuan bertarung luar biasa dan Sharingan yang kuat. Ia memiliki tekad besar untuk membalas dendam atas tragedi yang menimpa keluarganya, yang membuatnya meninggalkan desa Konohagakure demi mencari kekuatan.',
    more:
      'Sasuke Uchiha adalah seorang ninja jenius dari klan Uchiha yang memiliki kemampuan bertarung luar biasa sejak usia muda. Setelah tragedi yang menimpa keluarganya, ia tumbuh dengan tekad kuat untuk membalas dendam kepada kakaknya, Itachi Uchiha. Dalam perjalanannya, Sasuke meninggalkan desa Konohagakure demi mengejar kekuatan yang lebih besar.',
    accent: '#4B2A85',
    accentSoft: 'rgba(75, 42, 133, 0.22)',
    image: '/characters/sasuke.png',
    switchSound: '/sounds/switch/sasuke.mp3',
    overview: {
      tagline: 'Membawa beban masa lalu, mencari cahaya di ujung jalan gelap.',
      role: 'Pengembara & Ahli Strategi Klan Uchiha',
      stats: [
        { label: 'Asal', value: 'Konohagakure' },
        { label: 'Klan', value: 'Uchiha' },
        { label: 'Status', value: 'Pengembara' },
        { label: 'Jurus Andalan', value: 'Chidori' },
      ],
      powers: [
        { label: 'Sharingan', value: 92 },
        { label: 'Kecepatan', value: 90 },
        { label: 'Ninjutsu Petir', value: 93 },
        { label: 'Strategi', value: 85 },
      ],
    },
    about: {
      quote:
        'Kekuatan bukan untuk membuktikan siapa yang paling kuat, tapi untuk melindungi apa yang tersisa.',
    },
    info: {
      affiliation: 'Klan Uchiha',
      element: 'Petir & Api',
      mentor: 'Tidak terikat — sempat berguru pada Orochimaru',
      status: 'Pengembara Independen',
      tags: ['Sharingan', 'Klan Uchiha', 'Penebusan', 'Soliter'],
    },
  },
  {
    id: 'kakashi',
    number: '04',
    eyebrow: 'Kakashi Hatake',
    lines: ['Hatake', 'Kakashi'],
    description:
      "Kakashi Hatake adalah seorang ninja elit dari Konohagakure yang dikenal sebagai “Copy Ninja” karena kemampuannya meniru berbagai teknik menggunakan Sharingan.",
    more:
      'Kakashi Hatake dikenal sebagai salah satu ninja paling berbakat di Konohagakure. Sejak usia muda, ia sudah menunjukkan kemampuan luar biasa dan menjadi anggota ANBU. Dengan Sharingan yang ia terima dari Obito Uchiha, Kakashi mampu menyalin ribuan teknik, sehingga mendapat julukan “Copy Ninja”.',
    accent: '#1B5C50',
    accentSoft: 'rgba(27, 92, 80, 0.22)',
    image: '/characters/kakashi.png',
    switchSound: '/sounds/switch/kakashi.mp3',
    overview: {
      tagline: 'Tenang di luar, penuh perhitungan di dalam.',
      role: 'Mantan ANBU & Pembimbing Tim 7',
      stats: [
        { label: 'Asal', value: 'Konohagakure' },
        { label: 'Tim', value: 'Pemimpin Tim 7' },
        { label: 'Status', value: 'Jonin Senior' },
        { label: 'Jurus Andalan', value: 'Raikiri' },
      ],
      powers: [
        { label: 'Sharingan', value: 90 },
        { label: 'Pengalaman', value: 98 },
        { label: 'Strategi', value: 96 },
        { label: 'Ninjutsu', value: 88 },
      ],
    },
    about: {
      quote: 'Rencana terbaik adalah yang masih bisa berubah tanpa kehilangan siapa pun.',
    },
    info: {
      affiliation: 'Konohagakure',
      element: 'Petir',
      mentor: 'Minato Namikaze',
      status: 'Jonin Senior',
      tags: ['Copy Ninja', 'Sharingan', 'Pembimbing', 'Tenang'],
    },
  },
];

const NAV_ITEMS = ['Home', 'Overview', 'About', 'Info'];

function PortraitFrame({ accent, reduceMotion }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-[6%] aspect-square w-[74%] -translate-x-1/2 rounded-full border-2"
      style={{ borderColor: accent, borderStyle: 'dashed', opacity: 0.35 }}
      animate={reduceMotion ? {} : { rotate: 360 }}
      transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
    />
  );
}

// ── Helper Sub-Components ─────────────────────────────────────────────
function GroundGlow({ accent }) {
  return (
    <motion.div
      className="pointer-events-none absolute bottom-[2%] left-1/2 h-[30%] w-[82%] -translate-x-1/2 rounded-[50%] blur-3xl"
      animate={{ background: accent }}
      transition={{ duration: 0.6 }}
      style={{ opacity: 0.45 }}
    />
  );
}

const DRIFT_SEEDS = [0.08, 0.22, 0.41, 0.57, 0.69, 0.84, 0.93];
function ParticleField({ accent, reduceMotion }) {
  if (reduceMotion) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {DRIFT_SEEDS.map((s, i) => {
        const left = `${(s * 86 + i * 5) % 90}%`;
        const size = 6 + (i % 3) * 3;
        const duration = 10 + s * 8;
        const delay = s * 4;
        const sway = i % 2 === 0 ? 18 : -18;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{ left, top: '-6%', width: size, height: size, background: accent, opacity: 0 }}
            animate={{ y: ['0%', '760%'], x: [0, sway, 0], opacity: [0, 0.55, 0] }}
            transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
          />
        );
      })}
    </div>
  );
}

function AmbientBackground({ accent, reduceMotion }) {
  const loop = (x, y, dur1, dur2) => ({
    animate: { background: accent, x: reduceMotion ? 0 : x, y: reduceMotion ? 0 : y },
    transition: {
      background: { duration: 0.6 },
      x: { duration: dur1, repeat: Infinity, ease: 'easeInOut' },
      y: { duration: dur2, repeat: Infinity, ease: 'easeInOut' },
    },
  });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full blur-3xl"
        {...loop([0, 30, 0], [0, -20, 0], 17, 19)}
      />
      <motion.div
        className="absolute right-[-12%] top-1/3 h-[360px] w-[360px] rounded-full blur-3xl"
        {...loop([0, -24, 0], [0, 22, 0], 20, 15)}
      />
      <motion.div
        className="absolute bottom-[-16%] left-1/3 h-[300px] w-[300px] rounded-full blur-3xl"
        animate={{ background: accent }}
        transition={{ duration: 0.6 }}
      />
    </div>
  );
}

function StatCell({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-[10px] uppercase tracking-[0.18em]"
        style={{ fontFamily: 'var(--font-mono)', color: MUTED }}
      >
        {label}
      </span>
      <span className="text-sm font-medium leading-snug" style={{ color: INK }}>
        {value}
      </span>
    </div>
  );
}

function StatBar({ label, value, accent }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="flex items-center justify-between text-xs"
        style={{ fontFamily: 'var(--font-mono)', color: MUTED }}
      >
        <span>{label}</span>
        <span style={{ color: accent, fontWeight: 700 }}>{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: TRACK }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: accent }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

function Tag({ label, accent }) {
  return (
    <span
      className="rounded-full border px-3 py-1 text-[11px] tracking-wide"
      style={{ borderColor: accent, color: accent, fontFamily: 'var(--font-mono)' }}
    >
      {label}
    </span>
  );
}

function ArrowButton({ direction, onClick, label }) {
  const path = direction === 'prev' ? 'M10,2 L4,8 L10,14' : 'M6,2 L12,8 L6,14';
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border transition-transform hover:scale-105 active:scale-95"
      style={{ borderColor: HAIRLINE, color: INK }}
    > 
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d={path} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// ── Panels ──────────────────────────────────────────────────────────────
function HomePanel({ character, onReadMore }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-md text-base leading-relaxed" style={{ color: MUTED }}>
        {character.description}
      </p>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onReadMore}
        className="w-fit rounded-full px-6 py-3 text-sm font-medium text-white shadow-sm"
        style={{ background: character.accent }}
      >
        Baca Profil Lengkap
      </motion.button>
    </div>
  );
}

function OverviewPanel({ character }) {
  const { tagline, role, stats, powers } = character.overview;
  return (
    <div className="flex max-w-md flex-col gap-6">
      <div>
        <p className="text-sm italic leading-relaxed" style={{ color: INK }}>
          “{tagline}”
        </p>
        <p
          className="mt-1 text-[11px] uppercase tracking-[0.16em]"
          style={{ fontFamily: 'var(--font-mono)', color: character.accent }}
        >
          {role}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {stats.map((s) => (
          <StatCell key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {powers.map((p) => (
          <StatBar key={p.label} label={p.label} value={p.value} accent={character.accent} />
        ))}
      </div>
    </div>
  );
}

function AboutPanel({ character }) {
  return (
    <div className="flex max-w-md flex-col gap-4">
      <div className="border-l-2 pl-4" style={{ borderColor: character.accent }}>
        <p className="text-sm italic leading-relaxed" style={{ color: INK }}>
          “{character.about.quote}”
        </p>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
        {character.more}
      </p>
    </div>
  );
}

function InfoPanel({ character }) {
  const { affiliation, element, mentor, status, tags } = character.info;
  return (
    <div className="flex max-w-md flex-col gap-5">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <StatCell label="Afiliasi" value={affiliation} />
        <StatCell label="Elemen" value={element} />
        <StatCell label="Mentor" value={mentor} />
        <StatCell label="Status" value={status} />
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <Tag key={t} label={t} accent={character.accent} />
        ))}
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────
export default function Page() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [navActive, setNavActive] = useState('Home');
  const reduceMotion = useReducedMotion();

  const currentSwitchSoundRef = useRef(null);

  useEffect(() => {
    return () => {
      if (currentSwitchSoundRef.current) {
        currentSwitchSoundRef.current.pause();
      }
    };
  }, []);

  const character = useMemo(() => CHARACTERS[index], [index]);

  const goTo = useCallback(
    (i) => {
      const next = (i + CHARACTERS.length) % CHARACTERS.length;
      if (next === index) return;
      
      const nextCharacter = CHARACTERS[next];

      if (typeof window !== 'undefined' && nextCharacter.switchSound) {
        if (currentSwitchSoundRef.current) {
          currentSwitchSoundRef.current.pause();
          currentSwitchSoundRef.current.currentTime = 0;
        }

        const audio = new Audio(nextCharacter.switchSound);
        audio.volume = 0.65; 
        currentSwitchSoundRef.current = audio;

        audio.play().catch((err) => {
          console.log("Audio play diblokir browser:", err);
        });
      }

      setDirection(next > index ? 1 : -1);
      setIndex(next);
    },
    [index]
  );

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight') goTo(index + 1);
      if (e.key === 'ArrowLeft') goTo(index - 1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, goTo]);

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mvY, [-1, 1], [10, -10]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(mvX, [-1, 1], [-10, 10]), { stiffness: 150, damping: 18 });

  const handlePortraitMove = useCallback(
    (e) => {
      if (!reduceMotion) {
        const rect = e.currentTarget.getBoundingClientRect();
        mvX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
        mvY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
      }
    },
    [reduceMotion, mvX, mvY]
  );

  const handlePortraitLeave = useCallback(() => {
    mvX.set(0);
    mvY.set(0);
  }, [mvX, mvY]);

  const textVariants = {
    enter: (dir) => ({ opacity: 0, x: reduceMotion ? 0 : dir > 0 ? 28 : -28 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: reduceMotion ? 0 : dir > 0 ? -28 : 28 }),
  };

  const imageVariants = {
    enter: (dir) => ({
      opacity: 0,
      scale: reduceMotion ? 1 : 0.8,
      rotate: reduceMotion ? 0 : dir > 0 ? 12 : -12,
      x: reduceMotion ? 0 : dir > 0 ? 40 : -40,
      clipPath: reduceMotion ? 'circle(75% at 50% 50%)' : 'circle(0% at 50% 50%)',
    }),
    center: { opacity: 1, scale: 1, rotate: 0, x: 0, clipPath: 'circle(75% at 50% 50%)' },
    exit: { opacity: 0, transition: { duration: 0.18, ease: 'easeOut' } },
  };

  return (
    <main
      className={`${display.variable} ${body.variable} ${mono.variable} relative min-h-screen overflow-hidden`}
      style={{
        background: 'linear-gradient(135deg, #F4F0FB 0%, #FBF8F3 58%, #F6EFE9 100%)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <AmbientBackground accent={character.accentSoft} reduceMotion={reduceMotion} />

      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-7 sm:px-10">
        <div className="flex shrink-0 items-center gap-3">
          <img src="/logo/konoha.png" alt="Logo" className="h-12 w-12" />
          <span className="text-lg font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: INK }}>
            チーム7
          </span>
        </div>

        <nav className="flex items-center gap-5 overflow-x-auto sm:gap-9">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => setNavActive(item)}
              className="relative shrink-0 pb-2 text-sm transition-colors"
              style={{ color: navActive === item ? INK : MUTED }}
            > 
              {item}
              {navActive === item && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-0 -bottom-0 h-[2px] rounded-full"
                  style={{ background: character.accent }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 pb-14 pt-6 sm:px-10 lg:grid-cols-2 lg:gap-10">
        <div className="relative order-2 flex flex-col gap-7 overflow-hidden lg:order-1">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-4 top-0 -z-10 select-none text-[200px] font-semibold leading-[0.8] sm:text-[240px]"
            style={{ fontFamily: 'var(--font-display)', color: character.accent, opacity: 0.06 }}
          >
            {character.number}
          </span>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={character.id}
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-wrap items-center gap-3 text-sm" style={{ fontFamily: 'var(--font-mono)', color: MUTED }}>
                <span style={{ color: character.accent, fontWeight: 700 }}>
                  {character.number}/04
                </span>
                <span className="tracking-[0.14em] uppercase text-xs">{character.eyebrow}</span>
                <span
                  className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
                  style={{ background: character.accentSoft, color: character.accent }}
                >
                  {character.info.status}
                </span>
              </div>

              <h1 className="text-5xl font-semibold leading-[1.05] sm:text-6xl" style={{ fontFamily: 'var(--font-display)', color: INK }}>
                {character.lines.map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>

              <AnimatePresence mode="wait">
                <motion.div
                  key={navActive}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {navActive === 'Home' && <HomePanel character={character} onReadMore={() => setNavActive('About')} />}
                  {navActive === 'Overview' && <OverviewPanel character={character} />}
                  {navActive === 'About' && <AboutPanel character={character} />}
                  {navActive === 'Info' && <InfoPanel character={character} />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          <div className="mt-2 flex flex-col gap-3">
            <div className="relative h-[2px] w-full max-w-[220px] overflow-hidden rounded-full" style={{ background: TRACK }}>
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: character.accent }}
                animate={{ width: `${((index + 1) / CHARACTERS.length) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
            <div className="flex items-center gap-5" role="tablist" aria-label="Choose a character">
              {CHARACTERS.map((c, i) => (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`View ${c.lines.join(' ')}`}
                  onClick={() => goTo(i)}
                  className="text-xs tracking-[0.16em] transition-colors"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: i === index ? INK : MUTED,
                    fontWeight: i === index ? 700 : 500,
                  }}
                >
                  {c.number}
                </button>
              ))}
              <div className="ml-1 flex items-center gap-2">
                <ArrowButton direction="prev" onClick={() => goTo(index - 1)} label="Previous character" />
                <ArrowButton direction="next" onClick={() => goTo(index + 1)} label="Next character" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative order-1 mx-auto aspect-[4/5] w-full max-w-[600px] lg:order-2"
          style={{ perspective: 1000 }}
          onMouseMove={handlePortraitMove}
          onMouseLeave={handlePortraitLeave}
        >
          <motion.div
            className="absolute inset-6 rounded-[50%] blur-3xl"
            animate={{ background: character.accent }}
            transition={{ duration: 0.6 }}
            style={{ opacity: 0.22 }}
          />
          <ParticleField accent={character.accent} reduceMotion={reduceMotion} />
          <PortraitFrame accent={character.accent} reduceMotion={reduceMotion} />
          <GroundGlow accent={character.accent} />

          <div
            className="absolute right-3 top-3 z-20 flex h-14 w-14 items-center justify-center rounded-full border-2 text-sm font-bold sm:h-16 sm:w-16"
            style={{
              borderColor: character.accent,
              color: character.accent,
              background: 'rgba(255,255,255,0.55)',
              fontFamily: 'var(--font-mono)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {character.number}
          </div>

          <motion.div className="relative z-10 h-full w-full" style={{ rotateX, rotateY }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={character.id}
                src={character.image}
                alt={character.lines.join(' ')}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full object-contain object-bottom"
                style={{
                  filter: 'drop-shadow(0 18px 36px rgba(0,0,0,0.28))',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 88%, transparent 99%)',
                  maskImage: 'linear-gradient(to bottom, black 0%, black 88%, transparent 99%)',
                }}
              />
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
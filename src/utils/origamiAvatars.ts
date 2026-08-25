/**
 * Origami Avatars Generator & Asset Library
 * Provides geometric folded-paper SVG avatars with faceted lighting, vibrant palettes, and origami animals/figures.
 */

export interface OrigamiAvatar {
  id: string;
  name: string;
  animal: string;
  primaryColor: string;
  secondaryColor: string;
  dataUri: string;
}

function svgToDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export const ORIGAMI_AVATARS: OrigamiAvatar[] = [
  {
    id: 'origami-crane-emerald',
    name: 'Emerald Crane (Tsuru)',
    animal: 'Peace Crane',
    primaryColor: '#10b981',
    secondaryColor: '#064e3b',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <defs>
          <linearGradient id="g-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#064e3b"/>
            <stop offset="100%" stop-color="#022c22"/>
          </linearGradient>
          <linearGradient id="g-wing-l" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#34d399"/>
            <stop offset="100%" stop-color="#059669"/>
          </linearGradient>
          <linearGradient id="g-wing-r" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6ee7b7"/>
            <stop offset="100%" stop-color="#10b981"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#g-bg)" stroke="#10b981" stroke-width="2"/>
        <!-- Background fold shadows -->
        <polygon points="60,25 35,65 60,85 85,65" fill="#047857" opacity="0.6"/>
        <!-- Left Wing -->
        <polygon points="60,55 15,35 45,75" fill="url(#g-wing-l)"/>
        <!-- Right Wing -->
        <polygon points="60,55 105,35 75,75" fill="url(#g-wing-r)"/>
        <!-- Body Center Diamond -->
        <polygon points="60,38 48,70 60,95 72,70" fill="#a7f3d0"/>
        <!-- Fold Spine & Shadow -->
        <polygon points="60,38 60,95 48,70" fill="#059669" opacity="0.4"/>
        <polygon points="60,38 60,95 72,70" fill="#ecfdf5" opacity="0.6"/>
        <!-- Neck & Head -->
        <polygon points="60,45 42,22 46,20 60,38" fill="#34d399"/>
        <polygon points="42,22 36,25 44,28" fill="#10b981"/>
        <!-- Tail -->
        <polygon points="60,78 78,98 74,102 60,88" fill="#059669"/>
      </svg>
    `),
  },
  {
    id: 'origami-fox-amber',
    name: 'Amber Fox (Kitsune)',
    animal: 'Clever Fox',
    primaryColor: '#f59e0b',
    secondaryColor: '#78350f',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <defs>
          <linearGradient id="fox-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#451a03"/>
            <stop offset="100%" stop-color="#1e0b02"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#fox-bg)" stroke="#f59e0b" stroke-width="2"/>
        <!-- Left Ear Outer -->
        <polygon points="30,55 22,20 52,38" fill="#d97706"/>
        <!-- Left Ear Inner -->
        <polygon points="32,50 26,26 48,40" fill="#fef3c7"/>
        <!-- Right Ear Outer -->
        <polygon points="90,55 98,20 68,38" fill="#f59e0b"/>
        <!-- Right Ear Inner -->
        <polygon points="88,50 94,26 72,40" fill="#fffbeb"/>
        <!-- Forehead Diamond -->
        <polygon points="60,32 40,55 60,72 80,55" fill="#fbbf24"/>
        <polygon points="60,32 40,55 60,72" fill="#d97706" opacity="0.35"/>
        <!-- Left Cheek -->
        <polygon points="40,55 24,72 60,88 60,72" fill="#fef3c7"/>
        <!-- Right Cheek -->
        <polygon points="80,55 96,72 60,88 60,72" fill="#ffffff"/>
        <!-- Snout / Nose -->
        <polygon points="60,72 52,88 60,98 68,88" fill="#b45309"/>
        <!-- Nose Tip -->
        <polygon points="57,94 63,94 60,99" fill="#1c1917"/>
        <!-- Eyes -->
        <polygon points="44,60 52,64 45,67" fill="#1c1917"/>
        <polygon points="76,60 68,64 75,67" fill="#1c1917"/>
      </svg>
    `),
  },
  {
    id: 'origami-butterfly-violet',
    name: 'Cosmic Butterfly',
    animal: 'Morpho Butterfly',
    primaryColor: '#8b5cf6',
    secondaryColor: '#3b0764',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <defs>
          <linearGradient id="bf-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2e1065"/>
            <stop offset="100%" stop-color="#0f0728"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bf-bg)" stroke="#a855f7" stroke-width="2"/>
        <!-- Top Left Wing Outer -->
        <polygon points="60,55 15,22 45,65" fill="#7c3aed"/>
        <polygon points="60,55 15,22 35,45" fill="#a855f7"/>
        <!-- Top Right Wing Outer -->
        <polygon points="60,55 105,22 75,65" fill="#c084fc"/>
        <polygon points="60,55 105,22 85,45" fill="#e9d5ff"/>
        <!-- Bottom Left Wing -->
        <polygon points="60,65 25,92 52,80" fill="#6d28d9"/>
        <!-- Bottom Right Wing -->
        <polygon points="60,65 95,92 68,80" fill="#9333ea"/>
        <!-- Center Folded Body -->
        <polygon points="60,30 55,60 60,95 65,60" fill="#f3e8ff"/>
        <polygon points="60,30 55,60 60,95" fill="#a855f7" opacity="0.5"/>
        <!-- Antennae -->
        <polygon points="60,34 50,18 53,16 60,30" fill="#e9d5ff"/>
        <polygon points="60,34 70,18 67,16 60,30" fill="#f3e8ff"/>
      </svg>
    `),
  },
  {
    id: 'origami-dragon-cyan',
    name: 'Celeste Dragon',
    animal: 'Mythic Wyrm',
    primaryColor: '#06b6d4',
    secondaryColor: '#083344',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <defs>
          <linearGradient id="dg-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#083344"/>
            <stop offset="100%" stop-color="#02141c"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#dg-bg)" stroke="#06b6d4" stroke-width="2"/>
        <!-- Left Wing -->
        <polygon points="60,55 12,30 38,72" fill="#0891b2"/>
        <polygon points="12,30 28,52 38,72" fill="#0e7490"/>
        <!-- Right Wing -->
        <polygon points="60,55 108,30 82,72" fill="#22d3ee"/>
        <polygon points="108,30 92,52 82,72" fill="#67e8f9"/>
        <!-- Crest Horns -->
        <polygon points="60,38 48,15 56,32" fill="#06b6d4"/>
        <polygon points="60,38 72,15 64,32" fill="#a5f3fc"/>
        <!-- Dragon Snout -->
        <polygon points="60,35 48,58 60,82 72,58" fill="#0891b2"/>
        <polygon points="60,35 60,82 72,58" fill="#22d3ee"/>
        <!-- Jaw & Underbelly -->
        <polygon points="60,82 52,98 60,105 68,98" fill="#cffafe"/>
        <polygon points="60,82 52,98 60,105" fill="#06b6d4" opacity="0.5"/>
        <!-- Eyes -->
        <polygon points="50,54 56,58 52,60" fill="#facc15"/>
        <polygon points="70,54 64,58 68,60" fill="#facc15"/>
      </svg>
    `),
  },
  {
    id: 'origami-bunny-rose',
    name: 'Sakura Bunny',
    animal: 'Paper Rabbit',
    primaryColor: '#f43f5e',
    secondaryColor: '#4c0519',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <defs>
          <linearGradient id="bn-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4c0519"/>
            <stop offset="100%" stop-color="#1f020a"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bn-bg)" stroke="#fb7185" stroke-width="2"/>
        <!-- Left Ear -->
        <polygon points="46,55 32,15 52,40" fill="#f43f5e"/>
        <polygon points="42,50 36,22 48,42" fill="#ffe4e6"/>
        <!-- Right Ear -->
        <polygon points="74,55 88,15 68,40" fill="#fb7185"/>
        <polygon points="78,50 84,22 72,42" fill="#fff1f2"/>
        <!-- Head Main -->
        <polygon points="60,42 38,65 60,88 82,65" fill="#fda4af"/>
        <polygon points="60,42 38,65 60,88" fill="#e11d48" opacity="0.3"/>
        <!-- Cheeks -->
        <polygon points="38,65 30,82 60,98 60,88" fill="#ffe4e6"/>
        <polygon points="82,65 90,82 60,98 60,88" fill="#ffffff"/>
        <!-- Nose -->
        <polygon points="57,84 63,84 60,88" fill="#9f1239"/>
        <!-- Eyes -->
        <polygon points="45,68 50,70 46,73" fill="#881337"/>
        <polygon points="75,68 70,70 74,73" fill="#881337"/>
      </svg>
    `),
  },
  {
    id: 'origami-frog-lime',
    name: 'Zen Frog',
    animal: 'Pond Jumper',
    primaryColor: '#84cc16',
    secondaryColor: '#1a2e05',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <defs>
          <linearGradient id="fr-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#14532d"/>
            <stop offset="100%" stop-color="#052e16"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#fr-bg)" stroke="#84cc16" stroke-width="2"/>
        <!-- Back Legs -->
        <polygon points="30,70 12,88 38,92" fill="#4d7c0f"/>
        <polygon points="90,70 108,88 82,92" fill="#65a30d"/>
        <!-- Body Diamond -->
        <polygon points="60,30 32,62 60,95 88,62" fill="#84cc16"/>
        <polygon points="60,30 32,62 60,95" fill="#4d7c0f" opacity="0.4"/>
        <!-- Front Eyes Triangles -->
        <polygon points="42,32 35,20 48,26" fill="#a3e635"/>
        <polygon points="78,32 85,20 72,26" fill="#bef264"/>
        <circle cx="42" cy="25" r="3" fill="#14532d"/>
        <circle cx="78" cy="25" r="3" fill="#14532d"/>
        <!-- Belly fold -->
        <polygon points="60,55 45,75 60,90 75,75" fill="#ecfccb"/>
        <polygon points="60,55 45,75 60,90" fill="#a3e635" opacity="0.5"/>
      </svg>
    `),
  },
  {
    id: 'origami-owl-indigo',
    name: 'Wisdom Owl',
    animal: 'Scholar Owl',
    primaryColor: '#6366f1',
    secondaryColor: '#1e1b4b',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <defs>
          <linearGradient id="ow-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="100%" stop-color="#090524"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#ow-bg)" stroke="#818cf8" stroke-width="2"/>
        <!-- Ear Tufts -->
        <polygon points="35,45 28,18 48,32" fill="#4f46e5"/>
        <polygon points="85,45 92,18 72,32" fill="#6366f1"/>
        <!-- Head & Wings -->
        <polygon points="60,30 22,65 60,102 98,65" fill="#4338ca"/>
        <!-- Left Wing Fold -->
        <polygon points="22,65 42,95 60,102" fill="#3730a3"/>
        <!-- Right Wing Fold -->
        <polygon points="98,65 78,95 60,102" fill="#6366f1"/>
        <!-- Chest Feathers -->
        <polygon points="60,52 46,75 60,95 74,75" fill="#e0e7ff"/>
        <polygon points="60,52 46,75 60,95" fill="#a5b4fc" opacity="0.6"/>
        <!-- Eyes Background Diamonds -->
        <polygon points="44,45 34,55 44,65 54,55" fill="#fef08a"/>
        <polygon points="76,45 66,55 76,65 86,55" fill="#fef08a"/>
        <circle cx="44" cy="55" r="4.5" fill="#1e1b4b"/>
        <circle cx="76" cy="55" r="4.5" fill="#1e1b4b"/>
        <!-- Beak -->
        <polygon points="56,58 64,58 60,68" fill="#f59e0b"/>
      </svg>
    `),
  },
  {
    id: 'origami-peacock-teal',
    name: 'Prism Peacock',
    animal: 'Royal Peacock',
    primaryColor: '#14b8a6',
    secondaryColor: '#042f2e',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <defs>
          <linearGradient id="pc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#042f2e"/>
            <stop offset="100%" stop-color="#021716"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#pc-bg)" stroke="#2dd4bf" stroke-width="2"/>
        <!-- Fan Feathers -->
        <polygon points="60,65 18,32 38,20" fill="#0d9488"/>
        <polygon points="60,65 38,20 60,15" fill="#14b8a6"/>
        <polygon points="60,65 60,15 82,20" fill="#2dd4bf"/>
        <polygon points="60,65 82,20 102,32" fill="#5eead4"/>
        <!-- Body -->
        <polygon points="60,45 50,75 60,105 70,75" fill="#0f766e"/>
        <polygon points="60,45 60,105 70,75" fill="#2dd4bf"/>
        <!-- Head -->
        <polygon points="60,35 55,48 65,48" fill="#ccfbf1"/>
        <polygon points="60,35 52,38 60,42" fill="#f59e0b"/>
        <!-- Eye -->
        <circle cx="58" cy="42" r="1.5" fill="#042f2e"/>
      </svg>
    `),
  },
  {
    id: 'origami-boat-ocean',
    name: 'Voyager Boat',
    animal: 'Origami Sailboat',
    primaryColor: '#38bdf8',
    secondaryColor: '#082f49',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <defs>
          <linearGradient id="bt-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#082f49"/>
            <stop offset="100%" stop-color="#021422"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bt-bg)" stroke="#38bdf8" stroke-width="2"/>
        <!-- Large Main Sail -->
        <polygon points="58,20 58,68 25,68" fill="#38bdf8"/>
        <polygon points="58,20 58,68 45,45" fill="#0284c7"/>
        <!-- Right Jib Sail -->
        <polygon points="62,32 62,68 92,68" fill="#e0f2fe"/>
        <polygon points="62,32 62,68 76,55" fill="#bae6fd"/>
        <!-- Hull Base -->
        <polygon points="20,74 100,74 85,94 35,94" fill="#0284c7"/>
        <polygon points="20,74 60,74 55,94 35,94" fill="#0369a1"/>
        <polygon points="60,74 100,74 85,94 55,94" fill="#38bdf8"/>
        <!-- Water ripples -->
        <polygon points="15,96 45,96 40,100 20,100" fill="#0ea5e9" opacity="0.7"/>
        <polygon points="55,97 95,97 90,101 60,101" fill="#7dd3fc" opacity="0.8"/>
      </svg>
    `),
  },
  {
    id: 'origami-cat-ruby',
    name: 'Ruby Kitten',
    animal: 'Origami Cat',
    primaryColor: '#e11d48',
    secondaryColor: '#4c0519',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <defs>
          <linearGradient id="ct-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4c0519"/>
            <stop offset="100%" stop-color="#1a0208"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#ct-bg)" stroke="#fb7185" stroke-width="2"/>
        <!-- Left Ear -->
        <polygon points="35,50 25,22 55,36" fill="#be123c"/>
        <polygon points="35,46 30,28 50,38" fill="#ffe4e6"/>
        <!-- Right Ear -->
        <polygon points="85,50 95,22 65,36" fill="#e11d48"/>
        <polygon points="85,46 90,28 70,38" fill="#fff1f2"/>
        <!-- Face Diamond -->
        <polygon points="60,38 35,62 60,88 85,62" fill="#fb7185"/>
        <polygon points="60,38 35,62 60,88" fill="#be123c" opacity="0.35"/>
        <!-- Cheeks -->
        <polygon points="35,62 25,78 60,94 60,88" fill="#ffe4e6"/>
        <polygon points="85,62 95,78 60,94 60,88" fill="#ffffff"/>
        <!-- Nose -->
        <polygon points="57,80 63,80 60,85" fill="#881337"/>
        <!-- Eyes -->
        <polygon points="44,62 50,65 45,68" fill="#1e1b4b"/>
        <polygon points="76,62 70,65 75,68" fill="#1e1b4b"/>
      </svg>
    `),
  },
  {
    id: 'origami-lotus-magenta',
    name: 'Lotus Blossom',
    animal: 'Origami Lotus',
    primaryColor: '#d946ef',
    secondaryColor: '#4a044e',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <defs>
          <linearGradient id="lt-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4a044e"/>
            <stop offset="100%" stop-color="#1e0120"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#lt-bg)" stroke="#e879f9" stroke-width="2"/>
        <!-- Outer Left Petal -->
        <polygon points="60,75 15,50 38,80" fill="#a21caf"/>
        <!-- Outer Right Petal -->
        <polygon points="60,75 105,50 82,80" fill="#c026d3"/>
        <!-- Middle Left Petal -->
        <polygon points="60,75 28,32 50,68" fill="#d946ef"/>
        <!-- Middle Right Petal -->
        <polygon points="60,75 92,32 70,68" fill="#f0abfc"/>
        <!-- Center Crown Petal -->
        <polygon points="60,20 48,65 60,82 72,65" fill="#fae8ff"/>
        <polygon points="60,20 48,65 60,82" fill="#e879f9" opacity="0.5"/>
        <!-- Base Leaves -->
        <polygon points="60,82 28,95 60,105 92,95" fill="#047857"/>
        <polygon points="60,82 28,95 60,105" fill="#065f46"/>
      </svg>
    `),
  },
  {
    id: 'origami-elephant-slate',
    name: 'Grand Elephant',
    animal: 'Origami Elephant',
    primaryColor: '#94a3b8',
    secondaryColor: '#0f172a',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <defs>
          <linearGradient id="el-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e293b"/>
            <stop offset="100%" stop-color="#090d16"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#el-bg)" stroke="#cbd5e1" stroke-width="2"/>
        <!-- Left Ear Flap -->
        <polygon points="45,45 15,35 25,75" fill="#64748b"/>
        <!-- Right Ear Flap -->
        <polygon points="75,45 105,35 95,75" fill="#94a3b8"/>
        <!-- Forehead -->
        <polygon points="60,30 38,55 60,75 82,55" fill="#cbd5e1"/>
        <polygon points="60,30 38,55 60,75" fill="#64748b" opacity="0.4"/>
        <!-- Trunk Segments -->
        <polygon points="54,75 66,75 64,92 56,92" fill="#94a3b8"/>
        <polygon points="56,92 64,92 68,102 60,105 52,100" fill="#e2e8f0"/>
        <!-- Tusks -->
        <polygon points="48,78 36,88 48,84" fill="#f8fafc"/>
        <polygon points="72,78 84,88 72,84" fill="#f8fafc"/>
        <!-- Eyes -->
        <circle cx="48" cy="54" r="2.5" fill="#0f172a"/>
        <circle cx="72" cy="54" r="2.5" fill="#0f172a"/>
      </svg>
    `),
  },
];

/**
 * Returns a random Origami avatar Data URI
 */
export function getRandomOrigamiAvatar(): string {
  const randomIndex = Math.floor(Math.random() * ORIGAMI_AVATARS.length);
  return ORIGAMI_AVATARS[randomIndex].dataUri;
}

/**
 * Returns a deterministic origami avatar based on a string seed (e.g. name or email)
 */
export function getOrigamiAvatarForSeed(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % ORIGAMI_AVATARS.length;
  return ORIGAMI_AVATARS[index].dataUri;
}

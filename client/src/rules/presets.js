// Färdiga profiler som följer med appen. Användarens egna profiler
// sparas separat (localStorage i v1, databasen i v2).

const protectSpecials = {
  shiny: true,
  lucky: true,
  legendary: true,
  mythical: true,
  shadow: true,
  purified: true,
  costume: true,
  dynamax: true,
  traded: false,
  hatched: false,
}

export const PRESETS = [
  {
    id: 'preset-standard',
    name: 'Min standard',
    description: 'Vanliga under 3 stjärnor åker. Allt speciellt och allt taggat "Best" stannar.',
    stars: [0, 1, 2],
    exclude: { ...protectSpecials },
    protectedTags: ['Best'],
    protectAllTags: false,
    maxCp: null,
  },
  {
    id: 'preset-community-day',
    name: 'Inför Community Day',
    description: 'Gör plats snabbt. Bara riktigt dåliga och lågt CP, tradade och kläckta skyddas också.',
    stars: [0, 1],
    exclude: { ...protectSpecials, traded: true, hatched: true },
    protectedTags: ['Best'],
    protectAllTags: false,
    maxCp: 1500,
  },
  {
    id: 'preset-panic',
    name: 'Panikrensning',
    description: 'Boxen är full och raiden startar om 2 minuter. Allt taggat skyddas, resten får gå.',
    stars: [0, 1, 2, 3],
    exclude: { ...protectSpecials },
    protectedTags: [],
    protectAllTags: true,
    maxCp: null,
  },
]

export function emptyProfile() {
  return {
    id: null,
    name: 'Ny profil',
    description: '',
    stars: [0, 1, 2],
    exclude: { ...protectSpecials },
    protectedTags: [],
    protectAllTags: false,
    maxCp: null,
  }
}

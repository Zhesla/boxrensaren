// Nyckelord som spelets sökruta förstår (engelska språkinställningen i spelet).
// Varje nyckelord kan uteslutas med "!" framför, t.ex. "!shiny".
//
// I version 2 kan den här listan flyttas till databasen så att den
// kan uppdateras utan ny deploy när Niantic lägger till nya nyckelord.
export const EXCLUDE_KEYWORDS = [
  { id: 'shiny', label: 'Shiny', keyword: 'shiny' },
  { id: 'lucky', label: 'Lucky', keyword: 'lucky' },
  { id: 'legendary', label: 'Legendariska', keyword: 'legendary' },
  { id: 'mythical', label: 'Mytiska', keyword: 'mythical' },
  { id: 'shadow', label: 'Shadow', keyword: 'shadow' },
  { id: 'purified', label: 'Purified', keyword: 'purified' },
  { id: 'costume', label: 'Kostymer', keyword: 'costume' },
  { id: 'dynamax', label: 'Dynamax', keyword: 'dynamax' },
  { id: 'traded', label: 'Tradade', keyword: 'traded' },
  { id: 'hatched', label: 'Kläckta', keyword: 'hatched' },
]

// Stjärnbetyg från appraisal: 0* till 4* (4* = perfekta 100 % IV)
export const STAR_LEVELS = [0, 1, 2, 3, 4]

// Tecken som har specialbetydelse i sökrutan och därför inte får finnas i taggnamn
export const RESERVED_CHARS = /[&|,;:!#*+@\-]/g

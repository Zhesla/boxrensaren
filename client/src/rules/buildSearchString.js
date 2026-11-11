import { EXCLUDE_KEYWORDS, STAR_LEVELS, RESERVED_CHARS } from './keywords.js'

/**
 * En regelprofil ser ut så här. Samma form sparas i databasen i version 2.
 *
 * {
 *   name: 'Min standard',
 *   stars: [0, 1, 2],              // vilka stjärnnivåer som FÅR transfereras
 *   exclude: { shiny: true, ... },  // nyckelord som skyddas (blir !shiny osv.)
 *   protectedTags: ['Best'],        // egna taggar som skyddas (blir !#Best)
 *   protectAllTags: false,          // true = skydda allt som har någon tagg (!#)
 *   maxCp: null,                    // valfritt tak, t.ex. 1500 → cp-1500
 * }
 */

/** Tar bort tecken som skulle förstöra söksträngen och trimmar mellanslag. */
export function sanitizeTag(tag) {
  return String(tag ?? '').replace(RESERVED_CHARS, '').trim()
}

/**
 * Bygger en söksträng av en regelprofil.
 *
 * I spelet gäller: "," betyder ELLER och "&" betyder OCH,
 * och kommatecken binds hårdare än &. Alltså tolkas
 * "0*,1*,2*&!shiny" som (0* ELLER 1* ELLER 2*) OCH inte shiny.
 *
 * Funktionen är "ren" (inga sidoeffekter), vilket gör den lätt att testa
 * och lätt att återanvända i backend i version 2.
 *
 * @returns {{ searchString: string, warnings: string[] }}
 */
export function buildSearchString(profile) {
  const warnings = []
  const parts = []

  // 1. Stjärnor – sorterade och utan dubbletter
  const stars = [...new Set(profile?.stars ?? [])]
    .filter((s) => STAR_LEVELS.includes(s))
    .sort((a, b) => a - b)

  if (stars.length === 0) {
    warnings.push(
      'Ingen stjärnnivå vald. Strängen träffar ALLA stjärnnivåer – dina bästa Pokémon står på tur.',
    )
  } else if (stars.length < STAR_LEVELS.length) {
    parts.push(stars.map((s) => `${s}*`).join(','))
  } else {
    warnings.push('Alla stjärnnivåer är valda, så stjärnfiltret gör ingenting.')
  }

  if (stars.includes(4)) {
    warnings.push('Du har med 4* (100 % IV). Är du säker på att du vill kunna transferera hundos?')
  }
  if (stars.includes(3)) {
    warnings.push('3* är med. Kolla PvP-värdet innan du trycker – låga IV kan vara guld i Great League.')
  }

  // 2. CP-tak
  const maxCp = Number(profile?.maxCp)
  if (Number.isInteger(maxCp) && maxCp > 0) {
    parts.push(`cp-${maxCp}`)
  }

  // 3. Skyddade nyckelord
  for (const { id, keyword } of EXCLUDE_KEYWORDS) {
    if (profile?.exclude?.[id]) parts.push(`!${keyword}`)
  }

  // 4. Taggar
  if (profile?.protectAllTags) {
    parts.push('!#')
  } else {
    const tags = [...new Set((profile?.protectedTags ?? []).map(sanitizeTag).filter(Boolean))]
    for (const tag of tags) parts.push(`!#${tag}`)
  }

  // 5. Vettighetskontroller på det som skyddas
  const ex = profile?.exclude ?? {}
  if (!ex.legendary || !ex.mythical) {
    warnings.push('Legendariska eller mytiska är inte skyddade. Det är så man förlorar en Mewtwo.')
  }
  if (!ex.shiny) {
    warnings.push('Shinies är inte skyddade. Mörkt, även för dig.')
  }

  return { searchString: parts.join('&'), warnings }
}

import { describe, it, expect } from 'vitest'
import { buildSearchString, sanitizeTag } from './buildSearchString.js'
import { PRESETS } from './presets.js'

const base = {
  stars: [0, 1, 2],
  exclude: { shiny: true, legendary: true, mythical: true },
  protectedTags: [],
  protectAllTags: false,
  maxCp: null,
}

describe('buildSearchString', () => {
  it('bygger stjärnor med komma och skydd med &', () => {
    const { searchString } = buildSearchString(base)
    expect(searchString).toBe('0*,1*,2*&!shiny&!legendary&!mythical')
  })

  it('sorterar stjärnor och tar bort dubbletter', () => {
    const { searchString } = buildSearchString({ ...base, stars: [2, 0, 2, 1] })
    expect(searchString.startsWith('0*,1*,2*')).toBe(true)
  })

  it('ignorerar ogiltiga stjärnvärden', () => {
    const { searchString } = buildSearchString({ ...base, stars: [1, 7, -1] })
    expect(searchString.startsWith('1*&')).toBe(true)
  })

  it('varnar när inga stjärnor är valda', () => {
    const { warnings } = buildSearchString({ ...base, stars: [] })
    expect(warnings.some((w) => w.includes('ALLA stjärnnivåer'))).toBe(true)
  })

  it('utelämnar stjärnfiltret när alla nivåer är valda', () => {
    const { searchString } = buildSearchString({ ...base, stars: [0, 1, 2, 3, 4] })
    expect(searchString).not.toContain('*')
  })

  it('varnar för hundos', () => {
    const { warnings } = buildSearchString({ ...base, stars: [4] })
    expect(warnings.some((w) => w.includes('hundos'))).toBe(true)
  })

  it('lägger till CP-tak', () => {
    const { searchString } = buildSearchString({ ...base, maxCp: 1500 })
    expect(searchString).toContain('&cp-1500')
  })

  it('ignorerar ogiltigt CP-tak', () => {
    for (const maxCp of [0, -5, 'abc', 12.5, null]) {
      expect(buildSearchString({ ...base, maxCp }).searchString).not.toContain('cp')
    }
  })

  it('skyddar egna taggar', () => {
    const { searchString } = buildSearchString({ ...base, protectedTags: ['Best', 'PvP'] })
    expect(searchString).toContain('&!#Best&!#PvP')
  })

  it('skyddar alla taggar med !# och ignorerar då enskilda taggar', () => {
    const { searchString } = buildSearchString({
      ...base,
      protectAllTags: true,
      protectedTags: ['Best'],
    })
    expect(searchString.endsWith('&!#')).toBe(true)
    expect(searchString).not.toContain('!#Best')
  })

  it('varnar när shinies inte är skyddade', () => {
    const { warnings } = buildSearchString({ ...base, exclude: { legendary: true, mythical: true } })
    expect(warnings.some((w) => w.includes('Shinies'))).toBe(true)
  })

  it('kraschar inte på tom eller saknad profil', () => {
    expect(() => buildSearchString(undefined)).not.toThrow()
    expect(() => buildSearchString({})).not.toThrow()
  })

  it('profilen "Min standard" ger förväntad sträng', () => {
    const { searchString } = buildSearchString(PRESETS[0])
    expect(searchString).toBe(
      '0*,1*,2*&!shiny&!lucky&!legendary&!mythical&!shadow&!purified&!costume&!dynamax&!#Best',
    )
  })
})

describe('sanitizeTag', () => {
  it('tar bort tecken som förstör söksträngen', () => {
    expect(sanitizeTag('Be&st,!#')).toBe('Best')
  })

  it('trimmar mellanslag och klarar null', () => {
    expect(sanitizeTag('  PvP  ')).toBe('PvP')
    expect(sanitizeTag(null)).toBe('')
  })

  it('blockerar försök att smyga in egna operatorer via taggnamn', () => {
    // En tagg som "x&shiny" får inte kunna ändra logiken i strängen
    expect(sanitizeTag('x&shiny')).toBe('xshiny')
  })
})

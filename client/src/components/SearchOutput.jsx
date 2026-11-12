import { useState } from 'react'
import { ChevronRight, Check } from './Icons.jsx'

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Reserv för äldre webbläsare / osäkra sammanhang (http)
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  }
}

// Räknar hur mycket profilen skyddar – visas som stora siffror i resultatrutan
function countProtected(profile) {
  const keywords = Object.values(profile?.exclude ?? {}).filter(Boolean).length
  const tags = profile?.protectAllTags ? 1 : (profile?.protectedTags ?? []).length
  return keywords + tags
}

// [0, 1, 2] blir "0–2★", [0, 2] blir "0, 2★" – kort nog för att få plats på mobilen
function formatStars(stars) {
  if (stars.length === 0) return '–'
  const consecutive = stars.every((s, i) => i === 0 || s === stars[i - 1] + 1)
  if (stars.length > 1 && consecutive) return `${stars[0]}–${stars.at(-1)}★`
  return `${stars.join(', ')}★`
}

export default function SearchOutput({ profile, searchString, warnings }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!searchString) return
    const ok = await copyText(searchString)
    setCopied(ok)
    setTimeout(() => setCopied(false), 2000)
  }

  const stars = [...new Set(profile?.stars ?? [])].sort((a, b) => a - b)

  return (
    <div className="output">
      <div className="stats">
        <div className="stat">
          <span className="stat-value">{countProtected(profile)}</span>
          <span className="stat-label">skydd aktiva</span>
        </div>
        <div className="stat">
          <span className="stat-value">{formatStars(stars)}</span>
          <span className="stat-label">får transfereras</span>
        </div>
      </div>

      <div className="result-box">
        <span className="result-label">Din söksträng</span>
        <code className="search-string">{searchString || '(tom – välj några regler)'}</code>
      </div>

      <button type="button" className="pill-btn icon wide" onClick={handleCopy} disabled={!searchString}>
        <span className="pill-icon">{copied ? <Check /> : <ChevronRight />}</span>
        {copied ? 'Kopierad!' : 'Kopiera strängen'}
      </button>

      {warnings.length > 0 && (
        <ul className="warnings">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}

      <details className="howto" id="sa-funkar-det">
        <summary>Så använder du den</summary>
        <ol>
          <li>Kopiera strängen.</li>
          <li>Öppna Pokémon-listan i spelet och tryck på sökrutan.</li>
          <li>Klistra in. Spelet visar bara de som får transfereras.</li>
          <li>Håll inne på en Pokémon, välj alla och transferera.</li>
          <li>Skumma ändå igenom listan. Koden är bra, men inte så bra att du ska lita blint på den.</li>
        </ol>
        <p className="hint">Nyckelorden gäller när spelet är på engelska.</p>
      </details>
    </div>
  )
}

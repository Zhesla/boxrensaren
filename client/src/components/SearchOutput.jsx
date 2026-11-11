import { useState } from 'react'

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

export default function SearchOutput({ searchString, warnings }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!searchString) return
    const ok = await copyText(searchString)
    setCopied(ok)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="output">
      <h2 className="label">Din söksträng</h2>
      <code className="search-string">{searchString || '(tom – välj några regler)'}</code>

      <button type="button" className="btn primary wide" onClick={handleCopy} disabled={!searchString}>
        {copied ? 'Kopierad!' : 'Kopiera'}
      </button>

      {warnings.length > 0 && (
        <ul className="warnings">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}

      <details className="howto">
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

import { useState } from 'react'
import { EXCLUDE_KEYWORDS, STAR_LEVELS } from '../rules/keywords.js'
import { sanitizeTag } from '../rules/buildSearchString.js'

export default function RuleForm({ profile, onChange }) {
  const [tagInput, setTagInput] = useState('')

  // Hjälpfunktion: uppdatera ett fält och behåll resten av profilen
  const update = (patch) => onChange({ ...profile, ...patch })

  function toggleStar(star) {
    const stars = profile.stars.includes(star)
      ? profile.stars.filter((s) => s !== star)
      : [...profile.stars, star]
    update({ stars })
  }

  function toggleExclude(id) {
    update({ exclude: { ...profile.exclude, [id]: !profile.exclude?.[id] } })
  }

  function addTag(e) {
    e.preventDefault()
    const tag = sanitizeTag(tagInput)
    if (!tag || profile.protectedTags.includes(tag)) return setTagInput('')
    update({ protectedTags: [...profile.protectedTags, tag] })
    setTagInput('')
  }

  function removeTag(tag) {
    update({ protectedTags: profile.protectedTags.filter((t) => t !== tag) })
  }

  function handleCp(e) {
    const value = e.target.value
    update({ maxCp: value === '' ? null : Math.max(0, parseInt(value, 10) || 0) })
  }

  return (
    <div className="form">
      <div className="field">
        <label htmlFor="profile-name" className="label">Namn</label>
        <input
          id="profile-name"
          type="text"
          maxLength={40}
          value={profile.name}
          onChange={(e) => update({ name: e.target.value })}
        />
      </div>

      <fieldset className="field">
        <legend className="label">Får transfereras – stjärnor</legend>
        <div className="chips">
          {STAR_LEVELS.map((star) => (
            <label key={star} className={`chip ${profile.stars.includes(star) ? 'on' : ''}`}>
              <input
                type="checkbox"
                checked={profile.stars.includes(star)}
                onChange={() => toggleStar(star)}
              />
              {star}★
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend className="label">Skydda alltid</legend>
        <div className="chips">
          {EXCLUDE_KEYWORDS.map(({ id, label }) => (
            <label key={id} className={`chip ${profile.exclude?.[id] ? 'on' : ''}`}>
              <input
                type="checkbox"
                checked={!!profile.exclude?.[id]}
                onChange={() => toggleExclude(id)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend className="label">Skyddade taggar</legend>
        <label className="check">
          <input
            type="checkbox"
            checked={profile.protectAllTags}
            onChange={() => update({ protectAllTags: !profile.protectAllTags })}
          />
          Skydda allt som har någon tagg
        </label>

        {!profile.protectAllTags && (
          <>
            <form className="row" onSubmit={addTag}>
              <input
                type="text"
                placeholder="t.ex. Best"
                maxLength={30}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                aria-label="Ny tagg"
              />
              <button type="submit" className="btn">Lägg till</button>
            </form>
            <div className="chips">
              {profile.protectedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="chip on removable"
                  onClick={() => removeTag(tag)}
                  aria-label={`Ta bort taggen ${tag}`}
                >
                  #{tag} ✕
                </button>
              ))}
            </div>
          </>
        )}
      </fieldset>

      <div className="field">
        <label htmlFor="max-cp" className="label">Max CP (valfritt)</label>
        <input
          id="max-cp"
          type="number"
          min="1"
          step="1"
          placeholder="Inget tak"
          value={profile.maxCp ?? ''}
          onChange={handleCp}
        />
      </div>
    </div>
  )
}

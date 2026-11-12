// Profilväljare som flikar (segmenterad kontroll), inspirerad av op.gg.
export default function ProfilePicker({ presets, ownProfiles, selectedId, onSelect, onNew }) {
  const all = [...presets, ...ownProfiles]
  const selected = all.find((p) => p.id === selectedId)

  return (
    <div className="field">
      <span className="label" id="profile-label">Profil</span>
      <div className="tabs" role="radiogroup" aria-labelledby="profile-label">
        {all.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={p.id === selectedId}
            className={`tab ${p.id === selectedId ? 'active' : ''}`}
            onClick={() => onSelect(p)}
          >
            {p.name}
          </button>
        ))}
        <button
          type="button"
          className={`tab add ${selectedId === null ? 'active' : ''}`}
          onClick={onNew}
          aria-label="Ny profil"
        >
          + Ny
        </button>
      </div>
      {selected?.description && <p className="hint">{selected.description}</p>}
    </div>
  )
}

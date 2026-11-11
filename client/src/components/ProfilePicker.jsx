export default function ProfilePicker({ presets, ownProfiles, selectedId, onSelect, onNew }) {
  const all = [...presets, ...ownProfiles]

  function handleChange(e) {
    const found = all.find((p) => p.id === e.target.value)
    if (found) onSelect(found)
  }

  const selected = all.find((p) => p.id === selectedId)

  return (
    <div className="field">
      <label htmlFor="profile-select" className="label">Profil</label>
      <div className="row">
        <select id="profile-select" value={selectedId ?? ''} onChange={handleChange}>
          {selectedId === null && <option value="">Ny osparad profil</option>}
          <optgroup label="Färdiga">
            {presets.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </optgroup>
          {ownProfiles.length > 0 && (
            <optgroup label="Mina profiler">
              {ownProfiles.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </optgroup>
          )}
        </select>
        <button type="button" className="btn" onClick={onNew}>Ny</button>
      </div>
      {selected?.description && <p className="hint">{selected.description}</p>}
    </div>
  )
}

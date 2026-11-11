import { useEffect, useMemo, useState } from 'react'
import { buildSearchString } from './rules/buildSearchString.js'
import { PRESETS, emptyProfile } from './rules/presets.js'
import { getProfiles, saveProfile, deleteProfile } from './storage/profileStore.js'
import ProfilePicker from './components/ProfilePicker.jsx'
import RuleForm from './components/RuleForm.jsx'
import SearchOutput from './components/SearchOutput.jsx'

export default function App() {
  const [ownProfiles, setOwnProfiles] = useState([])
  const [profile, setProfile] = useState(PRESETS[0])
  const [status, setStatus] = useState('')

  useEffect(() => {
    getProfiles().then(setOwnProfiles)
  }, [])

  // Söksträngen räknas om varje gång profilen ändras
  const result = useMemo(() => buildSearchString(profile), [profile])

  const isPreset = profile.id?.startsWith('preset-')

  function flash(message) {
    setStatus(message)
    setTimeout(() => setStatus(''), 2500)
  }

  async function handleSave() {
    try {
      const name = profile.name.trim() || 'Namnlös profil'
      const saved = await saveProfile({ ...profile, name: isPreset ? `${name} (kopia)` : name })
      setProfile(saved)
      setOwnProfiles(await getProfiles())
      flash('Sparad.')
    } catch (err) {
      flash(err.message)
    }
  }

  async function handleDelete() {
    if (!profile.id || isPreset) return
    if (!window.confirm(`Ta bort "${profile.name}"? Till skillnad från en Pidgey går den inte att få tillbaka.`)) return
    await deleteProfile(profile.id)
    setOwnProfiles(await getProfiles())
    setProfile(PRESETS[0])
    flash('Borttagen.')
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Boxrensaren</h1>
        <p className="tagline">
          Ställ in dina regler, kopiera strängen, klistra in i spelets sökruta. Ingen Mewtwo ska dö i onödan.
        </p>
      </header>

      <main className="layout">
        <section className="panel">
          <ProfilePicker
            presets={PRESETS}
            ownProfiles={ownProfiles}
            selectedId={profile.id}
            onSelect={setProfile}
            onNew={() => setProfile(emptyProfile())}
          />
          <RuleForm profile={profile} onChange={setProfile} />
          <div className="actions">
            <button type="button" className="btn primary" onClick={handleSave}>
              {isPreset ? 'Spara som egen profil' : 'Spara profil'}
            </button>
            {!isPreset && profile.id && (
              <button type="button" className="btn danger" onClick={handleDelete}>
                Ta bort
              </button>
            )}
            <span className="status" role="status">{status}</span>
          </div>
        </section>

        <section className="panel sticky">
          <SearchOutput searchString={result.searchString} warnings={result.warnings} />
        </section>
      </main>

      <footer className="footer">
        Boxrensaren läser aldrig ditt spelkonto – den bygger bara text du klistrar in själv.
        Inofficiella spel-API:er bryter mot Niantics villkor och kan ge ban.
      </footer>
    </div>
  )
}

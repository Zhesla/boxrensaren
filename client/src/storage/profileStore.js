// Lagring av användarens egna profiler.
//
// VERSION 1: sparas i webbläsarens localStorage.
// VERSION 2: byt ut innehållet i de här funktionerna mot fetch-anrop
// till ditt Express-API (GET/POST/PUT/DELETE /api/profiles).
// Resten av appen behöver inte ändras, eftersom den bara pratar
// med de här funktionerna – och de är redan async.

const KEY = 'boxrensaren.profiles.v1'

function readAll() {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // Privat läge, blockerad lagring eller trasig JSON – börja om tomt
    return []
  }
}

function writeAll(profiles) {
  try {
    localStorage.setItem(KEY, JSON.stringify(profiles))
    return true
  } catch {
    return false
  }
}

export async function getProfiles() {
  return readAll()
}

export async function saveProfile(profile) {
  const profiles = readAll()
  const id = profile.id && !profile.id.startsWith('preset-') ? profile.id : crypto.randomUUID()
  const toSave = { ...profile, id }
  const index = profiles.findIndex((p) => p.id === id)
  if (index >= 0) profiles[index] = toSave
  else profiles.push(toSave)
  if (!writeAll(profiles)) throw new Error('Kunde inte spara – webbläsaren blockerar lagring.')
  return toSave
}

export async function deleteProfile(id) {
  writeAll(readAll().filter((p) => p.id !== id))
}

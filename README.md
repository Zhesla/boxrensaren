# Boxrensaren

Ett verktyg för att rensa sitt Pokémon GO-lager utan att råka transferera något man ångrar.

Du ställer in dina regler (vilka stjärnnivåer som får åka, vad som alltid ska skyddas, vilka taggar som är heliga) och appen bygger en söksträng som du klistrar in i spelets egen sökruta. Spelet visar då bara de Pokémon som är säkra att transferera.

**Live-demo:** _(lägg in länken när den är deployad)_

## Varför jag byggde den

Mitt lager är alltid fullt. Jag har en egen regel – vanliga under 3 stjärnor åker, men allt speciellt och allt jag taggat "Best" stannar – men att skriva söksträngen för hand varje gång är segt och lätt att göra fel på. Ett glömt `!legendary` och en raid-pass är bortkastat.

## Funktioner (version 1)

- Regelbyggare: stjärnor, skyddade kategorier (shiny, lucky, legendariska …), skyddade taggar och CP-tak
- Söksträngen uppdateras live och kan kopieras med ett klick
- Varningar när reglerna är riskabla (t.ex. oskyddade legendariska eller hundos med i urvalet)
- Färdiga profiler + egna profiler som sparas i webbläsaren
- Taggnamn rensas från specialtecken så att man inte kan förstöra logiken i strängen av misstag

## Teknik

- React 19 + Vite
- Vitest för enhetstester av regelmotorn
- Ingen backend i version 1

## Arkitektur

```
client/src/
  rules/          ← all logik, ren JavaScript utan React
    buildSearchString.js   regler → söksträng + varningar
    keywords.js            spelets nyckelord
    presets.js             färdiga profiler
  storage/
    profileStore.js        sparar profiler (localStorage nu, API senare)
  components/     ← bara gränssnitt
```

Regelmotorn är en ren funktion utan sidoeffekter. Det gör den lätt att testa och betyder att samma kod kan köras i backend i version 2.

`profileStore.js` är det enda stället som vet *var* profiler sparas. När backend finns byts innehållet där ut mot `fetch`-anrop, och resten av appen märker ingenting.

## Säkerhet och etik

Appen loggar aldrig in på något spelkonto. Det finns inofficiella API:er som gör det, men de bryter mot Niantics användarvillkor och kan leda till avstängning. Boxrensaren bygger bara text som användaren själv klistrar in.

## Kom igång

```bash
cd client
npm install
npm run dev     # startar utvecklingsservern
npm test        # kör testerna
npm run build   # bygger till client/dist
```

## Roadmap

- [x] **v1** – Regelbyggare och söksträng (frontend)
- [ ] **v2** – Node/Express-API, inloggning (bcrypt + httpOnly-cookies), profiler i databas, speldata synkad från PoGoAPI
- [ ] **v3** – Import av lager via CSV från IV-scanner, analys per Pokémon och statistik

## Vad jag lärt mig

_(Fyll i löpande – det här är delen rekryterare faktiskt läser.)_

# NASA data sources

| Source | Where it is used | Code |
|---|---|---|
| **api.nasa.gov EPIC** | Trainer, Mission 3, *Part B: Live Earth Disc*. Real DSCOVR frames with timestamps and spacecraft/Moon/Sun vectors; three tasks are generated from them. | `src/utils/nasaApi.ts` (`fetchEpic`), `src/utils/epic.ts`, `src/utils/epicGeo.ts`, `src/components/nasa/EpicObservation.tsx` |
| **api.nasa.gov APOD** | Daily image reward when a mission ends (all 18 quiz missions + Trainer M1/M2/M3). Flight Deck uses the same cached call. | `fetchApod`, `src/components/nasa/ApodReward.tsx` |
| **NASA Image & Video Library** | Trainer, Mission 1 (checklist): each subsystem that goes GO unlocks a training or ISS photo. | `searchNasaImages`, `src/components/nasa/ChecklistPhotoLog.tsx` |
| **NTRS** | Source panel under every quiz explanation, and on-demand lookups in the Trainer citation archive. | `searchNtrs`, `src/data/ntrsSources.ts`, `src/components/nasa/NtrsSources.tsx`, `api/ntrs.ts` |

## API key
Set `VITE_NASA_API_KEY` (free at https://api.nasa.gov). Without it the shared `DEMO_KEY` (~30 requests/hour/IP) is used.
Responses are cached for the session and every feature has a fallback, so a rate limit never blocks a mission.

## Fallbacks
- EPIC: live (api.nasa.gov) -> EPIC host -> **archived real sample** (2026-11-03), clearly labelled.
- APOD / Image Library: the card explains it is unavailable; credits are never affected.
- NTRS: direct API -> `/api/ntrs` proxy -> link to the NTRS search page.

## NTRS sources: pinned vs live
`NTRS_PINNED` holds records whose ID, title, authors and date were verified on ntrs.nasa.gov, each with a note on what it
supports. Questions without a pinned record get a live keyword search labelled "related". To pin one, add the record to
`NTRS_PINNED` and its ID under `"<missionId>:<questionIndex>"` in `QUESTION_SOURCES`. Never add an ID you have not opened.

Attribution: Data provided by NASA Scientific and Technical Information Program (https://ntrs.nasa.gov/api/openapi/).

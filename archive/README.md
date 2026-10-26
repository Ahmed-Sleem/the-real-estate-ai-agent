# Archive — removed from the live app (recoverable from here / git history)

- `CitationDrawer.tsx` — GPR document-citation drawer. This workflow has no
  documents/chunks; answers cite catalogue units directly. Removed 2026-10-26.
- `sseParser.ts` — SSE stream parser for the old FastAPI `/api/v1/chat/stream`
  backend. The agent now runs in the browser (lib/agent.ts) calling the model
  provider directly; no SSE backend stream exists. Removed 2026-10-26.

Also removed from live code at the same time (small, in git history):
- AppContext `inspectingNode/inspectingNodeId` state + GlobalModals drawer wiring
  (only fed CitationDrawer).
- AppContext documents fetching (`/api/v1/documents`) + `selectedDocIds`
  (GPR document scoping; the catalogue is `data/hierarchy.ts`).

NOT archived (kept in the reference GPR repo only): the FastAPI backend's
unused `list_agent_tools`, test-only `search_chunks` path, duplicate offline
greeting/identity fallbacks, and the PDF ingestion pipeline — Ahmed cleans
datasets manually, final data ships in `data/hierarchy.ts`.

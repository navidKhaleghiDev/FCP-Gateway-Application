# Sentinel IoT Operations Dashboard

A map-first operations dashboard for monitoring simulated fire-panel gateways. Phase one includes 120 live gateways, real-time alarms and telemetry, resilient WebSocket synchronization, an operator fleet table, alert center, device detail charts, and PostgreSQL-backed gateway identity persistence.

## Quick start for development (recommended)

From PowerShell in the repository directory:

```powershell
npm install
npm run dev
```

Keep that terminal open. Wait until it prints both the Vite URL and `IoT API listening`, then open http://localhost:5173. Do not run `npm run dev` a second time while the first process is still active, because ports `5173` and `4000` will already be occupied. Press `Ctrl+C` once to stop both servers.

The frontend also listens at http://127.0.0.1:5173. The backend health check is http://localhost:4000/api/health.

## Docker startup

Prerequisite: Docker Desktop must be open and its Linux engine must report that it is running. Having only the Docker command installed is not sufficient.

From PowerShell in the repository directory:

```powershell
docker compose up --build -d
docker compose ps
```

Open the application and health endpoint:

- Application: http://localhost:8080
- Backend health check: http://localhost:4000/api/health

Follow application logs:

```powershell
docker compose logs -f backend frontend
```

Stop the application without deleting PostgreSQL data:

```powershell
docker compose down
```

To also permanently remove the local database volume, run `docker compose down -v`.

## Local development

Prerequisites: Node.js 20+ and optionally Docker for PostgreSQL.

```powershell
Copy-Item .env.example .env
npm install
docker compose up postgres -d
npm run dev
```

Open http://localhost:5173. The API runs at http://localhost:4000. PostgreSQL is optional in development because the simulator can fall back to in-memory state.

## Useful commands

```powershell
npm run dev        # Start frontend and backend with live reload
npm run typecheck  # Check all TypeScript workspaces
npm run build      # Create production builds
docker compose ps  # Show container status
docker compose logs backend frontend postgres
```

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | API port |
| `CLIENT_URL` | `http://localhost:5173` | Allowed browser origin |
| `DATABASE_URL` | optional | PostgreSQL connection string |
| `VITE_API_URL` | `http://localhost:4000` | Browser REST origin |
| `VITE_SOCKET_URL` | `http://localhost:4000` | Browser WebSocket origin (the app uses /ws) |

## Stack

- Frontend: React 19, TypeScript, Vite, TanStack Query, Zustand, Axios, React Router, Tailwind CSS, Leaflet, Recharts and Sonner
- Backend: Node.js, TypeScript, Express 5, ws and PostgreSQL
- Contracts: `frontend/src/types.ts` and `backend/src/types.ts` define each project's API and socket payload types

## API

- `GET /api/health`
- `GET /api/devices` (optional `search`, `filter`, `status`, `priority`; returns `{ data: Device[], meta: { summary } }`)
- `GET /api/devices/:id`
- `GET /api/dashboard/summary`
- `GET /api/alerts` (optional `search`, `deviceId`, `status`, `kind`, `priority`)
- `POST /api/devices/:id/simulate`

The simulation request body accepts:

```json
{ "eventType": "urgent_alarm" }
```

Supported event types are `urgent_alarm`, `technical_fault`, `power_failure`, `disconnect`, `reconnect` and `resolve_alarm`.

Device `filter` accepts `all`, `online`, `urgent`, `faults` and `attention`. Device `status` accepts `all`, `online` and `offline`; device `priority` accepts `all`, `normal`, `warning` and `urgent`. Alert `status` accepts `all`, `active` and `resolved`; `kind` accepts `all`, `urgent_alarm`, `technical_fault` and `power_failure`; alert `priority` accepts `all`, `warning` and `urgent`. Invalid filter values return HTTP 400.

The alert icon requests `GET /api/alerts` when opened; alert history is not preloaded. The WebSocket only keeps the latest warning or urgent alert for the live indicator and toast.

The native WebSocket endpoint is `/ws`. Events are `device:updated`, `device:disconnected`, `device:connected`, `alert:created` and `alert:resolved`, sent as JSON `{ "event": "...", "data": { ... } }`. Device payloads carry monotonically increasing version values. The client rejects older versions and refetches REST queries after reconnection.

## Architecture

- `frontend/src/components`: atomic-design layers (`atoms`, `molecules`, `organisms`)
- `frontend/src/pages`: route-level composition
- `frontend/src/services`: application-wide WebSocket hook
- `frontend/src/stores`: ordering-safe live state
- `backend/src/simulator.ts`: authoritative runtime state and realistic telemetry
- `frontend/src/types.ts`, `backend/src/types.ts`: local API and socket contracts

The simulator updates a subset of online devices every 1-3 seconds. Offline gateways do not emit ordinary telemetry. Routine telemetry updates stay in local state. Gateway status, fault, power, priority and alarm changes invalidate active device queries, whose responses include updated summary metadata; alert events invalidate active alert views. Live updates do not reset search, filters or pagination.

## Troubleshooting

- If Docker reports it cannot connect to the daemon, start Docker Desktop and wait until its engine is ready.
- If port `4000`, `5173`, `5432` or `8080` is occupied, stop the conflicting service or change the corresponding mapping in `docker-compose.yml`.
- If containers fail, inspect them with `docker compose ps` and `docker compose logs backend frontend postgres`.
- For a stale browser bundle, rerun `docker compose up --build -d` and refresh without cache.

## Known phase-one limitations

- Telemetry history is bounded in browser memory and starts when a detail page opens.
- PostgreSQL persists gateway identity and location; rapidly changing telemetry remains in memory.
- Authentication, alert acknowledgement, escalation and historical telemetry storage are deferred.
- Automated tests are intentionally excluded at the project owner's request.

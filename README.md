# Sentinel IoT Operations Dashboard

A map-first operations dashboard for monitoring simulated fire-panel gateways. Phase one includes 120 live gateways, real-time alarms and telemetry, resilient Socket.IO synchronization, an operator fleet table, alert center, device detail charts, and PostgreSQL-backed gateway identity persistence.

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
| `VITE_SOCKET_URL` | `http://localhost:4000` | Browser Socket.IO origin |

## Stack

- Frontend: React 19, TypeScript, Vite, TanStack Query, Zustand, Axios, React Router, Tailwind CSS, Leaflet, Recharts and Sonner
- Backend: Node.js, TypeScript, Express 5, Socket.IO and PostgreSQL
- Contracts: `packages/shared` is the single source of truth for device, alert, API and socket types

## API

- `GET /api/health`
- `GET /api/devices`
- `GET /api/devices/:id`
- `GET /api/dashboard/summary`
- `GET /api/alerts`
- `POST /api/devices/:id/simulate`

The simulation request body accepts:

```json
{ "eventType": "urgent_alarm" }
```

Supported event types are `urgent_alarm`, `technical_fault`, `power_failure`, `disconnect`, `reconnect` and `resolve_alarm`.

Socket events are `device:updated`, `device:disconnected`, `device:connected`, `alert:created` and `alert:resolved`. Device payloads carry monotonically increasing version values. The client rejects older versions and performs an authoritative REST synchronization after every socket connection.

## Architecture

- `frontend/src/components`: atomic-design layers (`atoms`, `molecules`, `organisms`)
- `frontend/src/pages`: route-level composition
- `frontend/src/services`: singleton socket lifecycle
- `frontend/src/stores`: ordering-safe live state
- `backend/src/simulator.ts`: authoritative runtime state and realistic telemetry
- `packages/shared`: shared frontend/backend contracts

The simulator updates a subset of online devices every 1-3 seconds. Offline gateways do not emit ordinary telemetry. Live updates do not reset search, filters or pagination.

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

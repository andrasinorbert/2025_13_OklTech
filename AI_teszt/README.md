# Blog alkalmazas (Node.js + React)

## Struktura
- `backend`: Express API, MySQL adatbazis, JWT auth
- `frontend`: React + Vite kliens

## 1) Backend inditas
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

A backend: `http://localhost:4000`

A backend MySQL-t hasznal, es inditaskor automatikusan lefuttatja a schema scriptet:
- `backend/db/schema.sql`

Alap admin fiok (elso inditasnal automatikusan letrejon):
- email: `admin@blog.local`
- jelszo: `admin123`

## 2) Frontend inditas
```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## API fo vegpontok
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/posts`
- `POST /api/posts` (csak admin)
- `POST /api/posts/:id/like` (bejelentkezett felhasznalo)

## MySQL script kezi futtatasa (opcionalis)
```bash
mysql -u root -p < backend/db/schema.sql
```


# SchedGO — Web Client

SchedGO is a scheduling platform for educational institutions. This repository
contains the **web client** (React) — the public timetable viewer and the
management dashboard for institution and admin roles.

The client talks to a separate backend service (**schedule-api**, Node.js +
Express + MongoDB), which must be running for the application to work.

---

## Features

- **Public timetable** (`/schedule`) — browse group and teacher schedules by
  specialty, course and group; export a week to `.ics` (calendar) or `.xlsx`.
- **Authentication** (`/auth`) — email / password sign-in.
- **Dashboard** (`/dashboard`) — role-based management console:
  - Institution: lessons, schedule editing, teachers, periods, specialties,
    courses, groups, rooms, group & teacher timetables.
  - Admin: users, registration, requests, reports.
- Responsive, Apple-style UI (light theme).

---

## Tech Stack

- [React 19](https://react.dev/) (Create React App)
- [React Router 7](https://reactrouter.com/)
- [MUI](https://mui.com/) + [Emotion](https://emotion.sh/)
- [Axios](https://axios-http.com/) for API calls
- [Moment.js](https://momentjs.com/)
- [Sass](https://sass-lang.com/)

---

## Prerequisites

- **Node.js** 18 or newer
- **npm** 9 or newer
- A running instance of the **schedule-api** backend (and its MongoDB database)

---

## Getting Started

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd schedule-site

# 2. Install dependencies
npm install

# 3. Create your environment file from the template
cp .env.example .env
#    then edit .env and point REACT_APP_API_URL at your backend

# 4. Start the development server
npm start
```

The app runs at **http://localhost:3000** by default.

> Make sure the backend (schedule-api) is running and reachable at the URL you
> set in `REACT_APP_API_URL` — otherwise data will not load.

---

## Environment Variables

All configuration lives in a `.env` file at the project root. See
[`.env.example`](./.env.example) for the full list.

| Variable              | Description                                    | Example                 |
| --------------------- | ---------------------------------------------- | ----------------------- |
| `REACT_APP_API_URL`   | Base URL of the SchedGO backend API            | `http://localhost:3001` |

> Create React App only exposes variables prefixed with `REACT_APP_`, and they
> are read **at build time** — restart `npm start` after changing `.env`.

---

## Available Scripts

| Command          | Description                                             |
| ---------------- | ------------------------------------------------------ |
| `npm start`      | Run the development server with hot reloading.         |
| `npm run build`  | Produce an optimized production build in `build/`.     |
| `npm test`       | Run the test runner in watch mode.                     |
| `npm run lint`   | Lint and auto-fix source files with ESLint.            |

---

## Production Build

```bash
npm run build
```

This outputs a static bundle to `build/`, which can be served by any static
host (Nginx, Netlify, Vercel, an S3 bucket, etc.). Remember to set
`REACT_APP_API_URL` to your production API URL **before** building.

---

## Project Structure

```
src/
├── assets/         Images, SVG icons, fonts
├── components/     Feature components and dashboard modules
├── pages/          Route-level pages (Home, Schedule, Auth, EditSchedule, …)
├── Widget/         Reusable layout widgets (headers, footers, containers)
├── styles/         Global and per-module CSS
└── routes.js       Application routes
```

---

## License

This project is licensed under the
**[PolyForm Noncommercial License 1.0.0](./LICENSE)**.

You are free to **use, run, copy, modify, and self-host** this software for any
**noncommercial** purpose. You may **not** sell it, offer it as a paid product
or service, or use it for the commercial promotion of services. See the
[LICENSE](./LICENSE) file for the full terms.

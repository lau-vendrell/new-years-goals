# Objetivos 2026

SPA en React + Vite (TypeScript) para crear y gestionar objetivos anuales con persistencia en localStorage y diseño editorial minimalista.

## Scripts

- `npm install` - instala dependencias (requiere acceso a npm)
- `npm run dev` - arranca el entorno de desarrollo en `http://localhost:5173`
- `npm run build` - compila la versión de producción
- `npm run preview` - sirve la build ya compilada

## Funcionalidad

- Añadir, editar inline, completar y eliminar objetivos.
- Filtro All/Activos/Completados + contador.
- Sidebar tipo tabla que navega a las cards y resalta la seleccionada.
- Persistencia automática en localStorage.
- Modal About y reloj en vivo en el header.

## Estructura

- `src/App.tsx` - composición principal, layout y coordinación de vistas.
- `src/components/` - Header, AboutModal, GoalCard, GoalsCanvas, GoalsTableSidebar.
- `src/hooks/` - lógica de estado y persistencia (`useGoalsManager`).
- `src/constants.ts` - constantes compartidas como `PAGE_SIZE`.
- `src/utils/` - helpers para localStorage y reloj.

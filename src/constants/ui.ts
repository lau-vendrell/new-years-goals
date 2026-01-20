export const UI_TEXT = {
  brand: 'OBJETIVOS 2026',
  about: 'ABOUT',
  aboutAria: 'Acerca de',
  close: 'Cerrar',
  newGoalAria: 'Nuevo objetivo',
  newGoalTitle: 'NUEVO OBJETIVO',
  newGoalLabel: 'Objetivo',
  identityLabel: 'Quién quiero ser respecto a este objetivo',
  newGoalPlaceholder: 'Ejemplo: Hacer ejercicio 3 veces por semana',
  identityPlaceholder: 'Ejemplo: Una persona activa',
  cancel: 'Cancelar',
  add: 'Añadir',
  edit: 'Editar',
  save: 'Guardar',
  delete: 'Eliminar',
  emptyCanvas: 'No hay objetivos todavía',
  emptyList: 'Nada por aquí todavía',
  addGoal: 'Añadir objetivo',
  goalCountLabel: 'Objetivos',
  allFilter: 'Todos',
  activeFilter: 'Activos',
  completedFilter: 'Completados',
  statusActive: 'Activo',
  statusCompleted: 'Completado',
  statusCompletedLower: 'completado',
  statusNotCompleted: 'no completado',
  countsSeparator: '·',
  identityPrefix: 'Quién quiero ser:',
  identityFallback: '...',
  editGoalAria: 'Editar objetivo',
  editIdentityAria: 'Editar frase de identidad',
  prevPageAria: 'Página anterior',
  nextPageAria: 'Página siguiente',
  togglePrefix: 'Marcar',
  toggleConnector: 'como',
  paginationPrevGlyph: '‹',
  paginationNextGlyph: '›',
  addRowSymbol: '+',
  emptyRowSymbol: '–',
  closeGlyph: '×'
} as const;

export const UI_NUMBERS = {
  pageSize: 10,
  indexPadLength: 2,
  dragThreshold: 8,
  flashDurationMs: 600
} as const;

export const GOAL_STATUS = {
  active: 'active',
  completed: 'completed'
} as const;

export const GOAL_POSITION_DEFAULTS = {
  minX: 0.05,
  maxX: 0.85,
  minY: 0.05,
  maxY: 0.75,
  minRot: -3,
  maxRot: 3
} as const;

export const ABOUT_CONTENT = {
  intro: 'Página creada por Laura Vendrell 🦦',
  stack:
    'Nace de un experimento de desarrollo con Visual Studio, Codex y ChatGPT. Hecha con React, Vite, Typescript y mucho amor.',
  purpose:
    'La idea del proyecto fue crear una web donde guardar objetivos de forma ágil y sencilla para poder acceder siempre que quieras. Puedes guardar tu web como marcador o crear un acceso directo.',
  dualView:
    'Además, la doble visualización de objetivos viene de la idea de cómo se siente marcar y querer abarcar muchos objetivos a la vez.',
  newsletter: {
    prefix: 'Para cotillear otros proyectos, podéis acceder a la ',
    label: 'newsletter',
    suffix: ' donde cuento en lo que estoy trabajando 2 veces por mes.',
    href: 'https://fractales.substack.com'
  }
} as const;

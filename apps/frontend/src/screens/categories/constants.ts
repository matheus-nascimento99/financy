import React from 'react'

// Icon set for categories
export const ICONS = [
  { id: 'fork-knife', label: 'Alimentação', icon: '🍽️' },
  { id: 'calendar', label: 'Diversão', icon: '📅' },
  { id: 'leaf', label: 'Saúde', icon: '🌿' },
  { id: 'shopping-cart', label: 'Compras', icon: '🛒' },
  { id: 'grid', label: 'Utilidades', icon: '⚙️' },
  { id: 'building', label: 'Trabalho', icon: '🏢' },
  { id: 'car', label: 'Transporte', icon: '🚗' },
  { id: 'home', label: 'Casa', icon: '🏠' },
  { id: 'heart', label: 'Saúde/Médico', icon: '❤️' },
  { id: 'book', label: 'Educação', icon: '📚' },
  { id: 'film', label: 'Diversão/Cinema', icon: '🎬' },
  { id: 'music', label: 'Música', icon: '🎵' },
  { id: 'plane', label: 'Viagens', icon: '✈️' },
  { id: 'gift', label: 'Presentes', icon: '🎁' },
  { id: 'credit-card', label: 'Cartão', icon: '💳' },
  { id: 'money-bag', label: 'Dinheiro', icon: '💰' },
]

export const ICON_MAP: Record<string, React.ReactNode> = {
  'fork-knife': '🍽️',
  calendar: '📅',
  leaf: '🌿',
  'shopping-cart': '🛒',
  grid: '⚙️',
  building: '🏢',
  car: '🚗',
  home: '🏠',
  heart: '❤️',
  book: '📚',
  film: '🎬',
  music: '🎵',
  plane: '✈️',
  gift: '🎁',
  'credit-card': '💳',
  'money-bag': '💰',
}

// Color options for categories
export const COLORS: Record<string, string> = {
  green: '#22c55e',
  blue: '#3b82f6',
  purple: '#a855f7',
  pink: '#ec4899',
  red: '#ef4444',
  orange: '#f97316',
  yellow: '#eab308',
  cyan: '#06b6d4',
  indigo: '#6366f1',
  teal: '#14b8a6',
  lime: '#84cc16',
  amber: '#f59e0b',
  rose: '#f43f5e',
  fuchsia: '#d946ef',
  slate: '#64748b',
}

export const COLOR_OPTIONS = [
  { id: 'green', name: 'Verde', hex: '#22c55e' },
  { id: 'blue', name: 'Azul', hex: '#3b82f6' },
  { id: 'purple', name: 'Roxo', hex: '#a855f7' },
  { id: 'pink', name: 'Rosa', hex: '#ec4899' },
  { id: 'red', name: 'Vermelho', hex: '#ef4444' },
  { id: 'orange', name: 'Laranja', hex: '#f97316' },
  { id: 'yellow', name: 'Amarelo', hex: '#eab308' },
  { id: 'cyan', name: 'Ciano', hex: '#06b6d4' },
  { id: 'indigo', name: 'Índigo', hex: '#6366f1' },
  { id: 'teal', name: 'Verde-azulado', hex: '#14b8a6' },
]

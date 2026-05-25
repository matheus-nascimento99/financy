import type { TagColor } from '../../components/ui/tag'

const TAG_COLORS: TagColor[] = ['blue', 'purple', 'red', 'orange', 'yellow', 'green']

export function getCategoryTagColor(color: string): TagColor {
  if (TAG_COLORS.includes(color as TagColor)) {
    return color as TagColor
  }
  return 'blue'
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function isDateOnlyInput(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value.trim())
}

export function parseTransactionDate(value: string | number): Date {
  if (typeof value === 'number') {
    return new Date(value)
  }

  const trimmed = value.trim()
  if (/^\d+$/.test(trimmed)) {
    return new Date(Number(trimmed))
  }

  if (isDateOnlyInput(trimmed)) {
    const [year, month, day] = trimmed.split('-').map(Number)
    return new Date(year, month - 1, day, 12, 0, 0, 0)
  }

  return new Date(trimmed)
}

/** Partes do dia de calendário (evita deslocamento por fuso na exibição) */
export function getTransactionDateParts(value: string | number): {
  day: number
  month: number
  year: number
} {
  if (typeof value === 'string' && isDateOnlyInput(value)) {
    const [year, month, day] = value.split('-').map(Number)
    return { day, month, year }
  }

  const parsed = parseTransactionDate(value)
  if (Number.isNaN(parsed.getTime())) {
    return { day: 0, month: 0, year: 0 }
  }

  return {
    day: parsed.getUTCDate(),
    month: parsed.getUTCMonth() + 1,
    year: parsed.getUTCFullYear(),
  }
}

export function formatTransactionDate(date: string | number): string {
  const { day, month, year } = getTransactionDateParts(date)
  if (day === 0) return '-'

  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${String(year).slice(-2)}`
}

export function formatLongDate(date: string | number): string {
  const { day, month, year } = getTransactionDateParts(date)
  if (day === 0) return '-'

  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** Converte valor do input type="date" (YYYY-MM-DD) para ISO sem mudar o dia */
export function dateInputToISO(dateInput: string): string {
  const [year, month, day] = dateInput.split('-').map(Number)
  return new Date(year, month - 1, day, 12, 0, 0, 0).toISOString()
}

export function toDateInputValue(date: string | number): string {
  const { day, month, year } = getTransactionDateParts(date)
  if (day === 0) return ''

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/** Aplica máscara BRL (centavos) enquanto o usuário digita — ex.: "141000" → "1.410,00" */
export function maskCurrencyInput(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  const cents = Number.parseInt(digits || '0', 10)

  return (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Converte valor mascarado para número enviado ao backend */
export function parseAmountInput(value: string): number {
  const digits = value.replace(/\D/g, '')
  if (!digits) return 0
  return Number.parseInt(digits, 10) / 100
}

export function formatAmountFromNumber(value: number): string {
  return maskCurrencyInput(String(Math.round(value * 100)))
}

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export function getPeriodOptions(count = 12): Array<{ value: string; label: string; month: number; year: number }> {
  const options: Array<{ value: string; label: string; month: number; year: number }> = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    options.push({
      value: `${month}-${year}`,
      label: `${MONTH_NAMES[date.getMonth()]} / ${year}`,
      month,
      year,
    })
  }

  return options
}

export function getCurrentPeriod(): { month: number; year: number; value: string } {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  return { month, year, value: `${month}-${year}` }
}

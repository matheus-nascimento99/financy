import { Input } from '../../components/ui/input'
import { maskCurrencyInput } from './utils'

interface CurrencyAmountInputProps {
  value: string
  onChange: (value: string) => void
  error?: boolean
  disabled?: boolean
}

export default function CurrencyAmountInput({
  value,
  onChange,
  error = false,
  disabled = false,
}: CurrencyAmountInputProps) {
  return (
    <div className="relative mt-1">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-primary">
        R$
      </span>
      <Input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(maskCurrencyInput(event.target.value))}
        placeholder="0,00"
        size="md"
        error={error}
        disabled={disabled}
        className="w-full pl-10"
      />
    </div>
  )
}

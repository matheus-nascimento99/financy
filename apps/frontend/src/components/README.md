# Financy UI Components

This directory contains reusable UI components built with React, TypeScript, and Tailwind CSS.

## Components Overview

### Input Components

#### Input
A customizable text input field with multiple states and sizes.

**Props:**
- `size?: 'sm' | 'md' | 'lg'` - Button size (default: 'md')
- `state?: 'empty' | 'active' | 'filled' | 'error' | 'disabled'` - Input state (default: 'empty')
- `error?: boolean` - Show error state
- `disabled?: boolean` - Disable input
- `label?: string` - Optional label text
- All standard `HTMLInputElement` attributes

**Example:**
```tsx
import { Input } from '@/components/ui'

export default function LoginForm() {
  return (
    <div>
      <Input placeholder="Email" size="md" />
      <Input placeholder="Password" type="password" error={true} />
      <Input placeholder="Disabled" disabled={true} />
    </div>
  )
}
```

#### Select
A customizable select dropdown with multiple states and sizes.

**Props:**
- `size?: 'sm' | 'md' | 'lg'` - Button size (default: 'md')
- `state?: 'empty' | 'active' | 'filled' | 'error' | 'disabled'` - Select state (default: 'empty')
- `error?: boolean` - Show error state
- `disabled?: boolean` - Disable select
- `options: SelectOption[]` - Array of options with value and label
- `placeholder?: string` - Placeholder text
- All standard `HTMLSelectElement` attributes

**Example:**
```tsx
import { Select } from '@/components/ui'

export default function CategoryFilter() {
  const options = [
    { value: 'food', label: 'Food' },
    { value: 'transport', label: 'Transport' },
    { value: 'utilities', label: 'Utilities' },
  ]

  return <Select options={options} placeholder="Select category" />
}
```

### Button Components

#### Button
A versatile button component with multiple variants for different use cases.

**Props:**
- `variant?: 'primary' | 'secondary' | 'danger' | 'icon' | 'label' | 'pagination' | 'link'` - Button variant (default: 'primary')
- `size?: 'sm' | 'md' | 'lg'` - Button size (default: 'md')
- `icon?: ReactNode` - Icon to display (used with 'icon', 'label' variants)
- `label?: string` - Button label text (used with 'label' variant)
- `isActive?: boolean` - Active state (used with 'pagination' variant)
- `number?: number | string` - Number to display (used with 'pagination' variant)
- `underline?: boolean` - Show underline (used with 'link' variant, default: true)
- All standard `HTMLButtonElement` attributes

**Variants:**
- **primary**: Purple accent button (main action)
- **secondary**: Gray secondary button
- **danger**: Red danger button (destructive actions)
- **icon**: Icon-only button, typically for toolbar actions
- **label**: Icon + text button
- **pagination**: Numbered pagination button with active state
- **link**: Text link styled button without background

**Examples:**

```tsx
import { Button } from '@/components/ui'
import { Plus, Settings } from 'lucide-react'

// Basic variants
<Button variant="primary" size="md">Save</Button>
<Button variant="secondary" size="md">Cancel</Button>
<Button variant="danger" size="lg">Delete</Button>

// Icon button
<Button variant="icon" icon={<Settings size={20} />} size="md" />

// Label button (icon + text)
<Button 
  variant="label" 
  icon={<Plus size={18} />} 
  label="New Transaction" 
  size="md" 
/>

// Pagination button
<div className="flex gap-1">
  {[1, 2, 3, 4, 5].map((num) => (
    <Button
      key={num}
      variant="pagination"
      number={num}
      isActive={num === 2}
      size="md"
    />
  ))}
</div>

// Link button
<Button variant="link" underline={true}>
  Click here
</Button>
```

#### Link
A styled link component with optional underline.

**Props:**
- `underline?: boolean` - Show underline (default: true)
- All standard `HTMLAnchorElement` attributes

**Example:**
```tsx
import { Link } from '@/components/ui'

<nav className="flex gap-4">
  <Link href="/dashboard" underline={false}>Dashboard</Link>
  <Link href="/transactions" underline={true}>Transactions</Link>
</nav>
```

### Feedback Components

#### Tag
A tag/label component with color variations.

**Props:**
- `color?: 'blue' | 'purple' | 'red' | 'orange' | 'yellow' | 'green'` - Tag color (default: 'blue')
- `label: string` - Tag text
- All standard `HTMLDivElement` attributes

**Example:**
```tsx
import { Tag } from '@/components/ui'

export default function CategoryList() {
  return (
    <div className="flex gap-2">
      <Tag label="Income" color="green" />
      <Tag label="Expense" color="red" />
      <Tag label="Transfer" color="blue" />
    </div>
  )
}
```

#### Type
A transaction type indicator showing "Entrada" (Income) or "Saída" (Expense) with appropriate icons and colors.

**Props:**
- `type: 'entrada' | 'saida'` - Transaction type
- `label?: string` - Custom label (default: 'Entrada' or 'Saída')
- `icon?: ReactNode` - Custom icon
- All standard `HTMLDivElement` attributes

**Example:**
```tsx
import { Type } from '@/components/ui'

export default function TransactionList() {
  return (
    <div>
      <Type type="entrada" /> {/* Shows "Entrada" with green arrow down */}
      <Type type="saida" /> {/* Shows "Saída" with red arrow up */}
      <Type type="entrada" label="Salary" />
    </div>
  )
}
```

## Design System

For detailed information about colors, typography, and spacing, see [design-system.md](./design-system.md).

## Conventions

All components:
- Use `forwardRef` for direct DOM access when needed
- Use `twMerge` from `tailwind-merge` to properly merge Tailwind classes
- Support standard HTML attributes (`className`, `disabled`, etc.)
- Have TypeScript types for all props
- Use `displayName` for better debugging

## Mobile Responsiveness

All components are built with a mobile-first approach. Use Tailwind's responsive prefixes:
```tsx
<Input size="sm" className="md:size-md lg:size-lg" />
```

## Theming

The components use Tailwind CSS classes and respect the custom theme defined in CSS variables. No component-specific CSS files are needed.

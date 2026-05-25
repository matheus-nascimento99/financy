# Financy Design System

## Overview
The Financy design system is built on Tailwind CSS with a custom theme that extends the default Tailwind configuration.

## Color Palette

### Semantic Colors
- **Primary**: `#aa3bff` (Accent Purple)
- **Secondary**: `#6b6375` (Text Secondary)
- **Danger**: `#ef4444` (Red)
- **Success**: `#22c55e` (Green)
- **Warning**: `#eab308` (Yellow)
- **Info**: `#3b82f6` (Blue)

### Light Mode
- **Text Primary**: `#6b6375`
- **Text Heading**: `#08060d`
- **Background**: `#fff`
- **Border**: `#e5e4e7`
- **Code Background**: `#f4f3ec`
- **Accent Background**: `rgba(170, 59, 255, 0.1)`
- **Accent Border**: `rgba(170, 59, 255, 0.5)`
- **Social Background**: `rgba(244, 243, 236, 0.5)`

### Tag Colors
- **Blue**: `#3b82f6`
- **Purple**: `#a855f7`
- **Red**: `#ef4444`
- **Orange**: `#f97316`
- **Yellow**: `#eab308`
- **Green**: `#22c55e`

## Typography

### Font Families
- **Sans**: `system-ui, 'Segoe UI', Roboto, sans-serif`
- **Heading**: `system-ui, 'Segoe UI', Roboto, sans-serif`
- **Mono**: `ui-monospace, Consolas, monospace`

### Font Sizes
- **xs**: 14px / 20px
- **sm**: 16px / 23px
- **base**: 18px / 26px (Default)
- **lg**: 20px / 29px
- **xl**: 24px / 35px
- **2xl**: 32px / 46px

### Letter Spacing
- **Tight**: -0.02em
- **Normal**: 0.18px
- **Wide**: 0.02em

## Spacing Scale

All spacing values follow an 4px base unit:
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px

## Responsive Breakpoints

The design system uses mobile-first approach with Tailwind's default breakpoints:
- **Default**: Mobile screens
- **md**: 768px and above
- **lg**: 1024px and above
- **xl**: 1280px and above

## Component Usage

See [Components Documentation](./README.md) for detailed component usage examples.

## CSS Custom Properties

The design system maintains CSS custom properties for dark mode support:

```css
--text: #6b6375
--text-h: #08060d
--bg: #fff
--border: #e5e4e7
--code-bg: #f4f3ec
--accent: #aa3bff
--accent-bg: rgba(170, 59, 255, 0.1)
--accent-border: rgba(170, 59, 255, 0.5)
--social-bg: rgba(244, 243, 236, 0.5)
--shadow: rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px
```

These are available for legacy components and dark mode support.

## Shadows

The design system defines a standard shadow for depth:
```
rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px
```

This can be applied using the `shadow-lg` Tailwind utility or `shadow-default` custom class.

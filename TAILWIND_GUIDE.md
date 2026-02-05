# Tailwind CSS Cheat Sheet for This Project

## Quick Reference for Common Patterns

### Glass Morphism Effect

```jsx
<div
  className="rounded-xl border"
  style={{
    background: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 12px'
  }}
>
```

### Gradient Button

```jsx
<button
  className="rounded-xl px-4 py-2 text-white transition-all duration-300 hover:scale-105"
  style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
>
  Click Me
</button>
```

### Responsive Text Sizing

```jsx
<h1 className="text-[clamp(20px,4vw,28px)] font-bold text-text-primary">
  Responsive Title
</h1>
```

### Hover Effects with State

```jsx
<div
  className="transition-all duration-300 hover:-translate-y-1"
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.1) 0px 8px 24px';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.08) 0px 4px 12px';
  }}
>
```

### Custom Colors (from config)

```jsx
<p className="text-text-primary">Primary Text</p>
<p className="text-text-secondary">Secondary Text</p>
<div className="bg-accent-start">Accent Background</div>
```

### Responsive Breakpoints

```jsx
<div className="
  p-2           /* mobile (default) */
  md:p-4        /* tablet (768px+) */
  lg:p-8        /* desktop (1024px+) */
">
```

### Flex Layout

```jsx
<div className="flex flex-col md:flex-row gap-2 items-center justify-between">
  {/* Mobile: column, Tablet+: row */}
</div>
```

### Scrollable Container

```jsx
<div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
  {/* Hidden scrollbar */}
</div>
```

## Custom Utilities Available

From `tailwind.config.js`:

- **Shadows**: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-accent`
- **Colors**: `text-primary`, `text-secondary`, `accent-start`, `accent-end`
- **Animation**: `animate-gradient`

## Tips

1. **Use inline styles for**: Complex gradients, precise rgba colors, dynamic styles
2. **Use Tailwind classes for**: Layout, spacing, typography, common utilities
3. **Combine both**: Use Tailwind for base styles + inline for complex effects

## Example Component

```jsx
const Card = ({ children }) => (
  <div
    className="rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1"
    style={{
      background: "rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
    }}
  >
    {children}
  </div>
);
```

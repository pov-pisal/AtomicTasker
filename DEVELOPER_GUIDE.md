# Atomic Tasker - Developer Reference Guide

## 🎯 Quick Start for Developers

### CSS Architecture Overview

The `style.css` file is organized in the following sections:

1. **Root Variables** - All design tokens
2. **Body & Container** - Global styles
3. **Header Section** - Branding
4. **Filter Section** - Search and sorting controls
5. **Add Task Section** - Input card
6. **Buttons** - All button styles
7. **Category Management** - Collapsible section
8. **Tasks Container** - Task list display
9. **Task Items** - Individual task styling
10. **Completed Tasks** - Completed section
11. **Motivation Section** - Quote card
12. **Modals** - Dialog styling
13. **Responsive Design** - Media queries
14. **Accessibility** - Focus and keyboard nav
15. **Print Styles** - Document export

---

## 🎨 Using CSS Variables

### Access Colors
```css
/* Primary backgrounds */
background: var(--bg-primary);        /* Deepest navy */
background: var(--bg-secondary);      /* Dark blue */
background: var(--bg-tertiary);       /* Medium blue */
background: var(--bg-glass);          /* Glass effect */

/* Text colors */
color: var(--text-primary);           /* Bright white */
color: var(--text-secondary);         /* Cool gray */
color: var(--text-tertiary);          /* Muted gray */

/* Accents */
color: var(--accent-primary);         /* Indigo */
color: var(--accent-secondary);       /* Purple */
color: var(--accent-tertiary);        /* Electric blue */
```

### Use Gradients
```css
background: var(--gradient-primary);   /* Indigo → Purple */
background: var(--gradient-electric);  /* Blue → Indigo */
```

### Apply Shadows
```css
box-shadow: var(--shadow-sm);          /* Small shadow */
box-shadow: var(--shadow-md);          /* Medium shadow */
box-shadow: var(--shadow-lg);          /* Large shadow */
box-shadow: var(--shadow-glow);        /* Glow effect */
```

### Smooth Transitions
```css
transition: var(--transition);         /* Standard 0.3s */
transition: var(--transition-fast);    /* Fast 0.15s */
```

---

## 📐 Spacing System

### Standard Gaps
```css
gap: 8px;       /* Extra small - inline items */
gap: 10px;      /* Small - default item spacing */
gap: 12px;      /* Base - main spacing */
gap: 14px;      /* Medium - emphasis */
gap: 16px;      /* Large - section spacing */
```

### Padding Classes
```css
padding: 11px 14px;     /* Input/button padding */
padding: 14px;          /* Card padding */
padding: 16px;          /* Section padding */
padding: 18px 20px;     /* Modal header */
padding: 20px;          /* Container padding */
```

---

## 🎬 Animation Patterns

### Hover Lift Effect
```css
.element:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--accent-primary);
}
```

### Focus Glow (Inputs)
```css
.element:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15),
                inset 0 0 8px rgba(99, 102, 241, 0.08);
    background: rgba(99, 102, 241, 0.05);
}
```

### Slide In (Tasks)
```css
animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Fade In (Modals)
```css
animation: fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 🔘 Button Patterns

### Primary Button Template
```css
.my-primary-btn {
    padding: 11px 18px;
    background: var(--gradient-primary);
    color: white;
    border: none;
    border-radius: var(--radius);
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.my-primary-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4), var(--shadow-glow);
}
```

### Secondary Button Template
```css
.my-secondary-btn {
    padding: 11px 18px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
}

.my-secondary-btn:hover {
    border-color: var(--accent-primary);
    background: rgba(99, 102, 241, 0.12);
    transform: translateY(-2px);
}
```

### Ghost Button Template
```css
.my-ghost-btn {
    background: none;
    border: none;
    color: var(--text-tertiary);
    cursor: pointer;
    padding: 5px 6px;
    border-radius: 4px;
    transition: var(--transition);
}

.my-ghost-btn:hover {
    color: var(--accent-tertiary);
    background: rgba(99, 102, 241, 0.12);
}
```

---

## 📝 Input Pattern

### Text Input Template
```css
.my-input {
    width: 100%;
    padding: 11px 14px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    color: var(--text-primary);
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    transition: var(--transition);
}

.my-input::placeholder {
    color: var(--text-tertiary);
}

.my-input:hover {
    border-color: var(--border-color-light);
    background: rgba(99, 102, 241, 0.04);
}

.my-input:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15),
                inset 0 0 8px rgba(99, 102, 241, 0.08);
    background: rgba(99, 102, 241, 0.05);
}
```

---

## 🏗️ Card/Section Pattern

### Card Container Template
```css
.my-card {
    padding: 16px;
    background: var(--bg-glass);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}
```

### Section with Glow
```css
.my-section {
    padding: 16px;
    background: var(--bg-glass);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2), 
                inset 0 1px 1px rgba(255, 255, 255, 0.1);
}
```

---

## 🎯 Modal Pattern

### Modal Template
```css
.my-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.my-modal-content {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    max-width: 360px;
    box-shadow: 0 20px 60px rgba(99, 102, 241, 0.25), var(--shadow-lg);
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 🏷️ Badge Pattern

### Accent Badge
```css
.my-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    border-radius: 999px;
    background: rgba(99, 102, 241, 0.15);
    color: var(--accent-primary);
    font-size: 11px;
    font-weight: 700;
}
```

### Priority Badge (High)
```css
.badge-high {
    padding: 4px 8px;
    border-radius: 999px;
    color: #fecaca;
    background: rgba(239, 68, 68, 0.2);
    border: 1px solid rgba(239, 68, 68, 0.35);
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
}
```

---

## 📱 Responsive Tweaks

### Mobile-Friendly Adjustments
```css
@media (max-height: 600px) {
    .container {
        padding: 15px;
        gap: 15px;
    }
    
    .add-task-section {
        padding: 12px;
    }
    
    .tasks-container,
    .motivation-section {
        padding: 12px;
    }
}
```

---

## ⌨️ Accessibility Checklist

When creating new components:

- [ ] Focus states are visible and clear
- [ ] Colors meet WCAG AA contrast (4.5:1)
- [ ] All interactive elements are keyboard accessible
- [ ] Use semantic HTML (button, input, etc.)
- [ ] Provide focus-visible outline
- [ ] Maintain 44px minimum touch targets
- [ ] Include proper ARIA labels where needed
- [ ] Test with keyboard navigation
- [ ] Verify with screen reader

### Focus Visible Override
```css
:focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
}
```

---

## 🎨 Creating New Sections

### Step-by-Step Process

1. **Choose a background**
   ```css
   background: var(--bg-glass);  /* Glassmorphic */
   /* OR */
   background: var(--bg-secondary);  /* Solid */
   ```

2. **Add borders**
   ```css
   border: 1px solid var(--border-color);
   border-radius: var(--radius-lg);  /* 16px for containers */
   ```

3. **Apply padding**
   ```css
   padding: 16px;
   ```

4. **Add backdrop filter (if glass)**
   ```css
   backdrop-filter: blur(12px);
   -webkit-backdrop-filter: blur(12px);
   ```

5. **Add shadow for depth**
   ```css
   box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
   ```

6. **Test hover states**
   ```css
   &:hover {
       border-color: var(--accent-primary);
       background: rgba(99, 102, 241, 0.08);
   }
   ```

---

## 🧪 Testing Checklist

- [ ] Looks good in light and on dark backgrounds
- [ ] Hover states work smoothly
- [ ] Focus states are visible
- [ ] Animations are smooth (60fps)
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Print styles work
- [ ] Colors accessible
- [ ] Text readable at all sizes
- [ ] Touch targets >= 44px

---

## 💡 Best Practices

### Do's ✅
- Use CSS variables for all colors
- Apply consistent spacing with 2px increments
- Use cubic-bezier timing functions
- Maintain 12-16px border radius
- Stack shadows for depth
- Test accessibility regularly
- Use semantic HTML
- Optimize animations

### Don'ts ❌
- Avoid hard-coded colors
- Don't mix spacing scales
- Avoid ease-in/ease-out (use cubic-bezier)
- Don't create new colors - use existing palette
- Avoid shadows without purpose
- Don't skip accessibility testing
- Avoid rapid animations (< 0.15s feels jarring)
- Don't duplicate styles (use CSS variables)

---

## 🔗 Quick Links

- Main stylesheet: [style.css](style.css)
- Design system: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
- Enhancement details: [UI_DESIGN_ENHANCEMENTS.md](UI_DESIGN_ENHANCEMENTS.md)
- Before/after: [DESIGN_BEFORE_AFTER.md](DESIGN_BEFORE_AFTER.md)

---

## 🆘 Troubleshooting

### Glassmorphism Not Working
- Check `backdrop-filter` and `-webkit-backdrop-filter`
- Ensure parent has fixed positioning (if needed)
- Verify blur value is 8-12px

### Colors Look Wrong
- Verify CSS variables are spelled correctly
- Check browser DevTools for computed styles
- Ensure no conflicting styles override variables

### Animations Feel Slow
- Check transition timing (should be 0.15-0.3s)
- Verify cubic-bezier function (0.4, 0, 0.2, 1)
- Test on actual hardware

### Focus Visible Not Working
- Check `:focus-visible` selector browser support
- Ensure outline offset is 2px
- Verify focus color contrasts with background

---

## 📞 Support Resources

- **CSS Variables**: Check `:root` section
- **Color Palette**: See DESIGN_SYSTEM.md
- **Typography**: Review type hierarchy section
- **Spacing**: Reference spacing scale table
- **Components**: Check component specification sections

---

**Version**: 1.0
**Last Updated**: February 13, 2026
**Maintained By**: AI Design Assistant
**Status**: Production Ready ✅


# Navigation Configuration

The application uses a routes-based navigation system where the sidebar navigation is automatically generated from the routes configuration in `ui/src/app/routes.tsx`.

## How It Works

The navigation system extends the existing `routes.tsx` configuration with additional properties for controlling sidebar appearance:

- **`icon`** - Optional Carbon icon component for the route/group
- **`divider`** - Boolean to add a divider after the route/group
- **`defaultExpanded`** - Boolean for groups to control initial expansion state

## Adding Navigation Items

### 1. Standalone Navigation Link

Add a route with a `label` property to make it appear in the sidebar:

```typescript
{
  element: <MyPage />,
  label: 'My Page',
  path: '/my-page',
  icon: MyIcon, // Optional: from @carbon/icons-react
  divider: true, // Optional: adds divider after this item
}
```

### 2. Navigation Group

Group related routes under a collapsible menu:

```typescript
{
  label: 'My Group',
  defaultExpanded: true, // Optional: expand by default
  icon: GroupIcon, // Optional
  divider: true, // Optional: adds divider after group
  routes: [
    {
      element: <Page1 />,
      label: 'Page 1',
      path: '/page1',
    },
    {
      element: <Page2 />,
      label: 'Page 2',
      path: '/page2',
    },
    // Detail pages without labels won't appear in nav
    {
      element: <Page1Detail />,
      path: '/page1/:id',
    },
  ],
}
```

### 3. Hidden Routes

Routes without a `label` property won't appear in the sidebar but will still be accessible:

```typescript
{
  element: <DetailPage />,
  path: '/items/:id', // No label = not in sidebar
}
```

## Current Navigation Structure

```
├── Dashboard
├── ─────────── (divider)
├── Data Management (group, expanded)
│   ├── Events
│   ├── Generations
│   └── Enhancements
├── ─────────── (divider)
└── Help
```

## Example: Adding a New Section

To add a new "Reports" section with dividers:

```typescript
// In ui/src/app/routes.tsx
import { Report } from '@carbon/icons-react';
import { ReportsPage } from './components/Pages/Reports/ReportsPage';

const routes: AppRouteConfig[] = [
  // ... existing routes ...
  
  {
    element: <ReportsPage />,
    label: 'Reports',
    path: '/reports',
    icon: Report,
    divider: true, // Add divider after Reports
  },
  
  // ... rest of routes ...
];
```

## Benefits

- **Single Source of Truth**: Routes and navigation defined in one place
- **Framework Standard**: Extends existing route configuration pattern
- **Type-Safe**: Full TypeScript support with existing interfaces
- **Automatic**: Navigation updates when routes change
- **Flexible**: Support for links, groups, dividers, and icons

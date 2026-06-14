# Add Translation

Add new translation keys or a new locale to the i18n system.

## Architecture

The i18n system uses **i18next** + **react-i18next** and lives entirely under `src/langs/`:

```
src/langs/
  i18n.ts        — init config (interpolation, default language)
  resources.ts   — assembles locales into the RESOURCES object
  en-US.json     — English (American) translations
  pt-BR.json     — Brazilian Portuguese translations
```

It is bootstrapped as a side effect import in `src/main.tsx`:

```ts
import './langs/i18n.js'
```

No other bootstrapping is needed. Once imported, the configured `i18n` instance is available globally via the hook or direct import.

## Locale Key Convention

Locale keys in `resources.ts` use **camelCase without hyphens**, not the BCP 47 tag:

| Display name       | JSON file    | Key in resources.ts |
|--------------------|--------------|---------------------|
| American English   | `en-US.json` | `enUS`              |
| Brazilian Portuguese | `pt-BR.json` | `ptBR`            |

This means `i18n.changeLanguage('enUS')` — not `'en-US'`.

The default and fallback language configured in `i18n.ts` is `'enUS'`.

## Using Translations in Components

**Preferred pattern — React hook** (use inside React components):

```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()
  return <p>{t('some.nested.key')}</p>
}
```

Use `{ t, i18n }` when you also need to call `i18n.changeLanguage()`:

```tsx
const { t, i18n } = useTranslation()
i18n.changeLanguage('ptBR')
```

**Alternative — direct instance** (use outside React, e.g. non-component files):

```ts
import i18n from '@/langs/i18n'

const { t } = i18n
t('some.key')
```

## Translation Key Structure

Keys are nested JSON objects accessed with dot notation. Group keys by feature/page:

```json
{
  "topLevelKey": "value",
  "featureName": {
    "title": "...",
    "description": "...",
    "nested": {
      "deepKey": "..."
    }
  }
}
```

Access: `t('featureName.nested.deepKey')`

## Currency Interpolation

A custom `format` function is registered in `i18n.ts`. Use it for monetary values:

```ts
t('someKey', { value: 1234.56, format: 'currency' })
```

The currency is resolved from the active locale: `enUS` → USD, `ptBR` → BRL.
The `lng` passed to the formatter is the BCP 47 tag (`'pt-BR'`, `'en-US'`), not the resource key.

## Language Switching

Call `i18n.changeLanguage(key)` with the resource key (`'enUS'` or `'ptBR'`).
The available keys and their icon names are exposed by `RESOURCES` in `resources.ts`:

```ts
import { RESOURCES } from '@/langs/resources'

// RESOURCES.enUS.iconName  → 'FlagUSA'
// RESOURCES.ptBR.iconName  → 'FlagBrazil'

Object.keys(RESOURCES).forEach(key => {
  i18n.changeLanguage(key) // key is 'enUS' | 'ptBR'
})
```

## Step-by-Step: Adding New Translation Keys

1. **Add the key to `en-US.json`** under the appropriate namespace/group.
2. **Add the same key to `pt-BR.json`** with the Portuguese translation.
3. Use `t('your.new.key')` in your component — no other files need updating.

Example — adding a `settings` section:

```json
// en-US.json
{
  "settings": {
    "title": "Settings",
    "language": "Language"
  }
}

// pt-BR.json
{
  "settings": {
    "title": "Configurações",
    "language": "Idioma"
  }
}
```

## Step-by-Step: Adding a New Locale

1. Create `src/langs/xx-XX.json` with all translated keys.
2. Import it in `resources.ts` and add an entry to `RESOURCES`:

```ts
import xxXX from './xx-XX.json'

export const RESOURCES = {
  enUS: { translation: enUS, iconName: 'FlagUSA' },
  ptBR: { translation: ptBR, iconName: 'FlagBrazil' },
  xxXX: { translation: xxXX, iconName: 'FlagXX' },  // ← add here
}
```

3. Add a currency case in the `setCurrency` function in `i18n.ts` if needed.
4. The new key (`'xxXX'`) is now valid for `i18n.changeLanguage('xxXX')`.

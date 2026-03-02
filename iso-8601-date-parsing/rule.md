# ⚠️ Rule — Always use ISO 8601 when constructing dates

## The format

```
YYYY-MM-DD  →  2026-03-02
```

- **Year first**, month second, day last
- Always **dashes**, never slashes
- This is the only format `new Date()` is guaranteed to parse correctly across all browsers, environments, and locales

## What ISO 8601 covers

| Format | Example | What it is |
|---|---|---|
| `YYYY-MM-DD` | `2026-03-02` | Date only |
| `YYYY-MM-DDTHH:mm:ss` | `2026-03-02T10:30:00` | Date + time (local) |
| `YYYY-MM-DDTHH:mm:ssZ` | `2026-03-02T10:30:00Z` | Date + time (UTC) |
| `YYYY-MM-DDTHH:mm:ss+HH:mm` | `2026-03-02T10:30:00+11:00` | Date + time + timezone offset |

## What to avoid

```js
new Date('02/03/2026')           // ❌ ambiguous — JS reads as Feb 3rd
new Date('2 Mar 2026')           // ❌ implementation-defined — risky
new Date('March 2, 2026')        // ❌ implementation-defined — risky
```

## What is safe

```js
new Date('2026-03-02')           // ✅ ISO — always March 2nd, everywhere
new Date('2026-03-02T10:00:00Z') // ✅ ISO with time — always safe
```

## If the date comes from an API in a non-ISO format

Do not pass it to `new Date()` directly. Parse it explicitly with `date-fns`:

```js
import { parse } from 'date-fns';

// Tell the parser exactly what the format is
parse('02/03/2026', 'dd/MM/yyyy', new Date())
// → correct Date: March 2nd, 2026  ✅
```

## What is ISO 8601?

It is an **international standard** published by the ISO (International Organization for Standardization) that defines a single unambiguous format for representing dates and times. Before it existed, every country wrote dates differently — cross-border software was a mess. ISO 8601 (published 1988) fixed that. Year-first also means dates sort correctly as plain strings alphabetically.

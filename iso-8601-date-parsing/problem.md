# The Problem — Passing non-ISO date strings to `new Date()`

## What goes wrong

Your API returns a date string in Australian format:

```
'02/03/2026'
```

You pass it directly to JavaScript:

```js
new Date('02/03/2026')
// → February 3rd, 2026  ❌
```

You meant **2nd of March**. JavaScript read it as **February 3rd**.

## Why JavaScript gets it wrong

`new Date()` only has one guaranteed format: ISO 8601 (`YYYY-MM-DD`).

For everything else — slashes, dots, locale strings — JS makes a guess.
V8 (Chrome/Node) guesses **American**: slashes = `MM/DD/YYYY`.

## Why this is dangerous

Both dates are valid. JavaScript does not throw an error.

```js
new Date('02/03/2026')  // silently wrong — Feb 3rd, not Mar 2nd
```

No crash. No warning. You ship wrong data and may not notice for days.

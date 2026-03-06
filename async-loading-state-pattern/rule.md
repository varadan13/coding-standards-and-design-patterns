# Rule: Async Loading State Must Use try/catch/finally

## The Rule

Any function that sets a loading state to `true` before an `async`/`await` call **must** reset it to `false` in a `finally` block — not scattered across individual branches.

```
setLoading(true)
  → try { ... }
  → catch { ... }
  → finally { setLoading(false) }  ← only place allowed
```

This is a hard standard. No exceptions unless documented explicitly (see Edge Cases).

---

## Why

- `setLoading(false)` placed inside `try` or `catch` branches will be silently skipped if a new code path is added later
- One missed `return` after `setLoading(true)` = infinite loader with no recovery
- `finally` runs unconditionally — it is the only pattern that is correct-by-construction

---

## The Standard Pattern

```js
const fetchSomething = async () => {
  setLoading(true);
  try {
    const data = await callApi();
    setState(data);
  } catch (err) {
    console.error('fetchSomething failed', err);
    // reset state, show toast, etc.
  } finally {
    setLoading(false); // always runs — one place, guaranteed
  }
};
```

---

## Edge Cases

### Early return BEFORE setLoading(true) — no finally needed
```js
if (!userId) return; // fine — loading was never set

setLoading(true);
try { ... } finally { setLoading(false); }
```

### Early return AFTER setLoading(true) — must reset before returning
```js
setLoading(true);

if (someCondition) {
  setLoading(false); // required before early return
  return;
}

try { ... } finally { setLoading(false); }
```
Prefer restructuring to avoid early returns after `setLoading(true)` — move the guard before the loading call.

### Chained/dependent fetches — one finally wraps the chain
```js
setLoading(true);
try {
  const a = await fetchA();
  const b = await fetchB(a); // both under one try
} finally {
  setLoading(false); // one finally, not one per await
}
```

### Optimistic updates — explicit exception, must be commented
If loading is intentionally set to false before the await (e.g. optimistic UI), document it explicitly:
```js
// OPTIMISTIC: loading cleared before await — revert in catch if needed
setLoading(false);
const result = await submitOrder();
```

---

## Summary Rule

> **If you call `setLoading(true)`, the only place `setLoading(false)` is allowed is in a `finally` block.**

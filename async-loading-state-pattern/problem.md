# Problem: Scattered `setLoading(false)` Calls

## The Anti-Pattern

Manually calling `setLoading(false)` in each branch of a try/catch, or inside early returns, instead of using `finally`.

---

## Why It Breaks

Every branch must remember to reset loading. Add one new code path and forget — infinite loader. No lint rule catches it. No test will catch it until a user reports it.

### Guaranteed infinite loader example

```js
const fetchCart = async (cartId) => {
  setCartLoading(true);

  if (!isLoggedIn && !cartId) {
    return; // BUG: loading is true, never reset — infinite loader
  }

  try {
    const data = await getCart(cartId);
    setCart(data);
    setCartLoading(false); // only runs on success
  } catch (err) {
    console.error(err);
    setCart([]);
    setCartLoading(false); // only runs on catch
  }
};
```

**Failure scenario**: user is not logged in and has no cartId → hits the early `return` → `setCartLoading(true)` was already called → spinner never stops → user must hard refresh.

---

## Fragility Over Time

```js
try {
  const list = await getCart();

  if (list[0].id === lastDeletedId) {
    setCartLoading(false); // easy to forget on new branches
    return;
  }

  const details = await fetchDetails(list[0].id);
  setData(details);
  setCartLoading(false); // easy to miss if new await is added above
} catch (err) {
  setCartLoading(false); // duplicated, fragile
}
```

Every new developer touching this function must remember to add `setLoading(false)` in the right places. This is an error-prone convention — not a guarantee.

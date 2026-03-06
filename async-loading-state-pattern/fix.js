/**
 * FIX: Use try/catch/finally — setLoading(false) in finally only
 *
 * The finally block runs unconditionally regardless of success, error,
 * or early return. This makes loader teardown correct-by-construction.
 *
 * Rules demonstrated:
 * 1. Guards that don't need loading go BEFORE setLoading(true)
 * 2. setLoading(false) appears exactly ONCE — in finally
 * 3. No scattered calls in try branches or catch
 */

const fetchCart = async (cartId) => {
  // Guard BEFORE setLoading(true) — no finally needed here
  if (!isLoggedIn && !cartId) {
    return;
  }

  setCartLoading(true);
  try {
    const list = await getCart(cartId);

    if (list[0]?.id === lastDeletedId) {
      return; // finally still runs — loading will be reset
    }

    const details = await fetchDetails(list[0].id);
    setCart(details);

  } catch (err) {
    console.error('fetchCart failed', err);
    setCart([]);
  } finally {
    setCartLoading(false); // always runs — one place, guaranteed
  }
};

/**
 * PROBLEM: Scattered setLoading(false) calls
 *
 * This demonstrates the anti-pattern where setLoading(false) is placed
 * manually in each branch instead of a finally block.
 *
 * Bugs in this code:
 * 1. Early return at line ~10 exits without resetting loading → infinite loader
 * 2. setLoading(false) duplicated in try and catch — fragile, easy to miss
 * 3. Adding any new early return will silently cause another infinite loader
 */

const fetchCart = async (cartId) => {
  setCartLoading(true);

  // BUG: early return without resetting loading
  if (!isLoggedIn && !cartId) {
    return;
  }

  try {
    const list = await getCart(cartId);

    // BUG: another early return — easy to forget setCartLoading(false) here
    if (list[0]?.id === lastDeletedId) {
      setCartLoading(false);
      return;
    }

    setCart(list);
    setCartLoading(false); // only runs on happy path

  } catch (err) {
    console.error(err);
    setCart([]);
    setCartLoading(false); // duplicated — easy to miss on new branches
  }
};

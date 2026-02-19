export const isWeakPin = (pin) => {
  if (!pin || pin.length !== 4) return true;

  // All digits same (1111, 2222)
  if (/^(\d)\1{3}$/.test(pin)) return true;

  // Sequential ascending (1234)
  if ("0123456789".includes(pin)) return true;

  // Sequential descending (4321)
  if ("9876543210".includes(pin)) return true;

  return false;
};

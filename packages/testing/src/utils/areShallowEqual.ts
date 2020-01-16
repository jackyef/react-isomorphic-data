const areEqualShallow = (a: Record<string, any> = {}, b: Record<string, any> = {}): boolean => {
  for (const key in a) {
    if (!(key in b) || a[key] !== b[key]) {
      return false;
    }
  }
  for (const key in b) {
    if (!(key in a) || a[key] !== b[key]) {
      return false;
    }
  }
  return true;
};

export default areEqualShallow;

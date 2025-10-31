export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  wait = 300
) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: TArgs) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

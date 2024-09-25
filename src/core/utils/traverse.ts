export interface Traversable {
  children?: Traversable[];
  Children?: Traversable[];
}

export function forEach<T extends Traversable>(
  obj: T,
  callback: (obj: T) => void,
) {
  callback(obj);
  for (const child of obj.children ?? obj.Children ?? []) {
    forEach(child as T, callback);
  }
}

export function find<T extends Traversable>(
  obj: T,
  callback: (obj: T) => boolean,
): T | undefined {
  if (callback(obj)) {
    return obj;
  }
  for (const child of obj.children ?? obj.Children ?? []) {
    const result = find(child as T, callback);
    if (result) {
      return result;
    }
  }
  return undefined;
}

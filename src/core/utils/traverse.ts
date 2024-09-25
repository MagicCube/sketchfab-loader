export interface Traversable {
  children: Traversable[];
}

export function traverse<T extends Traversable>(
  obj: T,
  callback: (obj: T) => void,
) {
  callback(obj);
  for (const child of obj.children) {
    traverse(child as T, callback);
  }
}

export function find<T extends Traversable>(
  obj: T,
  callback: (obj: T) => boolean,
): T | undefined {
  if (callback(obj)) {
    return obj;
  }
  for (const child of obj.children) {
    const result = find(child as T, callback);
    if (result) {
      return result;
    }
  }
  return undefined;
}

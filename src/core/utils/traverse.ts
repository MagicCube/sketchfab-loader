export interface Traversable {
  children?: Traversable[];
}

export function forEach<T extends Traversable>(
  obj: T,
  callback: (obj: T) => void,
) {
  callback(obj);
  for (const child of obj.children ?? []) {
    forEach(child as T, callback);
  }
}

export function* traverse<T extends Traversable>(
  obj: T,
  filter: (obj: T) => boolean = () => true,
): Iterable<T> {
  if (filter(obj)) {
    yield obj;
  }
  for (const child of obj.children ?? []) {
    yield* traverse(child as T, filter);
  }
}

export function find<T extends Traversable>(
  obj: T,
  callback: (obj: T) => boolean,
): T | undefined {
  if (callback(obj)) {
    return obj;
  }
  for (const child of obj.children ?? []) {
    const result = find(child as T, callback);
    if (result) {
      return result;
    }
  }
  return undefined;
}

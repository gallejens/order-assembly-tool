export type ObjEntries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

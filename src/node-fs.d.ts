/** The two node:fs calls the tests make (they run in Node). The project doesn't include Node's types. */
declare module 'node:fs' {
  export function existsSync(path: URL): boolean;
  export function readFileSync(path: URL): Uint8Array;
}

declare module 'jws' {
  export function decode(token: string, options?: any): any;
  export function sign(opts: any): string;
}

declare module 'jws' {
  export function decode(token: string): any;
  export function sign(payload: any): string;
}
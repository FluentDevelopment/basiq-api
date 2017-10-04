declare module 'jws' {
  export function decode(token: string): any;
  export function sign(token: any): string;
}

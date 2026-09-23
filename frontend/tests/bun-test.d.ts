declare module "bun:test" {
  export function describe(name: string, fn: () => void): void;
  export function test(name: string, fn: () => void | Promise<void>): void;
  export function beforeEach(fn: () => void | Promise<void>): void;
  export function afterEach(fn: () => void | Promise<void>): void;
  export function expect(actual: any): {
    toBe(expected: any): void;
    toEqual(expected: any): void;
    toHaveProperty(prop: string): void;
    toBeGreaterThan(expected: number): void;
    toBeLessThan(expected: number): void;
    toBeDefined(): void;
    toBeNull(): void;
    toBeUndefined(): void;
    toContain(expected: any): void;
    not: {
      toBe(expected: any): void;
      toBeNull(): void;
      toBeUndefined(): void;
    };
  };
}

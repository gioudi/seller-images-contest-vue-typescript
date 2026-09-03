const maybeObserver = (globalThis as { ResizeObserver?: typeof ResizeObserver })
  .ResizeObserver;
if (!maybeObserver) {
  globalThis.ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): ResizeObserverEntry[] {
      return [];
    }
  };
}

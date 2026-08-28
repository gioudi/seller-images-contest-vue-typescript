if (!global.ResizeObserver) {
  global.ResizeObserver = class ResizeObserver {
    observe = () => undefined;
    unobserve = () => undefined;
    disconnect = () => undefined;
  };
}

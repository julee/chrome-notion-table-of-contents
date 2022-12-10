export const debounce = (fn: () => void, delay: number): (() => void) => {
  let timeoutID: number | null = null;
  return () => {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    timeoutID = window.setTimeout(() => {
      fn();
    }, delay);
  };
};

export const getContainer = (): HTMLElement => {
  return querySelector('.notion-frame .notion-scroller');
};

export const querySelector = (selector: string): HTMLElement => {
  const elem = document.querySelector<HTMLElement>(selector);
  if (!elem) {
    throw new Error(`"${selector}" is not found`);
  }
  return elem;
};

export const waitFor = (selector: string): Promise<HTMLElement> => {
  return new Promise((resolve) => {
    const getElements = (fn?: () => void) => {
      const elem = document.querySelector<HTMLElement>(selector);
      if (elem) {
        if (fn) fn();
        resolve(elem);
      }
    };
    getElements();

    const id = setInterval(() => {
      getElements(() => {
        clearInterval(id);
      });
    }, 300);
  });
};

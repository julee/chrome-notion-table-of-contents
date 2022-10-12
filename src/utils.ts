export const waitFor = (selector: string): Promise<NodeListOf<HTMLElement>> => {
  return new Promise((resolve) => {
    const getElements = (fn?: () => void) => {
      const elems = document.querySelectorAll<HTMLElement>(selector);
      if (elems.length > 0) {
        if (fn) fn();
        resolve(elems);
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

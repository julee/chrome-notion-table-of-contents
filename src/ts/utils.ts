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
  return $('.notion-frame .notion-scroller');
};

export const $ = (selector: string): HTMLElement => {
  const elem = document.querySelector<HTMLElement>(selector);
  if (!elem) {
    throw new Error(`"${selector}" is not found`);
  }
  return elem;
};

const GET_ELEMENT_INTERVAL = 100;

export const waitFor = (selector: string): Promise<HTMLElement> => {
  return new Promise((resolve) => {
    const getElement = (fn?: () => void) => {
      const elem = document.querySelector<HTMLElement>(selector);
      if (elem) {
        if (fn) fn();
        resolve(elem);
      }
    };
    getElement();

    const id = setInterval(() => {
      getElement(() => {
        clearInterval(id);
      });
    }, GET_ELEMENT_INTERVAL);
  });
};

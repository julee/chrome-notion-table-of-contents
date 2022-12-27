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
const TIMEOUT = 15_000;

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

    let elapsed = 0;
    const id = setInterval(() => {
      elapsed += GET_ELEMENT_INTERVAL;
      if (elapsed >= TIMEOUT) {
        console.error(`# Timeout for ${selector}`);
        clearInterval(id);
        return;
      }
      getElement(() => {
        clearInterval(id);
      });
    }, GET_ELEMENT_INTERVAL);
  });
};

export function waitFor(selector: string): Promise<NodeListOf<HTMLElement>> {
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
}

export function debounce(fn: () => void, delay: number): () => void {
  let timeoutID: number | null = null;
  return () => {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    timeoutID = window.setTimeout(() => {
      fn();
    }, delay);
  };
}

export function getContainer(): HTMLElement {
  return querySelector('.notion-frame .notion-scroller');
}

export function querySelector(selector: string): HTMLElement {
  const elem = document.querySelector<HTMLElement>(selector);
  if (!elem) {
    throw new Error(`"${selector}" is not found`);
  }
  return elem;
}

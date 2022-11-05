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

export function getContainer() {
  const container = document.querySelector('.notion-frame .notion-scroller');
  if (!container) {
    throw new Error('".notion-frame .notion-scroller" is not found');
  }
  return container;
}

export const waitFor = (selector: string): Promise<NodeListOf<HTMLElement>> => {
  return new Promise(resolve => {
    const id = setInterval(() => {
      const elems = document.querySelectorAll<HTMLElement>(selector);
      if (elems.length > 0) {
        clearInterval(id);
        resolve(elems);
      }
    }, 300);
  });
};
import { atom } from 'jotai';
import { atomWithReset, RESET } from 'jotai/utils';

const STORAGE_KEY = 'FOLDED';

// ========================================
// Primitive Atom
// ========================================

export const showsTailFoldButtonAtom = atom(false);
export const maxHeightAtom = atomWithReset('26vh');
export const tailFoldedAtom = atom(true);
const _wholeFoldedAtom = atom<boolean | undefined>(undefined);
export const wholeFoldedAtom = atom(
  async (get) => {
    const val = get(_wholeFoldedAtom);
    if (val === undefined)
      return (
        ((await chrome.storage.local.get(STORAGE_KEY))[STORAGE_KEY] as
          | boolean
          | undefined) ?? false
      );
    return val;
  },
  async (_get, set, val: boolean) => {
    set(_wholeFoldedAtom, val);
    await chrome.storage.local.set({ [STORAGE_KEY]: val });
  },
);

// ========================================
// Selector Atom
// ========================================

export const handlePageMoveAtom = atom(null, (get, set) => {
  console.info('# jotai: PageMoveAtom');
  set(tailFoldedAtom, true);
  set(showsTailFoldButtonAtom, calcShowsTailFoldButton(get(tailFoldedAtom)));
});

export const handleHeadingsUpdateAtom = atom(null, (get, set) => {
  console.info('# jotai: HeadingsUpdateAtom');
  set(showsTailFoldButtonAtom, calcShowsTailFoldButton(get(tailFoldedAtom)));
});

export const handleResizeAtom = atom(null, (get, set) => {
  console.info('# jotai: ResizeAtom');
  set(maxHeightAtom, calcMaxHeight(get(tailFoldedAtom)));
  set(showsTailFoldButtonAtom, calcShowsTailFoldButton(get(tailFoldedAtom)));
});

export const handleTailFoldButtonClickAtom = atom(null, (get, set) => {
  console.info('# jotai: TailFoldButtonClickAtom');
  const folded = !get(tailFoldedAtom);
  set(tailFoldedAtom, folded);
  set(maxHeightAtom, calcMaxHeight(folded));
});

export const handleWholeFoldButtonClickAtom = atom(null, async (get, set) => {
  console.info('# jotai: WholeFoldButtonClickAtom');
  const folded = !(await get(wholeFoldedAtom));
  await set(wholeFoldedAtom, folded);
  if (!folded)
    setTimeout(
      () =>
        set(
          showsTailFoldButtonAtom,
          calcShowsTailFoldButton(get(tailFoldedAtom)),
        ),
      0,
    );
});

// ========================================
// Utils
// ========================================

function calcShowsTailFoldButton(tailFolded: boolean): boolean {
  if (!tailFolded) return true;

  const headings = document.querySelector('.toc-headings,.toc-no-headings');
  if (!headings)
    throw new Error('".toc-headings,.toc-no-headings" is not found');
  return headings.scrollHeight > headings.clientHeight; // has scrollbar
}

function calcMaxHeight(tailFolded: boolean) {
  if (tailFolded) return RESET;

  const container = document.querySelector<HTMLElement>('.toc-container');
  if (!container) throw new Error('.toc-container is not found');
  return window.innerHeight - container.offsetTop - 69 + 'px';
}

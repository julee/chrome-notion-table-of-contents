import { atom } from 'jotai';
import { atomWithReset, RESET } from 'jotai/utils';
import { $ } from './utils';

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

const updateShowsTailFoldButtonAtom = atom(null, (get, set) => {
  set(showsTailFoldButtonAtom, calcShowsTailFoldButton(get(tailFoldedAtom)));
});

const updateMaxHeightAtom = atom(null, (get, set) => {
  set(maxHeightAtom, calcMaxHeight(get(tailFoldedAtom)));
});

export const handlePageMoveAtom = atom(null, (_get, set) => {
  set(tailFoldedAtom, true);
  set(updateShowsTailFoldButtonAtom);
});

export const handleHeadingsUpdateAtom = atom(null, (_get, set) => {
  set(updateShowsTailFoldButtonAtom);
});

export const handleResizeAtom = atom(null, (_get, set) => {
  set(updateMaxHeightAtom);
  set(updateShowsTailFoldButtonAtom);
});

export const handleTailFoldButtonClickAtom = atom(null, (get, set) => {
  const folded = !get(tailFoldedAtom);
  set(tailFoldedAtom, folded);
  set(updateMaxHeightAtom);
});

export const handleWholeFoldButtonClickAtom = atom(null, async (get, set) => {
  const folded = !(await get(wholeFoldedAtom));
  await set(wholeFoldedAtom, folded);
  if (!folded) setTimeout(() => set(updateShowsTailFoldButtonAtom), 0);
});

// ========================================
// Utils
// ========================================

function calcShowsTailFoldButton(tailFolded: boolean): boolean {
  if (!tailFolded) return true;

  const headings = $('.toc-headings,.toc-no-headings');
  return headings.scrollHeight > headings.clientHeight; // has scrollbar
}

function calcMaxHeight(tailFolded: boolean) {
  if (tailFolded) return RESET;

  const container = $('.toc-container');
  return window.innerHeight - container.offsetTop - 69 + 'px';
}

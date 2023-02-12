import { ACTION } from '../../constants';

export const Reducer = (
  prevState: State,
  action: { type: valueOf<typeof ACTION> },
): State => {
  switch (action.type) {
    case ACTION.PAGE_CHANGED:
      return { ...prevState, tailFolded: true };
    default:
      throw new TypeError(`Unknown type: ${action.type}`);
  }
};

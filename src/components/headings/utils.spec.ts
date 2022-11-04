/**
 * @jest-environment jsdom
 */

import { extractHeadings } from './utils';

const wrap = (str: string) => `
  <div class="notion-frame">
    <div class="notion-scroller">
      ${str}
    </div>
  </div>`;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('extractHeadings', () => {
  it('basic', () => {
    document.body.innerHTML = wrap(`
      <div data-block-id="h1-xxx">
        <div placeholder="Heading 1">
          This is h1
        </div>
      </div>
      <div data-block-id="h2-xxx">
        <div placeholder="Heading 2">
          This is h2
        </div>
      </div>
      <div data-block-id="h3-xxx">
        <div placeholder="Heading 3">
          This is h3
        </div>
      </div>
    `);
    expect(extractHeadings()).toEqual([
      {
        text: 'This is h1',
        rank: 1,
        blockId: 'h1-xxx',
        offset: 0,
        isFocused: false,
      },
      {
        text: 'This is h2',
        rank: 2,
        blockId: 'h2-xxx',
        offset: 0,
        isFocused: false,
      },
      {
        text: 'This is h3',
        rank: 3,
        blockId: 'h3-xxx',
        offset: 0,
        isFocused: false,
      },
    ]);
  });
  it('un-indent', () => {
    document.body.innerHTML = wrap(`
      <div data-block-id="h2-xxx">
        <div placeholder="Heading 2">
          This is h2
        </div>
      </div>
      <div data-block-id="h3-xxx">
        <div placeholder="Heading 3">
          This is h3
        </div>
      </div>
    `);
    expect(extractHeadings()).toEqual([
      {
        text: 'This is h2',
        rank: 1,
        blockId: 'h2-xxx',
        offset: 0,
        isFocused: false,
      },
      {
        text: 'This is h3',
        rank: 2,
        blockId: 'h3-xxx',
        offset: 0,
        isFocused: false,
      },
    ]);
  });
});

describe('setHighlight', () => {
  // const spy = jest
  //   .spyOn(HTMLElement.prototype, 'offsetTop', 'get')
  //   .mockReturnValue(10);
  expect(1).toBe(1);
});

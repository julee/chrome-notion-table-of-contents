import { SCROLL_OFFSET } from '../../constants';
import * as utils from '../../utils';
import { extractHeadings, highlightCurrentFocused } from './utils';

const wrap = (str: string) => `
<div class="notion-frame">
  <div class="notion-scroller">
    ${str}
  </div>
</div>`;

/* eslint  @typescript-eslint/no-empty-function: 0 */
beforeAll(() => jest.spyOn(console, 'info').mockImplementation(() => {}));
afterAll(() => jest.restoreAllMocks());

describe('extractHeadings', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('basic', () => {
    document.body.innerHTML = wrap(`
      <div data-block-id="h1-xxx" class="notion-header-block">
        <div placeholder="Heading 1">
          This is h1
        </div>
      </div>
      <div data-block-id="h2-xxx" class="notion-sub_header-block">
        <div placeholder="Heading 2">
          This is h2
        </div>
      </div>
      <div data-block-id="h3-xxx" class="notion-sub_sub_header-block">
        <div placeholder="Heading 3">
          This is h3
        </div>
      </div>
    `);
    expect(extractHeadings()).toEqual([
      {
        text: 'This is h1',
        level: 1,
        blockId: 'h1-xxx',
        offset: 0,
        isFocused: false,
      },
      {
        text: 'This is h2',
        level: 2,
        blockId: 'h2-xxx',
        offset: 0,
        isFocused: false,
      },
      {
        text: 'This is h3',
        level: 3,
        blockId: 'h3-xxx',
        offset: 0,
        isFocused: false,
      },
    ]);
  });

  test('toggle heading', () => {
    document.body.innerHTML = wrap(`
      <div data-block-id="h1-xxx" class="notion-header-block">
        <div>
          <div>
            <div class="pseudoSelection">
            </div>
            <div>
              <div>
                <div
                  class="notranslate"
                  spellcheck="true"
                  placeholder="Heading 1"
                  data-content-editable-leaf="true"
                  contenteditable="true"
                >
                  This is h1
                </div>
              </div>
              <div>
                <div data-block-id="h2-xxx" class="notion-sub_header-block">
                  <div
                    class="notranslate"
                    spellcheck="true"
                    placeholder="Heading 2"
                    data-content-editable-leaf="true"
                    contenteditable="true"
                  >
                    This is h2
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
    expect(extractHeadings()).toEqual([
      {
        text: 'This is h1',
        level: 1,
        blockId: 'h1-xxx',
        offset: 0,
        isFocused: false,
      },
      {
        text: 'This is h2',
        level: 2,
        blockId: 'h2-xxx',
        offset: 0,
        isFocused: false,
      },
    ]);
  });

  test('un-indent', () => {
    document.body.innerHTML = wrap(`
      <div data-block-id="h2-xxx" class="notion-sub_header-block">
        <div placeholder="Heading 2">
          This is h2
        </div>
      </div>
      <div data-block-id="h3-xxx" class="notion-sub_sub_header-block">
        <div placeholder="Heading 3">
          This is h3
        </div>
      </div>
    `);
    expect(extractHeadings()).toEqual([
      {
        text: 'This is h2',
        level: 1,
        blockId: 'h2-xxx',
        offset: 0,
        isFocused: false,
      },
      {
        text: 'This is h3',
        level: 2,
        blockId: 'h3-xxx',
        offset: 0,
        isFocused: false,
      },
    ]);
  });

  test('removes empty blocks', () => {
    document.body.innerHTML = wrap(`
      <div data-block-id="h1-xxx" class="notion-sub_header-block">
        <div placeholder="Heading 2">
        </div>
      </div>
      <div data-block-id="h1-xxx" class="notion-header-block">
        <div placeholder="Heading 1">
          This is h1
        </div>
      </div>
      <div data-block-id="h3-xxx" class="notion-sub_sub_header-block">
        <div placeholder="Heading 3"> </div>
      </div>
    `);
    expect(extractHeadings()).toEqual([
      {
        text: 'This is h1',
        level: 1,
        blockId: 'h1-xxx',
        offset: 0,
        isFocused: false,
      },
    ]);
  });
});

describe('highlightCurrentFocused', () => {
  // https://github.com/jsdom/jsdom/issues/3363
  // 2 つ以上になったら setupFilesAfterEnv にまとめる
  global.structuredClone = (val: unknown) => JSON.parse(JSON.stringify(val));

  test.each([
    {
      name: 'basic',
      input: {
        scrollTop: 100 - SCROLL_OFFSET,
        headings: [{ offset: 10 }, { offset: 90 }, { offset: 110 }],
      },
      expected: [
        { isFocused: false },
        { isFocused: true },
        { isFocused: false },
      ],
    },
    {
      name: 'no headings',
      input: {
        scrollTop: 100,
        headings: [],
      },
      expected: [],
    },
    {
      name: 'scrollTop < heading[0].offset',
      input: {
        scrollTop: 0,
        headings: [{ offset: 10 }, { offset: 90 }],
      },
      expected: [{ isFocused: true }, { isFocused: false }],
    },
    {
      name: 'scrollTop > heading[-1].offset',
      input: {
        scrollTop: 100,
        headings: [{ offset: 10 }, { offset: 90 }],
      },
      expected: [{ isFocused: false }, { isFocused: true }],
    },
  ])('$name', ({ input, expected }) => {
    jest.spyOn(utils, 'getContainer').mockImplementation(() => {
      const elem = document.createElement('div');
      elem.scrollTop = input.scrollTop;
      return elem;
    });

    expect(
      highlightCurrentFocused(
        input.headings.map((heading) => ({
          blockId: 'xxx',
          text: 'text',
          level: 1,
          isFocused: false,
          ...{ offset: heading.offset },
        })),
      ).map((heading) => ({ isFocused: heading.isFocused })),
    ).toEqual(expected);
  });
});

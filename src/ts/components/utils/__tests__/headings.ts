import * as utils from '../../../utils';
import { extractHeadings, setHighlight } from '../headings';

const wrap = (str: string) => `
<div class="notion-frame">
  <div class="notion-scroller">
    ${str}
  </div>
</div>`;

describe('extractHeadings', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('basic', () => {
    document.body.innerHTML = wrap(`
      <div data-block-id="h1-xxx" class="notion-header-block">
        <div placeholder="Heading 1">
          This is h1
        </div>
      </div>
      <div data-block-id="h2-xxx" class="notion-header-block">
        <div placeholder="Heading 2">
          This is h2
        </div>
      </div>
      <div data-block-id="h3-xxx" class="notion-header-block">
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
  it('un-indent', () => {
    document.body.innerHTML = wrap(`
      <div data-block-id="h2-xxx" class="notion-header-block">
        <div placeholder="Heading 2">
          This is h2
        </div>
      </div>
      <div data-block-id="h3-xxx" class="notion-header-block">
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
});

describe('locales', () => {
  it.each([
    {
      name: 'en',
      input: { prefix: 'Heading ' },
    },
    {
      name: 'ja',
      input: { prefix: '見出し' },
    },
    {
      name: 'kr',
      input: { prefix: '제목' },
    },
    {
      name: 'fr',
      input: { prefix: 'Titre ' },
    },
  ])('$name (prefix: $input.prefix)', ({ input: { prefix } }) => {
    document.body.innerHTML = wrap(`
      <div data-block-id="h1-xxx" class="notion-header-block">
        <div placeholder="${prefix}1">This is h1</div>
      </div>
      <div data-block-id="h2-xxx" class="notion-header-block">
        <div placeholder="${prefix}2">This is h2</div>
      </div>
      <div data-block-id="h3-xxx" class="notion-header-block">
        <div placeholder="${prefix}3">This is h3</div>
      </div>
    `);

    expect(extractHeadings().map((heading) => heading.level)).toEqual([
      1, 2, 3,
    ]);
  });
});

describe('setHighlight', () => {
  // https://github.com/jsdom/jsdom/issues/3363
  // 2 つ以上になったら setupFilesAfterEnv にまとめる
  global.structuredClone = (val: unknown) => JSON.parse(JSON.stringify(val));

  it.each([
    {
      name: 'basic',
      input: {
        scrollTop: 100,
        headings: [{ offset: 10 }, { offset: 90 }, { offset: 110 }],
      },
      expects: [
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
      expects: [],
    },
    {
      name: 'scrollTop < heading[0].offset',
      input: {
        scrollTop: 0,
        headings: [{ offset: 10 }, { offset: 90 }],
      },
      expects: [{ isFocused: true }, { isFocused: false }],
    },
    {
      name: 'scrollTop > heading[-1].offset',
      input: {
        scrollTop: 100,
        headings: [{ offset: 10 }, { offset: 90 }],
      },
      expects: [{ isFocused: false }, { isFocused: true }],
    },
  ])('$name', ({ input, expects }) => {
    jest.spyOn(utils, 'getContainer').mockImplementation(() => {
      const elem = document.createElement('div');
      elem.scrollTop = input.scrollTop;
      return elem;
    });

    expect(
      setHighlight(
        input.headings.map((heading) => ({
          blockId: 'xxx',
          text: 'text',
          level: 1,
          isFocused: false,
          ...{ offset: heading.offset },
        })),
      ).map((heading) => ({ isFocused: heading.isFocused })),
    ).toEqual(expects);
  });
});

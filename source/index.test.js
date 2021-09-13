jest.mock('./styles/main.css', () => {
  return '';
});

const AlertBanner = require('./index.js');

test('jest is loaded', () => {
  expect(true).toBe(true);
});

test('umd-alert-banner is in the CustomElementRegistry as AlertBanner', () => {
  const customElement = customElements.get('umd-alert-banner');

  expect(customElement).not.toBeNull();
  expect(customElement.name).toBe('AlertBanner');
});

describe('umd-alert-banner is added to the DOM with necessary attributes and child elements', () => {
  beforeEach(() => {
    document.body.innerHTML = `<umd-alert-banner></umd-alert-banner>`;
  });

  afterEach(() => {
    document.querySelector('umd-alert-banner').remove();
  });

  test('Can add umd-alert-banner to DOM', () => {
    const umdAlertBanner = document.querySelector('umd-alert-banner');

    expect(umdAlertBanner).not.toBeNull();
  });

  test('umd-alert-banner is added to DOM with the "show" attribute', () => {
    const umdAlertBanner = document.querySelector('umd-alert-banner');

    expect(umdAlertBanner.getAttribute('show')).not.toBeUndefined();
  });

  test('umd-alert-banner contains a shadowDOM', () => {
    const umdAlertBanner = document.querySelector('umd-alert-banner');

    expect(umdAlertBanner.shadowRoot).not.toBeNull();
  });
});

describe('shadowDOM in umd-alert-banner contains expected child elements', () => {
  beforeEach(() => {
    document.body.innerHTML = `<umd-alert-banner></umd-alert-banner>`;
  });

  afterEach(() => {
    document.querySelector('umd-alert-banner').remove();
  });

  test('shadowDOM has two (2) top-level elements for layout and styles', () => {
    const shadowRoot = document.querySelector('umd-alert-banner').shadowRoot;

    expect(shadowRoot.childElementCount).toEqual(2);
    expect(shadowRoot.children[0].tagName.toLowerCase()).toBe('layout-lock');
    expect(shadowRoot.children[1].tagName.toLowerCase()).toBe('style');
  });

  test('Layout element includes a slot element as a child', () => {
    const shadowRoot = document.querySelector('umd-alert-banner').shadowRoot;
    const layout = shadowRoot.querySelector('layout-lock');
    let counter = 0;

    layout.childNodes.forEach((node) => {
      if (node.tagName.toLowerCase() == 'slot') {
        counter++;
      }
    });

    expect(counter).toEqual(1);
  });

  test('Layout element includes a button element by default', () => {
    const shadowRoot = document.querySelector('umd-alert-banner').shadowRoot;
    const layout = shadowRoot.querySelector('layout-lock');
    let counter = 0;

    layout.childNodes.forEach((node) => {
      if (node.tagName.toLowerCase() == 'button') {
        counter++;
      }
    });

    expect(counter).toEqual(1);
  });
});

describe('Set attributes return expected results', () => {
  describe('Close Button loads with expected textContent', () => {
    const defaultButtonText = 'Close';
    const listOfStrings = [
      'Lorem ipsum dolor sit amet',
      'consectetur adipiscing elit',
      'sed do eiusmod tempor incididunt',
      'ut labore et dolore magna aliqua',
    ];
    const getListIndex = Math.floor(Math.random() * listOfStrings.length);
    const testButtonText = listOfStrings[getListIndex];

    beforeEach(() => {
      document.body.innerHTML = `
        <umd-alert-banner id="default-text"></umd-alert-banner>
        <umd-alert-banner id="custom-text" button="${testButtonText}"></umd-alert-banner>
      `;
    });

    afterEach(() => {
      document.body.innerHTML = ``;
    });

    test("The default button text is 'Close'", () => {
      const shadowRoot = document.getElementById('default-text').shadowRoot;
      const buttonText = shadowRoot.querySelector('button').textContent;

      expect(buttonText).toBe(defaultButtonText);
    });

    test('The button text is set by the button attribute', () => {
      const shadowRoot = document.getElementById('custom-text').shadowRoot;
      const buttonText = shadowRoot.querySelector('button').textContent;

      expect(buttonText).toBe(testButtonText);
    });
  });

  describe('Add dismissable attribute', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <umd-alert-banner id="dismissable-false" dismissable="false"></umd-alert-banner>
        <umd-alert-banner id="dismissable-not-boolean" dismissable="not a boolean value"></umd-alert-banner>
      `;
    });

    afterEach(() => {
      document.body.innerHTML = ``;
    });

    test('The element does not have a button element if dismissable=false', () => {
      const umdAlertBanner = document.getElementById('dismissable-false');
      const shadowRoot = umdAlertBanner.shadowRoot;
      const button = shadowRoot.querySelector('button');

      expect(button).toBeNull();
    });

    test('The element is not affected by dismissable values other than "false"', () => {
      const umdAlertBanner = document.getElementById('dismissable-not-boolean');
      const shadowRoot = umdAlertBanner.shadowRoot;
      const button = shadowRoot.querySelector('button');

      expect(button.textContent).toBe('Close');
    });
  });

  describe('Add padding and size with number + unit values', () => {
    const testPadding = `${Math.floor(Math.random() * 40)}px`;
    const testSizing = `${Math.floor(Math.random() * 40)}px`;

    beforeEach(() => {
      document.body.innerHTML = `
        <umd-alert-banner id="with-neither"></umd-alert-banner>
        <umd-alert-banner id="with-padding" padding="${testPadding}"></umd-alert-banner>
        <umd-alert-banner id="with-size" size="${testSizing}"></umd-alert-banner>
      `;
    });

    afterEach(() => {
      document.body.innerHTML = ``;
    });

    test('The layout element has default styling', () => {
      const shadowRoot = document.getElementById('with-neither').shadowRoot;
      const expectedStyles = `layout-lock{padding:0;max-width:initial;}`;
      const styles = shadowRoot
        .querySelector('style')
        .innerHTML.replace(/\r?\n|\r| +/g, '');

      expect(styles).toContain(expectedStyles);
    });

    test('The padding attribute value is set as padding on the layout element', () => {
      const shadowRoot = document.getElementById('with-padding').shadowRoot;
      const expectedStyles = `layout-lock{padding:${testPadding};max-width:initial;}`;
      const styles = shadowRoot
        .querySelector('style')
        .innerHTML.replace(/\r?\n|\r| +/g, '');

      expect(styles).toContain(expectedStyles);
    });

    test('The size attribute value is set as max-width on the layout element', () => {
      const shadowRoot = document.getElementById('with-size').shadowRoot;
      const expectedStyles = `layout-lock{padding:0;max-width:${testSizing};}`;
      const styles = shadowRoot
        .querySelector('style')
        .innerHTML.replace(/\r?\n|\r| +/g, '');

      expect(styles).toContain(expectedStyles);
    });
  });
});

describe('Close button functionality', () => {
  describe('Close button functionality on a single element', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <umd-alert-banner></umd-alert-banner>
      `;
    });

    afterEach(() => {
      document.body.innerHTML = ``;
    });

    test('umdAlertBanner is removed on button click', () => {
      const umdAlertBanner = document.querySelector('umd-alert-banner');
      const button = umdAlertBanner.shadowRoot.querySelector('button');

      expect(document.querySelector('umd-alert-banner')).toBe(umdAlertBanner);

      button.click();

      expect(document.querySelector('umd-alert-banner')).toBeNull();
    });
  });

  describe('Close button functionality on multiple elements', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <umd-alert-banner id="first-alert"></umd-alert-banner>
        <umd-alert-banner id="second-alert"></umd-alert-banner>
        <umd-alert-banner id="third-alert"></umd-alert-banner>
      `;
    });

    afterEach(() => {
      document.body.innerHTML = ``;
    });

    test('Clicking close button on one umd-alert-banner does not close the any other', () => {
      const secondAlert = document.getElementById('second-alert');
      const secondButton = secondAlert.shadowRoot.querySelector('button');

      expect(document.querySelectorAll('umd-alert-banner').length).toEqual(3);
      expect(document.getElementById('second-alert')).not.toBeNull();

      secondButton.click();

      expect(document.querySelectorAll('umd-alert-banner').length).toEqual(2);
      expect(document.getElementById('second-alert')).toBeNull();
    });
  });
});

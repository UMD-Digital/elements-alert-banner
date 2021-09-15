# \<umd-alert-banner> element

## Installation

```bash
yarn add @universityofmaryland/alertbanner
```

## Basic Usage

**Import the Alert Banner in your `js` if you bundle using a transpiler with babel or typescript.**

```js
import '@universityofmaryland/alertbanner';
```

**HTML Usage**

```html
<!-- Simple -->
<umd-alert-banner storage-key="unique-id-0">
  <!-- alert message or content -->
</umd-alert-banner>

<!-- With options -->
<umd-alert-banner
  button="Close this specific alert"
  padding="20px"
  storage-key="unique-id-1"
  type="warning"
  max-width="1024px"
>
  <!-- alert message or content -->
</umd-alert-banner>
```

**Attributes Breakdown**

| Attribute         | Required? | default value |     type      | Purpose                                                                                                                                                                         |
| ----------------- | :-------: | :-----------: | :-----------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`storage-key`** |  **Yes**  |     null      |    string     | _Alert elements require a unique key for use with localStorage and the component's dismiss functionality. The element will throw an error if the key is missing or not unique._ |
| **`button`**      |     -     |    "Close"    |    string     | _Override the close button accessible Text_                                                                                                                                     |
| **`dismissable`** |     -     |    `true`     |    boolean    | _Set to **false** to prevent users from dismissing/hiding an alert._                                                                                                            |
| **`padding`**     |     -     |      `0`      | number + unit | _Set **padding** to banner content with [appropriate css units](https://developer.mozilla.org/en-US/docs/Web/CSS/length) (ie: **px**)_                                          |
| **`max-width`**   |     -     |    initial    | number + unit | _Set a **max-width** to banner content with [appropriate css units](https://developer.mozilla.org/en-US/docs/Web/CSS/length) (ie: **px**)_                                      |
| **`type`**        |     -     |     null      |    string     | _Set a custom alert type or select a preset type with styling. Presets: **['primary', 'warning', 'danger']**_                                                                   |

## Functionality

**localStorage**

By default the element displays a "Close" `X` button that lets a user dismiss/hide the alert. Using the [localStorage WebAPI](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) that alert remains dismissed until the user clears their local cache, or the contents of the alert element differ compared to the reference saved to `window.localStorage`. _**A unique `storage-key` attribute is required on each element to allow this functionality to work.**_

## Development

```bash
# Build once or build and watch for changes
yarn build
yarn start

# Remove index.js from /dist, and /examples directories
yarn cleanup

# Build index.js for distribution/production
yarn dist

# Run jest suite of testing on the custom element
yarn jest
```

## License

Distributed under the MIT license. See LICENSE for details.

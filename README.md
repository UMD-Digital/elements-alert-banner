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
<umd-alert-banner>
  <!-- alert content -->
</umd-alert-banner>

<!-- With options -->
<umd-alert-banner
  id="unique-alert-id"
  button="Close this specific alert"
  padding="20px"
  size="1024px"
  type="warning"
>
  <!-- alert content -->
</umd-alert-banner>
```

**Options Breakdown**

| Option            | default value |     type      | Purpose                                                                                                                                    |
| ----------------- | :-----------: | :-----------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **`id`**          |     null      |    string     | _Set a unique ID for use with localStorage and the component's dismiss functionality_                                                      |
| **`button`**      |    "Close"    |    string     | _Override the close button accessible Text_                                                                                                |
| **`dismissable`** |    `true`     |    boolean    | Set to **false** to prevent users from dismissing/hiding an alert\_                                                                        |
| **`padding`**     |      `0`      | number + unit | _Set **padding** to banner content with [appropriate css units](https://developer.mozilla.org/en-US/docs/Web/CSS/length) (ie: **px**)_     |
| **`size`**        |     unset     | number + unit | _Set a **max-width** to banner content with [appropriate css units](https://developer.mozilla.org/en-US/docs/Web/CSS/length) (ie: **px**)_ |
| **`type`**        |     null      |    string     | _Set a custom alert type or select a preset type with styling. Presets: **['primary', 'warning', 'danger']**_                              |

## Functionality

**localStorage**

By default the element displays a "Close" `X` button that lets a user dismiss/hide the alert. Using the [localStorage WebAPI](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) that alert remains dismissed until the user clears their local cache, or the contents of the alert element differ compared to the reference saved to `window.localStorage`. _**Setting a unique `id` attribute to each alert displayed allows this functionality to work individually with each alert element on a page.**_

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

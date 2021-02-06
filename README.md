# fitted-text

Horizontally squishes a line of text down to a set limit.

Built to be a vanilla JS alternative to
[sc-fitted-text](https://github.com/SupportClass/sc-fitted-text).

## Install & Usage

Install the package from npm: `npm i fitted-text`

Include the package in your HTML page: 
```html
<script src="/node_modules/fitted-text/dist/fitted-text.js"></script>
```

Use the element as follows:
```html
<fitted-text
	text="Text"
	max-width="100"
	align="right"
	id="fit-text">
</fitted-text>
```

In JavaScript, the element's properties can be edited using the
`setAttribute()` function.

```js
document.getElementById('fit-text').setAttribute('text', 'Text set using JavaScript');
```

For the element to use HTML tags, use the `useInnerHTML` attribute:

```html
<fitted-text 
	text="<i>Text</i>"
	max-width="100"
	align="right"
	useInnerHTML
	id="html-fit-text">
</fitted-text>
```

```js
document.getElementById('html-fit-text').removeAttribute('useInnerHTML');
document.getElementById('html-fit-text').setAttribute('useInnerHTML', '');
```

For a demonstration of all the element's capabilities, 
refer to the `example.html` file in the repository root.

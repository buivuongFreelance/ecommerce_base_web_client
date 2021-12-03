module.exports = {
	parserOptions: {
		ecmaVersion: 11,
		sourceType: 'module',
	},
	extends: ['airbnb-base'],
	env: {
		es6: true,
		browser: true,
		node: true,
	},
	plugins: ['svelte3'],
	overrides: [
		{
			files: ['*.svelte'],
			processor: 'svelte3/svelte3',
		},
	],
	rules: {
		'linebreak-style': 0,
	},
	settings: {
		// ...
	},
};

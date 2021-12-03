<script>
	import Cleave from 'cleave.js';
	import { onMount } from 'svelte';
	export let name = '';
	export let value;
	export let onInput;
	export let error;

	onMount(() => {
		var cleave = new Cleave('.input-expiry', {
			date: true,
			datePattern: ['m', 'y'],
			onValueChanged: (event) => {
				handleChange(event);
			},
		});
	});
	const handleChange = (event) => {
		value = event.target.rawValue;
		onInput(event.target.rawValue);
	};
</script>

<input
	{name}
	class="input-expiry ba b--light-gray br2 h-40-px pl4 w-100"
	class:b--red={error}
	type="text" />

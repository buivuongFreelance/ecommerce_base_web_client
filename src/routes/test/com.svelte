<script>
	import { onMount } from 'svelte';
	import noUiSlider from 'nouislider';
	import 'nouislider/distribute/nouislider.css';

	let rootEle;
	onMount(() => {
		noUiSlider.create(rootEle, {
			start: [0, 0],
			behaviour: 'unconstrained-tap',
			connect: [false, true, false],
			tooltips: true,
			range: {
				min: -2000,
				max: 2000,
			},
		});
	});
</script>

<div bind:this={rootEle} />

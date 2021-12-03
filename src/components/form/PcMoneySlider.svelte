<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import noUiSlider from 'nouislider';
	import 'nouislider/distribute/nouislider.css';
	import { currency } from '../../stores';
	import { displayCurrencyDbRound, formatFixedPrice } from '../../functions';

	export let bindValue;
	export let min = 0;
	export let onUpdate = null;
	export let countRefresh = 0;

	let rootEle;
	let mounted = false;
	let oldCountRefresh = 0;

	$: {
		if (mounted) {
			if (countRefresh !== oldCountRefresh) {
				oldCountRefresh = countRefresh;
				rootEle.noUiSlider.set(bindValue);
			}
		}
	}

	onMount(() => {
		noUiSlider.create(rootEle, {
			start: bindValue >= 0 ? bindValue : 0,
			connect: [true, false],
			tooltips: {
				to: function (value) {
					return formatFixedPrice(Number(value));
				},
				from: function (value) {
					return Number(value);
				},
			},
			step: 0.1,
			range: {
				min: min,
				max: displayCurrencyDbRound(2000, $currency),
			},
			pips: {
				mode: 'values',
				values: [0, displayCurrencyDbRound(2000, $currency)],
				density: 4,
			},
		});

		rootEle.noUiSlider.on('update', () => {
			bindValue = Number(rootEle.noUiSlider.get());
		});

		rootEle.noUiSlider.on('change', () => {
			if (onUpdate) {
				onUpdate(Number(rootEle.noUiSlider.get()));
			}
		});
		mounted = true;
	});
</script>

<div bind:this={rootEle} />

<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import noUiSlider from 'nouislider';
	import 'nouislider/distribute/nouislider.css';
	import { currency } from '../../stores';
	import { displayCurrencyDbRound, formatFixedPrice } from '../../functions';

	export let bindValue;
	export let onUpdate = null;
	export let countRefresh = 0;

	let rootEle;
	let connectColor = '#2f3a97';
	let oldCountRefresh = 0;

	let mounted = false;
	$: {
		if (mounted) {
			if (countRefresh !== oldCountRefresh) {
				oldCountRefresh = countRefresh;
				rootEle.noUiSlider.set([null, bindValue]);
			}
		}
	}

	onMount(() => {
		noUiSlider.create(rootEle, {
			start: [0, bindValue],
			connect: [false, true, false],
			behaviour: 'unconstrained-tap',
			step: 1,
			tooltips: [
				{
					to: function (value) {
						return Number(value);
					},
					from: function (value) {
						return Number(value);
					},
				},
				{
					to: function (value) {
						if (value < 0) {
							connectColor = '#f64e60';
							return `<div class="tc"><i class="fw3">${$_(
								'device.youPayPrice'
							)}</i> <div>${formatFixedPrice(Number(value))}</div></div>`;
						} else if (value === 0) {
							connectColor = '#2f3a97';
							return `<div class="tc"><i class="fw3">${$_(
								'device.yourPrice'
							)}</i> <div>${formatFixedPrice(Number(value))}</div></div>`;
						} else {
							connectColor = '#2f3a97';
							return `<div class="tc"><i class="fw3">${$_(
								'device.youTakePrice'
							)}</i> <div>${formatFixedPrice(Number(value))}</div></div>`;
						}
					},
					from: function (value) {
						return Number(value);
					},
				},
			],
			step: 1,
			range: {
				min: displayCurrencyDbRound(-2000, $currency),
				max: displayCurrencyDbRound(2000, $currency),
			},
			pips: {
				mode: 'values',
				values: [
					displayCurrencyDbRound(-2000, $currency),
					displayCurrencyDbRound(2000, $currency),
				],
				density: 4,
			},
		});

		var origins = rootEle.getElementsByClassName('noUi-origin');
		origins[0].setAttribute('disabled', true);

		rootEle.noUiSlider.on('update', () => {
			const arr = rootEle.noUiSlider.get();
			bindValue = Number(arr[1]);
		});

		rootEle.noUiSlider.on('change', () => {
			const arr = rootEle.noUiSlider.get();
			if (onUpdate) {
				onUpdate(Number(arr[1]));
			}
		});

		mounted = true;
	});
</script>

<div
	bind:this={rootEle}
	class="custom"
	style="--connectColor: {connectColor};"
/>

<style>
	.custom :global(.noUi-handle-upper .noUi-tooltip) {
		height: auto !important;
	}
	.custom :global(.noUi-handle-lower) {
		background: none !important;
		height: 0px !important;
		border-radius: 0px !important;
		top: 0px !important;
		border: none !important;
		box-shadow: none !important;
		cursor: default !important;
	}
	.custom :global(.noUi-handle-lower .noUi-tooltip) {
		bottom: -47px !important;
		font-size: 15px !important;
		font-weight: bold !important;
		color: #3f4254 !important;
		background: none !important;
	}
	.custom :global(.noUi-connect) {
		background: var(--connectColor) !important;
	}
	.custom :global(.noUi-handle) {
		background: var(--connectColor) !important;
	}
	.custom :global(.noUi-tooltip) {
		background: var(--connectColor) !important;
	}
	.custom :global(.noUi-tooltip::after) {
		border-top: 6px solid var(--connectColor) !important;
	}
</style>

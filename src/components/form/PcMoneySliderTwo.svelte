<script>
	import { _ } from 'svelte-i18n';
	import { onDestroy, onMount } from 'svelte';
	import noUiSlider from 'nouislider';
	import 'nouislider/distribute/nouislider.css';
	import {
		formatPercentage,
		formatPercentageMinusPrice,
		formatPercentagePrice,
	} from '../../functions';
	import { currency } from '../../stores';

	export let bindValue;
	export let onUpdate = null;
	export let countRefresh = 0;

	let originalValue = 0;
	let rootEle;
	let oldCountRefresh = 0;
	let mounted = false;
	let percentValue = 0;
	let pips = [];

	$: {
		if (mounted) {
			if (countRefresh !== oldCountRefresh) {
				percentValue = formatPercentage(bindValue, originalValue);
				rootEle.noUiSlider.set(percentValue);
			}
		}
	}

	function clickOnPip() {
		const value = Number(this.getAttribute('data-value'));
		rootEle.noUiSlider.set(value);
	}

	onMount(() => {
		originalValue = bindValue;
		noUiSlider.create(rootEle, {
			start: 0,
			connect: [true, false],
			tooltips: {
				to: function (value) {
					return (
						formatPercentageMinusPrice(originalValue, value) + ' ' + $currency
					);
				},
				from: function (value) {
					return Number(value);
				},
			},
			step: 0.1,
			range: {
				min: 0,
				max: 100,
			},
			pips: {
				// mode: 'values',
				// values: [
				// 	displayCurrencyDbRound(min, $currency),
				// 	displayCurrencyDbRound(max, $currency),
				// ],
				mode: 'positions',
				values: [0, 10, 20, 30, 50, 100],
				density: 0,
				stepped: true,
				format: {
					to: (value) => {
						if (value == 0) {
							return '' + value + '%';
						} else {
							return '-' + value + '%';
						}
					},
					from: (value) => {
						return value;
					},
				},
			},
		});

		pips = rootEle.querySelectorAll('.noUi-value');

		for (var i = 0; i < pips.length; i++) {
			pips[i].style.cursor = 'pointer';
			pips[i].addEventListener('click', clickOnPip);
		}

		rootEle.noUiSlider.on('update', () => {
			if (countRefresh !== oldCountRefresh) {
				oldCountRefresh = countRefresh;
			} else {
				bindValue = formatPercentagePrice(
					originalValue,
					rootEle.noUiSlider.get()
				);
			}
		});

		rootEle.noUiSlider.on('change', () => {
			if (onUpdate) {
				onUpdate(
					formatPercentagePrice(originalValue, rootEle.noUiSlider.get())
				);
			}
		});
		mounted = true;
	});

	onDestroy(() => {
		for (var i = 0; i < pips.length; i++) {
			pips[i].removeEventListener('click', clickOnPip);
		}
	});
</script>

<style>
	:global(.noUi-connects) {
		border-radius: 0 !important;
	}

	:global(.noUi-value-horizontal) {
		transform: translate(-50%, calc(51% + 10px)) !important;
	}
	:global(.noUi-connect) {
		background-color: #2f3a97 !important;
	}

	:global(.noUi-pips-horizontal) {
		padding: 0 !important;
		margin-top: -5px;
	}
	:global(.noUi-pips) {
		font-size: 12px !important;
		font-weight: normal !important;
	}
	:global(.noUi-marker) {
		background-color: #e4e6ef !important;
	}
	:global(.noUi-marker-horizontal.noUi-marker) {
		height: 5px !important;
		margin-left: 0 !important;
	}
	:global(.noUi-marker-horizontal.noUi-marker-large) {
		height: 15px !important;
	}
</style>

<div bind:this={rootEle} class="percent-slider" />

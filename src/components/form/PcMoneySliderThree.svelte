<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import noUiSlider from 'nouislider';
	import 'nouislider/distribute/nouislider.css';
	import { currency } from '../../stores';
	import { displayCurrencyDbRound, formatFixedPrice } from '../../functions';

	export let bindValue;
	export let max = 2000;
	export let onUpdate = null;
	export let countRefresh = 0;

	let rootEle;
	let mounted = false;
	let oldCountRefresh = 0;
	let originalValue = 0;

	$: {
		if (mounted) {
			if (countRefresh !== oldCountRefresh) {
				oldCountRefresh = countRefresh;
				rootEle.noUiSlider.set(bindValue);
			}
		}
	}

	onMount(() => {
		originalValue = bindValue;
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
			step: 1,
			range: {
				min: displayCurrencyDbRound(originalValue, $currency),
				max: displayCurrencyDbRound(max, $currency),
			},
			pips: {
				mode: 'values',
				values: [
					displayCurrencyDbRound(originalValue, $currency),
					displayCurrencyDbRound(max, $currency),
				],
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

<!--<style>
	.toggle {
		cursor: pointer;
		display: flex;
		align-items: center;
	}
	.toggle > input {
		display: none;
	}
	.toggle > input + span {
		width: 40px;
		height: 20px;
		padding: 2px;
		border-radius: 20px;
		background-color: #e0e6ef;
		display: block;
		box-sizing: border-box;
		position: relative;
	}
	.toggle > input + span + span {
		margin-left: 10px;
	}
	.toggle > input + span:after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		display: block;
		background-color: white;
		transition: 0.3s;
	}
	.toggle > input:checked + span {
		background-color: #2f3a97;
	}

	.toggle > input:checked + span:after {
		left: calc(100% - 18px);
	}
</style>-->

<!-- <div class="mb5">
	<label class="toggle mb3">
		<input type="checkbox" />
		<span />
		<span>Input price</span>
	</label>
</div> -->
<div bind:this={rootEle} />

<!-- <div class="mt6 mb5">
	<label class="flex items-center">
		<span class="mr3 f4 fw6 steel-two i">You can input exactly</span>
		<input
			type="text"
			placeholder="0"
			class="pa3 b--light-gray h-60-px bg-white ba br2 f4 fw6 flex-auto tr" />
	</label>
</div> -->

<script>
	import { _ } from 'svelte-i18n';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import { selectedExchangeDevice, currency } from '../../stores';
	import PcMoneyExchangeSlider from '../form/PcMoneyExchangeSlider.svelte';
	import { displayCurrency, displayMoneyNoCurrency } from '../../functions';
	import { onMount } from 'svelte';
	import config from '../../config';
	import { request } from 'http';
	import MobileModalSelectModel from '../modal/MobileModalSelectModel.svelte';

	export let bindValue;
	export let onNextStep;
	export let typeExchange;
	export let sellPrice;

	let isOpenModel = false;
	let inputWrapper;
	let oldBindValue;
	let mounted = false;
	let countRefresh = 0;

	$: {
		if (isOpenModel) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
		if (mounted) {
			if ($selectedExchangeDevice) {
				if (inputWrapper) {
					if (oldBindValue !== bindValue) {
						inputWrapper.value = bindValue;
						oldBindValue = bindValue;
					}
				}
			}
		}
	}

	onMount(() => {
		mounted = true;
	});

	const handleOpenModel = () => {
		isOpenModel = true;
	};
	const handleSkip = () => {
		selectedExchangeDevice.set(null);
		onNextStep();
	};

	const handleInput = (e) => {
		const { value } = e.target;
		if (value.length > 5) {
			inputWrapper.value = value.slice(0, 5);
		} else {
			if (Number(value) <= 2000 && Number(value) >= -2000) {
				bindValue = isNaN(parseInt(value)) ? 0 : parseInt(value);
				countRefresh++;
			} else {
				inputWrapper.value = oldBindValue;
			}
		}
	};
</script>

<style>
	.panel {
		height: 50px;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	.image-empty {
		/* width: 300px; */
		/* height: 400px; */
		width: 90px;
		height: 120px;
		border-radius: 10px;
		border: 1px dashed #3699ff;
		border-width: 4;
	}
	.image {
		/* width: 270px; */
		/* height: 370px; */
		width: 90px;
		height: 120px;
		object-fit: cover;
	}

	.btn-skip {
		border-top-right-radius: 10px;
	}
	.input-money input {
		line-height: 1;
	}
	.flex-1 {
		flex: 1;
	}
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
		width: 200px;
	}

	.inputNumber {
		height: 80px;
	}
	.inputNumber:focus {
		outline: none;
	}
	.container-inputNumber {
		border: 1px solid #e4e6ef;
		border-radius: 4px;
		overflow: hidden;
	}
	.container-inputNumber:focus-within {
		border-color: #b5b5c3;
	}
	.radio {
		display: inline-flex;
		align-items: center;
	}
	.radio input {
		display: none;
	}
	.radio .box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2px solid #7e8299;
		box-sizing: border-box;
	}
	.radio .box:after {
		content: '';
		display: block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: #2f3a97;
		opacity: 0;
	}
	.radio > input:checked + .box {
		border-color: #2f3a97;
	}
	.radio > input:checked + .box:after {
		opacity: 1;
	}
</style>

{#if isOpenModel}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal type="modal" onClick={() => (isOpenModel = false)} />
		<MobileModalSelectModel onClose={() => (isOpenModel = false)} />
	</Portal>
{/if}

<div class="panel bg-light-gray br--top flex items-center justify-between pl4">
	<div class="fw6">{$_('device.exchangeYourDevice')}</div>
	<div
		class="btn-skip link fw6 ph4 h-50-px white bg-light-blue flex items-center
			ttu pointer dim justify-center"
		on:click={handleSkip}>
		{$_('message.skip')}
	</div>
</div>

<div class="w-100 b--light-gray ba br2 br--bottom pa3">
	<div>
		<div class="f5 mt3 near-black fw6 tc">
			{$_('device.descExchangeDevice')}
		</div>
		<div class="mt5 flex items-center justify-center">
			<div
				class="image-empty flex items-center justify-center pointer grow"
				on:click={handleOpenModel}>
				{#if $selectedExchangeDevice}
					<img
						class="lazy image"
						src={$selectedExchangeDevice.model_image_url}
						alt={$selectedExchangeDevice.model_name} />
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="#3699ff"
						width="40">
						<path d="M0 0h24v24H0z" fill="none" />
						<path
							d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
					</svg>
				{/if}
			</div>
		</div>
		{#if $selectedExchangeDevice}
			<div class="mt4 f5 near-black fw6 tc">
				{$selectedExchangeDevice.model_name}
				{$selectedExchangeDevice.capacity_name}
				{$selectedExchangeDevice.color_name}
			</div>
			<div class="f5 mt3 near-black b tc">{$_('device.descExchangeModel')}</div>
			<!-- <div class="mb6 money-exchange w-100 money-slider-exchange-pc"> -->
			<!-- <PcMoneyExchangeSlider bind:bindValue {countRefresh} /> -->
			<div class="mt5 mb3">
				<div class="flex justify-between">
					<div class="w-50">
						<label class="light-silver radio pointer">
							<input
								type="radio"
								value={config.exchangeType.offer}
								bind:group={typeExchange} />
							<span class="box" />
							<span class="label ml3 ttc">{$_('device.youPayPrice')}</span>
						</label>
					</div>
					<div class="w-50">
						<label class="light-silver radio pointer">
							<input
								type="radio"
								value={config.exchangeType.request}
								bind:group={typeExchange} />
							<span class="box" />
							<span class="label ml3 ttc">{$_('device.youTakePrice')}</span>
						</label>
					</div>
				</div>
				<div class="flex items-center mt5">
					<div
						class="container-inputNumber input-money b--pale-grey ba flex flex-1">
						<input
							type="number"
							id="inputNumber"
							class="inputNumber b f2 near-black tr bn w-100 mr3 flex-1"
							on:input={(e) => handleInput(e)}
							bind:this={inputWrapper} />
						<label
							for="inputNumber"
							class="pointer bg-light-gray ph5 bl b--light-gray flex items-center justify-center f3 b">
							{$currency}
						</label>
					</div>
				</div>
			</div>
			{#if typeExchange == config.exchangeType.request}
				<div class="i">
					{$_('error.exchangePriceSmall', {
						values: { number: sellPrice + ' ' + $currency },
					})}
				</div>
			{/if}
		{/if}
	</div>
</div>

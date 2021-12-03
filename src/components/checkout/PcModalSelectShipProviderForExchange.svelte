<script>
	import { onMount } from 'svelte';

	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { convertCurrency } from '../../functions';
	import { currency, settings } from '../../stores';

	export let item;
	export let onClose;
	export let totalShip;
	export let totalShipExchange;
	export let totalPay;
	export let totalDingtoiFee;
	export let realTotal;
	export let onSelect;

	let oldItem = null;
	let isSelected = false;

	onMount(() => {
		if (!oldItem) oldItem = Object.assign({}, item);
	});

	const onChange = (event) => {
		isSelected = true;

		setTimeout(() => {
			let tt =
				totalShipExchange -
				Number(
					convertCurrency(
						oldItem.selectedRateExchange.amount,
						oldItem.selectedRateExchange.currency,
						$settings
					)
				);

			tt += Number(
				convertCurrency(
					item.selectedRateExchange.amount,
					item.selectedRateExchange.currency,
					$settings
				)
			);
			totalShipExchange = tt;
			realTotal =
				totalShip + Number(totalShipExchange) + totalDingtoiFee + totalPay;
			onSelect(item);
			onClose();
		}, 500);
	};
</script>

<div class="fixed z-max wrapper" transition:fade>
	<div class="w-100 bg-white container">
		<div
			class="h-60-px flex items-center justify-between bg-light-gray b--pale-grey bb ph4 near-black fw5 f4 panel"
		>
			<div>{$_('checkout.selectProvider')}</div>
			<div class="pointer flex items-center" on:click={onClose}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 0 24 24"
					fill="#7e8299"
					width="24"
					><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
					/></svg
				>
			</div>
		</div>
		<div class="content pb3 relative">
			<div class:absoluteSelected={isSelected} class:o-1={!isSelected} />
			{#if item.ratesExchange}
				{#if item.ratesExchange.length > 0}
					{#each item.ratesExchange as rate}
						<div
							class="flex items-start justify-between spacing-ext bb b--light-gray pv4"
						>
							<div>
								<label class="light-silver radio pointer">
									<input
										on:change={onChange}
										type="radio"
										value={rate}
										bind:group={item.selectedRateExchange}
									/>
									<span class="box" />
									<span class="label fw6 ml3 f4"
										>{rate.provider}
										{$_('checkout.provider')}</span
									>
								</label>
								<div class="light-silver f6 i duration">
									{rate.duration_terms}
								</div>
								<div class="light-silver f6  duration">
									{$_('checkout.estimatedDeliveryDate')}:
									{rate.estimated_days}
									{#if rate.estimated_days == 1}
										{$_('checkout.day')}
									{:else}{$_('checkout.days')}{/if}
								</div>
							</div>
							<div class="b f4">
								{convertCurrency(rate.amount, rate.currency, $settings)}
								{$currency}
							</div>
						</div>
					{/each}
				{/if}
			{/if}
		</div>
	</div>
</div>

<style>
	.absoluteSelected {
		width: 100%;
		height: 100%;
		z-index: 9999;
		position: absolute;
		cursor: not-allowed;
	}
	.wrapper {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		height: calc(100vh - 120px);
		overflow: hidden;
		border-radius: 10px;
		width: 500px;
	}
	.container {
		height: calc(100vh - 120px);
	}
	.content {
		max-height: calc(100vh - 180px);
		overflow: auto;
	}
	.duration {
		margin-left: 32px;
		width: 295px;
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

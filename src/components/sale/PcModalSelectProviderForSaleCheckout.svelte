<script>
	import { onMount } from 'svelte';

	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { convertCurrency } from '../../functions';
	import { currency, settings } from '../../stores';
	import ContentLoader from 'svelte-content-loader';

	export let sale;
	export let onClose;
	export let isLoadingShippo;
	export let onSelect;

	const onChange = (event) => {
		setTimeout(() => {
			onSelect(sale);
			onClose();
		}, 500);
	};
</script>

<style>
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

<div class="fixed z-max wrapper" transition:fade>
	<div class="w-100 bg-white container">
		<div
			class="h-60-px flex items-center justify-between bg-light-gray b--pale-grey bb ph4 near-black fw5 f4 panel">
			<div>{$_('checkout.selectProvider')}</div>
			<div class="pointer flex items-center" on:click={onClose}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 0 24 24"
					fill="#7e8299"
					width="24"><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
			</div>
		</div>
		<div class="content pb3">
			{#if isLoadingShippo}
				<div class="mt5 spacing-ext">
					<ContentLoader
						width="500"
						uniqueKey="payship"
						primaryColor="#e4e6ef"
						secondaryColor="#f8f8f8">
						<rect x="0" y="0" rx="3" ry="3" width="400" height="20" />
						<rect x="0" y="40" rx="3" ry="3" width="200" height="20" />
						<rect x="0" y="80" rx="3" ry="3" width="350" height="20" />
					</ContentLoader>
				</div>
			{:else if sale.rates}
				{#if sale.rates.length > 0}
					{#each sale.rates as rate}
						<div
							class="flex items-start justify-between spacing-ext bb b--light-gray pv4">
							<div>
								<label class="light-silver radio pointer">
									<input
										on:change={onChange}
										type="radio"
										value={rate}
										bind:group={sale.selectedRate} />
									<span class="box" />
									<span class="label fw6 ml3 f4">{rate.provider}
										{$_('checkout.provider')}</span>
								</label>
								<div class="light-silver f6 i duration">
									{rate.duration_terms}
								</div>
								<div class="light-silver f6 duration">
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

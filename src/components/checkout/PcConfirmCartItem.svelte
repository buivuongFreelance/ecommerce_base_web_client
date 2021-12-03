<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import { displayCurrency } from '../../functions';
	import { currency, settings } from '../../stores';
	import PcExchangeInfoConfirmCart from './PcExchangeInfoConfirmCart.svelte';

	export let item;
</script>

<div class="flex justify-between pa4 bb b--light-gray bg-light-gray">
	<div class="flex">
		<div class="ba b--light-gray br2 flex items-center justify-center w-image">
			<img src={item.url} alt="no" class="image ba b--white" />
		</div>
		<div class="device-info">
			<span class="near-black dim db ttc">
				{item.model}&nbsp;-&nbsp;{item.capacity}{$_(
					'label.GB'
				)}&nbsp;-&nbsp;{item.color}
			</span>
		</div>
	</div>
	<div class="tr">
		<div class="">
			{#if item.proposal_type}
				{#if item.proposal_type == config.exchange}
					<!-- {#if item.proposal_exchange_price > 0}
						<span class="fw6 f5">
							{$_(displayProposalBuyerExchangeStrReverse(Number(item.proposal_exchange_price)))}</span>
						<span class="b f4">
							{displayCurrency(item.proposal_exchange_price, $currency)}</span>
						<sup class="currency">{$currency}</sup>
					{:else}
						{displayCurrency(item.proposal_exchange_price, $currency)}
						<sup class="currency">{$currency}</sup>
					{/if} -->
					<PcExchangeInfoConfirmCart {item} />
				{:else}
					<div class="b f4">
						<span class="money"
							>{displayCurrency(item.proposal_sale_price, $currency)}</span
						>
						<sup class="currency">{$currency}</sup>
					</div>
				{/if}
			{:else}
				<div class="b f4">
					<span class="money"
						>{displayCurrency(item.real_sale_price, $currency)}</span
					>
					<sup class="currency">{$currency}</sup>
				</div>
			{/if}
		</div>
		<div class="light-silver mt3">
			{$_('cart.commission')}:
			{#if item.proposal_type}
				{#if item.proposal_type == config.exchange}
					{displayCurrency(item.dingtoiFee, $currency)}
					{$currency}
				{:else}
					{displayCurrency(item.dingtoiFee, $currency)}
					{$currency}
				{/if}
			{:else}
				{displayCurrency(item.dingtoiFee, $currency)}
				{$currency}
			{/if}
		</div>
		<div class="light-silver">{$_('checkout.tax')}: 0 {$currency}</div>
	</div>
</div>

<style>
	.device-info {
		margin-left: 13px;
		width: 500px;
	}
	.w-image {
		width: 60px;
		height: 60px;
		border-radius: 50%;
	}
	.image {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		object-fit: cover;
	}
	/* .list {
		list-style: inherit;
		padding-left: 40px;
	}
	.pl-34px {
		padding-left: 15px;
	} */
</style>

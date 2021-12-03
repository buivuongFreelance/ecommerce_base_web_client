<script>
	import { _ } from 'svelte-i18n';
	import { currency } from '../../stores';
	import {
		displayCurrency,
		displayProposalBuyerExchangeStrReverse,
	} from '../../functions';
	export let item;
</script>

{#if item}
	<div class="i">
		<div class="light-silver">{$_('message.exchangeWith')}:</div>
		<div class="">
			{#if item.proposal_exchange_devices}
				{#if item.proposal_exchange_devices.length > 0}
					{#each item.proposal_exchange_devices as i, index}
						{i.model}
						{i.capacity}{$_('label.GB')}
						{i.color}
					{/each}
				{/if}
			{/if}
		</div>

		<span class="light-silver">{$_('cart.and')}</span>
		<span class="b i">
			{$_(displayProposalBuyerExchangeStrReverse(item.proposal_exchange_price))}
		</span>
		<span class="b i">
			{displayCurrency(item.proposal_exchange_price, $currency)}
		</span>
		<span class="b i"><u>{$currency}</u></span>
	</div>
{/if}

<style>
</style>

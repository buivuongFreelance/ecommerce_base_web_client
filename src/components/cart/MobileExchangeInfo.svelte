<script>
	import { _ } from 'svelte-i18n';
	import { currency } from '../../stores';
	import {
		displayCurrencyReverse,
		displayProposalBuyerExchangeStr,
	} from '../../functions';
	export let item;
</script>

{#if item}
	<div class="i">
		<div class="light-silver">{$_('message.exchangeWith')}:</div>
		<div class="">
			<b class="">
				{item.exchange_model.model_name}
				{item.exchange_model.capacity_name}
				{item.exchange_model.color_name}
			</b>
			<div>
				<span class="light-silver">{$_('cart.and')}</span>
				<span class="b">
					{$_(displayProposalBuyerExchangeStr(item.real_exchange_price))}
				</span>
				<span class="b">
					{displayCurrencyReverse(item.real_exchange_price, $currency)}
					<u>{$currency}</u>
				</span>
			</div>
		</div>
	</div>
{/if}

<style>
</style>

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
			<span class="tooltip">
				<b class="tooltip__title"
					>{item.exchange_model.model_name}
					<sup>ⓘ</sup></b
				>
				<blockquote class="tooltip__content">
					{item.exchange_model.model_name}
					{item.exchange_model.color_name}
					{item.exchange_model.capacity_name}
				</blockquote>
			</span>
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
	.tooltip {
		cursor: help;
		position: relative;
	}
	.tooltip__content {
		display: none;
		position: absolute;
		bottom: 100%;
		left: 0;
		white-space: nowrap;
		background-color: black;
		color: white;
		padding: 5px 10px;
		border-radius: 4px;
		font-size: 0.8em;
	}
	.tooltip:hover .tooltip__content {
		display: block;
	}
</style>

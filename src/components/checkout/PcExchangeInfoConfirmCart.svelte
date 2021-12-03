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
						<div class="tooltip">
							<b class="tooltip__title"> {i.model} <sup>ⓘ</sup> </b>
							<blockquote class="tooltip__content">
								{i.model}
								{i.color}
								{i.capacity}
								{$_('label.GB')}
							</blockquote>
						</div>
					{/each}
				{/if}
			{/if}

			<span class="light-silver">{$_('cart.and')}</span>
			<span class="b">
				{$_(
					displayProposalBuyerExchangeStrReverse(item.proposal_exchange_price)
				)}
			</span>
			<span class="b">
				{displayCurrency(item.proposal_exchange_price, $currency)}
			</span>
			<span class="b">{$currency}</span>
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

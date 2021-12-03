<script>
	import { goto } from '@sapper/app';
	import { _ } from 'svelte-i18n';
	import { currency } from '../../stores';
	import {
		displayCurrency,
		displayOrderPriceStr,
		displayProposalBuyerExchangeStrReverse,
	} from '../../functions';
	import PcButtonTransactionProcessing from '../button/PcButtonTransactionProcessing.svelte';
	import config from '../../config';
	import PcButtonViewTransaction from '../button/PcButtonViewTransaction.svelte';
	export let item;
	export let sale;
</script>

{#if item}
	<div class="pa4 br2 bg-light-gray ba b--light-gray b--dashed f6">
		{#if sale.charge_stripe != null}
			<div class="light-silver mb3 i">{$_('message.subItems')}:</div>
		{:else}
			<div class="light-silver i">{$_('message.subItems')}:</div>
		{/if}
		<div class="">
			{#if item.items}
				{#if item.items.length > 0}
					{#each item.items as i}
						<div class="mt3">
							<div class="b i text-nowrap">
								{i.model}
								{i.color}
								{i.capacity}
								{$_('label.GB')}
							</div>
							{#if sale.charge_stripe != null}
								<div class="tr mt3">
									<PcButtonViewTransaction
										onClickButton={() => goto(`/my-transactions/${i.id}`)}
									/>
								</div>
							{/if}
						</div>
					{/each}
				{/if}
			{/if}

			<!-- <div class="bt b--light-gray b--dashed mt4 pt4">
				<span class="light-silver ttc">{$_('cart.and')}</span>
				<span class="b ttl">
					{$_(displayOrderPriceStr(item.money_not_fee))}
				</span>
				<span class="b">
					{displayCurrency(item.money_not_fee, $currency)}
				</span>
				<span class="b">{$currency}</span>
			</div> -->
		</div>
	</div>
{/if}

<style>
</style>

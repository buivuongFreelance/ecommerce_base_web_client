<script>
	import { goto } from '@sapper/app';
	import { _ } from 'svelte-i18n';
	import PcButtonTransactionProcessing from '../button/PcButtonTransactionProcessing.svelte';
	import config from '../../config';
	import PcButtonViewTransaction from '../button/PcButtonViewTransaction.svelte';
	export let item;
	export let sale;
</script>

{#if item}
	<div class="pa4 br2 bg-light-gray ba b--light-gray b--dashed mb4 ml73px">
		{#if sale.charge_stripe != null}
			<div class="light-silver mb3 i">{$_('message.subItems')}:</div>
		{:else}
			<div class="light-silver i">{$_('message.subItems')}:</div>
		{/if}
		<div class="">
			{#if item.items}
				{#if item.items.length > 0}
					{#each item.items as i}
						<div class="flex justify-between items-center mb3 ">
							<div class="b i text-nowrap">
								{i.model}
								{i.color}
								{i.capacity}
								{$_('label.GB')}
							</div>
							{#if i.status == config.order.buyerReceived}
								<div class="hr-dashed" />

								<PcButtonTransactionProcessing
									onClickButton={() => goto(`/my-transactions/${i.id}`)}
								/>
							{:else if i.status == config.transaction.systemCancelled}
								<div />
							{:else if sale.charge_stripe != null}
								<div class="hr-dashed" />
								<PcButtonViewTransaction
									onClickButton={() => goto(`/my-transactions/${i.id}`)}
								/>
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
	.ml73px {
		margin-left: 73px;
	}

	.hr-dashed {
		flex-basis: 100%;
		margin: 0 10px;
		border-bottom: 1px dashed #e4e6ef;
	}
</style>

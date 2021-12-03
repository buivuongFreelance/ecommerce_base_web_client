<script>
	import { goto } from '@sapper/app';
	import { _ } from 'svelte-i18n';
	import { currency } from '../../stores';
	import {
		displayCurrency,
		displayProposalBuyerExchangeStrReverse,
	} from '../../functions';
	import PcButtonTransactionProcessing from '../button/PcButtonTransactionProcessing.svelte';
	import config from '../../config';
	import PcButtonViewTransaction from '../button/PcButtonViewTransaction.svelte';
	export let item;
	export let invoice_info;
</script>

{#if item}
	<div
		class="pa1rem br2 bg-light-gray ba b--light-gray b--dashed mb1rem mh1rem"
	>
		{#if invoice_info != null}
			<div class="light-silver i f6">
				<!-- {$_('message.exchangeWithYourDevice')}: -->
				{$_('message.subItems')}:
			</div>
		{:else}
			<div class="light-silver i f6">
				{$_('message.exchangeWithYourDevice')}:
			</div>
		{/if}
		<div class="">
			{#if item.proposal_exchange_devices}
				{#if item.proposal_exchange_devices.length > 0}
					{#each item.proposal_exchange_devices as i, index}
						<div class="">
							<div class="b i text-nowrap">
								{i.model}
								{i.color}
								{i.capacity}
								{$_('label.GB')}
							</div>
							{#if i.status == config.order.ownerScanned || i.status == config.order.buyerAccept || i.status == config.order.toBeShipped || i.status == config.order.shipped || i.status == config.order.buyerReceived}
								<div class="hr-dashed mv1rem" />
								<PcButtonViewTransaction
									bg="bg-blue"
									onClickButton={() => goto(`/my-transactions/${i.id}`)}
								/>
							{:else if invoice_info != null}
								<div class="hr-dashed mv1rem" />
								<PcButtonTransactionProcessing
									onClickButton={() => goto(`/my-transactions/${i.id}`)}
								/>
							{/if}
						</div>
					{/each}
				{/if}
			{/if}

			<!-- <div class="bt b--light-gray b--dashed mt4 pt4">
				<span class="light-silver ttc">{$_('cart.and')}</span>
				<span class="b">
					{$_(
						displayProposalBuyerExchangeStrReverse(item.proposal_exchange_price)
					)}
				</span>
				<span class="b">
					{displayCurrency(item.proposal_exchange_price, $currency)}
				</span>
				<span class="b">{$currency}</span>
			</div> -->
		</div>
	</div>
{/if}

<style>
	.hr-dashed {
		flex-basis: 100%;
		border-bottom: 1px dashed #e4e6ef;
	}
</style>

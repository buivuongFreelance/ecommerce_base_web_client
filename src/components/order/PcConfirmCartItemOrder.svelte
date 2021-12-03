<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import { displayCurrency } from '../../functions';
	import { currency, settings } from '../../stores';
	import { goto } from '@sapper/app';
	import PcButtonViewTransaction from '../button/PcButtonViewTransaction.svelte';
	import PcExchangeInfoConfirmOrder from './PcExchangeInfoConfirmOrder.svelte';
	import PcExchangeInfoConfirmCart from '../checkout/PcExchangeInfoConfirmCart.svelte';
	import PcButtonTransactionProcessing from '../button/PcButtonTransactionProcessing.svelte';

	export let item;
	export let invoice_info;
</script>

<tr class="bl br b--light-gray" class:bb={item.type == config.buyer}>
	<td>
		<div class="flex items-center ml4">
			<div class="flex items-center justify-center w-image">
				<img src={item.url} alt="no" class="image ba b--white br2" />
			</div>
			<div class="device-info">
				<span
					class="near-black dim db ttc pointer"
					on:click={() => goto('device/' + item.device_id)}
				>
					{item.model}
					{item.color}
					{item.capacity}
					{$_('label.GB')}
				</span>
				{#if item.status == config.order.buyerRejected}
					<p class="red f6">{$_('message.inDispute')}</p>
				{/if}
			</div>
		</div>
	</td>
	<td class="w-300px">
		<div class="tr">
			<div class="mt3">
				{#if item.proposal_type}
					{#if item.proposal_type == config.exchange}
						<div />
						<PcExchangeInfoConfirmCart {item} />
					{:else}
						<span class="b f4"
							>{displayCurrency(item.money_not_fee, $currency)}</span
						>
						<sup class="currency"> {$currency}</sup>
					{/if}
				{:else}
					<span class="b f4"
						>{displayCurrency(item.money_not_fee, $currency)}
						{$currency}</span
					>
				{/if}
			</div>
			{#if item.proposal_type}
				<div class="">
					<span>{$_('cart.commission')}:</span>
					{#if item.proposal_type == config.exchange}
						{displayCurrency(item.dingtoi_fee_buyer, $currency)}
						{$currency}
					{:else}
						{displayCurrency(item.dingtoi_fee_buyer, $currency)}
						{$currency}
					{/if}
				</div>
			{:else}
				<div class="">
					<span>{$_('cart.commission')}:</span>
					{displayCurrency(item.dingtoi_fee_buyer, $currency)}
					{$currency}
				</div>
			{/if}
			<div class="light-silver mb3">{$_('checkout.tax')}: 0 {$currency}</div>
		</div>
	</td>
	<td class="w-100px" />
	{#if item.type == config.buyer && item.status == config.order.buyerReceived}
		<td class="pr4">
			<PcButtonTransactionProcessing
				onClickButton={() => goto(`/my-transactions/${item.id}`)}
			/>
		</td>
		<!-- {:else if (item.type == config.buyer && item.status == config.order.created) || (item.type == config.buyer && item.status == config.order.ownerScanned) || (item.type == config.buyer && item.status == config.order.buyerAccept) || (item.type == config.buyer && item.status == config.order.buyerRejected) || (item.type == config.buyer && item.status == config.order.ready) || (item.type == config.buyer && item.status == config.order.toBeShipped)} -->
	{:else if item.type == config.buyer && item.status != config.order.buyerReceived}
		<td class="pr4">
			<PcButtonViewTransaction
				onClickButton={() => goto(`/my-transactions/${item.id}`)}
			/>
		</td>
	{:else if invoice_info == null || item.status == config.transaction.systemCancelled}
		<td class="">
			<div />
		</td>
	{:else if item.type == config.order.group && item.status != config.order.buyerReceived}
		<td class="pr4">
			<PcButtonViewTransaction
				onClickButton={() => goto(`/my-transactions/${item.id}`)}
			/>
		</td>
	{:else if (item.shipping_rate_seller != null && item.status == config.order.ownerScanned && item.type == config.order.group) || (item.type == config.order.group && item.status == config.order.buyerReceived)}
		<td class="pr4">
			<PcButtonTransactionProcessing
				onClickButton={() => goto(`/my-transactions/${item.id}`)}
			/>
		</td>
	{/if}
</tr>
{#if item.proposal_type}
	{#if item.proposal_type == config.exchange}
		<tr class="bb bl br b--light-gray">
			<td colspan="2">
				<PcExchangeInfoConfirmOrder {item} {invoice_info} />
			</td>
			<td />
			<td />
		</tr>
	{/if}
{/if}

<style>
	.device-info {
		margin-left: 20px;
	}
	.w-image {
		width: 60px;
		height: 60px;
	}
	.image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.w-100px {
		width: 100px;
	}
	.w-300px {
		width: 300px;
	}
</style>

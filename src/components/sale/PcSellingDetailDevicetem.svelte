<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import { displayCurrency, displayOrderPriceStr } from '../../functions';
	import { currency } from '../../stores';
	import { goto } from '@sapper/app';
	import PcButtonViewTransaction from '../button/PcButtonViewTransaction.svelte';
	import PcButtonTransactionProcessing from '../button/PcButtonTransactionProcessing.svelte';
	import PcExchangeInfoConfirmSale from './PcExchangeInfoConfirmSale.svelte';

	export let item;
	export let sale;
	export let isOpenModalCommission = false;
</script>

<tr class="bl br b--light-gray" class:bb={item.type == config.buyer}>
	<td>
		<div class="flex items-center">
			<div class="flex items-center justify-center w-image">
				<img src={item.url} alt="no" class="image ba b--white" />
			</div>
			<div class="device-info">
				<span
					class="near-black dim db ttc pointer"
					on:click={() => goto('my-devices/' + item.device_id)}
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
		<div class="tr mv3 f6">
			{#if item.items}
				{#if item.items.length > 0}
					<div class="light-silver f6">{$_('message.exchangeWith')}:</div>
					<div class="">
						{#each item.items as i, index}
							<div class="tooltip">
								<b class="tooltip__title">
									{i.model}
									<sup>ⓘ</sup>
								</b>
								{item.items.length && item.items.length != index + 1
									? ', '
									: ''}

								<blockquote class="tooltip-content">
									{i.model}
									{i.color}
									{i.capacity}
									{$_('label.GB')}
								</blockquote>
							</div>
						{/each}

						<span class="light-silver">{$_('cart.and')}</span>
						<span class="b">
							{$_(displayOrderPriceStr(item.money_not_fee))}
						</span>
						<span class="b">
							{displayCurrency(item.money_not_fee, $currency)}
						</span>
						<span class="b">{$currency}</span>
						<div
							class="light-silver help"
							on:click={() => (isOpenModalCommission = true)}
						>
							{$_('cart.commission')}
							<sup>ⓘ</sup>:
							<span class="near-black b "
								>{displayCurrency(item.dingtoi_fee_seller, $currency)}
								{$currency}</span
							>
						</div>
					</div>
				{:else}
					<span class="b f4"
						>{displayCurrency(item.money_not_fee, $currency)}
						{$currency}</span
					>
				{/if}
			{/if}
		</div>
	</td>
	<td class="w-130px" />
	<td class=" pr4">
		{#if item.status == config.order.toBeShipped || item.status == config.order.shipped || item.status == config.order.buyerReceived || item.status == config.order.buyerAccept || item.status == config.order.buyerRejected}
			<PcButtonViewTransaction
				onClickButton={() => goto(`/my-transactions/${item.id}`)}
			/>
		{:else if item.type == config.buyer && item.status != config.order.shipped}
			<PcButtonTransactionProcessing
				onClickButton={() => goto(`/my-transactions/${item.id}`)}
			/>
		{:else if sale.charge_stripe == null || item.status == config.transaction.systemCancelled}
			<div />
		{:else if item.type == config.order.group && item.status != config.order.shipped && item.shipping_rate_buyer != null}
			<PcButtonTransactionProcessing
				onClickButton={() => goto(`/my-transactions/${item.id}`)}
			/>
		{/if}
	</td>
</tr>
{#if item.items}
	{#if item.items.length > 0}
		<tr class="bb bl br b--light-gray">
			<td colspan="2">
				<PcExchangeInfoConfirmSale {item} {sale} />
			</td>
			<td />
			<td />
		</tr>
	{/if}
{/if}

<style>
	.device-info {
		margin-left: 13px;
	}
	.w-image {
		width: 60px;
		height: 60px;
		border-radius: 50%;
	}
	.image {
		width: 40px;
		height: 40px;
		object-fit: cover;
	}
	/* .w-110px {
		width: 110px;
	} */
	.w-130px {
		width: 130px;
	}
	.w-300px {
		width: 300px;
	}

	.help {
		cursor: help;
	}
</style>

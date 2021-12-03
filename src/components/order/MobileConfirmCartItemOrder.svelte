<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import { displayCurrency } from '../../functions';
	import { currency } from '../../stores';
	import { goto } from '@sapper/app';
	import PcButtonViewTransaction from '../button/PcButtonViewTransaction.svelte';
	import MobileExchangeInfoConfirmOrder from './MobileExchangeInfoConfirmOrder.svelte';
	import PcExchangeInfoConfirmCart from '../checkout/PcExchangeInfoConfirmCart.svelte';
	import PcButtonTransactionProcessing from '../button/PcButtonTransactionProcessing.svelte';

	export let item;
	export let invoice_info;
</script>

<tr class="bl br b--light-gray" class:bb={item.type == config.buyer}>
	<td colspan="4">
		<div class="flex pa1rem">
			<div class="flex items-center justify-center w-image">
				<img src={item.url} alt="no" class="image ba b--white br2" />
			</div>
			<div class="device-info">
				<div>
					<span
						class="near-black dim db ttc pointer"
						on:click={() => goto('device/' + item.device_id)}
					>
						{item.model}
						{item.capacity}{$_('label.GB')}
						{item.color}
					</span>
					{#if item.status == config.order.buyerRejected}
						<p class="red f6">{$_('cart.rejected')}</p>
					{/if}
				</div>
				<div class="">
					<div class="">
						{#if item.proposal_type}
							{#if item.proposal_type == config.exchange}
								<div class="mt3">
									<PcExchangeInfoConfirmCart {item} />
								</div>
							{:else}
								<span class="b f4">
									{displayCurrency(item.money_not_fee, $currency)}
								</span>
								<sup class="b currency">
									<u>{$currency}</u>
								</sup>
							{/if}
						{:else}
							<span class="b f4">
								{displayCurrency(item.money_not_fee, $currency)}
								<u>{$currency}</u>
							</span>
						{/if}
					</div>
					{#if item.proposal_type}
						<div class="">
							<span>{$_('cart.commission')}:</span>
							<b>
								{#if item.proposal_type == config.exchange}
									{displayCurrency(item.dingtoi_fee_buyer, $currency)}
									<u>{$currency}</u>
								{:else}
									{displayCurrency(item.dingtoi_fee_buyer, $currency)}
									<u>{$currency}</u>
								{/if}
							</b>
						</div>
					{:else}
						<div class="">
							<span>{$_('cart.commission')}:</span>
							<b>
								{displayCurrency(item.dingtoi_fee_buyer, $currency)}
								<u>{$currency}</u>
							</b>
						</div>
					{/if}
					<div class="">
						{$_('checkout.tax')}:
						<b>
							0
							<u>{$currency}</u>
						</b>
					</div>
				</div>
			</div>
		</div>
		{#if item.type == config.buyer && item.status == config.order.buyerReceived}
			<div class="pl1rem mb1rem">
				<PcButtonTransactionProcessing
					onClickButton={() => goto(`/my-transactions/${item.id}`)}
				/>
			</div>
		{:else if item.type == config.buyer && item.status != config.order.buyerReceived}
			<div class="pl1rem mb1rem">
				<PcButtonViewTransaction
					onClickButton={() => goto(`/my-transactions/${item.id}`)}
				/>
			</div>
		{:else if invoice_info == null}
			<div class="pl1rem mb1rem">
				<div />
			</div>
		{:else if item.type == config.order.group && item.status != config.order.buyerReceived}
			<div class="pl1rem mb1rem">
				<PcButtonTransactionProcessing
					onClickButton={() => goto(`/my-transactions/${item.id}`)}
				/>
			</div>
		{:else if (item.shipping_rate_seller != null && item.status == config.order.ownerScanned && item.type == config.order.group) || (item.type == config.order.group && item.status == config.order.buyerReceived)}
			<div class="pl1rem mb1rem">
				<PcButtonViewTransaction
					bg="bg-blue"
					onClickButton={() => goto(`/my-transactions/${item.id}`)}
				/>
			</div>
		{/if}
	</td>
</tr>
{#if item.proposal_type}
	{#if item.proposal_type == config.exchange}
		<tr class="bb bl br b--light-gray">
			<td colspan="4">
				<MobileExchangeInfoConfirmOrder {item} {invoice_info} />
			</td>
		</tr>
	{/if}
{/if}

<style>
	.device-info {
		margin-left: 1rem;
	}
	.w-image {
		width: 60px;
		height: 60px;
	}
	.image {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>

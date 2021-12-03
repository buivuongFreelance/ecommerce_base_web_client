<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import { displayCurrency, displayOrderPriceStr } from '../../functions';
	import { currency } from '../../stores';
	import { goto } from '@sapper/app';
	import PcButtonViewTransaction from '../button/PcButtonViewTransaction.svelte';
	import PcButtonTransactionProcessing from '../button/PcButtonTransactionProcessing.svelte';
	import MobileExchangeInfoConfirmSale from './MobileExchangeInfoConfirmSale.svelte';

	export let item;
	export let sale;
	export let isOpenModalCommission = false;
</script>

<div class="pa4 bl br b--light-gray" class:bb={item.type == config.buyer}>
	<div class="flex items-start">
		<div class="w-image">
			<img src={item.url} alt="no" class="image br2" />
		</div>
		<div class="device-info">
			<div
				class="near-black dim db ttc pointer"
				on:click={() => goto('device/' + item.device_id)}
			>
				{item.model}
				{item.color}
				{item.capacity}{$_('label.GB')}
			</div>
			{#if item.items}
				{#if item.items.length > 0}
					<div class="i f6 tr">
						<div class="light-silver f6">{$_('message.exchangeWith')}:</div>
						<div class="">
							{#each item.items as i, index}
								<div class="">
									<b class="">
										{i.model}
										{i.color}
										{i.capacity}{$_('label.GB')}
									</b>
									{item.items.length && item.items.length != index + 1
										? ', '
										: ''}
								</div>
							{/each}

							<span class="light-silver">{$_('cart.and')}</span>
							<span class="b">
								{$_(displayOrderPriceStr(item.money_not_fee))}
							</span>
							<span class="b">
								{displayCurrency(item.money_not_fee, $currency)}
							</span>
							<u class="b">{$currency}</u>
							<div
								class="light-silver help"
								on:click={() => (isOpenModalCommission = true)}
							>
								{$_('cart.commission')}
								<sup>ⓘ</sup>:
								<span class="near-black b ">
									{displayCurrency(item.dingtoi_fee_seller, $currency)}
									<u>{$currency}</u>
								</span>
							</div>
						</div>
					</div>
				{:else}
					<div class="b f4 tr">
						{displayCurrency(item.money_not_fee, $currency)}
						<u>{$currency}</u>
					</div>
				{/if}
			{/if}
			<div class="tr mt3">
				{#if item.status == config.order.ownerScanned}
					<PcButtonViewTransaction
						onClickButton={() => goto(`/my-transactions/${item.id}`)}
					/>
				{:else if item.type == config.buyer && item.status != config.order.ownerScanned}
					<PcButtonTransactionProcessing
						onClickButton={() => goto(`/my-transactions/${item.id}`)}
					/>
				{:else if sale.charge_stripe == null}
					<div />
				{:else}
					<PcButtonTransactionProcessing
						onClickButton={() => goto(`/my-transactions/${item.id}`)}
					/>
				{/if}
			</div>
		</div>
	</div>
</div>

{#if item.items}
	{#if item.items.length > 0}
		<div class="pl4 pr4 pb4 bb4 bl br b--light-gray">
			<MobileExchangeInfoConfirmSale {item} {sale} />
		</div>
	{/if}
{/if}

<style>
	.device-info {
		flex-grow: 1;
		margin-left: 20px;
	}
	.w-image {
		width: 60px;
		height: 60px;
		border-radius: 50%;
	}
	.image {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.help {
		cursor: help;
	}
</style>

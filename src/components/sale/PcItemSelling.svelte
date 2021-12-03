<script>
	import { goto } from '@sapper/app';
	import { _ } from 'svelte-i18n';
	import { currency } from '../../stores';
	import { displayCurrency, displayDateTime } from '../../functions';
	import PcTagOrder from '../order/PcTagOrder.svelte';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import PcDropdownMoreMenuSaleItem from './PcDropdownMoreMenuSaleItem.svelte';

	import PcButtonViewDetail from '../button/PcButtonViewDetail.svelte';
	import config from '../../config';
	import PcButtonCheckoutSmall from '../button/PcButtonCheckoutSmall.svelte';

	export let item;
	export let isLoadingDetail;
	export let handlePayment;

	const displayStatus = (item) => {
		if (item.status == config.order.shipped) {
			return config.order.shipped;
		} else if (item.status == config.order.completed) {
			return config.order.confirm;
		} else if (item.status == config.order.buyerRejected) {
			return config.order.inDispute;
		} else if (
			item.status == config.transaction.systemCancelled ||
			item.status == config.order.systemCancelNotPayShip
		) {
			return config.transaction.systemCancelled;
		} else if (
			item.countTransactionsExchangeIsPaid > 0 ||
			item.countTransactionsSellIsPaid > 0
		) {
			return config.order.processing;
		} else if (
			item.countTransactionsExchangeIsPaid == 0 &&
			item.countTransactionsSellIsPaid == 0
		) {
			return config.order.created;
		}
	};

	const totalPrice = (item) => {
		const total = Number(item.money) - Number(item.receive_money);
		if (total > 0) {
			return displayCurrency(total, $currency);
		} else {
			return (
				$_('cart.exchangeReceive') + ' ' + displayCurrency(total, $currency)
			);
		}
	};
</script>

<tr class="bb b--light-gray">
	<td>
		<span class="fw6 light-blue pointer" on:click={goto('my-sales/' + item.id)}
			>{item.code}</span
		>
	</td>
	<td>{displayDateTime(item.created_at)}</td>
	<!-- <td>{displayCurrency(item.money, $currency)} {$currency}</td> -->
	<!-- <td>{totalPrice(item)} {$currency}</td> -->
	<td>
		<PcTagOrder status={displayStatus(item)} />
	</td>
	<td>
		{#if item.status == config.order.systemCancelNotPayShip}
			<div class="red">
				{$_('message.youHasBeenCancel')}
			</div>
		{:else if item.charge_stripe == null && item.has_exchange_devices}
			<div class="red">
				{$_('message.makePayment')}
			</div>
		{:else if item.countTotalTransactionRejected > 0}
			<div class="red">
				{#if item.countTotalTransactionRejected == 1}
					{$_('message.countOneDeviceReject', {
						values: {
							count: item.countTotalTransactionRejected,
						},
					})}
				{:else if item.countTotalTransactionRejected > 1}
					{$_('message.countDeviceReject', {
						values: {
							count: item.countTotalTransactionRejected,
						},
					})}
				{/if}
			</div>
		{:else if item.countTransactionsTotalProcess > 0}
			<div class="red">
				{$_('message.countDeviceWaitingScan', {
					values: {
						count: item.countTransactionsTotalProcess,
					},
				})}
			</div>
		{:else if item.countTransactionsWaitingForBuyerScanned > 0}
			<div class="yellow">
				{$_('message.countDeviceWaitingBuyerScan', {
					values: {
						count: item.countTransactionsWaitingForBuyerScanned,
					},
				})}
			</div>
		{:else if item.countTotalTransactionReady > 0}
			<div class="yellow">
				{$_('message.countDeviceWaitingTobeShipped', {
					values: {
						count: item.countTotalTransactionReady,
					},
				})}
			</div>
		{:else if item.countTotalShipping > 0}
			<div class="yellow">
				{$_('message.countDeviceWaitingShip', {
					values: {
						count: item.countTotalShipping,
					},
				})}
			</div>
		{/if}
	</td>
	<td class="tr">
		<div class="flex justify-end flex-gap10px">
			{#if item.has_exchange_devices == null || item.charge_stripe !== null}
				<PcButtonViewDetail onClickButton={() => goto('my-sales/' + item.id)} />
				<div class="w40px ml3" />
			{/if}

			{#if item.charge_stripe == null && item.has_exchange_devices}
				{#if isLoadingDetail}
					<button
						class="btn flex items-center h-40-px ph4 br2 bn bg-dark-blue "
					>
						<LoadingDefault size={30} />
					</button>
				{:else}
					{#if item.status != config.order.systemCancelNotPayShip}
						<PcButtonCheckoutSmall
							className="mr3"
							onClickButton={() => handlePayment(item)}
						/>
					{/if}

					<PcDropdownMoreMenuSaleItem id={item.id} />
				{/if}
			{/if}
		</div>
	</td>
</tr>

<style>
	td {
		padding: 20px 15px;
	}
	.btn {
		white-space: nowrap;
	}
	.w40px {
		width: 40px;
	}
</style>

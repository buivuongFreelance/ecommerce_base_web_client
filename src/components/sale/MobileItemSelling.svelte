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
		if (
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
</script>

<tbody class="ba b--light-gray">
	<tr>
		<td class="tr gray text-nowrap">
			<div class="mt4">{$_('order.saleNumber')}:</div>
		</td>
		<td>
			<div class="mt4">
				<a href="my-sales/{item.id}" class="fw6 light-blue pointer">
					{item.code}
				</a>
			</div>
		</td>
	</tr>
	<tr>
		<td class="tr gray text-nowrap">{$_('message.createdDate')}:</td>
		<td>{displayDateTime(item.created_at)}</td>
	</tr>
	<tr>
		<td class="tr gray text-nowrap">{$_('cart.total')}:</td>
		<td>
			<b>{displayCurrency(item.money, $currency)} <u>{$currency}</u></b>
		</td>
	</tr>
	<tr>
		<td class="tr gray text-nowrap">{$_('device.status')}:</td>
		<td><PcTagOrder status={displayStatus(item)} /></td>
	</tr>
	<tr>
		<td class="tr gray text-nowrap">{$_('order.attention')}:</td>
		<td>
			{#if item.charge_stripe == null && item.has_exchange_devices}
				<div class="flash animated infinite duration-5s red">
					{$_('message.makePayment')}
				</div>
			{:else if item.countTransactionsSellOwnersNotScanned > 0}
				<div class="flash animated infinite duration-5s red">
					{$_('message.countDeviceWaitingScan', {
						values: {
							count: item.countTransactionsSellOwnersNotScanned,
						},
					})}
				</div>
			{/if}
		</td>
	</tr>
	<tr>
		<td colspan="2" class="tc">
			<div class="flex justify-between mb3 pt3 bt b--light-gray b--dashed">
				{#if item.has_exchange_devices == null || item.charge_stripe !== null}
					<PcButtonViewDetail
						onClickButton={() => goto('my-sales/' + item.id)}
					/>
				{/if}

				{#if item.charge_stripe == null && item.has_exchange_devices}
					{#if isLoadingDetail}
						<button
							class="btn flex items-center h-40-px ph4 br2 bn bg-dark-blue "
						>
							<LoadingDefault size={30} />
						</button>
					{:else}
						<PcButtonCheckoutSmall onClickButton={() => handlePayment(item)} />
						<PcDropdownMoreMenuSaleItem id={item.id} />
					{/if}
				{/if}
			</div>
		</td>
	</tr>
</tbody>

<!-- <tr class="bb b--light-gray">
	<td>
		<span class="fw6 light-blue pointer" on:click={goto('my-sales/' + item.id)}
			>{item.code}</span
		>
	</td>
	<td>{displayDateTime(item.created_at)}</td>
	<td>{displayCurrency(item.money, $currency)} {$currency}</td>
	<td>
		<PcTagOrder status={displayStatus(item)} />
	</td>
	<td>
		{#if item.charge_stripe == null && item.has_exchange_devices}
			<div class="animate__flash animate__animated red">
				{$_('message.makePayment')}
			</div>
		{:else if item.countTransactionsSellOwnersNotScanned > 0}
			<div class="animate__flash animate__animated red">
				{$_('message.countDeviceWaitingScan', {
					values: {
						count: item.countTransactionsSellOwnersNotScanned,
					},
				})}
			</div>
		{/if}
	</td>
	<td class="tr">
		<div class="flex justify-end">
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
					<PcButtonCheckoutSmall onClickButton={() => handlePayment(item)} />
					<PcDropdownMoreMenuSaleItem id={item.id} />
				{/if}
			{/if}
		</div>
	</td>
</tr> -->
<style>
	td {
		padding: 10px;
	}
	.btn {
		white-space: nowrap;
	}
</style>

<script>
	import { goto } from '@sapper/app';
	import { _ } from 'svelte-i18n';
	import TabletDropdownMoreMenuAccoutItemDevice from './TabletDropdownMoreMenuAccoutItemDevice.svelte';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import config from '../../config';
	import PcModalQrCode from '../modal/PcModalQrCode.svelte';
	import { auth, selectedAccountItem } from '../../stores';
	import { onDestroy } from 'svelte';
	import PcTagDevice from './PcTagDevice.svelte';
	import PcModalUserAgreement from '../modal/PcModalUserAgreement.svelte';
	import PcButtonViewTransaction from '../button/PcButtonViewTransaction.svelte';
	import PcButtonLowerYourPrice from '../button/PcButtonLowerYourPrice.svelte';
	import PcButtonScanDevice from '../button/PcButtonScanDevice.svelte';
	import PcButtonViewOffer from '../button/PcButtonViewOffer.svelte';
	import PcButtonPostDevice from '../button/PcButtonPostDevice.svelte';
	import PcButtonTransactionProcessing from '../button/PcButtonTransactionProcessing.svelte';
	import PcButtonViewPurchase from '../button/PcButtonViewPurchase.svelte';
	import PcButtonViewSale from '../button/PcButtonViewSale.svelte';

	export let item;
	export let onDeleteSuccess;

	export let selectedItem = null;

	let isOpenQrCode = false;
	let isOpenUserAgreement = false;

	const unsubscribeSelectedAccountItem = selectedAccountItem.subscribe(
		(value) => {
			if (value) {
				if (item.status === config.device.waitingForScan) {
					if (value.id === item.id) {
						//isOpenQrCode = true;
					}
				}
			}
		}
	);

	onDestroy(() => {
		selectedAccountItem.set(null);
		unsubscribeSelectedAccountItem();
	});

	$: {
		if (isOpenQrCode || isOpenUserAgreement) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	}
	const handlePostDevice = () => {
		isOpenUserAgreement = true;
	};
	const handleSelectedItem = (it) => {
		selectedItem(it);
	};
</script>

<style>
	td {
		padding: 10px 15px;
	}
	.w40px {
		width: 40px;
	}
</style>

{#if isOpenQrCode}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal
			type="modal"
			onClick={() => {
				isOpenQrCode = false;
				selectedAccountItem.set(null);
			}} />
		<PcModalQrCode
			{item}
			onClose={() => {
				isOpenQrCode = false;
				selectedAccountItem.set(null);
			}} />
	</Portal>
{/if}
{#if isOpenUserAgreement}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal
			type="modal"
			onClick={() => {
				isOpenUserAgreement = false;
			}} />
		<PcModalUserAgreement
			{item}
			onClose={() => {
				isOpenUserAgreement = false;
			}} />
	</Portal>
{/if}

{#if item}
	<tr class="ba b--black-10 bt-0 bl-0 br-0 relative">
		<td class="">
			<!-- svelte-ignore a11y-invalid-attribute -->
			<a
				href={'my-devices/' + item.id}
				class="db link light-blue fw6">{item.model}
				{item.color}
				{item.capacity}
				{$_('label.GB')}</a>
			<small class="light-silver">{item.imei}</small>
		</td>
		<td class="">
			<span class="dark-blue i">
				{$_('device.grade') + ' ' + item.physical_grading}
			</span>
		</td>

		<td class="">
			{#if item.charge_stripe == null && item.transaction_type != config.buyer && item.status == config.device.inTransaction}
				{#if item.transaction_email_buyer != $auth.email}
					<PcTagDevice status={config.order.waitingForDevicePayment} />
				{:else}
					<PcTagDevice status={config.order.waitingForOwnerPayment} />
				{/if}
			{:else}
				<PcTagDevice status={item.status} />
			{/if}
		</td>

		<td>
			<div class="flex justify-end">
				{#if item.status !== config.device.inTransaction}
					{#if item.status === config.device.created}
						<PcButtonPostDevice onClickButton={handlePostDevice} />
					{:else if item.status !== config.device.created}
						{#if item.proposals != null}
							<!-- view offer -->
							<PcButtonViewOffer
								bg="bg-blue"
								onClickButton={() => goto('my-devices/offers/' + item.id)} />
							<!-- button scan -->
						{:else if item.status === config.device.waitingForScan}
							<!-- scan device -->
							<PcButtonScanDevice onClickButton={() => (isOpenQrCode = true)} />
						{:else}
							<!-- button lower your price -->
							<PcButtonLowerYourPrice
								onClickButton={() => handleSelectedItem(item)} />
						{/if}
					{/if}
					<TabletDropdownMoreMenuAccoutItemDevice
						id={item.id}
						status={item.status}
						onSuccess={onDeleteSuccess}
						bind:isOpenQrCode
						onSelectLowerPrice={() => handleSelectedItem(item)} />
				{:else if item.transaction_type == config.buyer}
					<PcButtonTransactionProcessing
						onClickButton={() => goto(`/my-transactions/${item.transaction_id}`)} />
					<div class="w40px ml3" />
				{:else if item.charge_stripe == null}
					{#if item.transaction_email_buyer != $auth.email}
						<PcButtonViewSale
							onClickButton={() => goto(`/my-sales/${item.order_seller_id}`)} />
						<div class="w40px ml3" />
					{:else}
						<PcButtonViewPurchase
							onClickButton={() => goto(`/my-purchases/${item.order_id}`)} />
						<div class="w40px ml3" />
					{/if}
				{:else}
					<PcButtonTransactionProcessing
						onClickButton={() => goto(`/my-transactions/${item.transaction_id}`)} />
					<div class="w40px ml3" />
				{/if}
			</div>
		</td>
	</tr>
{/if}

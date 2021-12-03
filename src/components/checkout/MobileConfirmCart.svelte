<script>
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '@sapper/app';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import { _ } from 'svelte-i18n';
	import { convertCurrency, displayCurrency } from '../../functions';
	import { currency, settings, checkoutAmountInfo } from '../../stores';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import MobileModalSelectShipProviderForExchange from './MobileModalSelectShipProviderForExchange.svelte';
	import PcConfirmEmailTitle from './PcConfirmEmailTitle.svelte';
	import MobileConfirmAddressShipping from './MobileConfirmAddressShipping.svelte';
	import MobileConfirmCartItem from './MobileConfirmCartItem.svelte';
	import MobileModalSelectShipProvider from './MobileModalSelectShipProvider.svelte';

	export let listConfirm = undefined;
	export let shipping = undefined;
	export let isValidate = true;
	export let isLoadingShippo;
	export let totalShip;
	export let totalShipExchange;
	export let realTotal;
	export let isLoadingShippoExchange;
	export let totalReceive;
	export let totalPay;
	export let totalDingtoiFee;
	export let isSelect = false;

	let mounted = false;
	let isOpenModal = false;
	let isOpenModalExchange = false;
	let selectedProviderItem = null;
	let selectedProviderKey = '';
	let mouted = false;

	$: {
		if (isOpenModal) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
		if (mouted) {
			totalShip = Number(displayCurrency(totalShip, $currency));
			totalShipExchange = Number(displayCurrency(totalShipExchange, $currency));
			checkoutAmountInfo.set({
				totalPay,
				totalReceive,
				totalShip,
				totalShipExchange,
				totalDingtoiFee,
			});
		}
	}
	onMount(() => {
		mouted = true;
	});
	const handleSelectProvider = (item, key) => {
		selectedProviderItem = item;
		selectedProviderKey = key;
		isOpenModal = true;
	};
	const handleSelectProviderExchange = (item, key) => {
		selectedProviderItem = item;
		selectedProviderKey = key;
		isOpenModalExchange = true;
	};
	onDestroy(() => {
		document.body.classList.remove('noscroll');
	});
	const onClose = () => {
		isOpenModal = false;
		isOpenModalExchange = false;
	};

	$: {
		if (mounted)
			if (!isValidate) {
				swal.fire({
					position: 'top',
					icon: 'warning',
					title: 'Device has been sold!',
					text: 'Some devices have already been sold',
					reverseButtons: true,
					allowOutsideClick: false,
					customClass: {
						icon: 'icon-warning',
					},
					preConfirm: () => {
						goto('cart');
					},
				});
			}
	}

	onMount(() => {
		mounted = true;
	});
</script>

{#if isOpenModal}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal
			type="modal"
			onClick={() => {
				isOpenModal = false;
			}}
		/>
		<MobileModalSelectShipProvider
			item={selectedProviderItem}
			bind:totalShip
			bind:totalShipExchange
			bind:realTotal
			{totalPay}
			{totalDingtoiFee}
			onSelect={(it) => {
				listConfirm[selectedProviderKey][0].selectedRate = it.selectedRate;
				selectedProviderItem = null;
				selectedProviderKey = '';
			}}
			{onClose}
		/>
	</Portal>
{/if}
{#if isOpenModalExchange}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal
			type="modal"
			onClick={() => {
				isOpenModalExchange = false;
			}}
		/>
		<MobileModalSelectShipProviderForExchange
			item={selectedProviderItem}
			bind:totalShip
			bind:totalShipExchange
			bind:realTotal
			{totalPay}
			{totalDingtoiFee}
			onSelect={(it) => {
				listConfirm[selectedProviderKey][0].selectedRateExchange =
					it.selectedRateExchange;
				selectedProviderItem = null;
				selectedProviderKey = '';
			}}
			{onClose}
		/>
	</Portal>
{/if}
<div class="mt2rem">
	<h4 class="ph1rem tc mb1rem">{$_('checkout.confirmCart')}</h4>
	{#if isValidate}
		{#each Object.entries(listConfirm) as [key, items]}
			{#if items}
				{#if items.length > 0}
					<div class="mb4">
						<div
							class="h-60-px flex items-center justify-between bg-shipping ph1rem"
						>
							{#if shipping}
								<PcConfirmEmailTitle
									email={items[0].seller_email}
									mode={items[0].proposal_type}
								/>
							{/if}
						</div>
						{#each items as item}
							<MobileConfirmCartItem {item} />
						{/each}
						<div class="pa1rem bg-light-gray">
							{#if isLoadingShippo}
								<div class="flex-1 tr">
									<div class="h-60-px flex items-center justify-center">
										<LoadingDefault color="#e4e6ef" size="50" />
									</div>
								</div>
							{:else if items[0].rates}
								{#if items[0].rates.length > 0}
									<div class="">
										{#if shipping}
											<div class="tooltip">
												<MobileConfirmAddressShipping
													shippingBuyer={shipping.address}
													shippingSeller={items[0].address}
													mode={items[0].proposal_type}
													{items}
												/>
											</div>
										{/if}
										<div class="w-shippo mt3">
											<span class="b">
												{items[0].selectedRate.provider}
												{$_('checkout.provider')}
											</span>
											<span class="b dark-blue ml3">
												{convertCurrency(
													items[0].selectedRate.amount,
													items[0].selectedRate.currency,
													$settings
												)}
												<u>{$currency}</u>
											</span>
											<div class="light-silver f6 duration mv3">
												{$_('checkout.estimatedDeliveryDate')}:
												{items[0].selectedRate.estimated_days}
												{#if items[0].selectedRate.estimated_days == 1}
													{$_('checkout.day')}
												{:else}{$_('checkout.days')}{/if}
											</div>
											<button
												class="bn bg-blue white f6 ph4 pv2 br2 grow pointer"
												on:click={() => handleSelectProvider(items[0], key)}
											>
												{$_('checkout.changeProvider')}
											</button>
										</div>
									</div>
								{:else}
									<div class="tr">
										<div class="red">{$_('checkout.errorShipProvider')}</div>
									</div>
								{/if}
							{/if}

							{#if isLoadingShippoExchange}
								<div class="flex-1 tr">
									<div class="h-60-px flex items-center justify-center">
										<LoadingDefault color="#e4e6ef" size="50" />
									</div>
								</div>
							{:else if items[0].ratesExchange}
								{#if items[0].ratesExchange.length > 0}
									<div class="flex-1">
										{#if shipping}
											<div class="tooltip">
												<MobileConfirmAddressShipping
													shippingBuyer={shipping.address}
													shippingSeller={items[0].address}
													mode={items[0].proposal_type}
													{items}
												/>
											</div>
										{/if}

										<div class="w-shippo mt3">
											<span class="b">
												{items[0].selectedRateExchange.provider}
												{$_('checkout.provider')}
											</span>
											<span class="b dark-blue ml3">
												{convertCurrency(
													items[0].selectedRateExchange.amount,
													items[0].selectedRateExchange.currency,
													$settings
												)}
												<u>{$currency}</u>
											</span>
											<div class="light-silver f6 duration mv3">
												{$_('checkout.estimatedDeliveryDate')}:
												{items[0].selectedRateExchange.estimated_days}
												{#if items[0].selectedRateExchange.estimated_days == 1}
													{$_('checkout.day')}
												{:else}{$_('checkout.days')}{/if}
											</div>
											<button
												class="bn bg-blue white f6 ph4 pv2 br2 grow pointer"
												on:click={() =>
													handleSelectProviderExchange(items[0], key)}
											>
												{$_('checkout.changeProvider')}
											</button>
										</div>
									</div>
								{:else}
									<div class="flex-1 tr">
										<div class="red">{$_('checkout.errorShipProvider')}</div>
									</div>
								{/if}
							{/if}
						</div>
					</div>
				{/if}
			{/if}
		{/each}
	{/if}
</div>

<div class="mt5">
	<div class="bg-light-gray pa1rem">
		<h4 class="mb5 ">{$_('checkout.orderSummary')}</h4>
		<div class="flex justify-between mb4 light-silver">
			<span class="flex-1 f6">{$_('cart.subtotal')}</span>
			<span class="fw6 tr">
				{displayCurrency(totalPay, $currency)}
				<u>{$currency}</u>
			</span>
		</div>
		<div class="flex justify-between mb4 light-silver">
			<span class="tooltip flex-1 f6">
				{$_('cart.totalCommission')}
				<div class="tooltip-content">{$_('cart.totalCommission')}</div>
			</span>
			<span class="fw6 tr">
				{displayCurrency(totalDingtoiFee, $currency)}
				<u>{$currency}</u>
			</span>
		</div>
		<div class="flex justify-between mb4 light-silver">
			<span class="flex-1 f6">{$_('checkout.feeShipping')}</span>
			<div class="tr">
				{#if isLoadingShippo}
					<div class="flex justify-end">
						<LoadingDefault size={30} color="#e4e6ef" />
					</div>
				{:else}
					<span class="fw6">
						{displayCurrency(totalShip, $currency)}
						<u>{$currency}</u>
					</span>
				{/if}
			</div>
		</div>
		<div class="flex justify-between mb4 light-silver">
			<span class="flex-1 f6">
				{$_('checkout.feeShippingYourDevice')}
			</span>
			<div class="tr">
				{#if isLoadingShippoExchange}
					<div class="flex justify-end">
						<LoadingDefault size={30} color="#e4e6ef" />
					</div>
				{:else}
					<span class="fw6">
						{displayCurrency(totalShipExchange, $currency)}
						<u>{$currency}</u>
					</span>
				{/if}
			</div>
		</div>
		<div class="flex justify-between light-silver">
			<span class="flex-1 f6">{$_('checkout.estimatedTaxes')}</span>
			<span class="fw6 tr">
				{displayCurrency(0, $currency)}
				<u>{$currency}</u>
			</span>
		</div>
	</div>

	<div
		class="flex justify-between items-center bt bb b--light-gray b--dashed pa1rem mv4"
	>
		<div class="b mr5">
			{$_('cart.total')}
		</div>
		<div class="f4 b">
			{#if isLoadingShippo || isLoadingShippoExchange}
				<LoadingDefault size={30} color="#e4e6ef" />
			{:else}
				<span class="">
					{#if totalReceive > realTotal}
						-{displayCurrency(totalReceive - realTotal, $currency)}
					{:else}{displayCurrency(realTotal - totalReceive, $currency)}{/if}
					<u>{$currency}</u>
				</span>
			{/if}
		</div>
	</div>

	<div class="bg-blue-10 pa1rem i">
		<div class="flex justify-between bb b--blue b--dashed pb4 mb4">
			<div class="blue">
				<div class="f6">{$_('checkout.theAmount')}</div>
				<b class="fw6">{$_('checkout.youWillReceiveLater')}</b>
			</div>

			<div class="b f4 blue tr">
				{displayCurrency(totalReceive, $currency)}
				<u>{$currency}</u>
			</div>
		</div>
		<div class="f6 light-silver">{$_('checkout.receiveTheMoneyDesc')}</div>
	</div>
	<div class="bg-red-10 pa1rem i mt4">
		<div class="flex justify-between bb b--red b--dashed pb4 mb4">
			<div class="red">
				<div class="f6">{$_('checkout.theAmount')}</div>
				<b class="fw6">{$_('checkout.youHaveToPayImmediately')} </b>
			</div>
			<div class="b red f4 tr flex justify-end">
				{#if isLoadingShippo || isLoadingShippoExchange}
					<LoadingDefault size={30} color="#e4e6ef" />
				{:else}{displayCurrency(realTotal, $currency)}
					<u class="ml1">{$currency}</u>{/if}
			</div>
		</div>
		<div class="f6 light-silver">
			{$_('checkout.youHaveToPayImmediatelyDesc')}
		</div>
		<div class="flex justify-end mt4">
			<label class="checkbox-default tr">
				<input type="checkbox" bind:checked={isSelect} />
				<span />
				<span class="ml3 red fw6">{$_('checkout.agree')} ?</span>
			</label>
		</div>
	</div>
</div>

<style>
	.bg-shipping {
		background: #e4e6ef;
	}
</style>

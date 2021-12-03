<script>
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '@sapper/app';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import { _ } from 'svelte-i18n';
	import PcConfirmCartItem from './PcConfirmCartItem.svelte';
	import { convertCurrency, displayCurrency } from '../../functions';
	import { currency, settings, checkoutAmountInfo } from '../../stores';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import PcModalSelectShipProvider from './PcModalSelectShipProvider.svelte';
	import PcModalSelectShipProviderForExchange from './PcModalSelectShipProviderForExchange.svelte';
	import config from '../../config';
	import PcConfirmEmailTitle from './PcConfirmEmailTitle.svelte';
	import PcConfirmAddressShipping from './PcConfirmAddressShipping.svelte';

	let mounted = false;

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
		<PcModalSelectShipProvider
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
		<PcModalSelectShipProviderForExchange
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
<div class="w-confirm w-100">
	<h3 class="mb5">{$_('checkout.confirmCart')}</h3>
	{#if isValidate}
		{#each Object.entries(listConfirm) as [key, items]}
			{#if items}
				{#if items.length > 0}
					<div class="mb4">
						<div
							class="h-60-px flex items-center justify-between bg-shipping ph4"
						>
							{#if shipping}
								<PcConfirmEmailTitle
									email={items[0].seller_email}
									mode={items[0].proposal_type}
								/>
							{/if}
						</div>
						{#each items as item}
							<PcConfirmCartItem {item} />
						{/each}
						<div class="flex pa4 bg-light-gray justify-end ">
							{#if isLoadingShippo}
								<div class="flex-1 tr">
									<div class="h-60-px flex items-center justify-center">
										<LoadingDefault color="#e4e6ef" size="50" />
									</div>
								</div>
							{:else if items[0].rates}
								{#if items[0].rates.length > 0}
									<div class="flex-1 tr">
										{#if shipping}
											<div class="tooltip">
												<PcConfirmAddressShipping
													shippingBuyer={shipping.address}
													shippingSeller={items[0].address +
														', ' +
														items[0].city +
														', ' +
														items[0].city_code +
														', ' +
														items[0].zip}
													mode={items[0].proposal_type}
												/>
												<div class="tooltip-content top-right">
													<div>{$_('label.theShippingChargesFor')}:</div>
													{#each items as item}
														<div class="b">
															{item.model}
															{item.color}
															{item.capacity}{$_('label.GB')}
														</div>
													{/each}
													<div class="mt1 pt1 bt b--gray">
														{$_('label.from')}
														<b
															>{items[0].address +
																', ' +
																items[0].city +
																', ' +
																items[0].city_code +
																', ' +
																items[0].zip}</b
														>
													</div>
													<div>{$_('label.to')} <b>{shipping.address}</b></div>
												</div>
											</div>
										{/if}
										<!-- {#each items as i}
											{#if i.proposal_type != config.exchange}
												<div class="fw6 f7 light-silver">
													{i.model}
													{i.color}
													{i.capacity}
													{$_('label.GB')}
												</div>
											{/if}
										{/each} -->

										<div class="w-shippo">
											<div class="b">
												{items[0].selectedRate.provider}
												{$_('checkout.provider')}
											</div>
											<div class="fw6 dark-blue">
												{convertCurrency(
													items[0].selectedRate.amount,
													items[0].selectedRate.currency,
													$settings
												)}
												{$currency}
											</div>
											<!-- <div class="light-silver i">
												{items[0].selectedRate.duration_terms}
											</div> -->
											<div class="light-silver f6 duration">
												{$_('checkout.estimatedDeliveryDate')}:
												{items[0].selectedRate.estimated_days}
												{#if items[0].selectedRate.estimated_days == 1}
													{$_('checkout.day')}
												{:else}{$_('checkout.days')}{/if}
											</div>
											<div
												class="blue dim pointer"
												on:click={() => handleSelectProvider(items[0], key)}
											>
												{$_('checkout.changeProvider')}
											</div>
										</div>
									</div>
								{:else}
									<div class="flex-1 tr">
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
									<div class="flex-1 tr">
										{#if shipping}
											<div class="tooltip">
												<PcConfirmAddressShipping
													shippingBuyer={shipping.address}
													shippingSeller={items[0].address +
														', ' +
														items[0].city +
														', ' +
														items[0].city_code +
														', ' +
														items[0].zip}
													mode={items[0].proposal_type}
												/>
												<div class="tooltip-content top-right">
													<div>{$_('label.theShippingChargesFor')}:</div>
													{#each items as item}
														{#if item.proposal_exchange_devices}
															{#if item.proposal_exchange_devices.length > 0}
																{#each item.proposal_exchange_devices as i}
																	<div class="b">
																		{i.model}

																		{i.capacity}{$_('label.GB')}

																		{i.color}
																	</div>
																{/each}
															{/if}
														{/if}
													{/each}
													<div class="mt1 pt1 bt b--gray">
														{$_('label.from')}
														<b>{shipping.address}</b>
													</div>
													<div>
														{$_('label.to')}
														<b
															>{items[0].address +
																', ' +
																items[0].city +
																', ' +
																items[0].city_code +
																', ' +
																items[0].zip}</b
														>
													</div>
												</div>
											</div>
										{/if}
										{#each items as item}
											{#if item.proposal_exchange_devices}
												{#if item.proposal_exchange_devices.length > 0}
													{#each item.proposal_exchange_devices as i}
														<div class="fw6 f7 light-silver">
															{i.model}
															{i.color}
															{i.capacity}
															{$_('label.GB')}
														</div>
													{/each}
												{/if}
											{/if}
										{/each}
										<div class="w-shippo">
											<div class="b">
												{items[0].selectedRateExchange.provider}
												{$_('checkout.provider')}
											</div>
											<div class="fw6 dark-blue">
												{convertCurrency(
													items[0].selectedRateExchange.amount,
													items[0].selectedRateExchange.currency,
													$settings
												)}
												{$currency}
											</div>
											<!-- <div class="light-silver i">
												{items[0].selectedRate.duration_terms}
											</div> -->
											<div class="light-silver f6 duration">
												{$_('checkout.estimatedDeliveryDate')}:
												{items[0].selectedRateExchange.estimated_days}
												{#if items[0].selectedRateExchange.estimated_days == 1}
													{$_('checkout.day')}
												{:else}{$_('checkout.days')}{/if}
											</div>
											<div
												class="blue dim pointer"
												on:click={() =>
													handleSelectProviderExchange(items[0], key)}
											>
												{$_('checkout.changeProvider')}
											</div>
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

<div class="w-100 flex justify-end mt5">
	<div class="w-order bg-light-gray pa4 br3">
		<h3 class="mb5">{$_('checkout.purchaseSummary')}</h3>
		<div class="flex justify-between mb4 light-silver">
			<span class="">{$_('cart.subtotal')}</span>
			<span class="fw6">
				{displayCurrency(totalPay, $currency)}
				<u>{$currency}</u>
			</span>
		</div>
		<div class="flex justify-between mb4 light-silver">
			<span class="tooltip">
				<!-- {$_('cart.commission')}  -->
				{$_('cart.totalCommission')}
				<sup>ⓘ</sup>
				<div class="tooltip-content">{$_('cart.totalCommission')}</div>
			</span>
			<span class="fw6">
				{displayCurrency(totalDingtoiFee, $currency)}
				<u>{$currency}</u>
			</span>
		</div>
		<div class="flex justify-between mb4 light-silver">
			<span class="">{$_('checkout.feeShipping')}</span>
			{#if isLoadingShippo}
				<LoadingDefault size={30} color="#e4e6ef" />
			{:else}
				<span class="fw6">
					{displayCurrency(totalShip, $currency)}
					<u>{$currency}</u>
				</span>
			{/if}
		</div>
		<div class="flex justify-between mb4 light-silver">
			<span class="tooltip">
				{$_('checkout.feeShippingYourDevice')}
				<sup>ⓘ</sup>
				<div class="tooltip-content">
					{$_('checkout.feeShippingYourDevice')}
				</div>
			</span>
			{#if isLoadingShippoExchange}
				<LoadingDefault size={30} color="#e4e6ef" />
			{:else}
				<span class="fw6">
					{displayCurrency(totalShipExchange, $currency)}
					<u>{$currency}</u>
				</span>
			{/if}
		</div>
		<div class="flex justify-between mb4 light-silver">
			<span class="">{$_('checkout.estimatedTaxes')}</span>
			<span class="fw6">
				{displayCurrency(0, $currency)}
				<u>{$currency}</u>
			</span>
		</div>
		<!-- {#if totalReceive > 0} -->
		<div
			class="flex justify-between items-center bt bb b--light-gray b--dashed pv4 mv4"
		>
			<div class="b mr5 tooltip">
				<!-- {#if totalReceive > realTotal}
					{$_('checkout.amountRemainingYouReceive')}
				{:else}{$_('checkout.amountRemainingYouPay')}{/if} -->
				{$_('cart.total')}
				<sup>ⓘ</sup>
				<div class="tooltip-content">{$_('checkout.totalAmount')}</div>
			</div>
			<div class="f3 b">
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
		<div class="bg-blue-10 pa4 i br3">
			<div
				class="flex justify-between items-center bb b--blue b--dashed pb4 mb4"
			>
				<div class="blue">
					<div class="f6">{$_('checkout.theAmount')}</div>
					<b class="fw6">{$_('checkout.youWillReceiveLater')}</b>
				</div>
				<b class="f3 blue">
					{displayCurrency(totalReceive, $currency)}
					<u>{$currency}</u>
				</b>
			</div>
			<div class="f6 light-silver">{$_('checkout.receiveTheMoneyDesc')}</div>
		</div>
		<div class="bg-red-10 pa4 i br3 mt4">
			<div
				class="flex justify-between items-center bb b--red b--dashed pb4 mb4"
			>
				<div class="red">
					<div class="f6">{$_('checkout.theAmount')}</div>
					<b class="fw6">{$_('checkout.youHaveToPayImmediately')} </b>
				</div>
				<b class="red f3">
					{#if isLoadingShippo || isLoadingShippoExchange}
						<LoadingDefault size={30} color="#e4e6ef" />
					{:else}{displayCurrency(realTotal, $currency)} <u>{$currency}</u>{/if}
				</b>
			</div>
			<div class="f6 light-silver">
				{$_('checkout.youHaveToPayImmediatelyDesc')}
			</div>
			<div class="flex justify-end mt4">
				<label class="checkbox-default  tr">
					<input type="checkbox" bind:checked={isSelect} />
					<span />
					<span class="ml3 red fw6">{$_('checkout.agree')} ?</span>
				</label>
			</div>
		</div>
	</div>
</div>

<style>
	.bg-shipping {
		background: #e4e6ef;
	}
	.w-order {
		min-width: 40%;
	}
	.flex-1 {
		flex: 1;
	}

	:root {
		--animate-duration: 1s;
		--animate-delay: 1s;
		--animate-repeat: 5;
	}

	@-webkit-keyframes heartBeat {
		0% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}

		14% {
			-webkit-transform: scale(1.3);
			transform: scale(1.3);
		}

		28% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}

		42% {
			-webkit-transform: scale(1.3);
			transform: scale(1.3);
		}

		70% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}
	}

	@keyframes heartBeat {
		0% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}

		14% {
			-webkit-transform: scale(1.3);
			transform: scale(1.3);
		}

		28% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}

		42% {
			-webkit-transform: scale(1.3);
			transform: scale(1.3);
		}

		70% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}
	}
</style>

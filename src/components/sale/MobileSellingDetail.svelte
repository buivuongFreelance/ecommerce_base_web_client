<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import { auth, currency, settings } from '../../stores';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import {
		detailSale as apiDetailSale,
		getShippingAndBilling as apiGetShipping,
		shipments as apiShipments,
	} from '../../services/transaction';
	import config from '../../config';
	import PcSellingDetailDevicetem from './PcSellingDetailDevicetem.svelte';
	import {
		convertCurrency,
		displayCurrency,
		isObjectEmpty,
	} from '../../functions';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import PcModalPayShip from './PcModalPayShip.svelte';
	import PcTagOrder from '../order/PcTagOrder.svelte';
	import PcModalCommissionForSeller from '../modal/PcModalCommissionForSeller.svelte';
	import PcButtonCheckout from '../button/PcButtonCheckout.svelte';
	import PcConfirmAddressShipping from '../checkout/PcConfirmAddressShipping.svelte';
	import MobileSellingDetailDevicetem from './MobileSellingDetailDevicetem.svelte';

	const { session, page } = stores();
	const { domainTransaction } = $session;

	let isLoading = false;
	let isLoadingShippo = false;
	let isServerError = false;
	let sale = {};
	let detailShip = null;
	let detailBill = null;
	let isSameShipping = true;
	let isOpenModal = false;
	let flagPay = false;
	let countItem = 0;
	export let saleCode;

	let isOpenModalCommission = false;

	$: {
		if (isOpenModal) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	}
	onMount(async () => {
		await detailSale();
		await getShippingAndBilling();
	});
	const shipments = (addressTo, parcelsShip) => {
		isLoadingShippo = true;
		return new Promise((resolve, reject) => {
			apiShipments(config.domainShippo, {
				token: config.shippoToken,
				address_from: {
					name: detailShip.first_name + ' ' + detailShip.last_name,
					street1: detailShip.address,
					city: detailShip.city_name,
					state: detailShip.province,
					zip: detailShip.postal_code,
					country: detailShip.country_code,
				},
				address_to: {
					name: addressTo.name,
					street1: addressTo.street1,
					city: addressTo.city,
					state: addressTo.state,
					zip: addressTo.zip,
					country: addressTo.country,
				},
				parcels: parcelsShip,
			})
				.then((obj) => {
					isLoadingShippo = false;
					resolve(obj.data.rates);
				})
				.catch((error) => {
					isLoadingShippo = false;
					isServerError = true;
					reject();
				});
		});
	};
	const getShippingAndBilling = () => {
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiGetShipping(domainTransaction, {
				token,
			})
				.then((obj) => {
					if (!isObjectEmpty(obj)) {
						detailShip = obj.shipping;
						detailBill = obj.billing;
					}
					if (isSameShipping) {
						detailBill = obj.shipping;
					}
					isServerError = false;
					resolve(obj);
				})
				.catch((error) => {
					isServerError = true;
					reject();
				});
		});
	};
	const detailSale = () => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiDetailSale(domainTransaction, {
				token,
				id: $page.params.id,
			})
				.then((items) => {
					isLoading = false;
					sale = items;
					saleCode = items.code;
					if (items.transactions) {
						for (const [key, value] of Object.entries(items.transactions)) {
							for (let i = 0; i < value.length; i++) {
								const v = value[i];
								countItem++;
								if (v.type == config.order.group) {
									flagPay = true;
								}
							}
						}
					}

					isServerError = false;
					resolve();
				})
				.catch((e) => {
					isLoading = false;
					isServerError = true;
					reject();
				});
		});
	};
	const handlePayment = () => {
		// isOpenModal = true;

		goto('my-sales/checkout/' + sale.id);
	};
	const onClose = () => {
		isOpenModal = false;
	};

	const handleSuccessPayment = async () => {
		await detailSale();
	};
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
	const onCloseCommision = () => {
		isOpenModalCommission = false;
	};
</script>

{#if isServerError}
	<div class="mw10 center pt5">
		<p class="red f4">{$_('error.serverErrorMessage')}</p>
	</div>
{:else if sale}
	{#if isOpenModal}
		<Portal target={document.getElementById('portal')}>
			<DimmerModal type="modal" onClick={() => (isOpenModal = false)} />
			<PcModalPayShip
				bind:isSameShipping
				{detailBill}
				{detailShip}
				{onClose}
				{sale}
				{shipments}
				onSuccess={handleSuccessPayment}
				{isLoadingShippo}
			/>
		</Portal>
	{/if}

	{#if isOpenModalCommission}
		<Portal target={document.getElementById('portal')}>
			<DimmerModal
				type="modal"
				onClick={() => (isOpenModalCommission = false)}
			/>
			<PcModalCommissionForSeller onClose={onCloseCommision} />
		</Portal>
	{/if}

	{#if sale}
		<div class="">
			<div class="flex justify-between">
				<div>
					<small class="f6 gray">{$_('order.saleNumber')}</small>
					<h3 class="ttc fw6">#{sale.code}</h3>
				</div>
			</div>

			<table class="table-default mt1rem">
				<tr class="">
					<td width="30%" class="bg-light-gray tr"
						><small class="gray f6">{$_('label.saleStatus')}</small></td
					>
					<td><PcTagOrder status={displayStatus(sale)} /></td>
				</tr>
				{#if sale.transactions}
					<tr class="">
						<td width="30%" class="bg-light-gray tr"
							><small class="gray f6">{$_('cart.items')}:</small></td
						>
						<td class="fw6">{countItem}</td>
					</tr>
				{/if}
				<tr>
					<td width="30%" class="bg-light-gray tr"
						><small class="f6 gray">{$_('label.date')}:</small></td
					>
					<td class="fw6">{new Date(sale.created_at)}</td>
				</tr>
			</table>

			{#if sale.charge_stripe != null}
				<div class="addresses mt1rem mb1rem pb1rem bb b--light-gray b--dashed">
					<div class="address">
						<div class="address__title f6 gray mb3">
							{$_('checkout.billingAdd')}:
						</div>
						<div class="address__content fw6 ml6">
							<div>
								{sale.billing_info.first_name}
								{sale.billing_info.last_name}
							</div>
							<div>{sale.billing_info.address}</div>
							<div>
								{sale.billing_info.city_name},
								{sale.billing_info.province},
								{sale.billing_info.country_code},
								{sale.billing_info.postal_code}
							</div>
							<div>
								{$_('label.phone')}:
								{sale.billing_info.phone_number}
							</div>
						</div>
					</div>
					{#if detailShip}
						<div class="address mt3">
							<div class="address__title f6 gray mb3">
								{$_('checkout.shippingAdd')}:
							</div>
							<div class="address__content fw6 ml6">
								{#if sale.shipping_info != null}
									<div>
										{sale.shipping_info.first_name}
										{sale.shipping_info.last_name}
									</div>
									<div>{sale.shipping_info.address}</div>
									<div>
										{sale.shipping_info.city_name},
										{sale.shipping_info.province},
										{sale.shipping_info.country_code},
										{sale.shipping_info.postal_code}
									</div>
									<div>
										{$_('label.phone')}:
										{sale.shipping_info.phone_number}
									</div>
								{:else}
									<div>
										{detailShip.first_name}
										{detailShip.last_name}
									</div>
									<div>{detailShip.address}</div>
									<div>
										{detailShip.city_name},
										{detailShip.province},
										{detailShip.country_code},
										{detailShip.postal_code}
									</div>
									<div>
										{$_('label.phone')}:
										{detailShip.phone_number}
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/if}

			{#if isLoading}
				<ContentLoader
					uniqueKey="mobilesellingdetail"
					primaryColor="#e4e6ef"
					secondaryColor="#f8f8f8"
					width="345"
					height="220"
				>
					<rect x="0" y="0" rx="3" ry="3" width="60" height="60" />
					<rect x="70" y="0" rx="3" ry="3" width="150" height="30" />
					<rect x="70" y="40" rx="3" ry="3" width="250" height="20" />

					<rect x="0" y="80" rx="3" ry="3" width="60" height="60" />
					<rect x="70" y="80" rx="3" ry="3" width="150" height="30" />
					<rect x="70" y="120" rx="3" ry="3" width="250" height="20" />

					<rect x="0" y="160" rx="3" ry="3" width="60" height="60" />
					<rect x="70" y="160" rx="3" ry="3" width="150" height="30" />
					<rect x="70" y="200" rx="3" ry="3" width="250" height="20" />
				</ContentLoader>
			{:else if sale.transactions}
				{#each Object.entries(sale.transactions) as [key, items]}
					{#if items}
						{#if items.length > 0}
							{#if key !== config.buyer}
								{#if sale.charge_stripe == null}
									<div class="ribbon mt1rem">
										<div class="ribbon__content f5">
											{$_('message.itemsThatYouPay')}
										</div>
									</div>
								{/if}
							{/if}
							<div class="bg-shipping ph4 pv3">
								{#if items[0].type == config.buyer}
									<div
										class="ttu fw7 f7 status-default status-default--in-transaction"
									>
										{$_('message.inTransaction')}
									</div>
								{:else if sale.charge_stripe == null}
									<div
										class="ttu fw7 f7 status-default status-default--waiting-for-owner-payment"
									>
										{$_('message.youNotPaidYet')}
									</div>
								{:else}
									<div
										class="ttu fw7 f7 status-default status-default--in-transaction"
									>
										{$_('message.inTransaction')}
									</div>
								{/if}
							</div>
							{#each items as item}
								<MobileSellingDetailDevicetem
									{item}
									{sale}
									bind:isOpenModalCommission
								/>
							{/each}
							{#if sale.charge_stripe}
								{#if key !== config.buyer}
									{#if sale.amount_info}
										<div class="bg-blue-10 pa4 bt bb bl bb br b--light-gray">
											<div class="flex flex-column items-end tr">
												<div class="w-shippo">
													<div class="b">
														{sale.amount_info.selectedRate.provider}
														{$_('checkout.provider')}
													</div>
													<div class="fw6 dark-blue">
														{convertCurrency(
															sale.amount_info.selectedRate.amount,
															sale.amount_info.selectedRate.currency,
															$settings
														)}
														{$currency}
													</div>

													<div class="light-silver f6 duration">
														{$_('checkout.estimatedDeliveryDate')}:
														{sale.amount_info.selectedRate.estimated_days}
														{#if sale.amount_info.selectedRate.estimated_days == 1}
															{$_('checkout.day')}
														{:else}{$_('checkout.days')}{/if}
													</div>
												</div>
											</div>
										</div>
									{/if}
								{/if}
							{/if}
							{#if key !== config.buyer}
								{#if sale.charge_stripe == null && flagPay}
									<div class="pt3 tr bt b--light-gray">
										<PcButtonCheckout onClickButton={handlePayment} />
									</div>
								{/if}
							{/if}
							<div class="mb4" />
						{/if}
					{/if}
				{/each}
			{/if}

			{#if sale.charge_stripe && sale.amount_info && flagPay}
				<div class="mt1rem">
					<h4 class="fw6 mb4">{$_('checkout.saleSummary')}</h4>
					<div class="bg-light-gray pa4 br3">
						<div class="flex justify-between mb3">
							<span class="f6 light-silver">{$_('cart.subtotal')}</span>
							<span class="fw6">
								{displayCurrency(sale.receive_money_not_fee, $currency)}
								<u>{$currency}</u>
							</span>
						</div>
						<div class="flex justify-between mb3">
							<span class="f6 light-silver"
								>{$_('cart.commission')} <sup>ⓘ</sup></span
							>
							<span class="fw6">
								{displayCurrency(sale.amount_info.totalDingtoiFee, $currency)}
								<u>{$currency}</u>
							</span>
						</div>
						<div class="flex justify-between mb3">
							<span class="f6 light-silver">
								{$_('checkout.feeShippingYourDevice')}
								<sup>ⓘ</sup>
							</span>
							<span class="fw6">
								{displayCurrency(sale.amount_info.totalShip, $currency)}
								<u>{$currency}</u>
							</span>
						</div>
						<div class="flex justify-between ">
							<span class="f6 light-silver"
								>{$_('checkout.estimatedTaxes')}</span
							>
							<span class="fw6">
								{displayCurrency(0, $currency)}
								<u>{$currency}</u>
							</span>
						</div>
					</div>

					<div
						class="flex justify-between items-center bt bb b--light-gray b--dashed pa4 mv4"
					>
						<div class="b mr5">{$_('cart.total')}</div>
						<div class="f4 b">
							<span class="">
								{#if sale.amount_info.totalReceive > sale.amount_info.stripePay}
									-{displayCurrency(
										sale.amount_info.totalReceive - sale.amount_info.stripePay,
										$currency
									)}
								{:else}
									{displayCurrency(
										sale.amount_info.stripePay - sale.amount_info.totalReceive,
										$currency
									)}
								{/if}
							</span>
							<u>{$currency}</u>
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
							<b class="f4 blue">
								{displayCurrency(sale.amount_info.totalReceive, $currency)}
								<u>{$currency}</u>
							</b>
						</div>
						<div class="f6 light-silver">
							{$_('checkout.receiveTheMoneyDescForSale')}
						</div>
					</div>

					<div class="bg-red-10 pa4 i br3 mt4">
						<div
							class="flex justify-between items-center bb b--red b--dashed pb4 mb4"
						>
							<div class="red">
								<div class="f6">{$_('checkout.theAmount')}</div>
								<b class="fw6">{$_('checkout.youHaveToPayImmediately')} </b>
							</div>
							<b class="f4 red"
								>{displayCurrency(sale.amount_info.stripePay, $currency)}
								<u>{$currency}</u>
							</b>
						</div>
						<div class="f6 light-silver">
							{$_('checkout.youHaveToPayImmediatelyDesc')}
						</div>
					</div>
				</div>
			{/if}

			<!-- <div class="invoice">
				<div class="invoice__body mb3em">
					<table class="table w-100 layout-fixed">
						<thead>
							<tr>
								<th />
								<th />
								<th />
								<th width="1" />
							</tr>
						</thead>
						<tbody>
							{#if sale.transactions}
								{#each Object.entries(sale.transactions) as [key, items]}
									{#if items}
										{#if items.length > 0}
											{#if key !== config.buyer}
												{#if sale.charge_stripe == null}
													<tr class="row-title">
														<td colspan="4" class="pa0">
															<div class="ribbon">
																<div class="ribbon__content f4">
																	{$_('message.itemsThatYouPay')}
																</div>
															</div>
														</td>
													</tr>
												{/if}
											{/if}

											<tr class="">
												<td colspan="4" class="bg-shipping">
													<div class="pl4">
														{#if items[0].type == config.buyer}
															<div
																class="ttu fw7 f7 status-default status-default--in-transaction"
															>
																{$_('message.inTransaction')}
															</div>
														{:else if sale.charge_stripe == null}
															<div
																class="ttu fw7 f7 status-default status-default--waiting-for-owner-payment"
															>
																{$_('message.youNotPaidYet')}
															</div>
														{:else}
															<div
																class="ttu fw7 f7 status-default status-default--in-transaction"
															>
																{$_('message.inTransaction')}
															</div>
														{/if}
													</div>
												</td>
											</tr>
											{#each items as item}
												<PcSellingDetailDevicetem
													{item}
													{sale}
													bind:isOpenModalCommission
												/>
											{/each}
											{#if sale.charge_stripe}
												<tr class="bt bl br b--light-gray">
													<td colspan="4">
														<div class="flex flex-column items-end pr4 tr">
															<div class="tooltip">
																
															</div>
															{#if key !== config.buyer}
																{#if sale.amount_info}
																	<div class="w-shippo">
																		<div class="b">
																			{sale.amount_info.selectedRate.provider}
																			{$_('checkout.provider')}
																		</div>
																		<div class="fw6 dark-blue">
																			{convertCurrency(
																				sale.amount_info.selectedRate.amount,
																				sale.amount_info.selectedRate.currency,
																				$settings
																			)}
																			{$currency}
																		</div>

																		<div class="light-silver f6 duration">
																			{$_('checkout.estimatedDeliveryDate')}:
																			{sale.amount_info.selectedRate
																				.estimated_days}
																			{#if sale.amount_info.selectedRate.estimated_days == 1}
																				{$_('checkout.day')}
																			{:else}{$_('checkout.days')}{/if}
																		</div>
																	</div>
																{/if}
															{/if}
														</div>
														
													</td>
												</tr>
											{/if}
											{#if key !== config.buyer}
												{#if sale.charge_stripe == null && flagPay}
													<tr>
														<td colspan="3" />
														<td colspan="" class="">
															<PcButtonCheckout onClickButton={handlePayment} />
														</td>
													</tr>
												{/if}
											{/if}
										{/if}
									{/if}
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			</div> -->
		</div>
	{/if}
{/if}

<style>
	/* .invoice {
		margin: 0 auto;
		background-color: #fff;
		color: #3f4254;
		font-family: arial;
		font-size: 16px;
		line-height: 1.5;
	}
	.table {
		width: 100%;
		border-collapse: collapse;
	}

	.table tr {
		border-bottom: 1px solid #e5e5e5;
	} */
	.bg-shipping {
		background: #e4e6ef;
	}
	/* .table td {
		padding: 1em 0;
	} */

	.ribbon {
		display: flex;
	}
	.ribbon__content {
		height: 40px;
		line-height: 40px;
		padding: 0 20px;
		background-color: #3699ff;
		color: white;
	}
	.ribbon::after {
		content: '';
		display: inline-block;
		border: 20px solid transparent;
		border-left-color: #3699ff;
		border-bottom-color: #3699ff;
	}
	/* .table .pa0 {
		padding: 0;
	} */

	.table-default td {
		padding: 10px;
	}
</style>

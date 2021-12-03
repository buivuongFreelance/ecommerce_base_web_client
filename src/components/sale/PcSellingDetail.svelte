<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import {
		auth,
		currency,
		settings,
		notifyTransactionChanged,
	} from '../../stores';
	import { onDestroy, onMount } from 'svelte';
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
		convertMillisecondsToHours,
		displayCurrency,
		isObjectEmpty,
	} from '../../functions';
	import Portal from 'svelte-portal';
	import DimmerModal from '../../components/loading/DimmerModal.svelte';
	import PcModalPayShip from './PcModalPayShip.svelte';
	import PcTagOrder from '../order/PcTagOrder.svelte';
	import PcModalCommissionForSeller from '../modal/PcModalCommissionForSeller.svelte';
	import PcButtonCheckout from '../button/PcButtonCheckout.svelte';
	import PcConfirmAddressShipping from '../checkout/PcConfirmAddressShipping.svelte';
	import IconTimer from '../icon/IconTimer.svelte';
	import { differenceInSeconds } from 'date-fns';
	import { tweened } from 'svelte/motion';
	import { msToSeconds } from '../../functions';
	import IconWarning from '../icon/IconWarning.svelte';

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
	let mounted = false;
	export let saleCode;

	let isOpenModalCommission = false;

	$: {
		if (isOpenModal) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	}
	let timer = null;
	let intervalTimer = null;
	let remainingAcceptTimeout = 0;

	$: hours =
		Math.floor($timer / 3600) < 10
			? '0' + Math.floor($timer / 3600)
			: Math.floor($timer / 3600);
	$: minutes =
		Math.floor(Math.floor($timer - hours * 3600) / 60) < 10
			? '0' + Math.floor(Math.floor($timer - hours * 3600) / 60)
			: Math.floor(Math.floor($timer - hours * 3600) / 60);
	$: minname = minutes > 1 ? $_('message.minutes') : $_('message.minute');
	$: seconds =
		Math.floor($timer - (hours * 3600 + minutes * 60)) < 10
			? '0' + Math.floor($timer - (hours * 3600 + minutes * 60))
			: Math.floor($timer - (hours * 3600 + minutes * 60));

	const unsubscribeNotifyTransactionChanged = notifyTransactionChanged.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					detailSale();
				}
			}
		}
	);
	onMount(async () => {
		mounted = true;

		await detailSale();
		await getShippingAndBilling();
		await countdown();
	});
	onDestroy(() => {
		unsubscribeNotifyTransactionChanged();
		if (intervalTimer) {
			clearInterval(intervalTimer);
		}
	});
	const setTimer = () => {
		if ($timer === 0) {
			if (intervalTimer) {
				clearInterval(intervalTimer);
				timer = null;
				remainingAcceptTimeout = 0;
			}
		} else {
			if ($timer > 0) $timer--;
		}
	};

	const countdown = () => {
		let result = 0;

		result = Math.abs(
			differenceInSeconds(new Date(sale.created_at), new Date())
		);

		const timeAccept = msToSeconds(
			$settings.transaction_seller_pay_checkout_timer
		);
		if (result < timeAccept) {
			remainingAcceptTimeout = timeAccept - parseFloat(result);
			timer = tweened(remainingAcceptTimeout);
			intervalTimer = setInterval(setTimer, 1000);
		} else {
			remainingAcceptTimeout = 0;
		}
	};
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
			<div class="flex justify-between items-center mb5">
				<h2 class="ttc">{$_('order.saleDetail')}</h2>
			</div>
			<div class="invoice">
				<div class="invoice__header flex mb3em">
					<div class="header__left flex-1">
						<div class="addresses flex">
							{#if sale.charge_stripe != null}
								<div class="address mr2em">
									<div class="address__title b f4 mb1em">
										{$_('checkout.billingAdd')}:
									</div>
									<div class="address__content">
										<div>
											{sale.billing_info.first_name}
											{sale.billing_info.last_name}
										</div>
										<div>{sale.billing_info.address}</div>
										<div>
											{$_('label.phone')}:
											{sale.billing_info.phone_number}
										</div>
									</div>
								</div>
							{/if}
							{#if sale.charge_stripe != null}
								{#if detailShip}
									<div class="address">
										<div class="address__title b f4 mb1em">
											{$_('checkout.shippingAdd')}:
										</div>
										<div class="address__content">
											{#if sale.shipping_info != null}
												<div>
													{sale.shipping_info.first_name}
													{sale.shipping_info.last_name}
												</div>
												<div>{sale.shipping_info.address}</div>
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
							{/if}
						</div>
					</div>
					<div class="header__right w-40">
						<dl class="dl mb1em">
							<dt class="b mb1em f4">{$_('order.saleNumber')}</dt>
							<dd class="b mb1em f4 tr">#{sale.code}</dd>
							<dt class="b">{$_('label.saleStatus')}</dt>
							<dd class="tr">
								<PcTagOrder status={displayStatus(sale)} />
							</dd>
							{#if sale.transactions}
								<dt class="b ttc">{$_('cart.items')}</dt>
								<dd class="tr">{countItem}</dd>
							{/if}
							<dt class="b">{$_('label.date')}</dt>
							<dd class="tr">{new Date(sale.created_at)}</dd>
						</dl>
					</div>
				</div>
				<div class="invoice__body mb3em">
					<table class="table w-100 layout-fixed">
						<thead>
							<tr>
								<!-- <th class="tl">{$_('cart.item')}</th>
								<th class="tl">{$_('device.status')}</th>
								<th class="tr">{$_('cart.price')}</th> -->
								<th />
								<th />
								<th />
								<th width="1" />
							</tr>
						</thead>
						<tbody>
							{#if isLoading}
								<ContentLoader
									uniqueKey="cartPage"
									primaryColor="#e4e6ef"
									secondaryColor="#f8f8f8"
									width={config.containerDesktop - 30}
									height="100"
								>
									<rect x="0" y="0" rx="3" ry="3" width="800" height="20" />
									<rect
										x="0"
										y="40"
										rx="3"
										ry="3"
										width={config.containerDesktop - 30}
										height="20"
									/>
									<rect
										x="0"
										y="40"
										rx="3"
										ry="3"
										width={config.containerDesktop - 30}
										height="20"
									/>
									<rect x="0" y="80" rx="3" ry="3" width="800" height="20" />
								</ContentLoader>
							{:else if sale.transactions}
								{#each Object.entries(sale.transactions) as [key, items]}
									{#if items}
										{#if items.length > 0}
											{#if key !== config.buyer}
												{#if sale.charge_stripe == null}
													<tr class="row-title">
														<td colspan="4" class="pa0">
															<div class="flex justify-between items-center">
																{#if sale.status == config.order.systemCancelNotPayShip}
																	<div class="ribbon-cancel flex">
																		<div
																			class="ribbon__content f4 bg-yellow h-60-px items-center flex"
																		>
																			<IconWarning />
																			<span class="ml3">
																				{$_('message.reasonCancelPayShip', {
																					values: {
																						hour: convertMillisecondsToHours(
																							$settings.transaction_seller_pay_checkout_timer
																						),
																					},
																				})}
																			</span>
																		</div>
																	</div>
																{:else}
																	<div class="ribbon flex">
																		<div
																			class="ribbon__content f4 bg-blue h-60-px white"
																		>
																			{$_('message.itemsThatYouPay')}
																		</div>
																	</div>
																	{#if remainingAcceptTimeout != 0}
																		<div class="flex light-silver items-center">
																			<IconTimer size="20" fill="#6c7293" />
																			<span class="ml1 mr3">
																				{$_(
																					'transaction.remainingTimeToPayment'
																				)}:
																			</span>
																			<div
																				class="timeout fadeOutUp animated infinite f4 fw6 red mt4"
																			>
																				{hours}:{minutes}:{seconds}
																			</div>
																		</div>
																	{/if}
																{/if}
															</div>
														</td>
													</tr>
												{/if}
											{/if}

											<tr class="">
												<td colspan="4" class="bg-shipping">
													<div class="pl4">
														{#if items[0].status == config.transaction.systemCancelled}
															<div
																class="ttu fw7 f7 status-default status-default--in-transaction"
															>
																{$_('message.cancelled')}
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
											{#if sale.charge_stripe && key !== config.buyer}
												<tr class="bt bl br b--light-gray">
													<td colspan="4">
														<div class="flex flex-column items-end pr4 tr">
															<div class="tooltip">
																{#if detailShip && sale.buyer_shipping_info}
																	<PcConfirmAddressShipping
																		shippingBuyer={detailShip.address}
																		shippingSeller={sale.buyer_shipping_info
																			.address}
																		mode={'exchange'}
																	/>

																	<div class="tooltip-content top-right">
																		<div>
																			{$_('label.theShippingChargesFor')}
																		</div>
																		{#each items as i}
																			<div class="b">
																				{i.model}
																				{i.color}
																				{i.capacity}
																				{$_('label.GB')}
																			</div>
																		{/each}
																		<div class="mt1 pt1 bt b--gray">
																			{$_('label.from')}
																			<b>{detailShip.address}</b>
																		</div>
																		<div>
																			{$_('label.to')}
																			<b>{sale.buyer_shipping_info.address}</b>
																		</div>
																	</div>
																{/if}
															</div>
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
														</div>
														<!-- {#if items[0].shipping_rate_seller != null}
															<p class="mv3 tr pr4">
																<a
																	class="btn-view f7 bg-blue white ph4 br2 pointer grow"
																	target="_blank"
																	href={items[0].shipping_rate_seller
																		.selectedRatePaid.label_url}
																>
																	{$_('checkout.getShippingLabel')}
																</a>
															</p>
															<p class="tr pr4">
																{$_('checkout.trackingNumber')}:
																<a
																	class="blue"
																	target="_blank"
																	href={items[0].shipping_rate_seller
																		.selectedRatePaid.tracking_url_provider}
																>
																	{items[0].shipping_rate_seller
																		.selectedRatePaid.tracking_number}
																</a>
															</p>
														{/if} -->
													</td>
												</tr>
											{/if}
											{#if key !== config.buyer && sale.status != config.order.systemCancelNotPayShip}
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

					{#if sale.charge_stripe && sale.amount_info && flagPay}
						<div class="w-100 flex justify-end mt5">
							<div class="w-order bg-light-gray pa4 br3">
								<h3 class="mb5">{$_('checkout.saleSummary')}</h3>
								<div class="flex justify-between mb4 light-silver">
									<span class="">{$_('cart.subtotal')}</span>
									<span class="fw6">
										{displayCurrency(sale.receive_money_not_fee, $currency)}
										<u>{$currency}</u>
									</span>
								</div>
								<div class="flex justify-between mb4 light-silver">
									<span class="">{$_('cart.commission')} <sup>ⓘ</sup></span>
									<span class="fw6">
										{displayCurrency(
											sale.amount_info.totalDingtoiFee,
											$currency
										)}
										<u>{$currency}</u>
									</span>
								</div>
								<div class="flex justify-between mb4 light-silver">
									<span class="">
										{$_('checkout.feeShippingYourDevice')}
										<sup>ⓘ</sup>
									</span>
									<span class="fw6">
										{displayCurrency(sale.amount_info.totalShip, $currency)}
										<u>{$currency}</u>
									</span>
								</div>
								<div class="flex justify-between mb4 light-silver">
									<span class="">{$_('checkout.estimatedTaxes')}</span>
									<span class="fw6">
										{displayCurrency(0, $currency)}
										<u>{$currency}</u>
									</span>
								</div>

								<div
									class="flex justify-between items-center bt bb b--light-gray b--dashed pv4 mv4"
								>
									<div class="b mr5">{$_('cart.total')} <sup>ⓘ</sup></div>
									<div class="f3 b">
										<span class="">
											{#if sale.amount_info.totalReceive > sale.amount_info.stripePay}
												-{displayCurrency(
													sale.amount_info.totalReceive -
														sale.amount_info.stripePay,
													$currency
												)}
											{:else}
												{displayCurrency(
													sale.amount_info.stripePay -
														sale.amount_info.totalReceive,
													$currency
												)}
											{/if}
											<u>{$currency}</u>
										</span>
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
											{displayCurrency(
												sale.amount_info.totalReceive,
												$currency
											)}
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
											<b class="fw6"
												>{$_('checkout.youHaveToPayImmediately')}
											</b>
										</div>
										<b class="f3 red"
											>{displayCurrency(sale.amount_info.stripePay, $currency)}
											<u>{$currency}</u>
										</b>
									</div>
									<div class="f6 light-silver">
										{$_('checkout.youHaveToPayImmediatelyDesc')}
									</div>
								</div>
							</div>
						</div>
					{:else if !flagPay}
						<div class="w-100 flex justify-end mt5">
							<div class="w-order bg-light-gray pa4 br3">
								<h3 class="mb5">{$_('checkout.saleSummary')}</h3>

								<div class="bg-blue-10 pa4 i br3">
									<div
										class="flex justify-between items-center bb b--blue b--dashed pb4 mb4"
									>
										<div class="blue">
											<div class="f6">{$_('checkout.theAmount')}</div>
											<b class="fw6">{$_('checkout.youWillReceiveLater')}</b>
										</div>
										<b class="f3 blue">
											{displayCurrency(sale.money, $currency)}
											<u>{$currency}</u>
										</b>
									</div>
									<div class="f6 light-silver">
										{$_('checkout.receiveTheMoneyDescForSale')}
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
{/if}

<style>
	.flex-1 {
		flex: 1;
	}
	.mb1em {
		margin-bottom: 1em;
	}
	.mr2em {
		margin-right: 2em;
	}
	.invoice {
		margin: 0 auto;
		background-color: #fff;
		color: #3f4254;
		font-family: arial;
		font-size: 16px;
		line-height: 1.5;
	}
	.dl {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.dl dt,
	.dl dd {
		width: 50%;
		line-height: 2;
	}
	.table {
		width: 100%;
		border-collapse: collapse;
	}

	.table tr {
		border-bottom: 1px solid #e5e5e5;
	}
	.bg-shipping {
		background: #e4e6ef;
	}
	.table td {
		padding: 1em 0;
	}

	.w-order {
		min-width: 40%;
	}
	.flex-1 {
		flex: 1;
	}
	/* .btn-view {
		text-decoration: none;
		display: inline-block;
		height: 30px;
		line-height: 30px;
	} */
	.row-title {
		border-top: 30px solid white;
	}

	.ribbon__content {
		line-height: 60px;
		padding: 0 40px 0 20px;
	}
	.ribbon::after {
		content: '';
		display: inline-block;
		border: 30px solid transparent;
		border-left-color: #3699ff;
		border-bottom-color: #3699ff;
	}
	.ribbon-cancel::after {
		content: '';
		display: inline-block;
		border: 30px solid transparent;
		border-left-color: #fbbb38;
		border-bottom-color: #fbbb38;
	}
	.table .pa0 {
		padding: 0;
	}
</style>

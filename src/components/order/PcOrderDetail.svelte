<script>
	import { _ } from 'svelte-i18n';

	import { stores } from '@sapper/app';
	import {
		auth,
		currency,
		settings,
		notifyTransactionChanged,
	} from '../../stores';
	import { onDestroy, onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import { detailOrder as apiDetailOrder } from '../../services/transaction';
	import config from '../../config';
	import {
		censorEmail,
		censorWord,
		convertCurrency,
		displayCurrency,
	} from '../../functions';
	import PcConfirmEmailTitle from '../checkout/PcConfirmEmailTitle.svelte';
	import PcTagOrder from './PcTagOrder.svelte';
	import PcConfirmAddressShipping from '../checkout/PcConfirmAddressShipping.svelte';
	import PcConfirmCartItemOrder from './PcConfirmCartItemOrder.svelte';

	const { session, page } = stores();
	const { domainTransaction } = $session;

	let isLoading = false;
	let isServerError = false;
	let order = '';
	let total = 0;
	let mounted = false;
	export let purchaseCode;

	const unsubscribeNotifyTransactionChanged = notifyTransactionChanged.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					detailOrder();
				}
			}
		}
	);

	onMount(async () => {
		mounted = true;
		await detailOrder();
	});
	onDestroy(() => {
		unsubscribeNotifyTransactionChanged();
	});
	const detailOrder = () => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiDetailOrder(domainTransaction, {
				token,
				orderId: $page.params.id,
			})
				.then((item) => {
					if (item) {
						const listGroupedExchange = item.transactions.reduce(function (
							r,
							a
						) {
							if (a.type === config.order.group) {
								r[`${a.device_user_email}-exchange`] =
									r[`${a.device_user_email}-exchange`] || [];
								a.proposal_exchange_devices = a.items;
								a.proposal_exchange_price = a.money_not_fee;
								a.proposal_type = config.exchange;
								a.status_temp = a.status;
								if (
									a.status === config.order.ownerScanned ||
									a.status === config.order.buyerAccept ||
									a.status === config.order.buyerRejected
								) {
									a.status_temp = config.device.created;
								}
								r[`${a.device_user_email}-exchange`].push(a);
							}
							return r;
						},
						Object.create(null));

						for (let key in listGroupedExchange) {
							const lg = listGroupedExchange[key];
							const test = lg.reduce(function (r, a) {
								r[a.status_temp] = r[a.status_temp] || [];
								r[a.status_temp].push(a);
								return r;
							}, Object.create(null));
							listGroupedExchange[key] = test;
						}

						const listGroupedSell = item.transactions.reduce(function (r, a) {
							if (a.type !== config.order.group) {
								r[a.device_user_email] = r[a.device_user_email] || [];
								a.proposal_type = config.sell;
								a.status_temp = a.status;
								if (
									a.status === config.order.ownerScanned ||
									a.status === config.order.buyerAccept ||
									a.status === config.order.buyerRejected
								) {
									a.status_temp = config.device.created;
								}
								r[a.device_user_email].push(a);
							}
							return r;
						}, Object.create(null));

						for (let key in listGroupedSell) {
							const lg = listGroupedSell[key];
							const test = lg.reduce(function (r, a) {
								r[a.status_temp] = r[a.status_temp] || [];
								r[a.status_temp].push(a);
								return r;
							}, Object.create(null));
							listGroupedSell[key] = test;
						}

						const listFinal = { ...listGroupedSell, ...listGroupedExchange };

						item.listFinal = listFinal;
						order = item;
						if (order.amount_info) {
							total =
								order.amount_info.totalPay +
								order.amount_info.totalDingtoiFee +
								order.amount_info.totalShip +
								order.amount_info.totalShipExchange;
						}
						purchaseCode = item.order_number;
					}
					isServerError = false;
					isLoading = false;
					resolve();
				})
				.catch((error) => {
					isLoading = false;
					isServerError = true;
					reject();
				});
		});
	};
	const displayStatus = (order) => {
		if (order.status == config.order.shipped) {
			return config.order.shipped;
		} else if (order.status == config.order.completed) {
			return config.order.confirm;
		} else if (order.status == config.order.buyerRejected) {
			return config.order.inDispute;
		} else if (order.status == config.transaction.systemCancelled) {
			return config.transaction.systemCancelled;
		} else if (
			order.countTransactionsExchangeIsPaid > 0 ||
			order.countTransactionsSellIsPaid > 0
		) {
			return config.order.processing;
		} else if (
			order.countTransactionsExchangeIsPaid == 0 &&
			order.countTransactionsSellIsPaid == 0
		) {
			return config.order.created;
		}
	};
</script>

{#if isServerError}
	<div class="mw10 center pt5">
		<p class="red f4">{$_('error.serverErrorMessage')}</p>
	</div>
{:else if isLoading}
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
{:else}
	<div class="flex justify-between items-center mb5">
		<h2 class="ttc">{$_('order.orderDetail')}</h2>
		<span
			class="pointer bg-blue-20 br2 flex items-center justify-center print dim"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="24"
				viewBox="0 0 24 24"
				fill="#3699ff"
				width="24"
				><path d="M0 0h24v24H0V0z" fill="none" />
				<path
					d="M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 12v2H8v-4h8v2zm2-2v-2H6v2H4v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4h-2z"
				/>
				<circle cx="18" cy="11.5" r="1" />
			</svg>
		</span>
	</div>
	{#if order}
		<div class="invoice">
			<div class="invoice__header flex mb3em">
				<div class="header__left flex-1">
					<!-- <img
						src="images/com_logo_color.png"
						alt="dingtoi"
						class="logo mb2em" /> -->
					<div class="addresses flex">
						<div class="address mr2em">
							<div class="address__title b f4 mb1em">
								{$_('checkout.billingAdd')}:
							</div>
							<div class="address__content">
								{#if order.billing_info}
									<div>
										{order.billing_info.first_name}
										{order.billing_info.last_name}
									</div>
									<div>{order.billing_info.address}</div>
									<div>{$_('label.phone')}: {order.billing_info.phone}</div>
								{/if}
							</div>
						</div>
						<div class="address mr2em">
							<div class="address__title b f4 mb1em">
								{$_('checkout.shippingAdd')}:
							</div>
							<div class="address__content">
								{#if order.shipping_info}
									<div>
										{order.shipping_info.first_name}
										{order.shipping_info.last_name}
									</div>
									<div>{order.shipping_info.address}</div>
									<div>{$_('label.phone')}: {order.shipping_info.phone}</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
				<div class="header__right w-40">
					<dl class="dl mb1em">
						<dt class="b mb1em f4">{$_('label.orderNumber')}</dt>
						<dd class="b mb1em f4 tr">#{order.order_number}</dd>
						<dt class="b">{$_('label.orderStatus')}</dt>
						<dd class="tr">
							<PcTagOrder status={displayStatus(order)} />
						</dd>
						{#if order.transactions}
							<dt class="b ttc">{$_('cart.items')}</dt>
							<dd class="tr">{order.transactions.length}</dd>
						{/if}
						<dt class="b">{$_('label.date')}</dt>
						<dd class="tr">{new Date(order.created_at)}</dd>
					</dl>
				</div>
			</div>
			<div class="invoice__body mb3em">
				<table class="table mb2em">
					<!-- <thead>
						<tr>
							<th class="tl">{$_('cart.item')}</th>
							<th class="tl">{$_('device.status')}</th>
							<th class="tr">{$_('cart.price')}</th>
						</tr>
					</thead> -->
					<thead>
						<th />
						<th />
						<th />
						<th width="1" />
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
						{:else if order.listFinal}
							{#each Object.entries(order.listFinal) as [key, items]}
								{#if items}
									<tr class="row-header">
										<td colspan="4" class="bg-blue-20">
											<div class="ph4">
												<PcConfirmEmailTitle
													email={censorEmail(key.replace('-exchange', ''))}
													mode={key.includes('-exchange')
														? config.exchange
														: config.sell}
												/>
											</div>
										</td>
									</tr>
									{#each Object.entries(items) as [key1, items1]}
										{#if items1}
											{#if items1.length > 0}
												<tr class="row-title">
													<td colspan="4" class="bg-shipping">
														<div class="pl4 ttu f7 fw7">
															{#if items1[0].status == config.transaction.systemCancelled}
																<div
																	class="status-default status-default--in-transaction"
																>
																	{$_('message.cancelled')}
																</div>
															{:else if parseInt(items1[0].countTransactionsExchangeIsPaid) === 0}
																<div
																	class="status-default status-default--waiting-for-owner-payment"
																>
																	{$_('message.sellerNotPaidYet')}
																</div>
															{:else}
																<div
																	class="status-default status-default--in-transaction "
																>
																	{$_('message.inTransaction')}
																</div>
															{/if}
														</div>
													</td>
												</tr>
												{#each items1 as item1}
													<PcConfirmCartItemOrder
														item={item1}
														invoice_info={item1.charge_stripe_seller}
													/>
												{/each}
												<tr class="bt bl br b--light-gray">
													<td colspan="4">
														<div class="flex justify-end pr4">
															{#if items1[0].type == config.buyer}
																{#if items1[0].shipping_rate_buyer}
																	<div class="flex-1 tr tr">
																		<div class="tooltip">
																			<PcConfirmAddressShipping
																				shippingBuyer={order.shipping_info
																					.address}
																				shippingSeller={items1[0]
																					.shipping_rate_buyer.sellerAddress +
																					', ' +
																					items1[0].shipping_rate_buyer
																						.sellerCity +
																					', ' +
																					items1[0].shipping_rate_buyer
																						.sellerState +
																					', ' +
																					items1[0].shipping_rate_buyer
																						.sellerPostalCode}
																				mode={items1[0].type}
																			/>
																			<div class="tooltip-content top-right">
																				<div>
																					{$_('label.theShippingChargesFor')}
																				</div>
																				{#each items1 as item}
																					<div class="b">
																						{item.model}
																						{item.color}
																						{item.capacity}{$_('label.GB')}
																					</div>
																				{/each}
																				<div class="mt1 pt1 bt b--gray">
																					{$_('label.from')}
																					<b
																						>{items1[0].shipping_rate_buyer
																							.sellerAddress +
																							', ' +
																							items1[0].shipping_rate_buyer
																								.sellerCity +
																							', ' +
																							items1[0].shipping_rate_buyer
																								.sellerState +
																							', ' +
																							items1[0].shipping_rate_buyer
																								.sellerPostalCode}</b
																					>
																				</div>
																				<div>
																					{$_('label.to')}
																					<b>{order.shipping_info.address}</b>
																				</div>
																			</div>
																		</div>
																		<div class="w-shippo">
																			<div class="b">
																				{items1[0].shipping_rate_buyer
																					.selectedRate.provider}
																				{$_('checkout.provider')}
																			</div>
																			<div class="fw6 dark-blue">
																				{convertCurrency(
																					items1[0].shipping_rate_buyer
																						.selectedRate.amount,
																					items1[0].shipping_rate_buyer
																						.selectedRate.currency,
																					$settings
																				)}
																				{$currency}
																			</div>

																			<div class="light-silver f6 duration">
																				{$_('checkout.estimatedDeliveryDate')}:
																				{items1[0].shipping_rate_buyer
																					.selectedRate.estimated_days}
																				{#if items1[0].shipping_rate_buyer.selectedRate.estimated_days == 1}
																					{$_('checkout.day')}
																				{:else}{$_('checkout.days')}{/if}
																			</div>
																		</div>
																	</div>
																{/if}
															{/if}
															{#if items1[0].type != config.buyer}
																{#if items1[0].shipping_rate_buyer}
																	<div class="flex-1 tr">
																		<div class="tooltip">
																			<PcConfirmAddressShipping
																				shippingBuyer={order.shipping_info
																					.address}
																				shippingSeller={items1[0]
																					.shipping_rate_buyer.sellerAddress +
																					', ' +
																					items1[0].shipping_rate_buyer
																						.sellerCity +
																					', ' +
																					items1[0].shipping_rate_buyer
																						.sellerState +
																					', ' +
																					items1[0].shipping_rate_buyer
																						.sellerPostalCode}
																				mode={items1[0].type}
																			/>
																			<div class="tooltip-content top-right">
																				<div>
																					{$_('label.theShippingChargesFor')}
																				</div>
																				{#each items1 as item}
																					{#if item.items}
																						{#if item.items.length > 0}
																							{#each item.items as i}
																								<div class="b">
																									{i.model}
																									{i.color}
																									{i.capacity}
																									{$_('label.GB')}
																								</div>
																							{/each}
																						{/if}
																					{/if}
																				{/each}
																				<div class="mt1 pt1 bt b--gray">
																					{$_('label.from')}
																					<b>{order.shipping_info.address}</b>
																				</div>
																				<div>
																					{$_('label.to')}
																					<b
																						>{items1[0].shipping_rate_buyer
																							.sellerAddress +
																							', ' +
																							items1[0].shipping_rate_buyer
																								.sellerCity +
																							', ' +
																							items1[0].shipping_rate_buyer
																								.sellerState +
																							', ' +
																							items1[0].shipping_rate_buyer
																								.sellerPostalCode}</b
																					>
																				</div>
																			</div>
																		</div>
																		<div class="w-shippo">
																			<div class="b">
																				{items1[0].shipping_rate_buyer
																					.selectedRate.provider}
																				{$_('checkout.provider')}
																			</div>
																			<div class="fw6 dark-blue">
																				{convertCurrency(
																					items1[0].shipping_rate_buyer
																						.selectedRate.amount,
																					items1[0].shipping_rate_buyer
																						.selectedRate.currency,
																					$settings
																				)}
																				{$currency}
																			</div>
																			<div class="light-silver f6 duration">
																				{$_('checkout.estimatedDeliveryDate')}:
																				{items1[0].shipping_rate_buyer
																					.selectedRate.estimated_days}
																				{#if items1[0].shipping_rate_buyer.selectedRate.estimated_days == 1}
																					{$_('checkout.day')}
																				{:else}{$_('checkout.days')}{/if}
																			</div>
																		</div>
																	</div>
																{/if}
															{/if}
														</div>
														<!-- {#if items1[0].shipping_rate_buyer.selectedRatePaid != null}
															<p class="mv3 tr pr4">
																<a
																	class="btn-view f7 bg-blue white ph4 br2 pointer grow"
																	target="_blank"
																	href={items1[0].shipping_rate_buyer
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
																	href={items1[0].shipping_rate_buyer
																		.selectedRatePaid.tracking_url_provider}
																>
																	{items1[0].shipping_rate_buyer
																		.selectedRatePaid.tracking_number}
																</a>
															</p>
														{/if} -->
													</td>
												</tr>
											{/if}
										{/if}
									{/each}
								{/if}
							{/each}
						{/if}
					</tbody>
				</table>
				<div class="w-100 flex justify-end mt5">
					<div class="w-order bg-light-gray pa4 br3">
						<h3 class="mb5">{$_('checkout.purchaseSummary')}</h3>
						<div class="flex justify-between mb4 light-silver">
							<span class="">{$_('cart.subtotal')}</span>
							<span class="fw6">
								{displayCurrency(order.amount_info.totalPay, $currency)}
								<u>{$currency}</u>
							</span>
						</div>
						<div class="flex justify-between mb4 light-silver">
							<span class="">{$_('cart.commission')} <sup>ⓘ</sup></span>
							<span class="fw6">
								{displayCurrency(order.amount_info.totalDingtoiFee, $currency)}
								<u>{$currency}</u>
							</span>
						</div>
						<div class="flex justify-between mb4 light-silver">
							<span class="">{$_('checkout.feeShipping')}</span>
							<span class="fw6">
								{displayCurrency(order.amount_info.totalShip, $currency)}
								<u>{$currency}</u>
							</span>
						</div>
						<div class="flex justify-between mb4 light-silver">
							<span class="">
								{$_('checkout.feeShippingYourDevice')}
								<sup>ⓘ</sup>
							</span>
							<span class="fw6">
								{displayCurrency(
									order.amount_info.totalShipExchange,
									$currency
								)}
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
							<div class="b f3">
								<span class="">
									{#if order.amount_info.totalReceive > total}
										-{displayCurrency(
											order.amount_info.totalReceive - total,
											$currency
										)}
									{:else}
										{displayCurrency(
											total - order.amount_info.totalReceive,
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
									{displayCurrency(order.amount_info.totalReceive, $currency)}
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
									<b class="fw6">{$_('checkout.amountYouHavePaid')} </b>
								</div>
								<b class="red f3">
									{displayCurrency(total, $currency)}
									<u>{$currency}</u>
								</b>
							</div>
							<div class="f6 light-silver">
								{$_('checkout.amountYouHavePaidDesc')}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}

<style>
	.flex-1 {
		flex: 1;
	}
	.mr2em {
		margin-right: 2em;
	}
	.mb1em {
		margin-bottom: 1em;
	}
	.mb2em {
		margin-bottom: 2em;
	}

	.print {
		width: 40px;
		height: 40px;
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
	.table td {
		padding: 1em 0;
	}

	.bg-shipping {
		background: #e4e6ef;
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

	.row-header {
		border-top: 30px solid white;
	}
	.row-title {
		border-top: 10px solid white;
	}
</style>

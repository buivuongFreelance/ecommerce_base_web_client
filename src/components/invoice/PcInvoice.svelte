<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import { auth, currency, settings } from '../../stores';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import { detailOrder as apiDetailOrder } from '../../services/transaction';
	import { convertCurrency, displayCurrency } from '../../functions';
	import PcTagInvoice from './PcTagInvoice.svelte';
	import PcConfirmCartItem from '../checkout/PcConfirmCartItem.svelte';
	import config from '../../config';

	const { session, page } = stores();
	const { domainTransaction, domainModel } = $session;

	let isServerError = false;
	let isLoading = false;

	let invoice;
	let created_at;
	let total = 0;

	onMount(async () => {
		try {
			let id = $page.params.id;
			invoice = await getDetailOrder(id);
			if (invoice) {
				created_at = new Date(invoice.created_at);
				if (invoice.amount_info) {
					total =
						invoice.amount_info.totalPay +
						invoice.amount_info.totalDingtoiFee +
						invoice.amount_info.totalShip +
						invoice.amount_info.totalShipExchange;
				}
			}
		} catch (error) {}
	});
	const getDetailOrder = async (orderId) => {
		isLoading = true;
		return new Promise((resolve, reject) => {
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiDetailOrder(domainTransaction, { token, orderId })
				.then((obj) => {
					resolve(obj);
					isServerError = false;
					isLoading = false;
				})
				.catch((error) => {
					reject(error);
					isServerError = true;
					isLoading = false;
				});
		});
	};
</script>

<style>
	.date {
		width: 80px;
	}
	.bg-shipping {
		background: #e4e6ef;
	}
	.btn {
		min-width: 120px;
	}
</style>

<h1 class="tc mb6">{$_('label.invoice')}</h1>

{#if isServerError}
	<p class="red f4 tc mv6">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<ContentLoader width="1170" height="300" uniqueKey="invoice_detail">
		<rect x="0" y="0" rx="5" ry="5" width="1170" height="300" />
	</ContentLoader>
{:else if !invoice}
	<p class="f4 mb3">{$_('label.thereIsNoInvoice')}</p>
{:else}
	<div class="flex items-end mb6">
		<div class="w-65 ">
			<div class="flex">
				<div class="date near-black w80 tc br b--light-gray pr4">
					{#if created_at}
						<div class="b f4">
							{created_at.toLocaleString('default', { month: 'short' })}
						</div>
						<div class="b f2">{created_at.getDate()}</div>
						<div>{created_at.getFullYear()}</div>
					{/if}
				</div>
				<div class="flex-auto ml4">
					<h3 class="mb4">{$_('label.orderNumber')}: {invoice.order_number}</h3>
					<div class="b mb3">
						<span class="mr3">{$_('label.orderStatus')}</span>
						<span class="">
							<PcTagInvoice status={invoice.status} />
						</span>
					</div>
					{#if invoice.transactions}
						<div class="mb3">
							{invoice.transactions.length}
							{$_('cart.items')}
						</div>
					{/if}
					<h5 class="pb3 mb3 bb b--light-gray">{$_('checkout.shippingAdd')}</h5>
					{#if invoice.shipping_info}
						<div class="mb3">
							{invoice.shipping_info.first_name}
							-
							{invoice.shipping_info.address}
						</div>
						<address class="mb4">
							<div>
								{invoice.shipping_info.first_name}
								{invoice.shipping_info.last_name}
							</div>
							<div>{invoice.shipping_info.address}</div>
							<div>
								{invoice.shipping_info.province},
								{invoice.shipping_info.city},
								{invoice.shipping_info.postal_code},
								{invoice.shipping_info.country}
							</div>
							<div>{invoice.shipping_info.phone}</div>
						</address>
					{/if}
					<h5 class="pb3 mb3 bb b--light-gray">{$_('checkout.billingAdd')}</h5>
					{#if invoice.billing_info}
						<div class="mb3">
							{invoice.billing_info.first_name}
							-
							{invoice.billing_info.address}
						</div>
						<address class="mb4">
							<div>
								{invoice.billing_info.first_name}
								{invoice.billing_info.last_name}
							</div>
							<div>{invoice.billing_info.address}</div>
							<div>
								{invoice.billing_info.province},
								{invoice.billing_info.city},
								{invoice.billing_info.postal_code},
								{invoice.billing_info.country}
							</div>
							<div>{invoice.billing_info.phone}</div>
						</address>
					{/if}
				</div>
			</div>
		</div>
		<div class="w-35 ml5 bg-blue-10 br1 pa5">
			<h4 class="pb3 mb4 bb b--light-blue light-blue">
				{$_('label.orderSummary')}
			</h4>
			<div class="flex mb4">
				<div class="flex-auto light-blue">{$_('checkout.productSub')}</div>
				<div class="b">
					{displayCurrency(invoice.amount_info.totalPay, $currency)}
					{$currency}
				</div>
			</div>
			<div class="flex mb4">
				<div class="flex-auto light-blue">{$_('cart.commission')}</div>
				<div class="b">
					{displayCurrency(invoice.amount_info.totalDingtoiFee, $currency)}
					{$currency}
				</div>
			</div>
			<div class="flex mb4">
				<div class="flex-auto light-blue">{$_('checkout.feeShipping')}</div>
				<div class="b">
					{displayCurrency(invoice.amount_info.totalShip, $currency)}
					{$currency}
				</div>
			</div>
			<div class="flex mb4">
				<div class="flex-auto light-blue">
					{$_('checkout.feeShippingYourDevice')}
				</div>
				<div class="b">
					{displayCurrency(invoice.amount_info.totalShipExchange, $currency)}
					{$currency}
				</div>
			</div>
			<div class="flex mb4">
				<div class="flex-auto light-blue">{$_('checkout.estimatedTaxes')}</div>
				<div class="b">0 {$currency}</div>
			</div>
			<div class="flex items-center">
				<div class="flex-auto fw6 light-blue">
					{$_('checkout.estimatedTotal')}
				</div>
				<div class="b">
					<span class="f3">{displayCurrency(total, $currency)}</span>
					{$currency}
				</div>
			</div>
			{#if invoice.amount_info.totalReceive > 0}
				<div class="fw6 dark-blue mt4">
					{$_('checkout.amountYouReceive')}:
					{displayCurrency(invoice.amount_info.totalReceive, $currency)}
					{$currency}
				</div>
			{/if}
		</div>
	</div>

	<div class="content">
		<div class="items">
			{#if invoice.invoice_info}
				{#each Object.entries(invoice.invoice_info) as [key, items]}
					{#if items}
						{#if items.length > 0}
							<div class="mb4">
								<div
									class="h-60-px flex items-center justify-between bg-shipping ph4">
									<span class="b dark-blue">{items[0].address}</span>
								</div>
								{#each items as item}
									<PcConfirmCartItem {item} />
								{/each}
								{#if items.length > 0}
									<div class="flex pv4 bg-light-gray justify-end">
										{#if items[0].selectedRate}
											<div class="w-40 mr5">
												<div class="fw6">{$_('message.shipFeeFor')}:</div>
												{#each items as i}
													{#if i.proposal_type !== config.exchange}
														<div class="fw6 f7 light-silver">
															{i.model}
															{i.color}
															{i.capacity}
															{$_('label.GB')}
														</div>
													{/if}
												{/each}
												<div class="w-shippo">
													<div class="b">
														{items[0].selectedRate.provider}
														{$_('checkout.provider')}
													</div>
													<div class="fw6 dark-blue">
														{convertCurrency(items[0].selectedRate.amount, items[0].selectedRate.currency, $settings)}
														{$currency}
													</div>

													<div class="light-silver f6 duration">
														{$_('checkout.estimatedDeliveryDate')}:
														{items[0].selectedRate.estimated_days}
														{#if items[0].selectedRate.estimated_days == 1}
															{$_('checkout.day')}
														{:else}{$_('checkout.days')}{/if}
													</div>
												</div>
											</div>
										{/if}
										{#if items[0].selectedRateExchange}
											<div class="w-40">
												<div class="fw6">
													{$_('message.shipFeeForYourDevice')}:
												</div>
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
														{convertCurrency(items[0].selectedRateExchange.amount, items[0].selectedRateExchange.currency, $settings)}
														{$currency}
													</div>
													<div class="light-silver f6 duration">
														{$_('checkout.estimatedDeliveryDate')}:
														{items[0].selectedRateExchange.estimated_days}
														{$_('checkout.day')}
													</div>
												</div>
											</div>
										{/if}
									</div>
								{/if}
							</div>
						{/if}
					{/if}
				{/each}
			{/if}
		</div>
	</div>

	<div class="flex justify-end pt4">
		<button
			type="button"
			class="btn h-50-px bg-dark-blue white bn pointer grow br1 fw6 ttu"
			on:click={() => goto('my-purchases')}>
			{$_('message.complete')}
		</button>
	</div>
{/if}

<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import { auth, currency } from '../../stores';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import { detailOrder as apiDetailOrder } from '../../services/transaction';
	import { getCountry as apiGetCountry } from '../../services/model';
	import {
		displayCurrency,
		displayCurrencyNoReverse,
		displayProposalBuyerStrCart,
		displayCurrencyReverse,
	} from '../../functions';
	import PcTagInvoice from './PcTagInvoice.svelte';

	const { session, page } = stores();
	const { domainTransaction, domainModel } = $session;

	let isServerError = false;
	let isLoading = false;

	let invoice;
	let shipping_country;
	let billing_country;
	let created_at;

	onMount(async () => {
		try {
			let id = $page.params.id;
			invoice = await getDetailOrder(id);
			if (invoice) {
				created_at = new Date(invoice.created_at);
				if (invoice.shipping_info) {
					shipping_country = await getCountry(invoice.shipping_info.country);
				}
				if (invoice.billing_info) {
					billing_country = await getCountry(invoice.billing_info.country);
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
	const getCountry = (id) => {
		return new Promise((resolve, reject) => {
			apiGetCountry(domainModel, { id })
				.then((obj) => {
					resolve(obj);
				})
				.catch((error) => {
					reject(error);
				});
		});
	};
</script>

<style>
	.date {
		width: 80px;
	}
	.picture {
		width: 60px;
		height: 80px;
	}
	.picture img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.img-exchange {
		display: block;
		width: 40px;
		height: 60px;
	}
	summary:focus {
		outline: none;
	}
	.btn {
		min-width: 120px;
	}
</style>

<h2 class="tc mb5">{$_('label.invoice')}</h2>

{#if isServerError}
	<p class="red f4 tc mv6">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<ContentLoader width="1170" height="300" uniqueKey="invoice_detail">
		<rect x="0" y="0" rx="5" ry="5" width="1170" height="300" />
	</ContentLoader>
{:else if !invoice}
	<p class="f4 mb3">{$_('label.thereIsNoInvoice')}</p>
{:else}
	<div class="flex mb5 items-start br1">
		<div class="w-70 pr5">
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
					<h4 class="mb4">{$_('label.orderNumber')}: {invoice.order_number}</h4>
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
								{#if shipping_country}{shipping_country.name}{/if}
							</div>
							<div>{invoice.shipping_info.phone}</div>
							<div>{invoice.shipping_info.optional}</div>
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
								{#if billing_country}{billing_country.name}{/if}
							</div>
							<div>{invoice.billing_info.phone}</div>
							<div>{invoice.billing_info.optional}</div>
						</address>
					{/if}
				</div>
			</div>
		</div>
		<div class="w-30 bg-blue-10 pa4">
			<h4 class="pb3 mb4 bb b--light-blue light-blue">
				{$_('label.orderSummary')}
			</h4>
			<div class="mb4">
				<div class="flex-auto light-blue">{$_('label.productTotal')}</div>
				<div class="b tr">{invoice.total_money} {$currency}</div>
			</div>
			<div class="">
				<div class="flex-auto fw6 light-blue">{$_('label.orderTotal')}</div>
				<div class="b tr">
					<span
						class="f3">{displayCurrency(invoice.total_money, $currency)}</span>
					{$currency}
				</div>
			</div>
		</div>
	</div>

	<details open>
		<summary
			class="ph4 b bg-light-gray h-50-px flex items-center br2 br--top pointer">
			{$_('label.itemDetails')}
		</summary>
		<div class="content">
			<div class="items">
				{#each invoice.transactions as transaction}
					<div class="item flex pv5 bb b--light-gray">
						<div class="item-info w-70 pr5">
							<div class="flex">
								<picture class="picture db br1 pa1 ba b--light-gray">
									<img
										src={transaction.url}
										alt={transaction.model}
										class="db br1" />
								</picture>
								<div class="ml4">
									<h5 class="">
										{transaction.model}
										-
										{transaction.capacity}
										{$_('label.GB')}
										-
										{transaction.color}
									</h5>
									<div class="mb3"><small>{transaction.brand_name}</small></div>
									{#if transaction.items}
										<div
											class="mv3 fw6"
											class:red={transaction.money < 0}
											class:dark-blue={transaction.money > 0}>
											{$_(displayProposalBuyerStrCart(transaction.money))}
											:
											{displayCurrencyNoReverse(transaction.money, $currency)}
											{$currency}
										</div>
										<div class="flex">
											<h5 class="fw6 gray mr4">{$_('cart.and')}</h5>
											{#if transaction.items.length > 0}
												{#each transaction.items as item}
													<div class="flex">
														<img
															src={item.url}
															alt={item.model}
															class="img-exchange mr3 br1" />
														<div>
															<h5>
																{item.model}
																-
																{item.capacity}
																{$_('label.GB')}
																-
																{item.color}
															</h5>
															<small>{item.brand_name}</small>
														</div>
													</div>
												{/each}
											{/if}
										</div>
									{/if}
								</div>
							</div>
						</div>
						<div class="item-total w-30">
							<h4 class="pb3 mb4 bb b--light-gray">{$_('label.itemTotal')}</h4>
							{#if transaction.items}
								<div class="flex mb4">
									<div class="flex-auto">{$_('cart.price')}</div>
									<div class="tr b">
										<big>
											{displayCurrencyReverse(transaction.money, $currency)}
										</big>
										{$currency}
									</div>
								</div>
							{:else}
								<div class="flex mb4">
									<div class="flex-auto">{$_('device.askingPrice')}</div>
									<div class="tr b">
										<big>
											{displayCurrency(Math.abs(transaction.money), $currency)}
										</big>
										{$currency}
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</details>

	<div class="flex justify-end pv5">
		<button
			type="button"
			class="btn h-50-px bg-dark-blue white bn pointer grow br1 fw6 ttu"
			on:click={() => goto('my-purchases')}>
			{$_('message.complete')}
		</button>
	</div>
{/if}

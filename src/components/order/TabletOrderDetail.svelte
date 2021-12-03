<script>
	import { _ } from 'svelte-i18n';

	import { stores } from '@sapper/app';
	import { auth, currency } from '../../stores';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import {
		detailOrder as apiDetailOrder,
		listOrder,
	} from '../../services/transaction';
	import config from '../../config';
	import { displayCurrencyReverseCart, displayDateTime } from '../../functions';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import PcModalScanTransaction from '../modal/PcModalScanTransaction.svelte';
	import { getCountry as apiGetCountry } from '../../services/model';
	import PcTagOrder from './PcTagOrder.svelte';
	import PcTagInvoice from '../invoice/PcTagInvoice.svelte';

	const { session, page } = stores();
	const { domainTransaction, domainModel } = $session;

	let isLoading = false;
	let list = [];
	let isServerError = false;
	let order = '';
	let shipping_country = null;
	let billing_country = null;
	let isOpenModal = false;
	let selectedItem = null;
	export let purchaseCode;

	$: {
		if (isOpenModal) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	}
	onMount(async () => {
		await detailOrder();
		if (order && order.shipping_info) {
			shipping_country = await getCountry(order.shipping_info.country);
		}
		if (order && order.billing_info) {
			billing_country = await getCountry(order.billing_info.country);
		}
	});
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
	const detailOrder = () => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiDetailOrder(domainTransaction, {
				token,
				orderId: $page.params.id,
			})
				.then((items) => {
					isLoading = false;
					if (items.transactions) list = items.transactions;
					order = items;
					purchaseCode = items.order_number;

					isServerError = false;
					resolve();
				})
				.catch(() => {
					isLoading = false;
					isServerError = true;
					reject();
				});
		});
	};
	const onClose = () => {
		isOpenModal = false;
	};
	const openModalScanTransaction = (item) => {
		isOpenModal = true;
		selectedItem = item;
	};
</script>

<style>
	table {
		border-collapse: collapse;
	}
	th,
	td {
		padding: 10px;
		padding-left: 0;
	}
	.pl4-i {
		padding-left: 20px !important;
	}

	.date {
		width: 80px;
	}
	.picture {
		width: 40px;
		height: 60px;
	}
	.picture img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>

{#if isOpenModal}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal type="modal" onClick={() => (isOpenModal = false)} />
		<PcModalScanTransaction {onClose} item={selectedItem} />
	</Portal>
{/if}

{#if isServerError}
	<div class="mw10 center pt5">
		<p class="red f4">{$_('error.serverErrorMessage')}</p>
	</div>
{:else}
	<h3 class="mb4 ttc">{$_('order.orderDetail')}</h3>

	<main>
		<table class="w-100">
			{#if isLoading}
				<ContentLoader
					uniqueKey="filterOrder"
					primaryColor="#e4e6ef"
					secondaryColor="#f8f8f8"
					width={config.containerDesktop - 30}
					height="40">
					<rect x="0" y="0" rx="3" ry="3" width="100%" height="40" />
				</ContentLoader>
			{:else}
				<thead class="tl">
					<tr>
						<th>{$_('order.transCode')}</th>
						<th>{$_('image.image')}</th>
						<th>{$_('device.deviceName')}</th>
						<th>{$_('message.createdDate')}</th>
						<th>{$_('cart.price')}</th>
						<th>{$_('device.status')}</th>
					</tr>
				</thead>
			{/if}
			<tbody>
				{#if isLoading}
					<ContentLoader
						uniqueKey="cartPage"
						primaryColor="#e4e6ef"
						secondaryColor="#f8f8f8"
						width={config.containerDesktop - 30}
						height="100">
						<rect x="0" y="0" rx="3" ry="3" width="800" height="20" />
						<rect
							x="0"
							y="40"
							rx="3"
							ry="3"
							width={config.containerDesktop - 30}
							height="20" />
						<rect
							x="0"
							y="40"
							rx="3"
							ry="3"
							width={config.containerDesktop - 30}
							height="20" />
						<rect x="0" y="80" rx="3" ry="3" width="800" height="20" />
					</ContentLoader>
				{:else if list.length > 0 && order}
					{#each list as item}
						<tr class="bb b--light-gray">
							<td>
								<span class="fw6 light-blue">{item.transaction_code}</span>
							</td>
							<td>
								<picture class="picture db br2 pa1 ba b--light-gray">
									<img src={item.url} alt={item.model} />
								</picture>
							</td>
							<td>{item.model}</td>
							<td>{displayDateTime(item.created_at)}</td>
							<td>
								{displayCurrencyReverseCart(item.money, $currency)}
								{$currency}
							</td>
							<td>
								<PcTagOrder status={item.status} />
								<!-- <span class="h-20-px ph3 ba b--light-gray f7 ">
									{#if item.status === config.device.inTransaction}
										{$_('message.inTransaction')}
									{:else if item.status === config.device.created}
										{$_('message.created')}
									{:else if item.status == config.order.ownerScanned}
										{$_('message.ownerScanned')}
									{:else if item.status === config.order.buyerRejected}
										{$_('message.buyerRejected')}
									{:else if item.status === config.proposal.buyerAccept}
										{$_('cart.accepted')}
									{/if}
								</span> -->
							</td>
						</tr>
						{#if item.items}
							{#each item.items as i}
								<tr class="bb b--light-gray">
									<td class="pl4-i">
										<span class="fw6 light-blue">{i.transaction_code}</span>
									</td>
									<td>
										<picture class="picture db br2 pa1 ba b--light-blue">
											<img src={i.url ? i.url : i.model_url} alt={i.model} />
										</picture>
									</td>
									<td>{i.model}</td>
									<td>{displayDateTime(i.created_at)}</td>
									<td>
										<!-- {displayCurrency(i.money, $currency)} {$currency} -->
									</td>
									<td>
										<PcTagOrder status={i.status} />

										<!-- <span class="h-20-px ph3 ba b--light-gray f7">
											{#if i.status === config.device.inTransaction}
												{$_('message.inTransaction')}
											{:else if i.status == config.device.created}
												{$_('message.created')}
											{:else if i.status == config.order.ownerScanned}
												{$_('message.ownerScanned')}
											{:else if i.status === config.order.buyerRejected}
												{$_('message.buyerRejected')}
											{:else if i.status === config.proposal.buyerAccept}
												{$_('cart.accepted')}
											{/if}
										</span> -->
									</td>
									<td class="tr" />
								</tr>
							{/each}
						{/if}
					{/each}
				{:else}
					<div class="pb6 mt4 f4">{$_('message.noItems')}</div>
				{/if}
			</tbody>
		</table>
	</main>
	<div class="flex items-start mt6">
		{#if order}
			<div class="w-60 pr5">
				<div class="flex">
					<div class="date near-black w80 tc br b--light-gray pr4">
						<div class="fw6 f4">
							<!-- {new Date(order.created_at).getMonth() + 1} -->
							{#if order.created_at}
								{new Date(order.created_at).toLocaleString('default', {
									month: 'short',
								})}
							{/if}
						</div>
						<div class="b f2">{new Date(order.created_at).getDate()}</div>
						<div>{new Date(order.created_at).getFullYear()}</div>
					</div>
					<div class="flex-auto ml4">
						<div class="mb4">
							<div class="fw6">{$_('label.orderNumber')}:</div>
							<h4>{order.order_number}</h4>
						</div>
						<div class="b mb3">
							<span class="">{$_('label.orderStatus')}:</span>
							<PcTagInvoice status={order.status} />
							<!-- <span class="">
								{#if order.status === config.device.inTransaction}
									{$_('message.inTransaction')}
								{:else if order.status === config.device.created}
									{$_('message.created')}
								{:else if order.status == config.order.ownerScanned}
									{$_('message.ownerScanned')}
								{:else if order.status === config.order.buyerRejected}
									{$_('message.buyerRejected')}
								{:else if order.status === config.proposal.buyerAccept}
									{$_('cart.accepted')}
								{:else if order.status === config.order.pending}
									{$_('message.pending')}
								{/if}
							</span> -->
						</div>
						{#if order.transactions}
							<div class="mb3">
								{order.transactions.length}
								{$_('cart.items')}
							</div>
						{/if}
						<h5 class="pb3 mb3 bb b--light-gray">
							{$_('checkout.shippingAdd')}
						</h5>
						{#if order.shipping_info}
							<div class="mb3">
								{order.shipping_info.first_name}
								-
								{order.shipping_info.address}
							</div>
							<address class="mb4">
								<div>
									{order.shipping_info.first_name}
									{order.shipping_info.last_name}
								</div>
								<div>{order.shipping_info.address}</div>
								<div>
									{order.shipping_info.province},
									{order.shipping_info.city},
									{order.shipping_info.postal_code},
									{#if shipping_country}{shipping_country.name}{/if}
								</div>
								<div>{order.shipping_info.phone}</div>
								<div>{order.shipping_info.optional}</div>
							</address>
						{/if}
						<h5 class="pb3 mb3 bb b--light-gray">
							{$_('checkout.billingAdd')}
						</h5>
						{#if order.billing_info}
							<div class="mb3">
								{order.billing_info.first_name}
								-
								{order.billing_info.address}
							</div>
							<address class="mb4">
								<div>
									{order.billing_info.first_name}
									{order.billing_info.last_name}
								</div>
								<div>{order.billing_info.address}</div>
								<div>
									{order.billing_info.province},
									{order.billing_info.city},
									{order.billing_info.postal_code},
									{#if billing_country}{billing_country.name}{/if}
								</div>
								<div>{order.billing_info.phone}</div>
								<div>{order.billing_info.optional}</div>
							</address>
						{/if}
					</div>
				</div>
			</div>
			<div class="w-40 bg-blue-10 pa4">
				<h4 class="pb3 mb4 bb b--light-blue light-blue">
					{$_('label.orderSummary')}
				</h4>
				<div class="flex mb4">
					<div class="flex-auto light-blue">{$_('label.productTotal')}</div>
					<div>{order.total_money} {$currency}</div>
				</div>
				<div class="flex mb4">
					<div class="flex-auto light-blue">{$_('label.shipping')}</div>
					<div>0.00 {$currency}</div>
				</div>
				<div class="flex">
					<div class="flex-auto fw6 light-blue">{$_('label.orderTotal')}</div>
					<div class="b">
						<span class="f3">{order.total_money}</span>
						{$currency}
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}

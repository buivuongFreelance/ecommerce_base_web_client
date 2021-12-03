<script>
	import { _ } from 'svelte-i18n';

	import { stores, goto } from '@sapper/app';
	import { auth, currency, notifyTransactionChanged } from '../../stores';
	import { onDestroy, onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import PcPagination from '../form/PcPagination.svelte';
	import { listOrder as apiListOrder } from '../../services/transaction';
	import config from '../../config';
	import { displayCurrency, displayDateTime } from '../../functions';
	import PcTagOrder from './PcTagOrder.svelte';
	import PcButtonSearch from '../button/PcButtonSearch.svelte';
	import PcButtonClearFilter from '../button/PcButtonClearFilter.svelte';
	import PcButtonViewDetail from '../button/PcButtonViewDetail.svelte';
	import PcNoData from '../error/PcNoData.svelte';

	const { session } = stores();
	const { domainTransaction } = $session;

	let isServerError = false;
	let isLoading = false;
	let offset = 0;
	let list = [];
	let countList = 0;

	let filter = {
		purchaseNumber: '',
		status: '',
	};
	let sort = { purchaseNumber: '', price: '', status: '', createdAt: '' };
	let mounted = false;

	const unsubscribeNotifyTransactionChanged = notifyTransactionChanged.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					listOrder();
				}
			}
		}
	);
	onMount(async () => {
		mounted = true;
		await listOrder();
	});
	onDestroy(() => {
		unsubscribeNotifyTransactionChanged();
	});
	const listOrder = () => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiListOrder(domainTransaction, {
				token,
				limit: config.limit,
				sort,
				offset,
				filter,
			})
				.then((items) => {
					isLoading = false;
					list = items.list;
					countList = items.count;
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
	const totalPrice = (item) => {
		let total =
			item.amount_info.totalPay +
			item.amount_info.totalDingtoiFee +
			item.amount_info.totalShip +
			item.amount_info.totalShipExchange -
			item.amount_info.totalReceive;
		if (total > 0) {
			return displayCurrency(total, $currency);
		} else {
			return (
				$_('cart.exchangeReceive') + ' ' + displayCurrency(total, $currency)
			);
		}
	};

	const handlePage = async (page) => {
		offset = config.limit * (page - 1);

		await listOrder();
	};
	const handleFilter = async () => {
		offset = 0;
		await listOrder();
	};
	const handleClearFilter = async () => {
		filter = {
			purchaseNumber: '',
			status: '',
		};
		offset = 0;
		await listOrder();
	};
	const handleSort = async (e) => {
		offset = 0;
		sort.price = '';
		sort.status = '';
		sort.createdAt = '';
		sort.purchaseNumber = e.target.checked ? e.target.value : 'asc';
		await listOrder();
	};
	const handleSortPrice = async (e) => {
		offset = 0;
		sort.createdAt = '';
		sort.purchaseNumber = '';
		sort.status = '';
		sort.price = e.target.checked ? e.target.value : 'asc';
		await listOrder();
	};
	const handleSortStatus = async (e) => {
		offset = 0;
		sort.createdAt = '';
		sort.purchaseNumber = '';
		sort.price = '';
		sort.status = e.target.checked ? e.target.value : 'asc';
		await listOrder();
	};
	const handleSortDate = async (e) => {
		offset = 0;
		sort.status = '';
		sort.purchaseNumber = '';
		sort.price = '';
		sort.createdAt = e.target.checked ? e.target.value : 'asc';
		await listOrder();
	};
	const displayStatus = (item) => {
		if (item.status == config.order.shipped) {
			return config.order.shipped;
		} else if (item.status == config.order.completed) {
			return config.order.completed;
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
</script>

{#if isServerError}
	<div class="mw10 center pt5">
		<p class="red f4">{$_('error.serverErrorMessage')}</p>
	</div>
{:else}
	<h3 class="page__title tc ttc">{$_('order.myOrder')}</h3>
	<form
		class="ph1rem"
		autocomplete="off"
		on:submit|preventDefault={handleFilter}
	>
		<div class="">
			<div class="relative">
				<input
					id="name"
					autocomplete="off"
					class="input-reset ba b--light-gray br2 pl5 w-100 h-40-px fw6"
					type="text"
					bind:value={filter.purchaseNumber}
					placeholder={$_('label.orderNumber')}
					on:input={(e) => {
						if (e.target.value == '') {
							handleClearFilter();
						}
					}}
				/>
				<i class="absolute left-0 pl1 top-0 bottom-0 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="#9fb0c9"
						width="24px"
						height="24px"
					>
						<path d="M0 0h24v24H0V0z" fill="none" />
						<path
							d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
						/>
					</svg>
				</i>
			</div>
		</div>
		<!-- svelte-ignore a11y-no-onchange -->
		<select
			class="bg-white b--light-gray br2 ba fw6 ph1rem w-100 h-40-px ttc mt3"
			value={filter.status}
			on:change={(event) => (filter.status = event.target.value)}
		>
			<option value="">{$_('device.allSta')}</option>
			<option value={config.order.processing}>
				{$_('message.processing')}
			</option>
			<option value={config.order.created}>{$_('message.created')}</option>
			<option value={config.order.completed}>{$_('message.completed')}</option>
		</select>
		<div class="mt3">
			<PcButtonSearch bg="bg-blue" className="" />
			<PcButtonClearFilter className="ml3" onClickButton={handleClearFilter} />
		</div>
	</form>
	<main class="mt1rem">
		{#if isLoading}
			<div class="pa1rem">
				<ContentLoader
					uniqueKey="filterOrder"
					primaryColor="#e4e6ef"
					secondaryColor="#f8f8f8"
					width="345"
					height="150"
				>
					<rect x="0" y="0" rx="3" ry="3" width="150" height="20" />
					<rect x="160" y="0" rx="3" ry="3" width="195" height="20" />
					<rect x="0" y="30" rx="3" ry="3" width="100" height="20" />
					<rect x="110" y="30" rx="3" ry="3" width="100" height="20" />
					<rect x="0" y="60" rx="3" ry="3" width="120" height="20" />
					<rect x="130" y="60" rx="3" ry="3" width="170" height="20" />
					<rect x="0" y="60" rx="3" ry="3" width="90" height="20" />
					<rect x="100" y="60" rx="3" ry="3" width="170" height="20" />
					<rect x="0" y="90" rx="3" ry="3" width="100" height="40" />
				</ContentLoader>
			</div>
		{:else if list.length > 0}
			<div class="mh1rem ">
				{#each list as item}
					<div class="mb1rem br2 ba b--light-gray pa1rem">
						<div class="flex mb3">
							<div class="order-number flex-1">
								#
								<span class="fw6 light-blue">{item.order_number}</span>
							</div>
							<div class="order-status">
								<PcTagOrder status={displayStatus(item)} />
								<!-- {#if item.status === config.device.inTransaction}
									<PcTagOrder status={$_('message.inTransaction')} />
								{:else if item.status === config.device.created}
									<PcTagOrder status={$_('message.created')} />
								{:else if item.status == config.order.ownerScanned}
									<PcTagOrder status={$_('message.ownerScanned')} />
								{:else if item.status === config.order.buyerRejected}
									<PcTagOrder status={$_('message.buyerRejected')} />
								{:else if item.status === config.proposal.buyerAccept}
									<PcTagOrder status={$_('message.accepted')} />
								{:else if item.status === config.order.pending}
									<PcTagOrder status={$_('message.pending')} />
								{/if} -->
							</div>
						</div>
						<table class="w-100 mb3">
							<tr>
								<td class="i light-silver nowrap tr pr3 pb3">
									{$_('message.createdDate')}:
								</td>
								<td class="pb3">{displayDateTime(item.created_at)}</td>
							</tr>
							<tr>
								<td class="i light-silver nowrap tr pr3 pb3">
									{$_('order.attention')}:
								</td>
								<td class="pb3">
									{#if item.countTransactionsExchangeIsNotPaid > 0}
										<div class="red">
											{$_('message.sellerNotPaidYet')}
										</div>
									{:else if item.countTransactionsYouMustScan > 0}
										<div class="flash animated infinite duration-5s red">
											{$_('message.countDeviceWaitingScan', {
												values: {
													count: item.countTransactionsYouMustScan,
												},
											})}
										</div>
									{:else if item.countTransactionsRejected > 0}
										<div class="flash animated infinite duration-5s red">
											{#if item.countTransactionsRejected == 1}
												{$_('message.countOneDeviceReject', {
													values: {
														count: item.countTransactionsRejected,
													},
												})}
											{:else if item.countTransactionsRejected > 1}
												{$_('message.countDeviceReject', {
													values: {
														count: item.countTransactionsRejected,
													},
												})}
											{/if}
										</div>
									{:else if item.countTransactionsYouMustWait > 0}
										<div class="yellow">
											{$_('message.countDeviceWaitingOwnerScan', {
												values: {
													count: item.countTransactionsYouMustWait,
												},
											})}
										</div>
									{/if}
								</td>
							</tr>
						</table>
						<div class="">
							<PcButtonViewDetail
								onClickButton={() => goto('my-purchases/' + item.id)}
							/>
						</div>
					</div>
				{/each}
			</div>
			<div class="flex justify-end pa1rem">
				<PcPagination totalItems={countList} {offset} onPage={handlePage} />
			</div>
		{:else if list.length === 0}
			<PcNoData />
		{/if}
	</main>
{/if}

<style>
	.flex-1 {
		flex: 1;
	}

	.nowrap {
		white-space: nowrap;
	}
	table td {
		vertical-align: top;
	}
</style>

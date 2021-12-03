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

	const { session } = stores();
	const { domainTransaction } = $session;

	let isLoading = false;
	let offset = 0;
	let list = [];
	let countList = 0;
	let isServerError = false;
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
			return config.order.confirm;
		} else if (item.status == config.order.buyerRejected) {
			return config.order.inDispute;
		} else if (item.status == config.transaction.systemCancelled) {
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
</script>

{#if isServerError}
	<div class="mw10 center pt5">
		<p class="red f4">{$_('error.serverErrorMessage')}</p>
	</div>
{:else}
	<h2 class="mb4 ttc">{$_('order.myOrder')}</h2>
	<form
		class="flex mb5"
		autocomplete="off"
		on:submit|preventDefault={handleFilter}
	>
		<div class="mr3">
			<div class="relative">
				<input
					id="name"
					autocomplete="off"
					class="input-reset ba b--light-gray br2 pl5 h-40-px w-filter fw6"
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
			class="bg-white b--light-gray br2 ba fw6 ph3 h-40-px ttc
						w-status-select mr3"
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
		<PcButtonSearch bg="bg-blue" className="ml3" />
		<PcButtonClearFilter className="ml3" onClickButton={handleClearFilter} />
	</form>
	<main>
		<div class="ba b--light-gray br3 pv4">
			<table class="w-100">
				{#if isLoading}
					<ContentLoader
						uniqueKey="filterOrder"
						primaryColor="#e4e6ef"
						secondaryColor="#f8f8f8"
						width={config.containerDesktop - 30}
						height="40"
					>
						<rect x="0" y="0" rx="3" ry="3" width="100%" height="40" />
					</ContentLoader>
				{:else}
					<thead class="tl">
						<tr class="bb b--light-gray">
							<th>
								<label class="checkbox-button pointer">
									<input
										type="checkbox"
										value="desc"
										checked={sort.purchaseNumber == 'desc' ? true : false}
										on:change={(e) => handleSort(e)}
									/>
									<span class="mr3"> {$_('label.orderNumber')}</span>
									<span class="icon flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="#9eabb4"
											width="18px"
											height="18px"
											><path d="M0 0h24v24H0V0z" fill="none" />
											<path
												d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
											/></svg
										>
									</span>
								</label>
							</th>
							<th>
								<label class="checkbox-button pointer">
									<input
										type="checkbox"
										value="desc"
										checked={sort.createdAt == 'desc' ? true : false}
										on:change={(e) => handleSortDate(e)}
									/>
									<span class="mr3">{$_('message.createdDate')}</span>
									<span class="icon flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="#9eabb4"
											width="18px"
											height="18px"
											><path d="M0 0h24v24H0V0z" fill="none" />
											<path
												d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
											/></svg
										>
									</span>
								</label>
							</th>
							<!-- <th>{$_('checkout.totalAmountReceive')}</th> -->
							<!-- <th>
								<label class="checkbox-button pointer">
									<input
										type="checkbox"
										value="desc"
										checked={sort.price == 'desc' ? true : false}
										on:change={(e) => handleSortPrice(e)}
									/>
									<span class="mr3">{$_('cart.total')}</span>
									<span class="icon flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="#9eabb4"
											width="18px"
											height="18px"
											><path d="M0 0h24v24H0V0z" fill="none" />
											<path
												d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
											/></svg
										>
									</span>
								</label>
							</th> -->
							<th>
								<label class="checkbox-button pointer">
									<input
										type="checkbox"
										value="desc"
										checked={sort.status == 'desc' ? true : false}
										on:change={(e) => handleSortStatus(e)}
									/>
									<span class="mr3">{$_('device.status')}</span>
									<span class="icon flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="#9eabb4"
											width="18px"
											height="18px"
											><path d="M0 0h24v24H0V0z" fill="none" />
											<path
												d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
											/></svg
										>
									</span>
								</label>
							</th>
							<th class="">{$_('order.attention')}</th>
							<th width="1" class="tr">{$_('device.availableActions')}</th>
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
					{:else if list.length > 0}
						{#each list as item}
							<tr class="bb b--light-gray">
								<td>
									<span
										class="fw6 light-blue pointer"
										on:click={goto('my-purchases/' + item.id)}
										>{item.order_number}</span
									>
								</td>
								<td>{displayDateTime(item.created_at)}</td>
								<!-- <td>
								{displayCurrency(item.amount_info.totalReceive, $currency)}
								{$currency}
							</td> -->
								<!-- <td>{totalPrice(item)} {$currency}</td> -->
								<td>
									<PcTagOrder status={displayStatus(item)} />
								</td>
								<td>
									{#if item.status == config.transaction.systemCancelled}
										<div class="red">
											{$_('message.sellerHasBeenCancelled')}
										</div>
									{:else if item.countTransactionsExchangeIsNotPaid > 0}
										<div class="red">
											{$_('message.sellerNotPaidYet')}
										</div>
									{:else if item.countTransactionsYouMustScan > 0}
										<div class="red">
											{$_('message.countDeviceWaitingScan', {
												values: {
													count: item.countTransactionsYouMustScan,
												},
											})}
										</div>
									{:else if item.countTransactionsRejected > 0}
										<div class="red">
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
									{:else if item.countTransactionsShipping > 0}
										<div class="yellow">
											{$_('message.countDeviceWaitingShip', {
												values: {
													count: item.countTransactionsShipping,
												},
											})}
										</div>
									{/if}
								</td>
								<td>
									<PcButtonViewDetail
										onClickButton={() => goto('my-purchases/' + item.id)}
									/>
								</td>
							</tr>
						{/each}
					{:else}
						<div class="pb6 mt4 f4 pl4">{$_('message.noItems')}</div>
					{/if}
				</tbody>
			</table>
			{#if list.length > 0}
				<div class="flex justify-end mt5 pr4">
					<PcPagination totalItems={countList} {offset} onPage={handlePage} />
				</div>
			{/if}
		</div>
	</main>
{/if}

<style>
	table {
		border-collapse: collapse;
	}
	th {
		padding: 20px 15px;
	}
	td {
		padding: 15px;
	}
	.w-filter {
		width: 222px;
	}
	.w-status-select {
		width: 180px;
		color: #9fb0c9;
	}
	.checkbox-button {
		display: flex;
		align-items: center;
	}
	.checkbox-button input {
		display: none;
	}
	.checkbox-button input[type='checkbox']:checked ~ .icon {
		transform: rotate(180deg);
	}
</style>

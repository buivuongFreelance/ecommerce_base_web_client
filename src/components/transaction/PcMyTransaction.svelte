<script>
	import { _ } from 'svelte-i18n';

	import { stores, goto } from '@sapper/app';
	import { auth, notifyTransactionChanged } from '../../stores';
	import { onDestroy, onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import { listTransactionsSeller as apiListTransactionsSeller } from '../../services/transaction';
	import config from '../../config';
	import PcButtonSearch from '../button/PcButtonSearch.svelte';
	import PcButtonClearFilter from '../button/PcButtonClearFilter.svelte';
	import PcButtonScanTransaction from '../button/PcButtonScanTransaction.svelte';
	import PcDropdownMoreMenuTransactionItem from './PcDropdownMoreMenuTransactionItem.svelte';
	import { filterAndSortTransactions } from '../../functions';
	import PcButtonViewDetail from '../button/PcButtonViewDetail.svelte';
	import PcTagTransaction from './PcTagTransaction.svelte';

	const { session } = stores();
	const { domainTransaction } = $session;

	let isLoading = false;
	let offset = 0;
	let list = [];
	let originalList = [];
	let isServerError = false;

	let filter = {
		transactionCode: '',
		purchaseNumber: '',
		status: '',
		deviceName: '',
	};
	let sort = {
		transactionCode: '',
		purchaseNumber: '',
		status: '',
		deviceName: '',
		createdAt: 'desc',
	};
	let mounted = false;

	const unsubscribeNotifyTransactionChanged = notifyTransactionChanged.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					listTransactionsSeller();
				}
			}
		}
	);

	onMount(async () => {
		mounted = true;
		await listTransactionsSeller();
	});
	onDestroy(() => {
		unsubscribeNotifyTransactionChanged();
	});
	const listTransactionsSeller = () => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiListTransactionsSeller(domainTransaction, {
				token,
				limit: config.limit,
				offset,
				filter,
				sort,
			})
				.then((items) => {
					isLoading = false;
					originalList = Object.assign([], items.list);
					list = filterAndSortTransactions(items.list, filter, sort);
					isServerError = false;
					resolve();
				})
				.catch((error) => {
					isLoading = false;
					isServerError = true;
					reject();
				});
		});
	};
	const handleFilter = async () => {
		offset = 0;
		list = filterAndSortTransactions(originalList, filter, sort);
	};
	const handleClearFilter = async () => {
		filter = {
			purchaseNumber: '',
			status: '',
		};
		offset = 0;
		list = filterAndSortTransactions(originalList, filter, sort);
	};
	const handleSort = async (e) => {
		offset = 0;
		sort.purchaseNumber = '';
		sort.status = '';
		sort.deviceName = '';
		sort.transactionCode = e.target.checked ? e.target.value : 'asc';
		list = filterAndSortTransactions(originalList, filter, sort);
	};
	const handleSortPurNum = async (e) => {
		offset = 0;
		sort.transactionCode = '';
		sort.status = '';
		sort.deviceName = '';
		sort.purchaseNumber = e.target.checked ? e.target.value : 'asc';
		list = filterAndSortTransactions(originalList, filter, sort);
	};
	const handleSortDevice = async (e) => {
		offset = 0;
		sort.transactionCode = '';
		sort.status = '';
		sort.purchaseNumber = '';
		sort.deviceName = e.target.checked ? e.target.value : 'asc';
		list = filterAndSortTransactions(originalList, filter, sort);
	};
	const handleSortStatus = async (e) => {
		offset = 0;
		sort.transactionCode = '';
		sort.deviceName = '';
		sort.purchaseNumber = '';
		sort.status = e.target.checked ? e.target.value : 'asc';
		list = filterAndSortTransactions(originalList, filter, sort);
	};
</script>

{#if isServerError}
	<div class="mw10 center pt5">
		<p class="red f4">{$_('error.serverErrorMessage')}</p>
	</div>
{:else}
	<h2 class="mb4 ttc">{$_('order.myTrans')}</h2>
	<form
		class="flex mb5"
		autocomplete="off"
		on:submit|preventDefault={handleFilter}
	>
		<div class="mr3">
			<div class="relative">
				<input
					autocomplete="off"
					class="input-reset ba b--light-gray br2 pl5 h-40-px w-filter fw6"
					type="text"
					bind:value={filter.transactionCode}
					placeholder={$_('order.transCode')}
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
		<div class="mr3">
			<div class="relative">
				<input
					autocomplete="off"
					class="input-reset ba b--light-gray br2 pl5 h-40-px w-filter fw6"
					type="text"
					bind:value={filter.purchaseNumber}
					placeholder={$_('order.salePurchaseNumber')}
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
		<div class="mr3">
			<div class="relative">
				<input
					autocomplete="off"
					class="input-reset ba b--light-gray br2 pl5 h-40-px w-filter fw6"
					type="text"
					bind:value={filter.deviceName}
					placeholder={$_('device.deviceName')}
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
			class="bg-white b--light-gray br2 ba fw6 ph3 h-40-px
						w-status-select mr3"
			value={filter.status}
			on:change={(event) => (filter.status = event.target.value)}
		>
			<option value="">{$_('device.allSta')}</option>
			<option value={config.order.created}>{$_('message.started')}</option>
			<option value={config.order.ownerScanned}
				>{$_('message.inPrepared')}</option
			>
			<option value={config.order.ready}>{$_('message.ready')}</option>
			<option value={config.order.toBeShipped}
				>{$_('message.toBeShipped')}</option
			>
			<option value={config.order.shipped}>{$_('message.shipped')}</option>
			<option value={config.order.buyerReceived}
				>{$_('message.delivered')}</option
			>
			<option value={config.order.buyerAccept}>{$_('message.confirmed')}</option
			>
			<option value={config.order.buyerRejected}
				>{$_('message.inDispute')}</option
			>
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
										checked={sort.transactionCode == 'desc' ? true : false}
										on:change={(e) => handleSort(e)}
									/>
									<span class="mr3">{$_('order.transCode')}</span>
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
										checked={sort.purchaseNumber == 'desc' ? true : false}
										on:change={(e) => handleSortPurNum(e)}
									/>
									<span class="mr3">{$_('order.salePurchaseNumber')}</span>
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
										checked={sort.deviceName == 'desc' ? true : false}
										on:change={(e) => handleSortDevice(e)}
									/>
									<span class="mr3">{$_('device.deviceName')}</span>
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
							<!-- <th>{$_('message.createdDate')}</th>
						<th>{$_('cart.price')}</th> -->
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
							{#if item && $auth}
								<tr class="bb b--light-gray">
									<td>
										<span
											class="fw6 light-blue pointer"
											on:click={goto('my-transactions/' + item.id)}
											>{item.transaction_code}</span
										>
									</td>
									<td>
										{#if item.email !== $auth.email}
											<a
												class="fw6 light-blue underline dim pointer"
												href={'my-sales/' + item.sale_id}>{item.sale_number}</a
											>
										{:else}
											<a
												class="fw6 light-blue underline dim pointer"
												href={'my-purchases/' + item.order_id}
												>{item.order_number}</a
											>
										{/if}
									</td>
									<td>
										<div>
											{item.model}
											{item.color}
											{item.capacity}
											{$_('label.GB')}
										</div>
										<div class="light-silver mt1 f7">
											{$_('device.brand')}:
											{item.brand_name}
										</div>
									</td>
									<td class="ttu">
										<PcTagTransaction status={item.status} {item} />
									</td>
									<td>
										<div class="flex justify-end">
											{#if item.email !== $auth.email && item.status == config.device.created}
												{#if item.type !== config.seller}
													<PcButtonScanTransaction
														onClickButton={() =>
															goto(
																'my-transactions/transaction-scan/' + item.id
															)}
													/>
													<PcDropdownMoreMenuTransactionItem id={item.id} />
												{:else}
													<PcButtonViewDetail
														onClickButton={async () => {
															await goto('my-transactions/' + item.id);
														}}
													/>
													<div class="w40px ml3" />
												{/if}
											{:else if item.email == $auth.email && item.status == config.device.created && item.type == config.seller}
												<PcButtonScanTransaction
													onClickButton={() =>
														goto('my-transactions/transaction-scan/' + item.id)}
												/>
												<PcDropdownMoreMenuTransactionItem id={item.id} />
											{:else}
												<PcButtonViewDetail
													onClickButton={async () => {
														await goto('my-transactions/' + item.id);
													}}
												/>
												<div class="w40px ml3" />
											{/if}
										</div>
									</td>
								</tr>
							{/if}
						{/each}
					{:else}
						<div class="pb6 mt4 f4 pl4">{$_('message.noItems')}</div>
					{/if}
				</tbody>
			</table>
		</div>
	</main>
{/if}

<style>
	table {
		border-collapse: collapse;
	}
	th,
	td {
		padding: 20px 15px;
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
	.w40px {
		width: 40px;
	}
</style>

<script>
	import { _ } from 'svelte-i18n';

	import { stores, goto } from '@sapper/app';
	import { auth } from '../../stores';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import PcPagination from '../form/PcPagination.svelte';
	import { listTransactionsSeller as apiListTransactionsSeller } from '../../services/transaction';
	import config from '../../config';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import PcModalScanTransaction from '../modal/PcModalScanTransaction.svelte';
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
	let countList = 0;
	let isServerError = false;

	let isOpenModal = false;
	let selectedItem = null;
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

	$: {
		if (isOpenModal) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	}

	onMount(async () => {
		await listTransactionsSeller();
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
					countList = items.count;
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

	const handlePage = async (page) => {
		offset = config.limit * (page - 1);
		await listTransactionsSeller();
	};

	const onClose = () => {
		isOpenModal = false;
	};
	const openModalScanTransaction = (item) => {
		isOpenModal = true;
		selectedItem = item;
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
	<div class="pt5">
		<p class="red f4">{$_('error.serverErrorMessage')}</p>
	</div>
{:else}
	{#if isOpenModal}
		<Portal target={document.getElementById('portal')}>
			<DimmerModal type="modal" onClick={() => (isOpenModal = false)} />
			<PcModalScanTransaction {onClose} item={selectedItem} />
		</Portal>
	{/if}

	<h1 class="page__title tc ttc">{$_('order.myTrans')}</h1>
	<form class="mb4" autocomplete="off" on:submit|preventDefault={handleFilter}>
		<div class="mt3">
			<div class="relative">
				<input
					autocomplete="off"
					class="input-reset ba b--light-gray br2 pl5 db w-100 h-40-px w-filter fw6"
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
		<div class="mt3">
			<div class="relative">
				<input
					autocomplete="off"
					class="db w-100 input-reset ba b--light-gray br2 pl5 h-40-px w-filter fw6"
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
		<div class="mt3">
			<div class="relative">
				<input
					autocomplete="off"
					class="db w-100 input-reset ba b--light-gray br2 pl5 h-40-px w-filter fw6"
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
		<div class="mt3">
			<!-- svelte-ignore a11y-no-onchange -->
			<select
				class="db w-100 bg-white b--light-gray br2 ba fw6 ph3 h-40-px ttc
						w-status-select "
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
				<option value={config.order.buyerAccept}
					>{$_('message.confirmed')}</option
				>
				<option value={config.order.buyerRejected}
					>{$_('message.inDispute')}</option
				>
			</select>
		</div>
		<div class="mt3">
			<PcButtonSearch bg="bg-blue" className="" />
			<PcButtonClearFilter className="ml3" onClickButton={handleClearFilter} />
		</div>
	</form>
	<main>
		{#if isLoading}
			<ContentLoader
				uniqueKey="filterOrder"
				primaryColor="#e4e6ef"
				secondaryColor="#f8f8f8"
				width={375 - 30}
				height="180"
			>
				<rect x="0" y="0" rx="3" ry="3" width="30%" height="20" />
				<rect x="0" y="30" rx="3" ry="3" width="70%" height="20" />

				<rect x="0" y="60" rx="3" ry="3" width="100%" height="40" />
				<rect x="0" y="110" rx="3" ry="3" width="20%" height="20" />

				<rect x="0" y="140" rx="3" ry="3" width="40%" height="30" />
			</ContentLoader>
		{:else if list.length > 0}
			{#each list as item}
				<div class="mt3 ba b--light-gray pt4 pl4 pr4 pb3 br2">
					<div
						class="flex justify-between tr bb b--light-gray b--dashed pb3 mb3"
					>
						<div class="">
							<div class="f7 light-silver">{$_('order.transCode')}</div>
							<span
								class="fw6 light-blue pointer"
								on:click={goto('my-transactions/' + item.id)}
							>
								{item.transaction_code}
							</span>
						</div>
						<div class="">
							<div class="f7 light-silver">
								{$_('order.salePurchaseNumber')}
							</div>
							<a
								class="fw6 light-blue underline dim pointer"
								href={'my-sales/' + item.sale_id}
							>
								{item.sale_number}
							</a>
						</div>
					</div>
					<div>
						{item.model}
						{item.color}
						{item.capacity}
						{$_('label.GB')}
					</div>
					<div class="light-silver f7">
						{$_('device.brand')}:
						{item.brand_name}
					</div>
					<div class="mt3">
						<PcTagTransaction status={item.status} {item} />
					</div>
					<div class="flex justify-between bt b--light-gray b--dashed mt3 pt3">
						{#if item.email !== $auth.email && item.status == config.device.created}
							{#if item.type !== config.seller}
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
						{/if}
					</div>
				</div>
			{/each}
		{:else}
			<div class="pb6 mt4 f4 pl4">{$_('message.noItems')}</div>
		{/if}
	</main>
{/if}

<style>
	.w-status-select {
		color: #9fb0c9;
	}
	/* .checkbox-button {
		display: flex;
		align-items: center;
	}
	.checkbox-button input {
		display: none;
	}
	.checkbox-button input[type='checkbox']:checked ~ .icon {
		transform: rotate(180deg);
	} */
</style>

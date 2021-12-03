<script>
	import { _ } from 'svelte-i18n';

	import { stores, goto } from '@sapper/app';
	import { auth, currency } from '../../stores';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import PcPagination from '../form/PcPagination.svelte';
	import { listOrder as apiListOrder } from '../../services/transaction';
	import config from '../../config';
	import { displayCurrency, displayDateTime } from '../../functions';
	import PcTagOrder from './PcTagOrder.svelte';

	const { session } = stores();
	const { domainTransaction } = $session;

	let isLoading = false;
	let offset = 0;
	let list = [];
	let countList = 0;
	let isServerError = false;
	let filter = {
		orderNum: '',
		status: '',
		date: '',
	};

	onMount(async () => {
		await listOrder();
	});
	const listOrder = () => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiListOrder(domainTransaction, {
				token,
				limit: config.limit,
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
	const handleFilter = async () => {
		offset = 0;
		await listOrder();
	};
	const handleClearFilter = async () => {
		filter = {
			orderNum: '',
			status: '',
			date: '',
		};
		offset = 0;
		await listOrder();
	};
	const handlePage = async (page) => {
		offset = config.limit * (page - 1);

		await listOrder();
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
	.btn {
		white-space: nowrap;
	}
	/* .w-filter {
		width: 222px;
	}
	.w-status-select {
		width: 180px;
		color: #9fb0c9;
	} */
</style>

{#if isServerError}
	<div class="mw10 center pt5">
		<p class="red f4">{$_('error.serverErrorMessage')}</p>
	</div>
{:else}
	<h2 class="mb4 ttc">{$_('order.myOrder')}</h2>

	<!-- <header class="flex">
	<h3 class="flex-auto">Recent Orders</h3>
	<a href="/" class="link">View all</a>
</header> -->

	<!-- <form
		class="flex mb5"
		autocomplete="off"
		on:submit|preventDefault={handleFilter}>
		<div class="mr3">
			<div class="relative">
				<input
					id="name"
					autocomplete="off"
					class="input-reset ba b--light-gray br2 pl5 h-40-px w-filter fw6"
					type="text"
					bind:value={filter.orderNum}
					placeholder={$_('Order Number')} />
				<i class="absolute left-0 pl1 top-0 bottom-0 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="#9fb0c9"
						width="24px"
						height="24px">
						<path d="M0 0h24v24H0V0z" fill="none" />
						<path
							d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
					</svg>
				</i>
			</div>
		</div>
		<!-- svelte-ignore a11y-no-onchange
		<select
			class="bg-white b--light-gray br2 ba fw6 ph3 h-40-px ttc
							w-status-select mr3"
			value={filter.status}
			on:change={(event) => (filter.status = event.target.value)}>
			<option value="">{$_('device.allSta')}</option>
			<option value={config.order.created}>{$_('device.statusCreated')}</option>
		</select>
		<div class="relative">
			<input
				id="name"
				autocomplete="off"
				class="input-reset ba b--light-gray br2 pl3 h-40-px w-filter fw6"
				type="text"
				bind:value={filter.date}
				placeholder={$_('Order Date')} />
		</div>
		<button
			type="submit"
			class="bg-blue b--transparent br2 ba f7 fw6 ttu white flex
							justify-center items-center ml3 pointer h-40-px w-search">
			<i class="mr1 flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="white"
					width="18px"
					height="18px">
					<path d="M0 0h24v24H0z" fill="none" />
					<path
						d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91
												13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59
												4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5
												11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
				</svg>
			</i>
			{$_('device.search')}
		</button>
		<button
			type="button"
			on:click={handleClearFilter}
			class="bg-silver b--light-gray br2 ba f7 fw6 ttu mid-gray flex
							justify-center items-center ml3 pointer w-search h-40-px">
			{$_('device.clearFilter')}
		</button>
	</form> -->
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
					<tr class="bb b--light-gray">
						<th>{$_('label.orderNumber')}</th>
						<th>{$_('message.createdDate')}</th>
						<th>{$_('order.shipTo')}</th>
						<th>{$_('order.orderTotal')}</th>
						<th>{$_('device.status')}</th>
						<th width="1%" />
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
				{:else if list.length > 0}
					{#each list as item}
						<tr class="bb b--light-gray">
							<td><span class="fw6 light-blue">{item.order_number}</span></td>
							<td>{displayDateTime(item.created_at)}</td>
							<td>{item.shipping_info.address}</td>
							<td>
								{displayCurrency(item.total_money, $currency)}
								{$currency}
							</td>
							<td>
								<PcTagOrder status={item.status} />
								<!-- <span class="h-20-px ph3 ba b--light-gray f7">
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
									{:else if item.status === config.order.pending}
										{$_('message.pending')}
									{/if}
								</span> -->
							</td>
							<td class="tr">
								<button
									on:click={() => goto('my-purchases/' + item.id)}
									class="btn flex items-center h-30-px ph3 br1 bn pointer grow bg-light-blue white fw6 f6 mr3">{$_('order.viewOrder')}</button>
							</td>
						</tr>
					{/each}
				{:else}
					<div class="pb6 mt4 f4">{$_('message.noItems')}</div>
				{/if}
			</tbody>
		</table>
		{#if list.length > 0}
			<div class="flex justify-end mt5">
				<PcPagination totalItems={countList} {offset} onPage={handlePage} />
			</div>
		{/if}
	</main>
{/if}

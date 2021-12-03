<script>
	import { _ } from 'svelte-i18n';

	import { stores, goto } from '@sapper/app';
	import { auth, notificationChanged } from '../../stores';
	import { onDestroy, onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import PcPagination from '../form/PcPagination.svelte';
	import config from '../../config';
	import {
		displayDateTime,
		notificationOrder,
		notificationProposal,
	} from '../../functions';
	import {
		listNotification as apiListNotification,
		removeNotification as apiRemoveNotification,
		updateNotificationRead as apiUpdateNotificationRead,
		removeAllNotification as apiRemoveAllNotification,
	} from '../../services/model';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import PcNotificationText from './PcNotificationText.svelte';
	const { session } = stores();
	const { domainModel } = $session;

	let isLoading = false;
	let isLoadingRemoveAll = false;
	let offset = 0;
	let list = [];
	let countList = 0;
	let isServerError = false;
	let filter = {
		orderNum: '',
		status: '',
		date: '',
	};
	let mounted = false;

	const unsubscribeNotificationChanged = notificationChanged.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					await listNotification();
				}
			}
		}
	);

	onMount(async () => {
		await listNotification();
		mounted = true;
	});
	onDestroy(async () => {
		unsubscribeNotificationChanged();
	});
	const removeAllNotification = () => {
		isLoadingRemoveAll = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiRemoveAllNotification(domainModel, { token })
				.then(() => {
					isLoadingRemoveAll = false;
					resolve();
				})
				.catch(() => {
					isLoadingRemoveAll = false;
					reject();
				});
		});
	};
	const handleRemoveAll = async () => {
		await removeAllNotification();
		notificationChanged.update((n) => n + 1);
	};
	const listNotification = () => {
		if ($auth) {
			isLoading = true;
			const token = $auth.accessToken;
			return new Promise((resolve, reject) => {
				apiListNotification(domainModel, {
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
		}
	};
	const updatedNotificationRead = (item) => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiUpdateNotificationRead(domainModel, {
				token,
				id: item.id,
			})
				.then(() => {
					notificationChanged.update((n) => n + 1);
					isLoading = false;
					resolve();
				})
				.catch(() => {
					isLoading = false;
					isServerError = true;
					reject();
				});
		});
	};
	const removeNotification = (item) => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiRemoveNotification(domainModel, {
				token,
				id: item.id,
			})
				.then((items) => {
					notificationChanged.update((n) => n + 1);
					isLoading = false;
					swal.fire({
						toast: true,
						position: 'top-end',
						icon: 'success',
						title: $_('message.actionSuccess'),
						showConfirmButton: false,
						timerProgressBar: true,
						timer: 1500,
						onOpen: (toast) => {
							toast.addEventListener('mouseenter', swal.stopTimer);
							toast.addEventListener('mouseleave', swal.resumeTimer);
						},
					});
					resolve();
				})
				.catch(() => {
					isLoading = false;
					isServerError = true;
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.serverErrorTitle'),
						reverseButtons: true,
						text: $_('error.serverErrorMessage'),
						customClass: {
							icon: 'icon-error',
						},
					});
					reject();
				});
		});
	};
	const handlePage = async (page) => {
		offset = config.limit * (page - 1);

		await listNotification();
	};
	const handleView = async (item) => {
		await updatedNotificationRead(item);
		await listNotification();
		const type = notificationProposal(item.name).type;
		let link = item.links;
		if (type === config.proposal.buyerRemove) {
			let strArr = link.split('/');
			link = strArr[1] + '/' + strArr[2] + '/' + strArr[3];
			goto(link);
		} else if (item.type == config.notification.transaction) {
			goto('my-transactions/' + item.links);
		} else {
			goto(item.links);
		}
	};
	const handleRemoveNotify = async (item) => {
		await removeNotification(item);
		offset = 0;
		await listNotification();
	};
</script>

<style>
	table {
		border-collapse: separate;
		border-spacing: 6px 6px;
	}
	tbody tr {
		transition: transform 0.3s;
	}
	tbody tr td {
		background-color: #f3f6f9;
	}
	tbody tr td.cell-type {
		background-color: #e4e6ef;
	}
	tbody td:first-child {
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
	}
	tbody td:last-child {
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}
	/* tr td.cell-type {
		background-color: #b5b5c3;
	} */
	tr.unread td {
		background-color: rgba(54, 153, 255, 0.1);
		font-weight: bold;
	}
	tr.unread td.cell-type {
		background-color: rgba(54, 153, 255, 0.2);
	}
	th,
	td {
		padding: 10px 20px;
	}
	.btn {
		white-space: nowrap;
	}

	tr svg {
		fill: #6c7293;
	}
	tr.unread svg {
		fill: #3699ff;
	}
	tbody tr:hover {
		transform: translateX(10px);
	}
	tbody tr.noItems:hover {
		transform: none;
	}
	tbody tr td.noItem {
		background-color: #fff;
	}
</style>

{#if isServerError}
	<div class="mw10 center pt5">
		<p class="red f4">{$_('error.serverErrorMessage')}</p>
	</div>
{:else}
	<div class="flex justify-between items-end">
		<h3 class="mb4 ttc">{$_('notification.title')}</h3>
		{#if list.length > 0}
			{#if isLoadingRemoveAll}
				<LoadingDefault color="#cccccc" size="20" />
			{:else}
				<span
					on:click={handleRemoveAll}
					class="viewermore light-blue pointer">{$_('message.markAsRead')}</span>
			{/if}
		{/if}
	</div>
	<main>
		<table class="w-100">
			{#if isLoading}
				<ContentLoader
					uniqueKey="filterNotification"
					primaryColor="#e4e6ef"
					secondaryColor="#f8f8f8"
					width={config.containerDesktop - 30}
					height="40">
					<rect x="0" y="0" rx="3" ry="3" width="100%" height="40" />
				</ContentLoader>
			{:else}
				<thead class="tl ttu light-silver">
					<tr class="bb b--light-gray">
						<th width="15%">{$_('device.type')}</th>
						<th>{$_('cart.name')}</th>
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
						<tr class:unread={item.status === 'unread'}>
							<td class="cell-type ttu">
								{#if item.type === config.proposalBuyer || item.type === config.proposalSeller}
									<div class="pl3">{$_('proposal.offer')}</div>
								{:else if item.type === config.notificationOrder}
									<div class="pl3">{$_('order.order')}</div>
								{:else if item.type === config.notification.transaction}
									<div class="pl3">{$_('transaction.transaction')}</div>
								{/if}
							</td>
							<td class="cell-content">
								<div
									class="light-blue pointer"
									on:click={() => handleView(item)}>
									<PcNotificationText {item} />
								</div>
								<small class="i">{displayDateTime(item.created_at)}</small>
							</td>
							<!-- <td>{$_('notification.' + [item.status])}</td> -->
							<td class="tr">
								<button
									on:click={() => handleRemoveNotify(item)}
									class="btn flex items-center h-30-px ph3 br1 bn pointer grow bg-transparent bn">
									<svg height="24" viewBox="0 0 24 24" width="24"><path
											d="M0 0h24v24H0z"
											fill="none" />
										<path
											d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
									</svg>
								</button>
							</td>
						</tr>
					{/each}
				{:else}
					<tr class="noItems">
						<td colspan="3" class="noItem">
							<div class="f4">{$_('message.noItems')}</div>
						</td>
					</tr>
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

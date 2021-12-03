<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import { auth } from '../../stores';
	import ContentLoader from 'svelte-content-loader';
	import MobileDeviceAccountItem from './MobileDeviceAccountItem.svelte';
	import { listDevice as apiListDevice } from '../../services/device';
	import { onMount } from 'svelte';
	import config from '../../config';
	import * as animateScroll from 'svelte-scrollto';
	import MobilePagination from '../form/MobilePagination.svelte';

	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';

	import { detailDevice as apiDetailDevice } from '../../services/device';
	import MobileModalLowerPriceSell from '../modal/MobileModalLowerPriceSell.svelte';

	const { session, page } = stores();
	const { domainDevice } = $session;

	let isServerError = false;
	let isLoading = false;
	let offset = 0;
	let list = [];
	let countList = 0;
	let loadingLoadMore = false;
	let filter = {
		deviceName: '',
		status: '',
		grade: '',
	};
	let sort = { deviceName: '', physicalGrading: '', status: '' };
	let selectedItem = null;
	let isOpenModalLowerPrice = false;

	let isLoadingDetail = false;
	let isServerErrorDetail = false;

	onMount(async () => {
		if ($page.query.status) {
			filter.status = config.device.posted;
		}
		await listDevice();
	});

	const listDeviceLoadMore = () => {
		loadingLoadMore = true;
		let token = '';
		if ($auth) token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiListDevice(domainDevice, {
				token,
				limit: config.limitMobile,
				offset,
				filter,
				sort,
			})
				.then((items) => {
					loadingLoadMore = false;
					list = [...list, ...items.list];
					countList = items.count;
					isServerError = false;
					resolve();
				})
				.catch(() => {
					loadingLoadMore = false;
					isServerError = true;
					reject();
				});
		});
	};

	const listDevice = () => {
		isLoading = true;
		let token = '';
		if ($auth) token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiListDevice(domainDevice, {
				token,
				limit: config.limitMobile,
				offset,
				filter,
				sort,
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
		animateScroll.scrollToTop();
		await listDevice();
	};

	const handleClearFilter = async () => {
		filter = {
			deviceName: '',
			status: '',
			grade: '',
		};
		offset = 0;
		animateScroll.scrollToTop();
		await listDevice();
	};

	const handlePage = async (page) => {
		offset = config.limitMobile * (page - 1);
		await listDeviceLoadMore();
	};

	const handleDeleteSuccess = async () => {
		animateScroll.scrollToTop();
		await listDevice();
	};

	const handleFocusSearch = () => {
		animateScroll.scrollTo({
			element: document.getElementById('searchDeviceName'),
			offset: -120,
		});
	};
	const detailDevice = (id) => {
		isLoadingDetail = true;
		let token = '';
		if ($auth) token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiDetailDevice(domainDevice, {
				id,
				token,
			})
				.then((info) => {
					isLoadingDetail = false;
					isServerErrorDetail = false;
					resolve(info);
				})
				.catch((error) => {
					isLoadingDetail = false;
					isServerErrorDetail = true;
					reject(error);
				});
		});
	};
	const handleSelectedItem = async (it) => {
		if (it) {
			selectedItem = await detailDevice(it.id);
			isOpenModalLowerPrice = true;
		} else {
			isOpenModalLowerPrice = false;
		}
	};
	const handleSort = async (e) => {
		offset = 0;
		sort.physicalGrading = '';
		sort.status = '';
		sort.deviceName = e.target.checked ? e.target.value : 'asc';
		await listDevice();
	};
</script>

{#if isOpenModalLowerPrice}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal type="modal" onClick={() => (isOpenModalLowerPrice = false)} />
		{#if selectedItem}
			<MobileModalLowerPriceSell
				isLoading={isLoadingDetail}
				isServerError={isServerErrorDetail}
				item={selectedItem}
				onClose={() => (isOpenModalLowerPrice = false)}
			/>
		{/if}
	</Portal>
{/if}

{#if isServerError}
	<div class="w-100 spacing-ext pt4 pb3">
		<p class="red f4">{$_('error.serverErrorMessage')}</p>
	</div>
{:else if isLoading}
	<div class="w-100 spacing-ext pt4 pb3">
		<ContentLoader
			uniqueKey="listDevice"
			primaryColor="#e4e6ef"
			secondaryColor="#f8f8f8"
			width="325"
			height="200"
		>
			<rect x="0" y="0" rx="3" ry="3" width="325" height="40" />
			<rect x="0" y="60" rx="3" ry="3" width="325" height="20" />
			<rect x="0" y="100" rx="3" ry="3" width="325" height="20" />
			<rect x="0" y="140" rx="3" ry="3" width="325" height="20" />
			<rect x="0" y="180" rx="3" ry="3" width="325" height="20" />
		</ContentLoader>
	</div>
{:else}
	<div class="w-100 spacing-ext mb1rem">
		<h1 class="page__title ttc tc">{$_('device.listDevice')}</h1>
		<form novalidate on:submit|preventDefault={handleFilter}>
			<div class="flex mb3">
				<div class="relative w-100">
					<input
						id="searchDeviceName"
						name="name"
						autocomplete="off"
						bind:value={filter.deviceName}
						class="input-reset ba b--light-gray br2 pl5 h-40-px fw6 w-100"
						type="text"
						on:focus={handleFocusSearch}
						placeholder={$_('device.filterDeviceName')}
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
			<div class="flex mb3 justify-between">
				<!-- svelte-ignore a11y-no-onchange -->
				<select
					class="b--light-gray light-gray br2 ba fw6 ph3 h-40-px ttc w-100 mr3
							bg-white"
					value={filter.status}
					on:change={(event) => (filter.status = event.target.value)}
				>
					<option value="">{$_('device.allSta')}</option>
					<option value={config.device.created}>
						{$_('device.statusCreated')}
					</option>
					<option value={config.device.waitingForScan}>
						{$_('message.waitingForScan')}
					</option>
					<!-- <option value={config.device.waitingForApproval}>
							{$_('message.waitingForApproval')}
						</option> -->
					<option value={config.device.posted}>{$_('message.posted')}</option>
				</select>

				<!-- svelte-ignore a11y-no-onchange -->
				<select
					value={filter.grade}
					on:change={(event) => (filter.grade = event.target.value)}
					class="b--light-gray light-gray br2 ba fw6 ph3 h-40-px ttc w-100 ml3
							bg-white"
				>
					<option value="">{$_('device.allGrading')}</option>
					<option value="A">{$_('device.grade') + ' A'}</option>
					<option value="B">{$_('device.grade') + ' B'}</option>
					<option value="C">{$_('device.grade') + ' C'}</option>
					<option value="D">{$_('device.grade') + ' D'}</option>
				</select>
			</div>
			<div class="flex mb3 justify-between">
				<button
					type="button"
					on:click={handleClearFilter}
					class="bg-silver b--light-gray br2 ba f7 fw6 ttu mid-gray flex w-100
							justify-center items-center pointer h-40-px mr3"
				>
					{$_('device.clearFilter')}
				</button>
				<button
					type="submit"
					class="bg-blue b--transparent br2 ba f7 fw6 ttu white flex
							justify-center items-center ml3 pointer h-40-px w-100"
				>
					<i class="mr1 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="white"
							width="18px"
							height="18px"
						>
							<path d="M0 0h24v24H0z" fill="none" />
							<path
								d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91
												13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59
												4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5
												11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
							/>
						</svg>
					</i>
					{$_('device.search')}
				</button>
			</div>
		</form>
		<div class="mb3">
			<button
				on:click={() => goto('my-devices/add-device')}
				type="submit"
				class="bg-dark-blue b--transparent br2 ba f7 fw6 ttu white flex
						justify-center items-center pointer h-40-px w-create-device grow"
			>
				<i class="mr1 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="white"
						width="20px"
						height="20px"
					>
						<path d="M0 0h24v24H0z" fill="none" />
						<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
					</svg>
				</i>
				{$_('device.createDevice')}
			</button>
		</div>
	</div>

	{#if list.length > 0}
		<div class="pb6 spacing-ext">
			<div class="br3 ba b--black-10 pt5 pb5">
				<div class="flex items-center ph3 f7 fw6 gray ttu pv3 bb b--black-10">
					<div class="flex items-center">
						<label class="checkbox-button pointer">
							<input
								type="checkbox"
								value="desc"
								checked={sort.deviceName == 'desc' ? true : false}
								on:change={(e) => handleSort(e)}
							/>
							<span class="mr3"> {$_('device.deviceName')}</span>
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
					</div>
				</div>
				{#each list as item}
					<MobileDeviceAccountItem
						{item}
						onDeleteSuccess={handleDeleteSuccess}
						selectedItem={handleSelectedItem}
					/>
				{/each}
				<div class="flex items-center justify-center f7 fw6 gray ttu pt4">
					<MobilePagination
						totalItems={countList}
						loading={loadingLoadMore}
						{offset}
						onPage={handlePage}
					/>
				</div>
			</div>
		</div>
	{:else}
		<div class="pb6 spacing-ext">{$_('message.noItems')}</div>
	{/if}
{/if}

<style>
	.w-create-device {
		width: 170px;
	}
	.checkbox-button {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.checkbox-button input {
		display: none;
	}
	.checkbox-button input[type='checkbox']:checked ~ .icon {
		transform: rotate(180deg);
	}
</style>

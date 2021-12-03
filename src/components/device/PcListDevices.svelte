<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import PcDeviceAccountItem from './PcDeviceAccountItem.svelte';
	import { auth } from '../../stores';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import config from '../../config';
	import PcPagination from '../form/PcPagination.svelte';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import PcModalLowerPriceSell from '../modal/PcModalLowerPriceSell.svelte';
	import {
		detailDevice as apiDetailDevice,
		listDevice as apiListDevice,
	} from '../../services/device';

	import { testBasicScanModel as apiTestBasicScan } from '../../services/model';

	import PcButtonSearch from '../button/PcButtonSearch.svelte';
	import PcButtonClearFilter from '../button/PcButtonClearFilter.svelte';

	$: {
		if (isOpenModalLowerPrice) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	}

	const { session, page } = stores();
	const { domainDevice, domainModel } = $session;

	let isOpenModalLowerPrice = false;
	let isLoading = false;
	let isServerError = false;
	let offset = 0;
	let list = [];
	let countList = 0;
	let isLoadingDetail = false;
	let isServerErrorDetail = false;
	let filter = {
		deviceName: '',
		status: '',
		grade: '',
	};
	let sort = { deviceName: '', physicalGrading: '', status: '' };
	let selectedItem = null;

	onMount(async () => {
		if ($page.query.status) {
			filter.status = config.device.posted;
		}
		await listDevice();
	});

	const handleDeleteSuccess = async () => {
		await listDevice();
	};

	const listDevice = () => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiListDevice(domainDevice, {
				token,
				limit: config.limit,
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

	const handlePage = async (page) => {
		offset = config.limit * (page - 1);
		await listDevice();
	};

	const handleFilter = async () => {
		offset = 0;
		await listDevice();
	};

	const handleClearFilter = async () => {
		filter = {
			deviceName: '',
			status: '',
			grade: '',
		};
		offset = 0;
		await listDevice();
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

	const handleTestBasicScan = async (it) => {
		isLoadingDetail = true;
		let token = '';
		if ($auth) token = $auth.accessToken;

		apiTestBasicScan(domainModel, {
			deviceId: it.id,
			token,
		})
			.then((info) => {
				isLoadingDetail = false;
				isServerErrorDetail = false;
				listDevice();
			})
			.catch((error) => {
				isLoadingDetail = false;
				isServerErrorDetail = true;
			});
	};

	const handleSort = async (e) => {
		offset = 0;
		sort.physicalGrading = '';
		sort.status = '';
		sort.deviceName = e.target.checked ? e.target.value : 'asc';
		await listDevice();
	};
	const handleSortP = async (e) => {
		offset = 0;
		sort.deviceName = '';
		sort.status = '';
		sort.physicalGrading = e.target.checked ? e.target.value : 'asc';
		await listDevice();
	};
	const handleSortS = async (e) => {
		offset = 0;
		sort.deviceName = '';
		sort.physicalGrading = '';
		sort.status = e.target.checked ? e.target.value : 'asc';
		await listDevice();
	};
</script>

{#if isOpenModalLowerPrice}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal type="modal" onClick={() => (isOpenModalLowerPrice = false)} />
		{#if selectedItem}
			<PcModalLowerPriceSell
				isLoading={isLoadingDetail}
				isServerError={isServerErrorDetail}
				item={selectedItem}
				onClose={() => (isOpenModalLowerPrice = false)}
			/>
		{/if}
	</Portal>
{/if}

{#if isServerError}
	<div class="mw10 center pt5">
		<p class="red f4">{$_('error.serverErrorMessage')}</p>
	</div>
{:else}
	<div class="mw10 center pt5 pb3">
		<h2 class="mb4 ttc">{$_('device.listDevice')}</h2>
		<div class="justify-between flex">
			{#if isLoading}
				<ContentLoader
					uniqueKey="filterDevice"
					primaryColor="#e4e6ef"
					secondaryColor="#f8f8f8"
					width={config.containerDesktop - 30}
					height="40"
				>
					<rect x="0" y="0" rx="3" ry="3" width="80%" height="40" />
				</ContentLoader>
			{:else}
				<form
					class="flex"
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
								bind:value={filter.deviceName}
								placeholder={$_('device.filterDeviceName')}
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
						<option value={config.device.created}>
							{$_('device.statusCreated')}
						</option>
						<option value={config.device.waitingForScan}>
							{$_('message.waitingForScan')}
						</option>
						<option value={config.device.inTransaction}>
							{$_('message.inTransaction')}
						</option>
						<option value={config.device.posted}>{$_('message.posted')}</option>
					</select>
					<!-- svelte-ignore a11y-no-onchange -->
					<select
						value={filter.grade}
						on:change={(event) => (filter.grade = event.target.value)}
						class="bg-white b--light-gray br2 ba fw6 ph3 h-40-px ttc
							w-status-select"
					>
						<option value="">{$_('device.allGrading')}</option>
						<option value="A">{$_('device.grade') + ' A'}</option>
						<option value="B">{$_('device.grade') + ' B'}</option>
						<option value="C">{$_('device.grade') + ' C'}</option>
						<option value="D">{$_('device.grade') + ' D'}</option>
					</select>

					<PcButtonSearch bg="bg-blue" className="ml3" />

					<PcButtonClearFilter
						className="ml3"
						onClickButton={handleClearFilter}
					/>
				</form>
			{/if}
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
	<div class="pb5 mt4 center mw10">
		{#if isLoading}
			<ContentLoader
				uniqueKey="listDevice"
				primaryColor="#e4e6ef"
				secondaryColor="#f8f8f8"
				width={config.containerDesktop - 30}
				height="200"
			>
				<rect x="0" y="0" rx="3" ry="3" width="100%" height="40" />
				<rect x="0" y="60" rx="3" ry="3" width="100%" height="20" />
				<rect x="0" y="100" rx="3" ry="3" width="100%" height="20" />
				<rect x="0" y="140" rx="3" ry="3" width="100%" height="20" />
				<rect x="0" y="180" rx="3" ry="3" width="100%" height="20" />
			</ContentLoader>
		{:else if list.length > 0}
			<div class="ba b--light-gray br3 pv4">
				<table class="table">
					<thead class="b--light-gray bb b">
						<tr>
							<th class="">
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
							</th>
							<th>
								<div class="flex items-center">
									<label class="checkbox-button pointer">
										<input
											type="checkbox"
											value="desc"
											checked={sort.physicalGrading == 'desc' ? true : false}
											on:change={(e) => handleSortP(e)}
										/>
										<span class="mr3">{$_('device.physicalGrading')}</span>
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
							</th>
							<th>
								<div class="flex items-center">
									<label class="checkbox-button pointer">
										<input
											type="checkbox"
											value="desc"
											checked={sort.status == 'desc' ? true : false}
											on:change={(e) => handleSortS(e)}
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
								</div>
							</th>

							<th class="tr" width="1%">{$_('device.availableActions')}</th>
						</tr>
					</thead>
					<tbody>
						{#each list as item}
							<PcDeviceAccountItem
								{item}
								onDeleteSuccess={handleDeleteSuccess}
								selectedItem={handleSelectedItem}
								testBasicScan={handleTestBasicScan}
							/>
						{/each}
					</tbody>
				</table>
				<div class="flex justify-end mt4 mr15px">
					<PcPagination totalItems={countList} {offset} onPage={handlePage} />
				</div>
			</div>
		{:else}
			<div class="pb6 mt4 center mw10 f4">{$_('message.noItems')}</div>
		{/if}
	</div>
{/if}

<style>
	.table {
		width: 100%;
		border-collapse: collapse;
	}
	.mr15px {
		margin-right: 15px;
	}
	th {
		padding: 20px 15px;
	}
	.w-filter {
		width: 222px;
	}
	.w-status-select {
		width: 180px;
		color: #9fb0c9;
	}
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

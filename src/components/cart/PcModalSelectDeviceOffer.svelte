<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import { fade } from 'svelte/transition';
	import { listAccountDevicesExclude as apiListAccountDevicesExclude } from '../../services/device';
	import { auth } from '../../stores';
	import ContentLoader from 'svelte-content-loader';
	import config from '../../config';
	import { onMount } from 'svelte';
	import PcModalSelectDeviceAccountItem from './PcModalSelectDeviceAccountItem.svelte';
	import PcPagination from '../form/PcPagination.svelte';

	export let onClose;
	export let onSelectItem;
	export let selectedExchangedDevices = [];

	const { session } = stores();
	const { domainDevice } = $session;

	export let listAdded = [];
	export let filterModel = '';

	let isLoading = false;
	let isServerError = false;
	let list = [];
	let offset = 0;
	let countList = 0;
	let filter = {
		deviceName: '',
	};
	let oldListAdded = [];

	$: {
		if (JSON.stringify(listAdded) !== JSON.stringify(oldListAdded)) {
			for (let i = 0; i < listAdded.length; i++) {
				list.unshift(listAdded[i]);
			}
			list = list;
			countList += listAdded.length;
			oldListAdded = Object.assign([], listAdded);
		}
	}

	onMount(async () => {
		if(filterModel){
			filter.deviceName = filterModel;
		}
		await listDevices();
	});

	const listDevices = () => {
		list = [];
		countList = 0;
		return new Promise((resolve, reject) => {
			isLoading = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			const exchangeIds = selectedExchangedDevices.map(
				(selectedExchangedDevice) => selectedExchangedDevice.id
			);

			apiListAccountDevicesExclude(domainDevice, {
				token,
				limit: config.limit,
				filter,
				offset,
				exchangeIds,
			})
				.then((obj) => {
					isServerError = false;
					isLoading = false;
					list = list.concat(obj.list);
					countList += obj.count;
				})
				.catch(() => {
					isServerError = true;
					isLoading = false;
				});
		});
	};

	const handlePage = async (page) => {
		offset = config.limit * (page - 1);
		await listDevices();
	};

	const handleFilter = async () => {
		offset = 0;
		await listDevices();
	};

	const handleClearFilter = async () => {
		filter = {
			deviceName: '',
			status: '',
			grade: '',
		};
		offset = 0;
		await listDevices();
	};

	const handleSelectItem = (item) => {
		isLoading = true;
		onSelectItem(item);
	};
</script>

<style>
	.w-filter {
		width: 222px;
	}
	.w-create-device {
		width: 170px;
	}
	.w-dn {
		width: 440px;
	}
	.w-pg {
		width: 190px;
	}
	.w-sta {
		width: 260px;
	}
	.w-ext {
		width: 250px;
	}
	.wrapper {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		height: calc(100vh - 120px);
		overflow: hidden;
		border-radius: 10px;
	}
	.container {
		height: calc(100vh - 120px);
	}
	.panel {
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	.content {
		max-height: calc(100vh - 180px);
		overflow: auto;
	}
</style>

<div class="fixed z-max w-90 wrapper" transition:fade>
	<div class="w-100 bg-white container">
		<div
			class="h-60-px flex items-center justify-between bg-light-gray
				b--pale-grey bb ph4 near-black fw5 f4 panel">
			<div>{$_('message.selectItem')}</div>
			<div class="pointer flex items-center" on:click={onClose}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 0 24 24"
					fill="#7e8299"
					width="24"><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
			</div>
		</div>
		<div class="ph4 content">
			<div class="w-100 center pt5 pb3">
				<h2 class="mb4 ttc">{$_('device.listDevice')}</h2>
				<div class="justify-between flex">
					{#if isLoading}
						<ContentLoader
							uniqueKey="filterDevice"
							primaryColor="#e4e6ef"
							secondaryColor="#f8f8f8"
							width={config.containerDesktop - 30}
							height="40">
							<rect x="0" y="0" rx="3" ry="3" width="80%" height="40" />
						</ContentLoader>
					{:else}
						<form
							class="flex"
							autocomplete="off"
							on:submit|preventDefault={handleFilter}>
							<div class="mr3">
								<div class="relative">
									<input
										on:input={(e) => {
											if (e.target.value == '') {
												handleClearFilter();
											}
										}}
										id="name"
										autocomplete="off"
										class="input-reset ba b--light-gray br2 pl5 h-40-px w-filter fw6"
										type="text"
										bind:value={filter.deviceName}
										placeholder={$_('device.filterDeviceName')} />
									<i
										class="absolute left-0 pl1 top-0 bottom-0 flex items-center">
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
						</form>
					{/if}
					<button
						on:click={() => goto('my-devices/add-device')}
						type="submit"
						class="bg-dark-blue b--transparent br2 ba f7 fw6 ttu white flex
							justify-center items-center pointer h-40-px w-create-device grow">
						<i class="mr1 flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="white"
								width="20px"
								height="20px">
								<path d="M0 0h24v24H0z" fill="none" />
								<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
							</svg>
						</i>
						{$_('device.createDevice')}
					</button>
				</div>
			</div>
			<div class="mv5">
				{#if isServerError}
					<p class="red f4">{$_('error.serverErrorMessage')}</p>
				{:else if isLoading}
					<ContentLoader
						width="800"
						height="40"
						uniqueKey="modalSelectDeviceOffer"
						primaryColor="#e4e6ef"
						secondaryColor="#f8f8f8">
						<rect x="0" y="0" rx="5" ry="5" width="800" height="40" />
					</ContentLoader>
				{:else if list.length === 0}
					<p class="f4 tc">{$_('message.noItems')}</p>
				{:else}
					<div class="br2 bt bl br br--top b--black-10">
						<div
							class="flex items-center ph5 ba b--black-10 bt-0 bl-0 br-0 f7 fw6
								gray pv4 ttu">
							<div class="w-dn">
								<div class="flex items-center">
									<span class="mr3"> {$_('device.deviceName')}</span>
									<!-- <svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="#9eabb4"
									width="18px"
									height="18px"><path d="M0 0h24v24H0V0z" fill="none" />
									<path
										d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" /></svg> -->
								</div>
							</div>
							<div class="w-pg">{$_('device.physicalGrading')}</div>
							<div class="w-sta">{$_('device.status')}</div>
							<div class="w-ext" />
						</div>
					</div>
					{#each list as item}
						<PcModalSelectDeviceAccountItem
							{item}
							onSelect={() => handleSelectItem(item)} />
					{/each}
					<div class="br2 bl br br--bottom b--black-10">
						<div
							class="flex items-center ph5 ba b--black-10 bt-0 bl-0 br-0 f7 fw6
								gray pv4 ttu w-100 justify-between">
							<div />
							<PcPagination
								totalItems={countList}
								{offset}
								onPage={handlePage} />
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

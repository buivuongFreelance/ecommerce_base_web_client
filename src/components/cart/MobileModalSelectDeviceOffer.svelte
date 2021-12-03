<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import { fade } from 'svelte/transition';
	import { listAccountDevicesExclude as apiListAccountDevicesExclude } from '../../services/device';
	import { auth } from '../../stores';
	import ContentLoader from 'svelte-content-loader';
	import config from '../../config';
	import { onMount } from 'svelte';
	import MobilePaginationTwo from '../form/MobilePaginationTwo.svelte';
	import MobileModalSelectDeviceAccountItem from './MobileModalSelectDeviceAccountItem.svelte';

	const { session } = stores();
	const { domainDevice } = $session;

	export let onClose;
	export let onSelectItem;
	export let selectedExchangedDevices = [];
	export let listAdded = [];

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
				limit: config.limitMobile,
				filter,
				offset,
				exchangeIds,
			})
				.then((obj) => {
					isServerError = false;
					isLoading = false;
					list = obj.list;
					countList = obj.count;
				})
				.catch(() => {
					isServerError = true;
					isLoading = false;
				});
		});
	};

	const handlePage = async (page) => {
		offset = config.limitMobile * (page - 1);
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
</script>

<div class="fixed z-max w-90 wrapper" transition:fade>
	<div class="w-100 container flex flex-column">
		<div
			class="modal__header min-h-50px h-50-px flex items-center justify-between bg-light-gray
				b--pale-grey bb ph4 near-black fw5 f4 panel"
		>
			<div>{$_('message.selectItem')}</div>
			<div class="pointer flex items-center" on:click={onClose}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 0 24 24"
					fill="#7e8299"
					width="24"
					><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
					/></svg
				>
			</div>
		</div>
		<div class="ph1rem content flex-1 bg-white">
			<div class="w-100 center pt1rem">
				<h2 class="ttc f4">{$_('device.listDevice')}</h2>
				<div>
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
						<form autocomplete="off" on:submit|preventDefault={handleFilter}>
							<div class="flex">
								<input
									id="name"
									autocomplete="off"
									class="input-reset ba br2 br--left b--pale-grey pv3 pl4
										h-40-px w-filter"
									type="text"
									on:input={(e) => {
										if (e.target.value == '') handleClearFilter();
									}}
									bind:value={filter.deviceName}
									placeholder={$_('device.filterDeviceName')}
								/>
								<button
									type="submit"
									class="bg-blue b--transparent pointer h-40-px w2 w2 br2
										br--right flex items-center justify-center pa0"
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
								</button>
							</div>
						</form>
					{/if}
					<button
						on:click={() => goto('my-devices/add-device')}
						type="submit"
						class="bg-dark-blue b--transparent br2 ba f7 fw6 ttu white flex
							justify-center items-center pointer h-40-px w-create-device mt1rem"
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
			<div class="mv1rem">
				{#if isServerError}
					<p class="red f4">{$_('error.serverErrorMessage')}</p>
				{:else if isLoading}
					<ContentLoader
						width="800"
						height="40"
						uniqueKey="modalSelectDeviceOffer"
						primaryColor="#e4e6ef"
						secondaryColor="#f8f8f8"
					>
						<rect x="0" y="0" rx="5" ry="5" width="800" height="40" />
					</ContentLoader>
				{:else if list.length === 0}
					<div class="pb6 spacing-ext">{$_('message.noItems')}</div>
				{:else}
					<div class="br2 ba br--top b--black-10">
						<div class="flex items-center ph3 f7 fw6 gray ttu pv3">
							<div class="flex items-center">
								<span class="mr3"> {$_('device.deviceName')}</span>
							</div>
						</div>
					</div>
					{#each list as item}
						<MobileModalSelectDeviceAccountItem
							{item}
							onSelect={onSelectItem}
						/>
					{/each}
					<div class="flex items-center justify-center f7 fw6 gray ttu mt1rem">
						<MobilePaginationTwo
							totalItems={countList}
							{offset}
							onPage={handlePage}
						/>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.w-filter {
		width: 222px;
	}
	.w-create-device {
		width: 170px;
	}
	.wrapper {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		overflow: hidden;
		border-radius: 0.5rem;
		width: calc(100% - 30px);
		padding: 60px 0;
	}
	.container {
		height: calc(100vh - 120px);
	}
	.modal__header {
		border-top-left-radius: 0.5rem;
		border-top-right-radius: 0.5rem;
	}

	.panel {
		border-top-left-radius: 0.5rem;
		border-top-right-radius: 0.5rem;
	}
	.content {
		overflow: auto;
	}
	.w-filter {
		width: calc(100% - 40px);
	}
	.flex-1 {
		flex: 1;
	}
	.min-h-50px {
		min-height: 50px;
	}
</style>

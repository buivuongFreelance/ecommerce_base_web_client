<script>
	import { _ } from 'svelte-i18n';
	import { auth } from '../../stores';
	import { stores } from '@sapper/app';
	import ContentLoader from 'svelte-content-loader';
	import { listModelExclude as apilistModelExclude } from '../../services/model';
	import { addDeviceTag as apiAddDeviceTag } from '../../services/device';
	import config from '../../config';
	import LazyLoad from 'vanilla-lazyload';
	import MobilePaginationTwo from '../form/MobilePaginationTwo.svelte';

	const { session } = stores();
	const { domainModel, domainDevice } = $session;

	export let selectedBrand;
	export let onClose;
	export let listExclude;

	let isServerError = false;
	let isLoading = false;
	let offset = 0;
	let list = [];
	let countList = 0;
	let filter = {
		modelName: '',
		status: '',
		grade: '',
	};
	let containerEle;
	let observer;

	$: {
		if (selectedBrand.id) {
			offset = 0;
			listModel();
		}
	}

	const handleSelectItem = async (item) => {
		await addDeviceTag(item);
		onClose();
	};
	const addDeviceTag = (item) => {
		const token = $auth.accessToken;
		isLoading = true;
		return new Promise((resolve, reject) => {
			apiAddDeviceTag(domainDevice, {
				token,
				modelId: item.model_id,
			})
				.then(() => {
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
	const listModel = () => {
		isLoading = true;

		return new Promise((resolve, reject) => {
			apilistModelExclude(domainModel, {
				limit: config.limitMobile,
				offset,
				filter,
				brandId: selectedBrand.id,
				deviceTags: listExclude,
			})
				.then((items) => {
					isLoading = false;
					list = items.list;
					countList = items.count;
					isServerError = false;
					setTimeout(() => {
						observer = new LazyLoad({
							container: containerEle,
							elements_selector: '.lazy',
						});
						observer.update();
					}, 200);
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
		offset = config.limitMobile * (page - 1);
		await listModel();
	};

	const handleFilter = async () => {
		offset = 0;
		await listModel();
	};
</script>

<style>
	.w-filter {
		width: 300px;
	}
	.image {
		width: 130px;
		height: 180px;
		object-fit: cover;
	}
	.item {
		padding: 0 5px;
		flex-basis: 50%;
		max-width: 50%;
		cursor: pointer;
	}
</style>

{#if selectedBrand.id}
	{#if isServerError}
		<p class="red f4 mt5">{$_('error.serverErrorMessage')}</p>
	{:else if isLoading}
		<div class="pb5">
			<ContentLoader
				uniqueKey="modalListModel"
				primaryColor="#e4e6ef"
				secondaryColor="#f8f8f8"
				width={320}
				height="200">
				<rect x="0" y="0" rx="3" ry="3" width="300" height="40" />
				<rect x="0" y="60" rx="3" ry="3" width="300" height="20" />
				<rect x="0" y="100" rx="3" ry="3" width="300" height="20" />
				<rect x="0" y="140" rx="3" ry="3" width="300" height="20" />
				<rect x="0" y="180" rx="3" ry="3" width="300" height="20" />
			</ContentLoader>
		</div>
	{:else}
		<div bind:this={containerEle}>
			<form
				class="flex self-center"
				novalidate
				autocomplete="off"
				on:submit|preventDefault={handleFilter}>
				<input
					id="name"
					autocomplete="off"
					class="input-reset ba br2 br--left b--pale-grey pv3 pl4 h-40-px
						w-filter"
					type="text"
					bind:value={filter.modelName}
					placeholder={$_('device.filterDeviceName')} />
				<button
					type="submit"
					class="bg-blue b--transparent pointer h-40-px w2 br2 br--right flex
						items-center justify-center pa0">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="white"
						width="24px"
						height="24px">
						<path d="M0 0h24v24H0z" fill="none" />
						<path
							d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91
							13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59
							4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99
							5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
					</svg>
				</button>
			</form>
			<div class="mt4">
				<div class="f4 fw6 near-black">
					{$_('device.devices')}
					({countList})
				</div>
			</div>
			{#if list.length === 0}
				<p class="mt3 f4">{$_('message.noItems')}</p>
			{:else}
				<div class="mt3 flex flex-wrap">
					{#each list as item}
						<div class="item mb4" on:click={() => handleSelectItem(item)}>
							<div class="ba b--pale-grey br2">
								<div
									class="relative pa3 w-100 flex items-center justify-center">
									<img
										class="image lazy"
										src={'images/phone_default.png'}
										data-src={item.model_image_url}
										alt={item.model_name} />
								</div>
							</div>
							<div class="f7 fw5 tc mt3 ttc">{item.model_name}</div>
						</div>
					{/each}
				</div>
				<div class="flex justify-end">
					<MobilePaginationTwo
						totalItems={countList}
						{offset}
						onPage={handlePage} />
				</div>
			{/if}
		</div>
	{/if}
{/if}

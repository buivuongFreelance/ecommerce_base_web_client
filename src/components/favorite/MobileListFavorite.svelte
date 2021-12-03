<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { auth, anonymous } from '../../stores';
	import { listWishlist as apiListWishlist } from '../../services/device';
	import config from '../../config';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import MobileDeviceItem from '../device/MobileDeviceItem.svelte';
	import MobilePaginationTwo from '../form/MobilePaginationTwo.svelte';
	import MobilePagination from '../form/MobilePagination.svelte';

	const { session } = stores();
	const { domainDevice } = $session;

	let isServerError = false;
	let isLoading = false;
	let list = [];
	let offset = 0;
	let countList = 0;
	let loadingLoadMore = false;

	onMount(async () => {
		await listWishlist();
	});
	const listWishlistLoadmore = () => {
		loadingLoadMore = true;

		return new Promise((resolve, reject) => {
			loadingLoadMore = false;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiListWishlist(domainDevice, {
				limit: config.limitMobile,
				offset,
				token,
				anonymous: $anonymous,
			})
				.then((items) => {
					isLoading = false;
					list = items.list;
					list = [...list, ...items.list];
					isLoading = false;
					isServerError = false;
					resolve(items);
				})
				.catch((error) => {
					loadingLoadMore = false;
					isLoading = false;
					isServerError = true;
					reject(error);
				});
		});
	};
	const listWishlist = () => {
		isLoading = true;

		return new Promise((resolve, reject) => {
			isLoading = false;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiListWishlist(domainDevice, {
				limit: config.limitMobile,
				offset,
				token,
				anonymous: $anonymous,
			})
				.then((items) => {
					isLoading = false;
					list = items.list;
					countList = items.count;
					isLoading = false;
					isServerError = false;
					resolve(items);
				})
				.catch((error) => {
					isLoading = false;
					isLoading = false;
					isServerError = true;
					reject(error);
				});
		});
	};
	const handlePage = async (page) => {
		offset = config.limitMobile * (page - 1);
		await listWishlistLoadmore();
	};
</script>

{#if isServerError}
	<p class="red f4">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<div class="flex justify-center mv4">
		<ContentLoader width="1170">
			<rect x="0" y="0" rx="5" ry="5" width="1170" height="400" />
		</ContentLoader>
	</div>
{:else if list.length > 0}
	<div class="flex flex-wrap">
		{#each list as item}
			<div class="item mb5">
				<MobileDeviceItem {item} />
			</div>
		{/each}
	</div>
	<div class="flex justify-end">
		<MobilePagination
			loading={loadingLoadMore}
			totalItems={countList}
			{offset}
			onPage={handlePage}
		/>
	</div>
{:else}
	<div class="pb6 mt4 tc f4">{$_('message.noItems')}</div>
{/if}

<style>
	.item {
		padding: 0 5px;
		flex-basis: 50%;
		max-width: 50%;
		cursor: pointer;
	}
</style>

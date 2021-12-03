<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { auth, anonymous } from '../../stores';
	import { listWishlist as apiListWishlist } from '../../services/device';
	import config from '../../config';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import PcDeviceItem from '../device/PcDeviceItem.svelte';
	import PcPagination from '../form/PcPagination.svelte';

	const { session } = stores();
	const { domainDevice } = $session;

	let isServerError = false;
	let isLoading = false;
	let list = [];
	let offset = 0;
	let countList = 0;

	onMount(async () => {
		await listWishlist();
	});

	const listWishlist = () => {
		return new Promise((resolve, reject) => {
			isLoading = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiListWishlist(domainDevice, {
				limit: config.limit,
				offset,
				token,
				anonymous: $anonymous,
			})
				.then((items) => {
					list = items.list;
					countList = items.count;
					isLoading = false;
					isServerError = false;
					resolve(items);
				})
				.catch((error) => {
					isLoading = false;
					isServerError = true;
					reject(error);
				});
		});
	};
	const handlePage = async (page) => {
		offset = config.limit * (page - 1);
		await listWishlist();
	};
</script>

<style>
	.item {
		padding: 0 5px;
		flex-basis: 25%;
		max-width: 25%;
		cursor: pointer;
	}
</style>

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
				<PcDeviceItem {item} />
			</div>
		{/each}
	</div>
	<div class="flex justify-end">
		<PcPagination totalItems={countList} {offset} onPage={handlePage} />
	</div>
{:else}
	<div class="pb6 mt4 tc f4">{$_('message.noItems')}</div>
{/if}

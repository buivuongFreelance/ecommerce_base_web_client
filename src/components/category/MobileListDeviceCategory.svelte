<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import {
		auth,
		anonymous,
		searchValue,
		cartChanged,
		favoriteChanged,
	} from '../../stores';
	import { listSearch as apiListSearch } from '../../services/device';
	import { onMount, onDestroy } from 'svelte';
	import config from '../../config';
	import ContentLoader from 'svelte-content-loader';
	import PcPagination from '../form/PcPagination.svelte';
	import * as animateScroll from 'svelte-scrollto';
	import MobileDeviceItem from '../device/MobileDeviceItem.svelte';

	const { session } = stores();
	const { domainDevice } = $session;

	export let countList = 0;
	export let sort;
	export let selectedBrands = [];
	export let selectedGrades = [];
	export let selectedTypes = [];
	export let selectedColors = [];
	export let selectedCapacities = [];
	export let selectedRams = [];
	export let countFilter = 0;
	export let countClear = 0;
	export let countTag = 0;
	export let selectedDingtoiRating = [];

	let oldSort = { name: 'asc' };
	let oldTag = 0;
	let oldFilter = 0;
	let oldClear = 0;
	let oldSelectedDingtoiRating = null;

	$: {
		if (JSON.stringify(sort) !== JSON.stringify(oldSort)) {
			oldSort = Object.assign({}, sort);
			offset = 0;
			listSearch();
		} else if (countFilter !== oldFilter) {
			oldFilter = countFilter;
			offset = 0;
			listSearch();
		} else if (countClear !== oldClear) {
			oldClear = countClear;
			offset = 0;
			listSearch();
		} else if (countTag !== oldTag) {
			oldTag = countTag;
			offset = 0;
			listSearch();
		}

		// else if (
		// 	JSON.stringify(oldSelectedDingtoiRating) !==
		// 	JSON.stringify(selectedDingtoiRating)
		// ) {
		// 	oldSelectedDingtoiRating = Object.assign([], selectedDingtoiRating);
		// 	offset = 0;
		// 	listSearch();
		// }
	}

	let isLoading = false;
	let isServerError = false;
	let list = [];
	let offset = 0;

	let oldSearchValue;
	let mounted = false;

	const unsubscribeSearchValue = searchValue.subscribe((value) => {
		if (oldSearchValue !== value) {
			if (!value) {
				if (mounted) {
					listSearch();
				}
			}
			oldSearchValue = value;
		}
	});
	const unsubscribeCartChanged = cartChanged.subscribe(async (value) => {
		if (value) {
			if (mounted) {
				listSearch();
			}
		}
	});
	const unsubscribeFavoriteChanged = favoriteChanged.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					listSearch();
				}
			}
		}
	);
	onMount(async () => {
		if (countFilter === 0) {
			await listSearch();
			mounted = true;
		}
	});
	onDestroy(() => {
		unsubscribeSearchValue();
		unsubscribeFavoriteChanged();
		unsubscribeCartChanged();
	});

	const listSearch = () => {
		animateScroll.scrollToTop();
		isLoading = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiListSearch(domainDevice, {
				token,
				anonymous: $anonymous,
				limit: config.limit,
				offset: offset,
				sort,
				name: $searchValue,
				filter: {
					brands: selectedBrands,
					grades: selectedGrades,
					types: selectedTypes,
					colors: selectedColors,
					capacities: selectedCapacities,
					rams: selectedRams,
					dingtoiRating: selectedDingtoiRating,
				},
			})
				.then((obj) => {
					isLoading = false;
					isServerError = false;
					list = obj.list;
					countList = obj.count;
					resolve();
				})
				.catch(() => {
					isServerError = true;
					isLoading = false;
					reject();
				});
		});
	};
	const handlePage = async (page) => {
		offset = config.limit * (page - 1);
		await listSearch();
	};
</script>

{#if isServerError}
	<p class="mv4 red f5 tc">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<ContentLoader
		uniqueKey="category"
		primaryColor="#e4e6ef"
		secondaryColor="#f8f8f8"
		width={375}
		height="510"
	>
		<rect x="0" y="0" rx="3" ry="3" width="187" height="180" />
		<rect x="190" y="0" rx="3" ry="3" width="187" height="180" />

		<rect x="0" y="190" rx="3" ry="3" width="187" height="10" />
		<rect x="0" y="210" rx="3" ry="3" width="100" height="10" />
		<rect x="0" y="230" rx="3" ry="3" width="50" height="10" />
		<rect x="0" y="250" rx="3" ry="3" width="25" height="10" />

		<rect x="190" y="190" rx="3" ry="3" width="187" height="10" />
		<rect x="190" y="210" rx="3" ry="3" width="100" height="10" />
		<rect x="190" y="230" rx="3" ry="3" width="50" height="10" />
		<rect x="190" y="250" rx="3" ry="3" width="25" height="10" />

		<rect x="0" y="270" rx="3" ry="3" width="187" height="180" />
		<rect x="190" y="270" rx="3" ry="3" width="187" height="180" />

		<rect x="0" y="460" rx="3" ry="3" width="187" height="10" />
		<rect x="0" y="480" rx="3" ry="3" width="100" height="10" />
		<rect x="0" y="500" rx="3" ry="3" width="50" height="10" />
		<rect x="0" y="520" rx="3" ry="3" width="25" height="10" />

		<rect x="190" y="460" rx="3" ry="3" width="187" height="10" />
		<rect x="190" y="480" rx="3" ry="3" width="100" height="10" />
		<rect x="190" y="500" rx="3" ry="3" width="50" height="10" />
		<rect x="190" y="500" rx="3" ry="3" width="25" height="10" />
	</ContentLoader>
{:else if list.length === 0}
	<p class="tc mv4 fw5">{$_('message.noItems')}</p>
{:else}
	<div class="row flex flex-wrap">
		{#each list as item}
			<div class="item">
				<MobileDeviceItem {item} />
			</div>
		{/each}
	</div>
	<div class="flex justify-end mt1rem mr1rem">
		<PcPagination totalItems={countList} {offset} onPage={handlePage} />
	</div>
{/if}

<style>
	.item {
		width: calc(50% - 1px);
		margin-top: 2px;
	}
	.row {
		justify-content: space-between;
	}
</style>

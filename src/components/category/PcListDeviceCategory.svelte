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
	import { onDestroy, onMount } from 'svelte';
	import config from '../../config';
	import ContentLoader from 'svelte-content-loader';
	import PcDeviceItem from '../device/PcDeviceItem.svelte';
	import PcPagination from '../form/PcPagination.svelte';
	import * as animateScroll from 'svelte-scrollto';
	import PcServerError from '../error/PcServerError.svelte';

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
	export let selectedDingtoiRating = [];

	let oldSort = { name: 'asc' };
	let oldSelectedBrands = [];
	let oldSelectedGrades = [];
	let oldSelectedTypes = [];
	let oldSelectedColors = [];
	let oldSelectedCapacities = [];
	let oldSelectedRams = [];
	let oldSelectedDingtoiRating = null;

	$: {
		if (JSON.stringify(sort) !== JSON.stringify(oldSort)) {
			oldSort = Object.assign({}, sort);
			offset = 0;
			listSearch();
		} else if (
			JSON.stringify(oldSelectedBrands) !== JSON.stringify(selectedBrands)
		) {
			oldSelectedBrands = Object.assign([], selectedBrands);
			offset = 0;
			listSearch();
		} else if (
			JSON.stringify(oldSelectedGrades) !== JSON.stringify(selectedGrades)
		) {
			oldSelectedGrades = Object.assign([], selectedGrades);
			offset = 0;
			listSearch();
		} else if (
			JSON.stringify(oldSelectedTypes) !== JSON.stringify(selectedTypes)
		) {
			oldSelectedTypes = Object.assign([], selectedTypes);
			offset = 0;
			listSearch();
		} else if (
			JSON.stringify(oldSelectedColors) !== JSON.stringify(selectedColors)
		) {
			oldSelectedColors = Object.assign([], selectedColors);
			offset = 0;
			listSearch();
		} else if (
			JSON.stringify(oldSelectedCapacities) !==
			JSON.stringify(selectedCapacities)
		) {
			oldSelectedCapacities = Object.assign([], selectedCapacities);
			offset = 0;
			listSearch();
		} else if (
			JSON.stringify(oldSelectedRams) !== JSON.stringify(selectedRams)
		) {
			oldSelectedRams = Object.assign([], selectedRams);
			offset = 0;
			listSearch();
		} else if (
			JSON.stringify(oldSelectedDingtoiRating) !==
			JSON.stringify(selectedDingtoiRating)
		) {
			oldSelectedDingtoiRating = Object.assign([], selectedDingtoiRating);
			offset = 0;
			listSearch();
		}
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
		await listSearch();
		mounted = true;
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
	<!-- <p class="mv4 red f5">{$_('error.serverErrorMessage')}</p> -->
	<div class="w-90 center">
		<PcServerError />
	</div>
{:else if isLoading}
	<ContentLoader
		uniqueKey="category"
		primaryColor="#e4e6ef"
		secondaryColor="#f8f8f8"
		width={870}
		height="1230"
	>
		<rect x="0" y="0" rx="3" ry="3" width="202" height="364" />
		<rect x="222" y="0" rx="3" ry="3" width="202" height="364" />
		<rect x="444" y="0" rx="3" ry="3" width="202" height="364" />
		<rect x="666" y="0" rx="3" ry="3" width="202" height="364" />

		<rect x="0" y="384" rx="3" ry="3" width="202" height="364" />
		<rect x="222" y="384" rx="3" ry="3" width="202" height="364" />
		<rect x="444" y="384" rx="3" ry="3" width="202" height="364" />
		<rect x="666" y="384" rx="3" ry="3" width="202" height="364" />

		<rect x="0" y="768" rx="3" ry="3" width="202" height="364" />
		<rect x="222" y="768" rx="3" ry="3" width="202" height="364" />
		<rect x="444" y="768" rx="3" ry="3" width="202" height="364" />
		<rect x="666" y="768" rx="3" ry="3" width="202" height="364" />
	</ContentLoader>
{:else if list.length === 0}
	<p class="tc mv4 fw5">{$_('message.noItems')}</p>
{:else}
	<div class="row flex flex-wrap">
		{#each list as item}
			<div class="item pl4 mb4">
				<PcDeviceItem {item} />
			</div>
		{/each}
	</div>
	<div class="flex justify-end">
		<PcPagination totalItems={countList} {offset} onPage={handlePage} />
	</div>
{/if}

<style>
	.item {
		width: calc(100% / 4);
	}
	.row {
		margin-left: -20px;
	}
</style>

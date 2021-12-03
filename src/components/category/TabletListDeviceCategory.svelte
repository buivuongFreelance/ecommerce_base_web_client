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
	export let selectedDingtoiRating = [];
	export let countFilter = 0;
	export let countClear = 0;
	export let countTag = 0;
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
		} else if (countFilter > 0) {
			offset = 0;
			listSearch();
		} else if (countClear > 0) {
			offset = 0;
			listSearch();
		} else if (countTag > 0) {
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
	<p class="mv4 red f5">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<ContentLoader
		uniqueKey="category"
		primaryColor="#e4e6ef"
		secondaryColor="#f8f8f8"
		width="768"
		height="710"
	>
		<rect x="0" y="0" width="240" height="240" />
		<rect x="250" y="0" width="240" height="240" />
		<rect x="500" y="0" width="240" height="240" />

		<rect x="0" y="250" width="240" height="10" />
		<rect x="0" y="270" width="200" height="10" />
		<rect x="0" y="290" width="180" height="10" />
		<rect x="0" y="310" width="220" height="10" />
		<rect x="0" y="330" width="100" height="10" />
		<rect x="0" y="350" width="150" height="10" />

		<rect x="250" y="250" width="240" height="10" />
		<rect x="250" y="270" width="200" height="10" />
		<rect x="250" y="290" width="180" height="10" />
		<rect x="250" y="310" width="220" height="10" />
		<rect x="250" y="330" width="100" height="10" />
		<rect x="250" y="350" width="150" height="10" />

		<rect x="500" y="250" width="240" height="10" />
		<rect x="500" y="270" width="200" height="10" />
		<rect x="500" y="290" width="180" height="10" />
		<rect x="500" y="310" width="220" height="10" />
		<rect x="500" y="330" width="100" height="10" />
		<rect x="500" y="350" width="150" height="10" />
		<!--  -->
		<rect x="0" y="370" width="240" height="240" />
		<rect x="250" y="370" width="240" height="240" />
		<rect x="500" y="370" width="240" height="240" />

		<rect x="0" y="620" width="240" height="10" />
		<rect x="0" y="640" width="200" height="10" />
		<rect x="0" y="660" width="180" height="10" />
		<rect x="0" y="680" width="220" height="10" />
		<rect x="0" y="700" width="100" height="10" />
		<rect x="0" y="720" width="150" height="10" />

		<rect x="250" y="620" width="240" height="10" />
		<rect x="250" y="640" width="200" height="10" />
		<rect x="250" y="660" width="180" height="10" />
		<rect x="250" y="680" width="220" height="10" />
		<rect x="250" y="700" width="100" height="10" />
		<rect x="250" y="720" width="150" height="10" />

		<rect x="500" y="620" width="240" height="10" />
		<rect x="500" y="640" width="200" height="10" />
		<rect x="500" y="660" width="180" height="10" />
		<rect x="500" y="680" width="220" height="10" />
		<rect x="500" y="700" width="100" height="10" />
		<rect x="500" y="720" width="150" height="10" />
	</ContentLoader>
{:else if list.length === 0}
	<p class="tc mv4 fw5">{$_('message.noItems')}</p>
{:else}
	<div class="row flex flex-wrap">
		{#each list as item}
			<div class="item pl1rem mb1rem">
				<MobileDeviceItem {item} />
			</div>
		{/each}
	</div>
	<div class="flex justify-end">
		<PcPagination totalItems={countList} {offset} onPage={handlePage} />
	</div>
{/if}

<style>
	.item {
		width: calc(100% / 3);
	}
	.row {
		margin-left: -1rem;
	}
</style>

<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import {
		auth,
		anonymous,
		linkToBack,
		cartChanged,
		favoriteChanged,
	} from '../../stores';
	import { newList as apiListSearch } from '../../services/device';
	import { onDestroy, onMount } from 'svelte';
	import config from '../../config';
	import ContentLoader from 'svelte-content-loader';
	import PcDeviceItem from '../device/PcDeviceItem.svelte';
	import Swiper, { Navigation, Autoplay } from 'swiper';
	import 'swiper/swiper-bundle.css';
	import PcServerError from '../error/PcServerError.svelte';
	Swiper.use([Navigation, Autoplay]);

	const { session, page } = stores();
	const { domainDevice } = $session;

	export let countList = 0;
	let sort = {
		name: 'asc',
	};
	export let selectedBrands = [];
	export let selectedTypes = [];
	export let isLoadingTag = false;
	let oldSelectedBrands = [];

	let oldSelectedTypes = [];

	$: {
		if (JSON.stringify(oldSelectedBrands) !== JSON.stringify(selectedBrands)) {
			oldSelectedBrands = Object.assign([], selectedBrands);
			offset = 0;
			listSearch();
		} else if (
			JSON.stringify(oldSelectedTypes) !== JSON.stringify(selectedTypes)
		) {
			oldSelectedTypes = Object.assign([], selectedTypes);
			offset = 0;
			listSearch();
		}
	}

	let isLoading = false;
	let isServerError = false;
	let list = [];
	let offset = 0;

	let swiper;
	let rootElem;
	let nextElem;
	let prevElem;

	const unsubscribeCartChanged = cartChanged.subscribe(async (value) => {
		if (value) {
			if (swiper) {
				listSearch();
			}
		}
	});

	const unsubscribeFavoriteChanged = favoriteChanged.subscribe(
		async (value) => {
			if (value) {
				if (swiper) {
					listSearch();
				}
			}
		}
	);

	onMount(async () => {
		try {
			await listSearch();
		} catch (error) {}
	});

	onDestroy(() => {
		unsubscribeCartChanged();
		unsubscribeFavoriteChanged();
	});

	const listSearch = () => {
		if (swiper) {
			//swiper.destroy();
			swiper = null;
		}
		isLoading = true;
		isLoadingTag = true;
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
				filter: {
					brands: selectedBrands,
					grades: [],
					types: selectedTypes,
					colors: [],
					capacities: [],
					rams: [],
				},
			})
				.then((obj) => {
					isLoading = false;
					isServerError = false;
					list = obj.list;
					countList = obj.count;
					if (list.length > 0) {
						setTimeout(() => {
							swiper = new Swiper(rootElem, {
								slidesPerView: 5,
								slidesPerColumn: 3,
								slidesPerColumnFill: 'row',
								spaceBetween: 20,
								navigation: {
									nextEl: nextElem,
									prevEl: prevElem,
								},
								autoplay: {
									delay: 5000,
								},
							});
							setTimeout(() => {
								isLoadingTag = false;
							}, 300);
						}, 500);
					} else {
						isLoadingTag = false;
					}
					resolve();
				})
				.catch(() => {
					isServerError = true;
					isLoading = false;
					isLoadingTag = false;
					reject();
				});
		});
	};
</script>

{#if isServerError}
	<PcServerError />
{:else if isLoading}
	<ContentLoader
		uniqueKey="category"
		primaryColor="#e4e6ef"
		secondaryColor="#f8f8f8"
		width={1170}
		height="400"
	>
		<rect x="0" y="0" rx="3" ry="3" width="222" height="364" />
		<rect x="237" y="0" rx="3" ry="3" width="222" height="364" />
		<rect x="474" y="0" rx="3" ry="3" width="222" height="364" />
		<rect x="711" y="0" rx="3" ry="3" width="222" height="364" />
		<rect x="948" y="0" rx="3" ry="3" width="222" height="364" />
	</ContentLoader>
{:else if list.length === 0}
	<h4 class="tc mv4 fw5">{$_('message.noItems')}</h4>
{:else}
	<div class="custom">
		<div class="swiper-container" bind:this={rootElem}>
			<div class="swiper-wrapper">
				{#each list as item}
					<div class="swiper-slide">
						{#if !swiper}
							<div style="width:20%">
								<PcDeviceItem {item} />
							</div>
						{:else}
							<PcDeviceItem {item} />
						{/if}
					</div>
				{/each}
			</div>
		</div>
		<div class="flex justify-center mt4">
			<div class="swiper-button-prev mr3" bind:this={prevElem} />
			<div class="swiper-button-next" bind:this={nextElem} />
		</div>
	</div>
{/if}

<style>
	.custom :global(.swiper-button-prev) {
		z-index: 1;
		position: static;
		width: 40px;
		height: 40px;
		border-radius: 2px;
		border: 1px solid black;
		margin-top: initial;
	}
	.custom :global(.swiper-button-next) {
		z-index: 1;
		position: static;
		width: 40px;
		height: 40px;
		border-radius: 2px;
		border: 1px solid black;
		margin-top: initial;
	}
	.custom :global(.swiper-button-prev:after) {
		font-size: 16px;
		color: #3f4254;
	}
	.custom :global(.swiper-button-next:after) {
		font-size: 16px;
		color: #3f4254;
	}
</style>

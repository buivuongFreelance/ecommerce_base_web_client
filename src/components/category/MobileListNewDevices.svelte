<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { auth, anonymous, cartChanged, favoriteChanged } from '../../stores';
	import { newList as apiListSearch } from '../../services/device';
	import { onMount, onDestroy } from 'svelte';
	import config from '../../config';
	import ContentLoader from 'svelte-content-loader';
	import Swiper, { Navigation, Autoplay } from 'swiper';
	import 'swiper/swiper-bundle.css';
	import MobileDeviceItem from '../device/MobileDeviceItem.svelte';
	Swiper.use([Navigation, Autoplay]);

	const { session } = stores();
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
			swiper.destroy();
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
								slidesPerView: 2,
								slidesPerColumn: 3,
								slidesPerColumnFill: 'row',
								spaceBetween: 2,
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
	<p class="mv4 red f5">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<ContentLoader
		uniqueKey="category"
		primaryColor="#e4e6ef"
		secondaryColor="#f8f8f8"
		width="375"
		height="265"
	>
		<rect x="0" y="0" width="185" height="200" />
		<rect x="190" y="0" width="185" height="200" />

		<rect x="0" y="210" width="185" height="10" />
		<rect x="0" y="225" width="120" height="10" />
		<rect x="0" y="240" width="90" height="10" />
		<rect x="0" y="255" width="140" height="10" />

		<rect x="190" y="210" width="185" height="10" />
		<rect x="190" y="225" width="120" height="10" />
		<rect x="190" y="240" width="90" height="10" />
		<rect x="190" y="255" width="140" height="10" />
	</ContentLoader>
{:else if list.length === 0}
	<p class="tc mv4 fw5">{$_('message.noItems')}</p>
{:else}
	<div class="custom">
		<div class="swiper-container" bind:this={rootElem}>
			<div class="swiper-wrapper">
				{#each list as item}
					<div class="swiper-slide">
						{#if !swiper}
							<div style="width:50%">
								<MobileDeviceItem {item} />
							</div>
						{:else}
							<MobileDeviceItem {item} />
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

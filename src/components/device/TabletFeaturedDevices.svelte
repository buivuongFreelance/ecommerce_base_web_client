<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { onDestroy, onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import Swiper, { Navigation, Autoplay } from 'swiper';
	import 'swiper/swiper-bundle.css';
	import PcDeviceItem from './PcDeviceItem.svelte';
	import { listFeaturedDevices as apiList } from '../../services/device';
	import { auth, anonymous } from '../../stores';
	Swiper.use([Navigation, Autoplay]);

	const { session } = stores();
	const { domainDevice } = $session;

	let isServerError = false;
	let isLoading = false;
	let swiper;
	let list = [];

	let rootElem;
	let nextElem;
	let prevElem;

	let limit = 10;

	onMount(async () => {
		try {
			list = await listFeatured();
			if (list.length > 0) {
				setTimeout(() => {
					swiper = new Swiper(rootElem, {
						slidesPerView: 3,
						spaceBetween: 15,
						navigation: {
							nextEl: nextElem,
							prevEl: prevElem,
						},
						autoplay: {
							delay: 5000,
						},
					});
				}, 500);
			}
		} catch (error) {}
	});

	onDestroy(() => {
		if (swiper) {
			swiper.destroy();
		}
	});

	const listFeatured = () => {
		return new Promise((resolve, reject) => {
			isLoading = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiList(domainDevice, { limit, token, anonymous: $anonymous })
				.then((obj) => {
					isServerError = false;
					isLoading = false;
					resolve(obj);
				})
				.catch((error) => {
					isServerError = true;
					isLoading = false;
					reject(error);
				});
		});
	};
</script>

<style>
	.custom :global(.swiper-button-prev) {
		width: 60px;
		height: 60px;
		border-radius: 5px;
		border: 1px solid black;
	}
	.custom :global(.swiper-button-next) {
		width: 60px;
		height: 60px;
		border-radius: 5px;
		border: 1px solid #e0e6ef;
	}
	.custom :global(.swiper-button-prev:after) {
		font-size: 24px;
		color: #3f4254;
	}
	.custom :global(.swiper-button-next:after) {
		font-size: 24px;
		color: #3f4254;
	}
</style>

<div class="custom">
	<h2 class="u tc mb5 ttu">{$_('home.featuredDevices')}</h2>
	{#if isServerError}
		<p class="red f4 tc">{$_('error.serverErrorMessage')}</p>
	{:else if !isLoading}
		{#if list.length === 0}
			<p class="tc f4">{$_('message.noItems')}</p>
		{:else}
			<div class="swiper-container" bind:this={rootElem}>
				<div class="swiper-wrapper">
					{#each list as item}
						<div class="swiper-slide">
							<PcDeviceItem {item} />
						</div>
					{/each}
				</div>
				<div class="swiper-button-next" bind:this={nextElem} />
				<div class="swiper-button-prev" bind:this={prevElem} />
			</div>
		{/if}
	{:else}
		<div class="flex justify-center mv4">
			<ContentLoader width="768" uniqueKey="featuredDevices">
				<rect x="0" y="0" rx="5" ry="5" width="768" height="1024" />
			</ContentLoader>
		</div>
	{/if}
</div>

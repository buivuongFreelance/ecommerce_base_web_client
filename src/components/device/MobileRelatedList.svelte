<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { onDestroy, onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import Swiper, { Navigation, Autoplay } from 'swiper';

	import { relatedList } from '../../services/device';
	import { auth, anonymous } from '../../stores';
	import 'swiper/swiper-bundle.css';
	import MobileDeviceItem from './MobileDeviceItem.svelte';

	Swiper.use([Navigation, Autoplay]);

	const { session } = stores();
	const { domainDevice } = $session;

	export let detail = null;

	let isServerError = false;
	let isLoading = false;

	let rootElem;
	let swiper;
	let nextElem;
	let prevElem;
	let list = [];
	let limit = 10;

	onMount(async () => {
		let { id, brand_name } = detail;
		try {
			list = await listRelated(id, limit, brand_name);
			if (list.length > 0) {
				setTimeout(() => {
					swiper = new Swiper(rootElem, {
						slidesPerView: 2,
						spaceBetween: 2,
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

	const listRelated = (id, limit, brand) => {
		return new Promise((resolve, reject) => {
			isLoading = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			relatedList(domainDevice, {
				id,
				limit,
				brand,
				token,
				anonymous: $anonymous,
			})
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

<div class="custom">
	<h3 class="u mb5 tc ttc ph1rem">
		{$_('deviceDetail.sponsoredProductsRelatedToThisItem')}
	</h3>
	{#if isServerError}
		<p class="red f4 ph1rem">{$_('error.serverErrorMessage')}</p>
	{:else if isLoading}
		<div class="flex justify-center mv4 ph1rem">
			<ContentLoader width="375" uniqueKey="product-relative">
				<rect x="0" y="0" rx="5" ry="5" width="375" height="400" />
			</ContentLoader>
		</div>
	{:else if list.length === 0}
		<p class="tc f4 ph1rem">{$_('message.noItems')}</p>
	{:else}
		<div class="swiper-container" bind:this={rootElem}>
			<div class="swiper-wrapper">
				{#each list as item}
					<div class="swiper-slide">
						<MobileDeviceItem {item} />
					</div>
				{/each}
			</div>
		</div>
		<div class="flex justify-center mt4">
			<div class="swiper-button-prev mr3" bind:this={prevElem} />
			<div class="swiper-button-next" bind:this={nextElem} />
		</div>
	{/if}
</div>

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

<script>
	import { _ } from 'svelte-i18n';
	import { onDestroy, onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import Swiper, { Thumbs } from 'swiper';
	import 'swiper/swiper-bundle.css';
	import PcGallery from '../form/PcGallery.svelte';

	Swiper.use([Thumbs]);

	export let images = [];

	let rootElem;
	let thumbElem;

	let swiperThumb;
	let swiper;

	let currentIndex = 0;

	let isOpenGallery = false;

	let visible = false;

	onMount(() => {
		visible = true;
		setTimeout(() => {
			if (visible) {
				swiperThumb = new Swiper(thumbElem, {
					spaceBetween: 10,
					slidesPerView: 5,
					freeMode: true,
					watchSlidesVisibility: true,
					watchSlidesProgress: true,
				});
				swiper = new Swiper(rootElem, {
					thumbs: {
						swiper: swiperThumb,
					},
					on: {
						click: (swiper) => {
							currentIndex = swiper.activeIndex;
							isOpenGallery = true;
						},
					},
				});
			}
		}, 500);
	});

	onDestroy(() => {
		if (swiperThumb) swiperThumb.destroy();
		if (swiper) swiper.destroy();
	});
</script>

<style>
	.top-image {
		width: 300px;
		height: 400px;
		object-fit: cover;
	}
	.thumb-image {
		width: 60px !important;
		height: 80px !important;
		object-fit: cover;
	}
	.custom-thumb :global(.swiper-slide-thumb-active) {
		border: 1px solid #3699ff !important;
		border-radius: 5px;
	}
</style>

{#if visible}
	{#if isOpenGallery}
		<PcGallery
			{currentIndex}
			{images}
			onClose={() => (isOpenGallery = false)} />
	{/if}
	<div class="b--light-gray br2 ba bw2 pa3">
		<div class="custom">
			<div class="swiper-container" bind:this={rootElem}>
				<div class="swiper-wrapper">
					{#each images as image}
						<div class="swiper-slide">
							<div class="flex items-center justify-center item">
								<img src={image.url} alt="no" class="top-image" />
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<div class="custom-thumb mt4">
		<div class="swiper-container" bind:this={thumbElem}>
			<div class="swiper-wrapper">
				{#each images as image}
					<div class="swiper-slide">
						<div
							class="flex items-center justify-center b--light-gray br2 ba pa1
								bw1">
							<img src={image.url} alt="no" class="thumb-image" />
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{:else}
	<div class="flex justify-center mv4">
		<ContentLoader width="400" uniqueKey="slider-detail">
			<rect x="0" y="0" rx="5" ry="5" width="400" height="400" />
		</ContentLoader>
	</div>
{/if}

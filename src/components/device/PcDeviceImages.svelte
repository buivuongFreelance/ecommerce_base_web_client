<script>
	import { _ } from 'svelte-i18n';
	import { onDestroy, onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import Swiper, { Thumbs } from 'swiper';
	import 'swiper/swiper-bundle.css';
	import ImageZoom from '../../helper/zoom';
	import PcGallery from '../form/PcGallery.svelte';

	Swiper.use([Thumbs]);

	export let images = [];

	let rootElem;
	let thumbElem;
	let zoomEle;

	let swiperThumb;
	let swiper;
	let zoom;

	let currentIndex = 0;

	let isOpenGallery = false;

	let visible = false;

	const options = {
		zoomWidth: 250,
		zoomHeight: 250,
		zoomLensStyle: 'background:white;opacity:0.4;z-index:1;',
		zoomStyle: 'z-index:999',
		offset: { vertical: -12, horizontal: 20 },
		swiper: true,
		onClick: () => {
			isOpenGallery = true;
		},
	};

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
						slideChange: (swiper) => {
							currentIndex = swiper.activeIndex;
							if (zoom) {
								zoom.kill();
								zoom = null;
							}
							setTimeout(() => {
								const addOptions = {
									height: document.querySelector('.swiper-slide-active img')
										.clientHeight,
									width: document.querySelector('.swiper-slide-active img')
										.clientWidth,
								};
								zoom = new ImageZoom(zoomEle, { ...options, ...addOptions });
							}, 300);
						},
					},
				});
			}
			setTimeout(() => {
				zoom = new ImageZoom(zoomEle, options);
			}, 400);
		}, 500);
	});

	onDestroy(() => {
		if (swiperThumb) swiperThumb.destroy();
		if (swiper) swiper.destroy();
		if (zoom) zoom.kill();
	});
</script>

<style>
	.top-image {
		width: 300px;
		height: auto;
	}
	.thumb-image {
		width: 60px !important;
		height: 80px !important;
		object-fit: cover;
	}
	.custom-thumb :global(.swiper-slide-thumb-active) {
		border-color: #3699ff !important;
	}
</style>

{#if visible}
	{#if isOpenGallery}
		<PcGallery
			{currentIndex}
			{images}
			onClose={() => (isOpenGallery = false)} />
	{/if}
	<div class="ba b--light-gray br2">
		<div class="custom" bind:this={zoomEle}>
			<div class="swiper-container" bind:this={rootElem}>
				<div class="swiper-wrapper">
					{#each images as image}
						<div class="swiper-slide">
							<div class="flex items-center justify-center item">
								<img src={image.url} alt="no" class="top-image br2" />
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
					<div class="swiper-slide b--light-gray br2 ba bw1">
						<div class="flex items-center justify-center pa1">
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

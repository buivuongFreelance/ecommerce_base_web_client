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

{#if visible}
	{#if isOpenGallery}
		<PcGallery
			{currentIndex}
			{images}
			onClose={() => (isOpenGallery = false)}
		/>
	{/if}
	<div class="br3">
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

	<div class="custom-thumb mt3">
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
		<ContentLoader width="345" uniqueKey="slider-detail">
			<rect x="0" y="0" rx="5" ry="5" width="345" height="400" />
		</ContentLoader>
	</div>
{/if}

<style>
	.top-image {
		width: 100%;
		height: 300px;
		object-fit: contain;
		border-radius: 3px;
	}
	.thumb-image {
		width: 50px;
		height: 50px;
		object-fit: cover;
	}
	.custom-thumb :global(.swiper-slide-thumb-active) {
		border-color: #3699ff !important;
	}
</style>

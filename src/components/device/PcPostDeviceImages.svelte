<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import Swiper, { Thumbs } from 'swiper';
	import 'swiper/swiper-bundle.css';
	Swiper.use([Thumbs]);

	export let images = [];

	let rootElem;
	let thumbElem;

	let swiperThumb;

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
				new Swiper(rootElem, {
					thumbs: {
						swiper: swiperThumb,
					},
				});
			}
		}, 500);
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
		border-color: #3699ff !important;
	}
</style>

{#if visible}
	<div class="custom">
		<div class="swiper-container" bind:this={rootElem}>
			<div class="swiper-wrapper">
				{#each images as image}
					<div class="swiper-slide">
						<div
							class="flex items-center justify-center item b--light-gray
								b--dashed br3 ba bw2 pa3">
							<img src={image.url} alt="no" class="top-image" />
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div class="custom-thumb mt4">
		<div class="swiper-container" bind:this={thumbElem}>
			<div class="swiper-wrapper">
				{#each images as image}
					<div class="swiper-slide b--light-gray br2 ba	bw1">
						<div class="flex items-center justify-center pa1
								">
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

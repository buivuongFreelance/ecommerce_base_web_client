<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';

	import { fade } from 'svelte/transition';
	import ContentLoader from 'svelte-content-loader';
	import Swiper, { Navigation, Autoplay, Lazy } from 'swiper';
	import 'swiper/swiper-bundle.css';
	Swiper.use([Navigation, Autoplay, Lazy]);

	let rootElem;
	let nextElem;
	let prevElem;
	let swiper;
	let visible = false;

	onMount(() => {
		visible = true;
		setTimeout(() => {
			if (visible) {
				swiper = new Swiper(rootElem, {
					speed: 400,
					preloadImages: false,
					lazy: {
						elementClass: 'swiper-lazy',
						preloaderClass: 'swiper-lazy-preloader',
					},
					navigation: {
						nextEl: nextElem,
						prevEl: prevElem,
					},
					autoplay: {
						delay: 2500,
						// disableOnInteraction: true,
					},
				});
			}
		}, 500);
		/*if (height > 0) {

		}*/
	});
</script>

{#if visible}
	<div class="custom">
		<div
			class="swiper-container"
			bind:this={rootElem}
			transition:fade
			style="height: 300px;"
		>
			<div class="swiper-wrapper">
				<div class="swiper-slide">
					<img
						data-src="images/bg_slideshow4.jpeg"
						alt=""
						class="swiper-lazy"
					/>
					<div class="swiper-lazy-preloader" />
					<div class="slide-container">
						<div class="slide-content">
							<div class="slide-text">
								<h2 class="slide-title dark-blue mb3">
									{$_('banner.beSavvyAndSwapIt')}
								</h2>
								<h3 class="slide-subtitle near-black mb3 ">
									{$_('banner.theDingtoiScanner')}
								</h3>
								<h6 class="mb3 fw4 ttu">{$_('home.downloadTheAppNow')}</h6>
								<div class="downloads flex">
									<a
										href="https://apps.apple.com/ca/app/id1524735381"
										class=" pointer grow mr3"
									>
										<img
											src="images/download_scan_ios.png"
											alt="download_scan_ios"
											class="h-40-px "
										/>
									</a>
									<a
										href="https://play.google.com/store/apps/details?id=com.dingtoi.dingtoimc"
										class=" pointer grow"
									>
										<img
											src="images/download_scan_android.png"
											alt="download_scan_android"
											class="h-40-px"
										/>
									</a>
								</div>
							</div>
						</div>
						<div class="slide-image flex justify-end items-end h-100 pt5">
							<!-- <img
								class="h-100"
								src="images/slideshow4_mobile.png"
								alt="slideshow4_mobile" /> -->
						</div>
					</div>
				</div>
				<div class="swiper-slide">
					<img
						data-src="images/bg_slideshow2.jpeg"
						alt=""
						class="swiper-lazy"
					/>
					<div class="swiper-lazy-preloader" />
					<div class="slide-container">
						<div class="slide-content">
							<div class="slide-text">
								<h2 class="slide-title dark-blue mb3">
									{$_('banner.newIsOverrated')}
								</h2>
								<h4 class="slide-subtitle mb3">
									{$_('banner.buyASecondHandPhoneWithConfidence')}
								</h4>
								<h6 class="mb3 fw4 ttu">{$_('home.downloadTheAppNow')}</h6>
								<div class="downloads flex">
									<a
										href="https://apps.apple.com/ca/app/id1524735381"
										class=" pointer grow mr3"
									>
										<img
											src="images/download_scan_ios.png"
											alt="download_scan_ios"
											class="h-40-px "
										/>
									</a>
									<a
										href="https://play.google.com/store/apps/details?id=com.dingtoi.dingtoimc"
										class=" pointer grow"
									>
										<img
											src="images/download_scan_android.png"
											alt="download_scan_android"
											class="h-40-px"
										/>
									</a>
								</div>
							</div>
						</div>
						<div class="slide-image flex justify-end items-end h-100 pt5">
							<!-- <img
								class="h-100"
								src="images/slideshow2_mobile.png"
								alt="slideshow2_mobile" /> -->
						</div>
					</div>
				</div>
				<div class="swiper-slide">
					<img
						data-src="images/bg_slideshow1.jpeg"
						alt=""
						class="swiper-lazy"
					/>
					<div class="swiper-lazy-preloader" />
					<div class="slide-container">
						<div class="slide-content">
							<div class="slide-text">
								<h2 class="slide-title dark-blue mb3">
									{$_('banner.noSurprisesNoHassles')}
								</h2>
								<h4 class="slide-subtitle mb3">
									{$_('banner.dingtoiMakesItEasyToTradeYourPhone')}
								</h4>
								<h6 class="mb3 fw4 ttu">{$_('home.downloadTheAppNow')}</h6>
								<div class="downloads flex">
									<a
										href="https://apps.apple.com/ca/app/id1524735381"
										class=" pointer grow mr3"
									>
										<img
											src="images/download_scan_ios.png"
											alt="download_scan_ios"
											class="h-40-px "
										/>
									</a>
									<a
										href="https://play.google.com/store/apps/details?id=com.dingtoi.dingtoimc"
										class=" pointer grow"
									>
										<img
											src="images/download_scan_android.png"
											alt="download_scan_android"
											class="h-40-px"
										/>
									</a>
								</div>
							</div>
						</div>
						<div class="slide-image flex justify-end items-end h-100 pt5">
							<!-- <img
								class="h-100"
								src="images/slideshow3_mobile.png"
								alt="slideshow3_mobile" /> -->
						</div>
					</div>
				</div>
			</div>
			<div class="swiper-button-next" bind:this={nextElem} />
			<div class="swiper-button-prev" bind:this={prevElem} />
		</div>
	</div>
{:else}
	<div class="flex justify-center mv4">
		<ContentLoader width="768" uniqueKey="slideshow">
			<rect x="0" y="0" rx="5" ry="5" width="768" height="1024" />
		</ContentLoader>
	</div>
{/if}

<style>
	.slide-text {
		margin-left: 40px;
	}
	.custom :global(.swiper-slide) {
		position: relative;
	}
	.swiper-slide > img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		/* height: 100%; */
		display: block;
		object-fit: cover;
	}
	.slide-container {
		height: 100%;
		margin: 0 auto;
		position: relative;
		display: flex;
		align-items: center;
	}
	.slide-content,
	.slide-image {
		flex: 1;
	}
	.slide-image {
		height: 100%;
		display: flex;
		align-items: flex-end;
	}

	.slide-title,
	.slide-subtitle {
		text-transform: uppercase;
	}
	.slide-subtitle {
		letter-spacing: 1px;
		font-weight: 600;
	}
	.custom :global(.slide-button) {
		min-width: 150px;
	}

	.custom :global(.swiper-button-prev) {
		width: 50px;
		height: 50px;
		border-radius: 5px;
		border: 1px solid #3f4254;
	}
	.custom :global(.swiper-button-next) {
		width: 50px;
		height: 50px;
		border-radius: 5px;
		border: 1px solid #3f4254;
	}
	.custom :global(.swiper-button-prev:after) {
		font-size: 24px;
		color: #3f4254;
	}

	.custom :global(.swiper-button-next:after) {
		font-size: 24px;
		color: #3f4254;
	}

	.slide-title,
	.slide-subtitle {
		font-family: 'Montserrat', sans-serif;
	}
	.slide-title {
		font-weight: bold;
		line-height: 52px;
		font-size: 40px;
		letter-spacing: 1px;
	}
	.slide-subtitle {
		font-size: 16px;
		line-height: 28px;
	}
</style>

<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';

	import { fade } from 'svelte/transition';
	import ContentLoader from 'svelte-content-loader';
	import Swiper, { Navigation, Autoplay } from 'swiper';
	import 'swiper/swiper-bundle.css';
	Swiper.use([Navigation, Autoplay]);

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
			style="height: 600px;"
			bind:this={rootElem}
			transition:fade
		>
			<div class="swiper-wrapper">
				<div class="swiper-slide">
					<img src="images/bg_slideshow.jpg" alt="bg_slideshow" />
					<div class="slide-container">
						<div class="slide-content pt5">
							<div class="slide-text">
								<h3 class="slide-title dark-blue mb3">
									{$_('banner.slide1Title')}
								</h3>
								<h4 class="slide-subtitle mb4">
									{$_('banner.slide1Subtitle')}
								</h4>
								<h6 class="mb3 fw4 ttu">{$_('home.downloadTheAppNow')}</h6>
								<div class="downloads flex justify-center">
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
						<div class="slide-image mt5 flex justify-center">
							<img src="images/slideshow4_mobile.png" alt="slideshow4_mobile" />
						</div>
					</div>
				</div>
				<div class="swiper-slide">
					<img src="images/bg_slideshow.jpg" alt="bg_slideshow" />
					<div class="slide-container">
						<div class="slide-content pt5">
							<div class="slide-text">
								<h3 class="slide-title dark-blue mb3">
									{$_('banner.slide2Title')}
								</h3>
								<h4 class="slide-subtitle mb4">
									{$_('banner.slide2Subtitle')}
								</h4>
								<h6 class="mb3 fw4 ttu">{$_('home.downloadTheAppNow')}</h6>
								<div class="downloads flex justify-center">
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
						<div class="slide-image mt5">
							<img src="images/slideshow2_mobile.png" alt="slideshow2_mobile" />
						</div>
					</div>
				</div>
				<div class="swiper-slide">
					<img src="images/bg_slideshow.jpg" alt="bg_slideshow" />
					<div class="slide-container">
						<div class="slide-content pt5">
							<div class="slide-text">
								<h3 class="slide-title dark-blue mb3">
									{$_('banner.slide3Title')}
								</h3>
								<h4 class="slide-subtitle mb4">
									{$_('banner.slide3Subtitle')}
								</h4>
								<h6 class="mb3 fw4 ttu">{$_('home.downloadTheAppNow')}</h6>
								<div class="downloads flex justify-center">
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
								<!-- <button
									class="slide-button ph3 h-40-px bg-transparent white bw1 b--white
										br2 ba fw6 grow tc ttu tracked pointer"
									on:click={() => goto('/category')}>{$_('banner.shopNow')}</button> -->
							</div>
						</div>
						<div class="slide-image mt5 flex justify-center">
							<img src="images/slideshow1_mobile.png" alt="slideshow1_mobile" />
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
		<ContentLoader width="1170" uniqueKey="slideshow">
			<rect x="0" y="0" rx="5" ry="5" width="1170" height="400" />
		</ContentLoader>
	</div>
{/if}

<style>
	.custom :global(.swiper-slide) {
		position: relative;
	}
	.swiper-slide > img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}
	.slide-container {
		max-width: 1170px;
		height: 100%;
		margin: 0 auto;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	.slide-content,
	.slide-image {
		flex-grow: 1;
	}
	.slide-text {
		max-width: 85%;
		min-height: 210px;
		margin: 0 auto;
	}
	.slide-image img {
		display: block;
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
		min-width: 170px;
	}

	.custom :global(.swiper-button-prev) {
		width: 60px;
		height: 60px;
		border-radius: 5px;
		border: 1px solid #3f4254;
	}
	.custom :global(.swiper-button-next) {
		width: 60px;
		height: 60px;
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
		line-height: 44px;
		font-size: 32px;
		letter-spacing: 1px;
	}
	.slide-subtitle {
		font-size: 16px;
		line-height: 28px;
	}
</style>

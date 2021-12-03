<script>
	import { _ } from 'svelte-i18n';
	import config from '../config';
	import TransactionWrapper from '../components/transition/TransactionWrapper.svelte';
	import PcNav from '../components/menu/PcNav.svelte';
	import { onMount } from 'svelte';
	import LoadingPage from '../components/loading/LoadingPage.svelte';
	import TabletNav from '../components/menu/TabletNav.svelte';
	import MobileNav from '../components/menu/MobileNav.svelte';
	import PcFooter from '../components/footer/PcFooter.svelte';
	import TabletFooter from '../components/footer/TabletFooter.svelte';
	import MobileFooter from '../components/footer/MobileFooter.svelte';
	import { checkDeviceType } from '../functions';
	import PcSlideshow from '../components/banner/PcSlideshow.svelte';
	import TabletSlideshow from '../components/banner/TabletSlideshow.svelte';
	import MobileSlideshow from '../components/banner/MobileSlideshow.svelte';
	import PcFeaturedCategory from '../components/home/PcFeaturedCategory.svelte';
	import TabletFeaturedCategory from '../components/home/TabletFeaturedCategory.svelte';
	import MobileFeaturedCategory from '../components/home/MobileFeaturedCategory.svelte';
	import PcFeaturedDevices from '../components/device/PcFeaturedDevices.svelte';
	import PcInnovativeQualities from '../components/home/PcInnovativeQualities.svelte';
	import MobileFeaturedDevices from '../components/device/MobileFeaturedDevices.svelte';
	import TabletFeaturedDevices from '../components/device/TabletFeaturedDevices.svelte';
	import TabletInnovativeQualities from '../components/home/TabletInnovativeQualities.svelte';
	import MobileInnovativeQualities from '../components/home/MobileInnovativeQualities.svelte';
	import { isVendor } from '../stores';
	import PcNewDevices from '../components/device/PcNewDevices.svelte';
	import PcSupport from '../components/home/PcSupport.svelte';
	import TabletSupport from '../components/home/TabletSupport.svelte';
	import MobileSupport from '../components/home/MobileSupport.svelte';
	import TabletNewDevices from '../components/device/TabletNewDevices.svelte';
	import MobileNewDevices from '../components/device/MobileNewDevices.svelte';
	import PcSubscribe from '../components/home/PcSubscribe.svelte';
	import TabletSubscribe from '../components/home/TabletSubscribe.svelte';
	import MobileSubscribe from '../components/home/MobileSubscribe.svelte';
	import PcContact from '../components/home/PcContact.svelte';

	const deviceType = checkDeviceType();

	let visible = false;

	onMount(() => {
		visible = true;
		isVendor.set(false);
	});
</script>

<svelte:head>
	<title>{$_('nav.home')}</title>
</svelte:head>
{#if visible}
	<TransactionWrapper id="home-screen">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<MobileSlideshow />
				<section class="w-100 spacing-ext pv1rem">
					<MobileFeaturedCategory />
				</section>
				<section class="center pv2rem bg-light-gray">
					<MobileNewDevices />
				</section>
				<MobileInnovativeQualities />
				<section class="bg-white bt b--light-gray pv2rem">
					<MobileSupport />
				</section>
				<MobileSubscribe />
			</div>
			<MobileFooter />
		{:else if deviceType == config.isTablet}
			<TabletNav />
			<div class="content-tablet ">
				<TabletSlideshow />
				<section class="spacing-ext pv1rem bg-light-gray">
					<TabletFeaturedCategory />
				</section>
				<section class="spacing-ext center pv2rem">
					<TabletNewDevices />
				</section>
				<TabletInnovativeQualities />
				<section class="bg-white bt b--light-gray pt5 pb6">
					<TabletSupport />
				</section>
				<TabletSubscribe />
			</div>
			<TabletFooter />
		{:else}
			<PcNav />
			<div class="content-desktop">
				<PcSlideshow />
				<section class="bg-light-gray">
					<PcFeaturedCategory />
				</section>
				<section
					class="spacing-ext mw10 center pv6"
					id="home-section-smartphones"
				>
					<PcNewDevices />
				</section>
				<PcInnovativeQualities />
				<section class="bg-white bt b--light-gray pv6">
					<PcSupport />
				</section>
				<PcSubscribe />
				<!-- <PcContact /> -->
			</div>
			<PcFooter />
		{/if}
	</TransactionWrapper>
{:else}
	<LoadingPage />
{/if}

<style>
</style>

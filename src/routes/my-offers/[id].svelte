<script>
	import { _ } from 'svelte-i18n';
	import { goto, stores } from '@sapper/app';
	import config from '../../config';
	import { auth, isVendor } from '../../stores';
	import Breadcrumb from '../../components/menu/Breadcrumb.svelte';
	import BreadcrumbItem from '../../components/menu/BreadcrumbItem.svelte';
	import TransactionWrapper from '../../components/transition/TransactionWrapper.svelte';
	import PcNav from '../../components/menu/PcNav.svelte';
	import { onDestroy, onMount } from 'svelte';
	import LoadingPage from '../../components/loading/LoadingPage.svelte';
	import TabletNav from '../../components/menu/TabletNav.svelte';
	import MobileNav from '../../components/menu/MobileNav.svelte';
	import PcFooter from '../../components/footer/PcFooter.svelte';
	import TabletFooter from '../../components/footer/TabletFooter.svelte';
	import MobileFooter from '../../components/footer/MobileFooter.svelte';

	import { checkDeviceType } from '../../functions';
	import PcOfferDetail from '../../components/offer/PcOfferDetail.svelte';
	import MobileOfferDetail from '../../components/offer/MobileOfferDetail.svelte';
	import TabletOfferDetail from '../../components/offer/TabletOfferDetail.svelte';

	const deviceType = checkDeviceType();
	const { page } = stores();

	let visible = false;

	onMount(async () => {
		if (!$auth) {
			await goto('');
		}
		setTimeout(() => {
			isVendor.set(true);
			visible = true;
		}, 500);
	});
	onDestroy(() => {
		isVendor.set(false);
	});
</script>

<svelte:head>
	<title>{$_('offer.detailOffersPage')}</title>
</svelte:head>

{#if visible}
	<TransactionWrapper id="my-offer-screen">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						href={'my-devices/offers/' + $page.query.deviceId}
						message={$_('offer.myOffers')} />
					<BreadcrumbItem active={true} message={$_('cart.newRequest')} />
				</Breadcrumb>
				<div class="w-100 spacing-ext">
					<MobileOfferDetail />
				</div>
			</div>
			<MobileFooter />
		{:else if deviceType == config.isTablet}
			<TabletNav />
			<div class="content-tablet">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						href={'my-devices/offers/' + $page.query.deviceId}
						message={$_('offer.myOffers')} />
					<BreadcrumbItem active={true} message={$_('cart.newRequest')} />
				</Breadcrumb>
				<div class="w-100 spacing-ext">
					<TabletOfferDetail />
				</div>
			</div>
			<TabletFooter />
		{:else}
			<PcNav />
			<div class="content-desktop">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						href={'my-devices/offers/' + $page.query.deviceId}
						message={$_('offer.myOffers')} />
					<BreadcrumbItem active={true} message={$_('cart.newRequest')} />
				</Breadcrumb>
				<div class="mw10 center">
					<PcOfferDetail />
				</div>
			</div>
			<PcFooter />
		{/if}
	</TransactionWrapper>
{:else}
	<LoadingPage />
{/if}

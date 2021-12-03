<script>
	import { _ } from 'svelte-i18n';
	import { goto } from '@sapper/app';
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
	import PcWishlistPage from '../../components/wishlist/PcWishlistPage.svelte';
	import TabletWishlistPage from '../../components/wishlist/TabletWishlistPage.svelte';
	import MobileWishlistPage from '../../components/wishlist/MobileWishlistPage.svelte';

	const deviceType = checkDeviceType();

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
	<title>{$_('wishlist.myWishlistsPage')}</title>
</svelte:head>

{#if visible}
	<TransactionWrapper id="my-wishlist-screen">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('wishlist.myWishlists')} />
				</Breadcrumb>
				<MobileWishlistPage />
			</div>
			<MobileFooter />
		{:else if deviceType == config.isTablet}
			<TabletNav />
			<div class="content-tablet">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('wishlist.myWishlists')} />
				</Breadcrumb>
				<TabletWishlistPage />
			</div>
			<TabletFooter />
		{:else}
			<PcNav />
			<div class="content-desktop">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('wishlist.myWishlists')} />
				</Breadcrumb>
				<PcWishlistPage />
			</div>
			<PcFooter />
		{/if}
	</TransactionWrapper>
{:else}
	<LoadingPage />
{/if}

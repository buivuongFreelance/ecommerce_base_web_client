<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import { isVendor } from '../../stores.js';
	import Breadcrumb from '../../components/menu/Breadcrumb.svelte';
	import BreadcrumbItem from '../../components/menu/BreadcrumbItem.svelte';
	import TransactionWrapper from '../../components/transition/TransactionWrapper.svelte';
	import PcNav from '../../components/menu/PcNav.svelte';
	import { onMount } from 'svelte';
	import LoadingPage from '../../components/loading/LoadingPage.svelte';
	import TabletNav from '../../components/menu/TabletNav.svelte';
	import MobileNav from '../../components/menu/MobileNav.svelte';
	import PcFooter from '../../components/footer/PcFooter.svelte';
	import TabletFooter from '../../components/footer/TabletFooter.svelte';
	import MobileFooter from '../../components/footer/MobileFooter.svelte';
	import { checkDeviceType } from '../../functions';
	import MobileCartPage from '../../components/cart/MobileCartPage.svelte';
	import PcListFavorite from '../../components/favorite/PcListFavorite.svelte';
	import TabletListFavorite from '../../components/favorite/TabletListFavorite.svelte';
	import MobileListFavorite from '../../components/favorite/MobileListFavorite.svelte';

	const deviceType = checkDeviceType();
	let visible = false;

	onMount(async () => {
		setTimeout(() => {
			visible = true;
			isVendor.set(false);
		}, 500);
	});
</script>

<svelte:head>
	<title>{$_('nav.favorites') + ' ' + $_('message.page')}</title>
</svelte:head>

{#if visible}
	<TransactionWrapper id="favorite-screen">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('nav.favorites')} />
				</Breadcrumb>
				<div class="w-100 spacing-ext pv5">
					<h2 class="fw6 tc mb5">{$_('nav.favorites')}</h2>
					<MobileListFavorite />
				</div>
			</div>
			<MobileFooter />
		{:else if deviceType == config.isTablet}
			<TabletNav />
			<div class="content-tablet">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('nav.favorites')} />
				</Breadcrumb>
				<div class="w-100 spacing-ext pv5">
					<h2 class="fw6 tc mb5">{$_('nav.favorites')}</h2>
					<TabletListFavorite />
				</div>
			</div>
			<TabletFooter />
		{:else}
			<PcNav />
			<div class="content-desktop">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('nav.favorites')} />
				</Breadcrumb>
				<div class="mw10 center pv5">
					<h1 class="fw6 tc mb5">{$_('nav.favorites')}</h1>
					<PcListFavorite />
				</div>
			</div>
			<PcFooter />
		{/if}
	</TransactionWrapper>
{:else}
	<LoadingPage />
{/if}

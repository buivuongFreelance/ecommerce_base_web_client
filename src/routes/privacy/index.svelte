<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import TransactionWrapper from '../../components/transition/TransactionWrapper.svelte';

	import { onMount } from 'svelte';
	import LoadingPage from '../../components/loading/LoadingPage.svelte';
	import PcFooter from '../../components/footer/PcFooter.svelte';
	import TabletFooter from '../../components/footer/TabletFooter.svelte';
	import MobileFooter from '../../components/footer/MobileFooter.svelte';
	import { checkDeviceType } from '../../functions';
	import PcNav from '../../components/menu/PcNav.svelte';
	import Breadcrumb from '../../components/menu/Breadcrumb.svelte';
	import BreadcrumbItem from '../../components/menu/BreadcrumbItem.svelte';
	import PcPrivacy from '../../components/privacy/PcPrivacy.svelte';
	import TabletPrivacy from '../../components/privacy/TabletPrivacy.svelte';
	import TabletNav from '../../components/menu/TabletNav.svelte';
	import MobileNav from '../../components/menu/MobileNav.svelte';

	const deviceType = checkDeviceType();

	let visible = false;

	onMount(() => {
		visible = true;
	});
</script>

<svelte:head>
	<title>{$_('nav.home') + ' ' + $_('message.page')}</title>
</svelte:head>
{#if visible}
	<TransactionWrapper id="privacy-screen">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('checkout.privacy')} />
				</Breadcrumb>
				<section class="spacing-ext center pb1rem">
					<TabletPrivacy />
				</section>
			</div>
		{:else if deviceType == config.isTablet}
			<TabletNav />
			<div class="content-tablet">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('checkout.privacy')} />
				</Breadcrumb>
				<section class="spacing-ext center pt3 pb5">
					<TabletPrivacy />
				</section>
			</div>
		{:else}
			<PcNav />
			<div class="content-desktop">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('checkout.privacy')} />
				</Breadcrumb>
				<section class="spacing-ext mw10 center pt3 pb5">
					<PcPrivacy />
				</section>
			</div>
		{/if}

		{#if deviceType === config.isMobile}
			<MobileFooter />
		{:else if deviceType == config.isTablet}
			<TabletFooter />
		{:else}
			<PcFooter />
		{/if}
	</TransactionWrapper>
{:else}
	<LoadingPage />
{/if}

<style>
</style>

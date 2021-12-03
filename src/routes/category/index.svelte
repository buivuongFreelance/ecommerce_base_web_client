<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import { isVendor } from '../../stores.js';
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

	import PcCategory from '../../components/category/PcCategory.svelte';
	import TabletCategory from '../../components/category/TabletCategory.svelte';
	import MobileCategory from '../../components/category/MobileCategory.svelte';

	const deviceType = checkDeviceType();
	let visible = false;

	onMount(async () => {
		setTimeout(() => {
			visible = true;
			isVendor.set(false);
		}, 500);
	});

	onDestroy(() => {
		// category.set(null);
	});
</script>

<svelte:head>
	<title>{$_('label.category') + ' ' + $_('message.page')}</title>
</svelte:head>

{#if visible}
	<TransactionWrapper id="category-screen">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('label.category')} />
				</Breadcrumb>
				<div class="pb5 bg-light-gray">
					<MobileCategory />
				</div>
			</div>
			<MobileFooter />
		{:else if deviceType == config.isTablet}
			<TabletNav />
			<div class="content-tablet">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('label.category')} />
				</Breadcrumb>
				<div class="spacing-ext center pb2rem">
					<TabletCategory />
				</div>
			</div>
			<TabletFooter />
		{:else}
			<PcNav />
			<div class="content-desktop">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('label.category')} />
				</Breadcrumb>
				<div class="mw10 center pv5">
					<PcCategory />
				</div>
			</div>
			<PcFooter />
		{/if}
	</TransactionWrapper>
{:else}
	<LoadingPage />
{/if}

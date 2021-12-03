<script>
	import { _ } from 'svelte-i18n';
	import config from '../../../config';
	import TransactionWrapper from '../../../components/transition/TransactionWrapper.svelte';

	import { onMount } from 'svelte';
	import LoadingPage from '../../../components/loading/LoadingPage.svelte';
	import PcFooter from '../../../components/footer/PcFooter.svelte';
	import TabletFooter from '../../../components/footer/TabletFooter.svelte';
	import MobileFooter from '../../../components/footer/MobileFooter.svelte';
	import { checkDeviceType } from '../../../functions';
	import PcNav from '../../../components/menu/PcNav.svelte';
	import TabletNav from '../../../components/menu/TabletNav.svelte';
	import MobileNav from '../../../components/menu/MobileNav.svelte';
	import Breadcrumb from '../../../components/menu/Breadcrumb.svelte';
	import BreadcrumbItem from '../../../components/menu/BreadcrumbItem.svelte';
	import PcInvoice from '../../../components/invoice/PcInvoice.svelte';
	import { auth } from '../../../stores';
	import { goto } from '@sapper/app';
	import TabletInvoice from '../../../components/invoice/TabletInvoice.svelte';
	import MobileInvoice from '../../../components/invoice/MobileInvoice.svelte';

	const deviceType = checkDeviceType();

	let visible = false;

	onMount(async () => {
		if (!$auth) {
			await goto('');
		}
		visible = true;
	});
</script>

<style>
</style>

<svelte:head>
	<title>{$_('label.invoice') + ' ' + $_('message.page')}</title>
</svelte:head>
{#if visible}
	<TransactionWrapper id="invoice-screen">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('label.invoice')} />
				</Breadcrumb>
				<section class="spacing-ext center pt3">
					<MobileInvoice />
				</section>
			</div>
		{:else if deviceType == config.isTablet}
			<TabletNav />
			<div class="content-tablet">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('label.invoice')} />
				</Breadcrumb>
				<section class="spacing-ext center pt3">
					<TabletInvoice />
				</section>
			</div>
		{:else}
			<PcNav />
			<div class="content-desktop">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('label.invoice')} />
				</Breadcrumb>
				<section class="spacing-ext mw10 center pt3 pb5">
					<PcInvoice />
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

<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
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
	import PcDeviceDetail from '../../components/device/PcDeviceDetail.svelte';
	import Breadcrumb from '../../components/menu/Breadcrumb.svelte';
	import BreadcrumbItem from '../../components/menu/BreadcrumbItem.svelte';
	import PcRelatedList from '../../components/device/PcRelatedList.svelte';
	import TabletDeviceDetail from '../../components/device/TabletDeviceDetail.svelte';
	import MobileDeviceDetail from '../../components/device/MobileDeviceDetail.svelte';
	import MobileRelatedList from '../../components/device/MobileRelatedList.svelte';
	import TabletRelatedList from '../../components/device/TabletRelatedList.svelte';

	const deviceType = checkDeviceType();

	let visible = false;
	let detail = null;

	onMount(() => {
		visible = true;
	});
</script>

<svelte:head>
	<title>{$_('deviceDetail.deviceDetailPage')}</title>
</svelte:head>
{#if visible}
	<TransactionWrapper id="detail-device-screen">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('device.detailDevice')} />
				</Breadcrumb>
				<section class="spacing-ext center ph1rem pb1rem">
					<MobileDeviceDetail bind:item={detail} />
				</section>
				{#if detail}
					<section class="pv2rem bg-light-gray">
						<MobileRelatedList {detail} />
					</section>
				{/if}
			</div>
		{:else if deviceType == config.isTablet}
			<TabletNav />
			<div class="content-tablet">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('device.detailDevice')} />
				</Breadcrumb>
				<section class="spacing-ext center pv4">
					<TabletDeviceDetail bind:item={detail} />
				</section>
				{#if detail}
					<section class="spacing-ext center pb5">
						<TabletRelatedList {detail} />
					</section>
				{/if}
			</div>
		{:else}
			<PcNav />
			<div class="content-desktop">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('device.detailDevice')} />
				</Breadcrumb>
				<section class="spacing-ext mw10 center pv5">
					<PcDeviceDetail bind:item={detail} />
				</section>
				{#if detail}
					<section class="spacing-ext mw10 center pv5">
						<PcRelatedList {detail} />
					</section>
				{/if}
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

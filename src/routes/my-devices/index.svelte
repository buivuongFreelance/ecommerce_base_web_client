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
	import PcListDevices from '../../components/device/PcListDevices.svelte';
	import TabletListDevices from '../../components/device/TabletListDevices.svelte';
	import MobileListDevices from '../../components/device/MobileListDevices.svelte';
	import { checkDeviceType } from '../../functions';

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
	<title>{$_('device.listDevicePage')}</title>
</svelte:head>

{#if visible}
	<TransactionWrapper id="my-devices-screen">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('device.listDevice')} />
				</Breadcrumb>
				<MobileListDevices />
			</div>
			<MobileFooter />
		{:else if deviceType == config.isTablet}
			<TabletNav />
			<div class="content-tablet">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('device.listDevice')} />
				</Breadcrumb>
				<TabletListDevices />
			</div>
			<TabletFooter />
		{:else}
			<PcNav />
			<div class="content-desktop">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('device.listDevice')} />
				</Breadcrumb>
				<PcListDevices />
			</div>
			<PcFooter />
		{/if}
	</TransactionWrapper>
{:else}
	<LoadingPage />
{/if}

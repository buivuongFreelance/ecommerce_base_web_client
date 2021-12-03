<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import TransactionWrapper from '../../components/transition/TransactionWrapper.svelte';

	import { onDestroy, onMount } from 'svelte';
	import LoadingPage from '../../components/loading/LoadingPage.svelte';
	import PcFooter from '../../components/footer/PcFooter.svelte';
	import TabletFooter from '../../components/footer/TabletFooter.svelte';
	import MobileFooter from '../../components/footer/MobileFooter.svelte';
	import { checkDeviceType } from '../../functions';
	import PcNav from '../../components/menu/PcNav.svelte';
	import TabletNav from '../../components/menu/TabletNav.svelte';
	import MobileNav from '../../components/menu/MobileNav.svelte';
	import Breadcrumb from '../../components/menu/Breadcrumb.svelte';
	import BreadcrumbItem from '../../components/menu/BreadcrumbItem.svelte';

	import { goto } from '@sapper/app';
	import { auth, isVendor } from '../../stores';
	import PcMyAccountShippingBillingAddress from '../../components/myAccountShippingBillingAddress/PcMyAccountShippingBillingAddress.svelte';
	import TabletMyAccountShippingBillingAddress from '../../components/myAccountShippingBillingAddress/TabletMyAccountShippingBillingAddress.svelte';

	import MobileMyAccountShippingBillingAddress from '../../components/myAccountShippingBillingAddress/MobileMyAccountShippingBillingAddress.svelte';

	const deviceType = checkDeviceType();

	let visible = false;

	onMount(async () => {
		visible = true;
		if (!$auth) {
			await goto('/');
		}
		setTimeout(async () => {
			isVendor.set(true);
			visible = true;
		}, 500);
	});

	onDestroy(() => {
		isVendor.set(false);
	});
</script>

<svelte:head>
	<title>{$_('nav.home') + ' ' + $_('message.page')}</title>
</svelte:head>
{#if visible}
	<TransactionWrapper id="my-account-screen">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						message={$_('nav.myAccount')}
						href="my-account"
					/>
					<BreadcrumbItem active={true} message={$_('checkout.shippingAdd')} />
				</Breadcrumb>
				<section class="spacing-ext center pb2rem">
					<MobileMyAccountShippingBillingAddress />
				</section>
			</div>
		{:else if deviceType == config.isTablet}
			<TabletNav />
			<div class="content-tablet">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('checkout.shippingAdd')} />
				</Breadcrumb>
				<section class="spacing-ext center pv5">
					<TabletMyAccountShippingBillingAddress />
				</section>
			</div>
		{:else}
			<PcNav />
			<div class="content-desktop">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('checkout.shippingAdd')} />
				</Breadcrumb>
				<section class="spacing-ext mw10 center pv5">
					<PcMyAccountShippingBillingAddress />
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

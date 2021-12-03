<script>
	import { _ } from 'svelte-i18n';
	import config from '../../../../config';
	import TransactionWrapper from '../../../../components/transition/TransactionWrapper.svelte';
	import { auth, isVendor } from '../../../../stores';
	import { goto } from '@sapper/app';
	import { onMount, onDestroy } from 'svelte';
	import LoadingPage from '../../../../components/loading/LoadingPage.svelte';
	import PcFooter from '../../../../components/footer/PcFooter.svelte';
	import TabletFooter from '../../../../components/footer/TabletFooter.svelte';
	import MobileFooter from '../../../../components/footer/MobileFooter.svelte';
	import { checkDeviceType } from '../../../../functions';
	import PcNav from '../../../../components/menu/PcNav.svelte';
	import Breadcrumb from '../../../../components/menu/Breadcrumb.svelte';
	import BreadcrumbItem from '../../../../components/menu/BreadcrumbItem.svelte';
	import TabletNav from '../../../../components/menu/TabletNav.svelte';
	import MobileNav from '../../../../components/menu/MobileNav.svelte';
	import PcTransactionPickupPurchase from '../../../../components/pickup/PcTransactionPickupPurchase.svelte';

	const deviceType = checkDeviceType();

	let visible = false;
	let purchaseCode = '';
	let purchaseId = '';

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
	<title>{$_('transaction.pickupPage')}</title>
</svelte:head>
{#if visible}
	<TransactionWrapper id="order-screen">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						href={'my-sales'}
						message={$_('order.myOrder')}
					/>
					<BreadcrumbItem
						active={false}
						href={'my-purchases/' + purchaseId}
						message={purchaseCode}
					/>

					<BreadcrumbItem active={true} message={$_('pickup.createPickup')} />
				</Breadcrumb>
				<section class="spacing-ext center pt3 pb5">
					<PcTransactionPickupPurchase bind:purchaseCode bind:purchaseId />
				</section>
			</div>
		{:else if deviceType == config.isTablet}
			<TabletNav />
			<div class="content-tablet">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						href={'my-sales'}
						message={$_('order.myOrder')}
					/>
					<BreadcrumbItem
						active={false}
						href={'my-purchases/' + purchaseId}
						message={purchaseCode}
					/>

					<BreadcrumbItem active={true} message={$_('pickup.createPickup')} />
				</Breadcrumb>
				<section class="spacing-ext center pt3 pb5">
					<PcTransactionPickupPurchase bind:purchaseCode bind:purchaseId />
				</section>
			</div>
		{:else}
			<PcNav />
			<div class="content-desktop">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						href={'my-sales'}
						message={$_('order.myOrder')}
					/>
					<BreadcrumbItem
						active={false}
						href={'my-purchases/' + purchaseId}
						message={purchaseCode}
					/>

					<BreadcrumbItem active={true} message={$_('pickup.createPickup')} />
				</Breadcrumb>
				<section class="spacing-ext mw10 center pt3 pb5">
					<PcTransactionPickupPurchase bind:purchaseCode bind:purchaseId />
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

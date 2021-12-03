<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import TransactionWrapper from '../../components/transition/TransactionWrapper.svelte';
	import { auth, isVendor } from '../../stores';
	import { goto } from '@sapper/app';
	import { onMount, onDestroy } from 'svelte';
	import LoadingPage from '../../components/loading/LoadingPage.svelte';
	import PcFooter from '../../components/footer/PcFooter.svelte';
	import TabletFooter from '../../components/footer/TabletFooter.svelte';
	import MobileFooter from '../../components/footer/MobileFooter.svelte';
	import { checkDeviceType } from '../../functions';
	import PcNav from '../../components/menu/PcNav.svelte';
	import Breadcrumb from '../../components/menu/Breadcrumb.svelte';
	import BreadcrumbItem from '../../components/menu/BreadcrumbItem.svelte';
	import TabletNav from '../../components/menu/TabletNav.svelte';
	import MobileNav from '../../components/menu/MobileNav.svelte';
	import MobileTransactionDetail from '../../components/transaction/MobileTransactionDetail.svelte';
	import PcTransactionDetail from '../../components/transaction/PcTransactionDetail.svelte';

	const deviceType = checkDeviceType();

	let visible = false;
	let transCode = '';
	let deviceName = '';
	let deviceId = '';
	let isBuyer = false;
	let purchaseCode = '';
	let saleCode = '';
	let purchaseId = '';
	let saleId = '';

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
	<title>{$_('order.transDetailPage')}</title>
</svelte:head>
{#if visible}
	<TransactionWrapper id="order-screen">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						href="my-devices"
						message={$_('device.listDevice')}
					/>
					<BreadcrumbItem
						active={false}
						href={'my-devices/' + deviceId}
						message={deviceName}
					/>
					<BreadcrumbItem
						active={false}
						href={!isBuyer ? 'my-sales' : 'my-purchases'}
						message={!isBuyer ? $_('order.mySelling') : $_('order.myOrder')}
					/>
					<BreadcrumbItem
						active={false}
						href={!isBuyer
							? 'my-sales/' + saleId
							: 'my-purchases/' + purchaseId}
						message={!isBuyer ? saleCode : purchaseCode}
					/>
					<BreadcrumbItem
						active={false}
						href="my-transactions"
						message={$_('order.myTrans')}
					/>
					<BreadcrumbItem active={true} message={transCode} />
				</Breadcrumb>
				<section class="spacing-ext center pt3 pb5">
					<MobileTransactionDetail
						bind:transCode
						bind:deviceName
						bind:deviceId
						bind:isBuyer
						bind:purchaseCode
						bind:saleCode
						bind:purchaseId
						bind:saleId
					/>
				</section>
			</div>
		{:else if deviceType == config.isTablet}
			<TabletNav />
			<div class="content-tablet">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						href="my-devices"
						message={$_('device.listDevice')}
					/>
					<BreadcrumbItem
						active={false}
						href={'my-devices/' + deviceId}
						message={deviceName}
					/>
					<BreadcrumbItem
						active={false}
						href={!isBuyer ? 'my-sales' : 'my-purchases'}
						message={!isBuyer ? $_('order.mySelling') : $_('order.myOrder')}
					/>
					<BreadcrumbItem
						active={false}
						href={!isBuyer
							? 'my-sales/' + saleId
							: 'my-purchases/' + purchaseId}
						message={!isBuyer ? saleCode : purchaseCode}
					/>
					<BreadcrumbItem
						active={false}
						href="my-transactions"
						message={$_('order.myTrans')}
					/>
					<BreadcrumbItem active={true} message={transCode} />
				</Breadcrumb>
				<section class="spacing-ext center pt3 pb5">
					<PcTransactionDetail
						bind:transCode
						bind:deviceName
						bind:deviceId
						bind:isBuyer
						bind:purchaseCode
						bind:saleCode
						bind:purchaseId
						bind:saleId
					/>
				</section>
			</div>
		{:else}
			<PcNav />
			<div class="content-desktop">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						href="my-devices"
						message={$_('device.listDevice')}
					/>
					<BreadcrumbItem
						active={false}
						href={'my-devices/' + deviceId}
						message={deviceName}
					/>
					<BreadcrumbItem
						active={false}
						href={!isBuyer ? 'my-sales' : 'my-purchases'}
						message={!isBuyer ? $_('order.mySelling') : $_('order.myOrder')}
					/>
					<BreadcrumbItem
						active={false}
						href={!isBuyer
							? 'my-sales/' + saleId
							: 'my-purchases/' + purchaseId}
						message={!isBuyer ? saleCode : purchaseCode}
					/>
					<BreadcrumbItem
						active={false}
						href="my-transactions"
						message={$_('order.myTrans')}
					/>
					<BreadcrumbItem active={true} message={transCode} />
				</Breadcrumb>
				<section class="spacing-ext mw10 center pt3 pb5 relative">
					<PcTransactionDetail
						bind:transCode
						bind:deviceName
						bind:deviceId
						bind:isBuyer
						bind:purchaseCode
						bind:saleCode
						bind:purchaseId
						bind:saleId
					/>
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

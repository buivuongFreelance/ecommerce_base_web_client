<script>
	import { _ } from 'svelte-i18n';
	import { goto } from '@sapper/app';
	import config from '../../config';
	import {
		auth,
		checkoutAmountInfo,
		isVendor,
		notifySellerCancelAcceptChanged,
		selectListConfirm,
	} from '../../stores';
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
	import PcCheckout from '../../components/checkout/PcCheckout.svelte';
	import TabletCheckout from '../../components/checkout/TabletCheckout.svelte';
	import MobileCheckout from '../../components/checkout/MobileCheckout.svelte';

	const deviceType = checkDeviceType();

	let visible = false;

	const unsubscribeNotifySellerCancelChanged = notifySellerCancelAcceptChanged.subscribe(
		async (value) => {
			if (value) {
				if (visible) {
					goto('/cart');
				}
			}
		}
	);

	onMount(async () => {
		if (!$auth) {
			await goto('');
		}
		setTimeout(() => {
			isVendor.set(false);
			visible = true;
		}, 500);
	});

	onDestroy(() => {
		checkoutAmountInfo.set(null);
		selectListConfirm.set([]);
		unsubscribeNotifySellerCancelChanged();
	});
</script>

<svelte:head>
	<title>{$_('checkout.checkoutPage')}</title>
</svelte:head>

{#if visible}
	<TransactionWrapper id="checkout">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('checkout.checkout')} />
				</Breadcrumb>
				<div class="pb2rem">
					<h3 class="page__title ttc tc">{$_('checkout.checkout')}</h3>
					<MobileCheckout />
				</div>
			</div>
			<MobileFooter />
		{:else if deviceType == config.isTablet}
			<TabletNav />
			<div class="content-tablet">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('checkout.checkout')} />
				</Breadcrumb>
				<div class="w-100 spacing-ext pv5">
					<h2 class="fw6 tc mb5">{$_('checkout.checkout')}</h2>
					<TabletCheckout />
				</div>
			</div>
			<TabletFooter />
		{:else}
			<PcNav />
			<div class="content-desktop">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						message={$_('nav.cart')}
						href="/cart"
					/>
					<BreadcrumbItem active={true} message={$_('checkout.checkout')} />
				</Breadcrumb>
				<div class="mw10 center pv5">
					<h1 class="fw6 tc mb5">{$_('checkout.checkout')}</h1>
					<PcCheckout />
				</div>
			</div>
			<PcFooter />
		{/if}
	</TransactionWrapper>
{:else}
	<LoadingPage />
{/if}

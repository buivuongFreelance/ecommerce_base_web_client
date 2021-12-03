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
	import PcCartPage from '../../components/cart/PcCartPage.svelte';
	import TabletCartPage from '../../components/cart/TabletCartPage.svelte';
	import MobileCartPage from '../../components/cart/MobileCartPage.svelte';
	import PcModalMakeOffer from '../../components/cart/PcModalMakeOffer.svelte';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import MobileModalMakeOffer from '../../components/cart/MobileModalMakeOffer.svelte';
	import PcModalViewOffer from '../../components/cart/PcModalViewOffer.svelte';
	import MobileModalViewOffer from '../../components/cart/MobileModalViewOffer.svelte';
	import PcModalMakeOfferDevice from '../../components/cart/PcModalMakeOfferDevice.svelte';
	import PcModalViewOfferDevice from '../../components/cart/PcModalViewOfferDevice.svelte';
	import MobileModalMakeOfferDevice from '../../components/cart/MobileModalMakeOfferDevice.svelte';
	import MobileModalViewOfferDevice from '../../components/cart/MobileModalViewOfferDevice.svelte';

	const deviceType = checkDeviceType();
	let visible = false;
	let isOpenMakeOffer = false;
	let isOpenViewOffer = false;
	let isOpenMakeOfferDevice = false;
	let isOpenViewOfferDevice = false;
	let selectedCart = null;
	let countRefresh = 0;

	onMount(async () => {
		setTimeout(() => {
			visible = true;
			isVendor.set(false);
		}, 500);
	});

	const handleOffer = (item) => {
		selectedCart = item;
		isOpenMakeOffer = true;
	};

	const handleViewOffer = (item) => {
		selectedCart = item;
		isOpenViewOffer = true;
	};
	const handleOfferDevice = (item) => {
		selectedCart = item;
		isOpenMakeOfferDevice = true;
	};

	const handleViewOfferDevice = (item) => {
		selectedCart = item;
		isOpenViewOfferDevice = true;
	};

	const handleSuccessBuyerReply = () => {
		isOpenViewOffer = false;
		refresh();
	};
	const handleSuccessBuyerReplyDevice = () => {
		isOpenViewOfferDevice = false;
		refresh();
	};

	const handleSuccessBuyerCreated = () => {
		isOpenMakeOffer = false;
		refresh();
	};
	const handleSuccessBuyerCreatedDevice = () => {
		isOpenMakeOfferDevice = false;
		refresh();
	};

	const refresh = () => {
		countRefresh++;
		swal.fire({
			toast: true,
			position: 'top-end',
			icon: 'success',
			title: $_('message.actionSuccess'),
			showConfirmButton: false,
			timerProgressBar: true,
			timer: 1500,
			onOpen: (toast) => {
				toast.addEventListener('mouseenter', swal.stopTimer);
				toast.addEventListener('mouseleave', swal.resumeTimer);
			},
		});
	};

	const handleSuccessDelete = () => {
		isOpenViewOffer = false;
		refresh();
	};
</script>

<svelte:head>
	<title>{$_('cart.cartPage')}</title>
</svelte:head>

{#if visible}
	<TransactionWrapper id="cart-screen">
		{#if deviceType === config.isMobile}
			{#if isOpenMakeOffer}
				<MobileModalMakeOffer
					cart={selectedCart}
					onClose={() => (isOpenMakeOffer = false)}
					onSuccess={handleSuccessBuyerCreated}
				/>
			{:else if isOpenViewOffer}
				<MobileModalViewOffer
					onSuccessBuyerReply={handleSuccessBuyerReply}
					cart={selectedCart}
					onClose={() => (isOpenViewOffer = false)}
				/>
			{:else if isOpenMakeOfferDevice}
				<MobileModalMakeOfferDevice
					cart={selectedCart}
					onClose={() => (isOpenMakeOfferDevice = false)}
					onSuccess={handleSuccessBuyerCreatedDevice}
				/>
			{:else if isOpenViewOfferDevice}
				<MobileModalViewOfferDevice
					cart={selectedCart}
					onSuccessBuyerReply={handleSuccessBuyerReplyDevice}
					onClose={() => (isOpenViewOfferDevice = false)}
				/>
			{:else}
				<MobileNav />
				<div class="content-mobile">
					<Breadcrumb>
						<BreadcrumbItem active={true} message={$_('cart.cart')} />
					</Breadcrumb>
					<div class="pb5">
						<h1 class="page__title ttc tc">{$_('cart.shoppingCart')}</h1>
						<MobileCartPage
							isRefresh={countRefresh}
							onMakeOffer={handleOffer}
							onViewOffer={handleViewOffer}
							onMakeOfferDevice={handleOfferDevice}
							onViewOfferDevice={handleViewOfferDevice}
						/>
					</div>
				</div>
				<MobileFooter />
			{/if}
		{:else if isOpenMakeOffer}
			<PcModalMakeOffer
				cart={selectedCart}
				onClose={() => (isOpenMakeOffer = false)}
				onSuccess={handleSuccessBuyerCreated}
			/>
		{:else if isOpenViewOffer}
			<PcModalViewOffer
				cart={selectedCart}
				onSuccessBuyerReply={handleSuccessBuyerReply}
				onClose={() => (isOpenViewOffer = false)}
			/>
		{:else if isOpenMakeOfferDevice}
			<PcModalMakeOfferDevice
				cart={selectedCart}
				onClose={() => (isOpenMakeOfferDevice = false)}
				onSuccess={handleSuccessBuyerCreatedDevice}
			/>
		{:else if isOpenViewOfferDevice}
			<PcModalViewOfferDevice
				cart={selectedCart}
				onSuccessBuyerReply={handleSuccessBuyerReplyDevice}
				onClose={() => (isOpenViewOfferDevice = false)}
			/>
		{:else if deviceType == config.isTablet}
			<TabletNav />
			<div class="content-tablet">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('cart.cart')} />
				</Breadcrumb>
				<div class="w-100 spacing-ext pb2rem">
					<h1 class="page__title tc ttc">{$_('cart.shoppingCart')}</h1>
					<TabletCartPage
						isRefresh={countRefresh}
						onMakeOffer={handleOffer}
						onViewOffer={handleViewOffer}
						onMakeOfferDevice={handleOfferDevice}
						onViewOfferDevice={handleViewOfferDevice}
					/>
				</div>
			</div>
			<TabletFooter />
		{:else}
			<PcNav />
			<div class="content-desktop">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('cart.cart')} />
				</Breadcrumb>
				<div class="mw10 center pb2rem">
					<h1 class="page__title tc ttc">{$_('cart.shoppingCart')}</h1>
					<div class="w-cart center">
						<PcCartPage
							isRefresh={countRefresh}
							onMakeOffer={handleOffer}
							onViewOffer={handleViewOffer}
							onMakeOfferDevice={handleOfferDevice}
							onViewOfferDevice={handleViewOfferDevice}
						/>
					</div>
				</div>
			</div>
			<PcFooter />
		{/if}
	</TransactionWrapper>
{:else}
	<LoadingPage />
{/if}

<style>
	/* .w-cart {
		width: 970px;
	} */
</style>

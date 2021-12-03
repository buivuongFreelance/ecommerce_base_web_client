<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import config from '../../../config';
	import { auth, isVendor } from '../../../stores';
	import Breadcrumb from '../../../components/menu/Breadcrumb.svelte';
	import BreadcrumbItem from '../../../components/menu/BreadcrumbItem.svelte';
	import TransactionWrapper from '../../../components/transition/TransactionWrapper.svelte';
	import PcNav from '../../../components/menu/PcNav.svelte';
	import { onDestroy, onMount } from 'svelte';
	import LoadingPage from '../../../components/loading/LoadingPage.svelte';
	import TabletNav from '../../../components/menu/TabletNav.svelte';
	import MobileNav from '../../../components/menu/MobileNav.svelte';
	import PcFooter from '../../../components/footer/PcFooter.svelte';
	import TabletFooter from '../../../components/footer/TabletFooter.svelte';
	import { checkDeviceType } from '../../../functions';
	import PcListOffers from '../../../components/offer/PcListOffers.svelte';
	import TabletListOffers from '../../../components/offer/TabletListOffers.svelte';
	import MobileListOffers from '../../../components/offer/MobileListOffers.svelte';
	import MobileFooter from '../../../components/footer/MobileFooter.svelte';
	import { detailDevice as apiDetailDevice } from '../../../services/device';

	const deviceType = checkDeviceType();
	const { session, page } = stores();
	const { domainDevice } = $session;

	let visible = false;
	let id;
	let name = '';
	let isLoading = false;
	let isServerDetailError = false;

	onMount(async () => {
		id = $page.params.id;
		if (!$auth) {
			await goto('');
		} else {
			setTimeout(() => {
				isVendor.set(true);
				visible = true;
				detailDevice();
			}, 500);
		}
	});
	onDestroy(() => {
		isVendor.set(false);
	});
	const detailDevice = () => {
		isLoading = true;
		let token = '';
		if ($auth) token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiDetailDevice(domainDevice, {
				id,
				token,
			})
				.then((info) => {
					name =
						info.model + ' - ' + info.capacity + ' GB' + ' - ' + info.color;
					isLoading = false;
					isServerDetailError = false;
					resolve();
				})
				.catch(() => {
					isLoading = false;
					isServerDetailError = true;
					reject();
				});
		});
	};
</script>

<svelte:head>
	<title>{$_('offer.myOffersPage')}</title>
</svelte:head>

{#if visible}
	<TransactionWrapper id="my-offers">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						href={`/my-devices?status=POSTED`}
						message={$_('device.myPostDevice')} />
					<BreadcrumbItem
						active={false}
						href={'my-devices/' + id}
						message={name} />
					<BreadcrumbItem active={true} message={$_('offer.myOffers')} />
				</Breadcrumb>
				<MobileListOffers {id} />
			</div>
			<MobileFooter />
		{:else if deviceType == config.isTablet}
			<TabletNav />
			<div class="content-tablet">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						href={`/my-devices?status=POSTED`}
						message={$_('device.myPostDevice')} />
					<BreadcrumbItem
						active={false}
						href={'my-devices/' + id}
						message={name} />
					<BreadcrumbItem active={true} message={$_('offer.myOffers')} />
				</Breadcrumb>
				<TabletListOffers {id} />
			</div>
			<TabletFooter />
		{:else}
			<PcNav />
			<div class="content-desktop">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						href={`/my-devices?status=POSTED`}
						message={$_('device.myPostDevice')} />
					<BreadcrumbItem
						active={false}
						href={'my-devices/' + id}
						message={name} />
					<BreadcrumbItem active={true} message={$_('offer.myOffers')} />
				</Breadcrumb>
				<PcListOffers {id} />
			</div>
			<PcFooter />
		{/if}
	</TransactionWrapper>
{:else}
	<LoadingPage />
{/if}

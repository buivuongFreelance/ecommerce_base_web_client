<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import config from '../../../../config';
	import { auth, isVendor } from '../../../../stores';
	import Breadcrumb from '../../../../components/menu/Breadcrumb.svelte';
	import BreadcrumbItem from '../../../../components/menu/BreadcrumbItem.svelte';
	import TransactionWrapper from '../../../../components/transition/TransactionWrapper.svelte';
	import PcNav from '../../../../components/menu/PcNav.svelte';
	import { onDestroy, onMount } from 'svelte';
	import TabletNav from '../../../../components/menu/TabletNav.svelte';
	import MobileNav from '../../../../components/menu/MobileNav.svelte';
	import PcFooter from '../../../../components/footer/PcFooter.svelte';
	import TabletFooter from '../../../../components/footer/TabletFooter.svelte';
	import MobileFooter from '../../../../components/footer/MobileFooter.svelte';
	import LoadingPage from '../../../../components/loading/LoadingPage.svelte';
	import { checkDeviceType } from '../../../../functions';
	import PcPostedDeviceEdit from '../../../../components/device/PcPostedDeviceEdit.svelte';
	import TabletPostedDeviceEdit from '../../../../components/device/TabletPostedDeviceEdit.svelte';
	import MobilePostedDeviceEdit from '../../../../components/device/MobilePostedDeviceEdit.svelte';

	const { page } = stores();

	const deviceType = checkDeviceType();

	let id;
	let visible;

	onMount(async () => {
		id = $page.params.id;
		if (!$auth) {
			await goto('');
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
	<title>{$_('device.editPostDevice') + ' ' + $_('message.page')}</title>
</svelte:head>

{#if visible}
	<TransactionWrapper id="edit-post-device">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						href="my-devices"
						message={$_('device.listDevice')}
					/>
					<BreadcrumbItem active={true} message={$_('device.editPostDevice')} />
				</Breadcrumb>
				<div class="pb2rem spacing-ext">
					<MobilePostedDeviceEdit {id} />
				</div>
			</div>
			<MobileFooter />
		{:else if deviceType == config.isTablet}
			<TabletNav />
			<div class="content-tablet">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						href="my-devices"
						message={$_('device.listDevice')}
					/>
					<BreadcrumbItem active={true} message={$_('device.editPostDevice')} />
				</Breadcrumb>
				<div class="w-100 pv5 spacing-ext">
					<TabletPostedDeviceEdit {id} />
				</div>
			</div>
			<TabletFooter />
		{:else}
			<PcNav />
			<div class="content-desktop">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						href="my-devices"
						message={$_('device.listDevice')}
					/>
					<BreadcrumbItem active={true} message={$_('device.editPostDevice')} />
				</Breadcrumb>
				<div class="mw10 center pv5 spacing-ext">
					<PcPostedDeviceEdit {id} />
				</div>
			</div>
			<PcFooter />
		{/if}
	</TransactionWrapper>
{:else}
	<LoadingPage />
{/if}

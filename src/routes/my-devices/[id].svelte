<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import config from '../../config';
	import { auth, isVendor, infoImei, fieldPhysicalGrading } from '../../stores';
	import Breadcrumb from '../../components/menu/Breadcrumb.svelte';
	import BreadcrumbItem from '../../components/menu/BreadcrumbItem.svelte';
	import TransactionWrapper from '../../components/transition/TransactionWrapper.svelte';
	import PcNav from '../../components/menu/PcNav.svelte';
	import { onMount, onDestroy } from 'svelte';
	import LoadingPage from '../../components/loading/LoadingPage.svelte';
	import TabletNav from '../../components/menu/TabletNav.svelte';
	import MobileNav from '../../components/menu/MobileNav.svelte';
	import PcFooter from '../../components/footer/PcFooter.svelte';
	import TabletFooter from '../../components/footer/TabletFooter.svelte';
	import MobileFooter from '../../components/footer/MobileFooter.svelte';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import ContentLoader from 'svelte-content-loader';
	import {
		detailDevice as apiDetailDevice,
		deleteDevice as apiDeleteDevice,
	} from '../../services/device';
	import Portal from 'svelte-portal';
	import { checkDeviceType } from '../../functions';
	import PcDeviceAccountDetail from '../../components/device/PcDeviceAccountDetail.svelte';
	import TabletDeviceAccountDetail from '../../components/device/TabletDeviceAccountDetail.svelte';
	import MobileDeviceAccountDetail from '../../components/device/MobileDeviceAccountDetail.svelte';

	const { session, page } = stores();
	const { domainDevice } = $session;

	const deviceType = checkDeviceType();

	let visible = false;
	let id;
	let isLoading = true;
	let isServerDetailError = false;
	let isLoadingDelete = false;

	onMount(async () => {
		id = $page.params.id;
		if (!$auth) {
			await goto('');
		}
		setTimeout(async () => {
			isVendor.set(true);
			visible = true;
			await detailDevice();
		}, 500);
	});

	onDestroy(() => {
		isVendor.set(false);
		infoImei.set(null);
		fieldPhysicalGrading.set('');
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
					infoImei.set(info);
					fieldPhysicalGrading.set(info.physical_grading);
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

	const deleteDevice = () => {
		isLoadingDelete = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiDeleteDevice(domainDevice, { token, id })
				.then(() => {
					isLoadingDelete = false;
					resolve();
				})
				.catch(() => {
					isLoadingDelete = false;
					reject();
				});
		});
	};

	const handleGotoEdit = async () => {
		await goto('my-devices/edit-device/' + $infoImei.id);
	};

	const handleDelete = async () => {
		swal
			.fire({
				position: 'top',
				icon: 'question',
				showCancelButton: true,
				cancelButtonText: $_('message.no'),
				confirmButtonText: $_('message.yes'),
				reverseButtons: true,
				customClass: {
					icon: 'icon-question',
				},
				title: $_('device.removeDevice'),
				text: $_('device.questionRemoveCreated'),
			})
			.then((result) => {
				if (result.value) {
					deleteDevice().then(() => {
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
						goto('my-devices');
					});
				}
			});
	};

	const onSuccessLowerPrice = async () => {
		await detailDevice();
	};
</script>

<svelte:head>
	<title>{$_('device.detailDevicePage')}</title>
</svelte:head>

{#if isLoadingDelete}
	<Portal target={document.getElementById('portal')}>
		<LoadingPage />
	</Portal>
{/if}

{#if visible}
	<TransactionWrapper id="detail-devices-screen">
		{#if deviceType === config.isMobile}
			<MobileNav />

			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						href="my-devices"
						message={$_('device.listDevice')}
					/>
					<BreadcrumbItem active={true} message={$_('device.detailDevice')} />
				</Breadcrumb>
				{#if isServerDetailError}
					<div class="w-100 spacing-ext center pt5 pb3">
						<p class="red f4">{$_('error.serverErrorMessage')}</p>
					</div>
				{:else if isLoading}
					<div class="w-100 spacing-ext center pt5 pb3">
						<ContentLoader
							uniqueKey="editDevice"
							primaryColor="#e4e6ef"
							secondaryColor="#f8f8f8"
							width={config.containerDesktop - 30}
							height="200"
						>
							<rect x="0" y="0" rx="3" ry="3" width="45%" height="40" />
							<rect x="0" y="60" rx="3" ry="3" width="45%" height="20" />
							<rect x="0" y="100" rx="3" ry="3" width="45%" height="20" />
							<rect x="0" y="140" rx="3" ry="3" width="45%" height="20" />
							<rect x="0" y="180" rx="3" ry="3" width="45%" height="20" />
							<rect x="50%" y="0" rx="3" ry="3" width="50%" height="200" />
						</ContentLoader>
					</div>
				{:else}
					<MobileDeviceAccountDetail
						{handleDelete}
						{handleGotoEdit}
						{id}
						{onSuccessLowerPrice}
					/>
				{/if}
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
					<BreadcrumbItem active={true} message={$_('device.editDevice')} />
				</Breadcrumb>
				{#if isServerDetailError}
					<div class="mw10 center pt5">
						<p class="red f4">{$_('error.serverErrorMessage')}</p>
					</div>
				{:else if isLoading}
					<div class="mw10 center pt5">
						<ContentLoader
							uniqueKey="editDevice"
							primaryColor="#e4e6ef"
							secondaryColor="#f8f8f8"
							width={config.containerDesktop - 30}
							height="200"
						>
							<rect x="0" y="0" rx="3" ry="3" width="45%" height="40" />
							<rect x="0" y="60" rx="3" ry="3" width="45%" height="20" />
							<rect x="0" y="100" rx="3" ry="3" width="45%" height="20" />
							<rect x="0" y="140" rx="3" ry="3" width="45%" height="20" />
							<rect x="0" y="180" rx="3" ry="3" width="45%" height="20" />
							<rect x="50%" y="0" rx="3" ry="3" width="50%" height="200" />
						</ContentLoader>
					</div>
				{:else}
					<TabletDeviceAccountDetail {handleDelete} {handleGotoEdit} {id} />
				{/if}
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
					<BreadcrumbItem active={true} message={$_('device.detailDevice')} />
				</Breadcrumb>
				{#if isServerDetailError}
					<div class="mw10 center pt5">
						<p class="red f4">{$_('error.serverErrorMessage')}</p>
					</div>
				{:else if isLoading}
					<div class="mw10 center pt5">
						<ContentLoader
							uniqueKey="detailDevice"
							primaryColor="#e4e6ef"
							secondaryColor="#f8f8f8"
							width={config.containerDesktop - 30}
							height="200"
						>
							<rect x="0" y="0" rx="3" ry="3" width="45%" height="40" />
							<rect x="0" y="60" rx="3" ry="3" width="45%" height="20" />
							<rect x="0" y="100" rx="3" ry="3" width="45%" height="20" />
							<rect x="0" y="140" rx="3" ry="3" width="45%" height="20" />
							<rect x="0" y="180" rx="3" ry="3" width="45%" height="20" />
							<rect x="50%" y="0" rx="3" ry="3" width="50%" height="200" />
						</ContentLoader>
					</div>
				{:else}
					<PcDeviceAccountDetail
						{handleDelete}
						{handleGotoEdit}
						{id}
						{onSuccessLowerPrice}
					/>
				{/if}
			</div>
			<PcFooter />
		{/if}
	</TransactionWrapper>
{:else}
	<LoadingPage />
{/if}

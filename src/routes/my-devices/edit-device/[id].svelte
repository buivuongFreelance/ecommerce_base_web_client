<script>
	import { _ } from 'svelte-i18n';
	import UAParser from 'ua-parser-js';
	import { stores, goto } from '@sapper/app';
	import config from '../../../config';
	import {
		auth,
		isVendor,
		infoImei,
		fieldPhysicalGrading,
	} from '../../../stores';
	import Breadcrumb from '../../../components/menu/Breadcrumb.svelte';
	import BreadcrumbItem from '../../../components/menu/BreadcrumbItem.svelte';
	import TransactionWrapper from '../../../components/transition/TransactionWrapper.svelte';
	import { fade } from 'svelte/transition';
	import PcNav from '../../../components/menu/PcNav.svelte';
	import { onMount, onDestroy } from 'svelte';
	import LoadingPage from '../../../components/loading/LoadingPage.svelte';
	import TabletNav from '../../../components/menu/TabletNav.svelte';
	import MobileNav from '../../../components/menu/MobileNav.svelte';
	import PcFooter from '../../../components/footer/PcFooter.svelte';
	import TabletFooter from '../../../components/footer/TabletFooter.svelte';
	import MobileFooter from '../../../components/footer/MobileFooter.svelte';
	import * as animateScroll from 'svelte-scrollto';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import InputImeiReadOnly from '../../../components/input/PcInputImeiReadOnly.svelte';
	import PcInfoAndGradeDeviceEdit from '../../../components/form/PcInfoAndGradeDeviceEdit.svelte';
	import ContentLoader from 'svelte-content-loader';
	import { detailDevice as apiDetailDevice } from '../../../services/device';
	import MobileInfoAndGradeDeviceEdit from '../../../components/form/MobileInfoAndGradeDeviceEdit.svelte';
	import MobileInputImeiReadOnly from '../../../components/input/MobileInputImeiReadOnly.svelte';
	import TabletInfoAndGradeDeviceEdit from '../../../components/form/TabletInfoAndGradeDeviceEdit.svelte';
	import { checkDeviceType } from '../../../functions';

	const { session, page } = stores();
	const { domainDevice } = $session;

	const deviceType = checkDeviceType();

	let visible = false;
	let infoEle;
	let id;
	let isLoading = true;
	let isServerDetailError = false;

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

	const handleImeiMobileErrors = (errors) => {
		setTimeout(() => {
			animateScroll.scrollTo({
				element: document.getElementById(Object.keys(errors)[0]),
				offset: -130,
			});

			if (Object.keys(errors)[0] === 'physicalGrading') {
				swal.fire({
					toast: true,
					position: 'top-end',
					icon: 'error',
					title: $_('error.physicalGradingRequired'),
					showConfirmButton: false,
					timerProgressBar: true,
					timer: 10000,
					onOpen: (toast) => {
						toast.addEventListener('mouseenter', swal.stopTimer);
						toast.addEventListener('mouseleave', swal.resumeTimer);
					},
				});
			}
		}, 500);
	};
</script>

<svelte:head>
	<title>{$_('device.editDevice') + ' ' + $_('message.page')}</title>
</svelte:head>

{#if visible}
	<TransactionWrapper id="edit-devices-screen">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						href="my-devices"
						message={$_('device.listDevice')}
					/>
					<BreadcrumbItem active={true} message={$_('device.editDevice')} />
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
					<div class="spacing-ext center">
						<p class="tc f4 i light-silver">{$_('device.editDevice')}</p>
						<h3 class="page__title ttc tc">{$infoImei.model}</h3>
					</div>
					<div class="w-100 spacing-ext pb2rem">
						<MobileInputImeiReadOnly label={$_('device.yourIMEI')} />
						<div bind:this={infoEle} transition:fade>
							<MobileInfoAndGradeDeviceEdit onErrors={handleImeiMobileErrors} />
						</div>
						<button
							on:click={() => (window.location.href = 'my-devices')}
							class="mt1rem br2 bg-light-gray b--light-gray ba grow ttu h-50-px fw6
								w-100 tracked near-black"
						>
							{$_('device.back')}
						</button>
					</div>
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
					<div class="w-100 spacing-ext center pv5">
						<h2 class="ttc tc">{$_('device.editDevice')}</h2>
						<p class="tc f3 fw5 light-silver">{$infoImei.model}</p>
					</div>
					<div class="w-100 spacing-ext pb5 flex items-center justify-center">
						<div class="w-70">
							<InputImeiReadOnly label={$_('device.yourIMEI')} />
							<div bind:this={infoEle} transition:fade>
								<TabletInfoAndGradeDeviceEdit
									onErrors={handleImeiMobileErrors}
								/>
							</div>
						</div>
					</div>
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
					<div class="mw10 center pt5">
						<h2 class="ttc tc">{$_('device.editDevice')}</h2>
						<p class="tc f3 fw5 light-silver">{$infoImei.model}</p>
					</div>
					<div class="mw10 pt5 ph3 flex justify-center center">
						<div class="w-60">
							<InputImeiReadOnly label={$_('device.yourIMEI')} />
						</div>
					</div>
					<div class="mw10 pb5 ph3 center">
						<div bind:this={infoEle} transition:fade>
							<PcInfoAndGradeDeviceEdit onErrors={handleImeiMobileErrors} />
						</div>
					</div>
				{/if}
			</div>
			<PcFooter />
		{/if}
	</TransactionWrapper>
{:else}
	<LoadingPage />
{/if}

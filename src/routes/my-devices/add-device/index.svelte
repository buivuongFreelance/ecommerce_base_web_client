<script>
	import { _ } from 'svelte-i18n';
	import { goto } from '@sapper/app';
	import config from '../../../config';
	import { auth, isVendor } from '../../../stores';
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
	import PcCheckImei from '../../../components/form/PcCheckImei.svelte';
	import MobileCheckImei from '../../../components/form/MobileCheckImei.svelte';
	import MobileInfoAndGradeDevice from '../../../components/form/MobileInfoAndGradeDevice.svelte';
	import MobileYourImeiDropDown from '../../../components/dropdown/MobileYourIMEIDropdown.svelte';
	import TabletInfoAndGradeDevice from '../../../components/form/TabletInfoAndGradeDevice.svelte';
	import PcInfoAndGradeDevice from '../../../components/form/PcInfoAndGradeDevice.svelte';
	import * as animateScroll from 'svelte-scrollto';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import { checkDeviceType } from '../../../functions';
	import ContentLoader from 'svelte-content-loader';

	const deviceType = checkDeviceType();

	let visible = false;
	let step = 1;
	let infoEle;

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

	const handleImeiPcErrors = (errors) => {
		setTimeout(() => {
			animateScroll.scrollTo({
				element: document.getElementById(Object.keys(errors)[0]),
				offset: -400,
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

	const handleImeiMobileSuccess = () => {
		step = 2;
		setTimeout(() => {
			animateScroll.scrollTo({
				element: infoEle,
				offset: -130,
			});
		}, 500);
	};

	const handleChangeImei = () => {
		step = 1;
	};

	let isOpenMenu = false;
	const handleMenuOpen = () => {
		if (!isOpenMenu) isOpenMenu = true;
	};
	const handleMenuClose = () => {
		if (isOpenMenu) isOpenMenu = false;
	};
</script>

<svelte:head>
	<title>{$_('device.createDevice') + ' ' + $_('message.page')}</title>
</svelte:head>

{#if visible}
	<TransactionWrapper id="add-devices-screen">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem
						active={false}
						href="my-devices"
						message={$_('device.listDevice')}
					/>
					<BreadcrumbItem active={true} message={$_('device.createDevice')} />
				</Breadcrumb>
				<div class="spacing-ext center">
					<h1 class="page__title ttc tc">
						{$_('device.createDevice')}
						<small class="page__subtitle f5 mt1rem db tc fw5 light-silver i">
							{$_('device.createDeviceDesc')}
						</small>
					</h1>
				</div>

				<div class="w-100 spacing-ext pb2rem ph1rem">
					<p class="flex items-center justify-center fw5 mb1">
						{$_('device.enterIMEI')}
					</p>

					<MobileCheckImei
						onSuccess={handleImeiMobileSuccess}
						{step}
						onChangeImei={handleChangeImei}
					/>

					{#if step === 2}
						<div bind:this={infoEle} transition:fade>
							<MobileInfoAndGradeDevice onErrors={handleImeiMobileErrors} />
						</div>
					{/if}
					<button
						on:click={() => (window.location.href = 'my-devices')}
						class="mt1rem br2 bg-light-gray b--light-gray ba grow ttu h-50-px fw6
							w-100 tracked near-black"
					>
						{$_('device.back')}
					</button>
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
					<BreadcrumbItem active={true} message={$_('device.createDevice')} />
				</Breadcrumb>
				<div class="w-70 spacing-ext center pv5">
					<h2 class="ttc tc mb3">{$_('device.createDevice')}</h2>
					<p class="tc f4 fw5 light-silver">
						{$_('device.createDeviceDesc')}
						<span class="relative pointer">
							<sup
								class="light-blue"
								on:mouseenter={handleMenuOpen}
								on:mouseleave={handleMenuClose}
							>
								&#9432;
							</sup>
							{#if isOpenMenu}
								<div
									class="z-max absolute ma0 pa4 bg-white br2 shadow-1 popup f6 fw4 near-black tl"
								>
									<h5 class="mb3 ttu">{$_('imei.whatIsTheImei')}</h5>
									<p class="mb3">
										<b>{$_('imei.labelImei')}</b>
										{$_('imei.headerImei')}
									</p>
									<p>{$_('imei.descImei')}</p>
								</div>
							{/if}
						</span>
					</p>
				</div>
				<div class="w-100 spacing-ext pb5 flex items-center justify-center">
					<div class="w-70">
						<p class="flex items-center justify-center fw5 mb3">
							{$_('device.enterIMEI')}
							<MobileYourImeiDropDown />
						</p>
						<PcCheckImei
							onSuccess={handleImeiMobileSuccess}
							{step}
							onChangeImei={handleChangeImei}
						>
							<div slot="loader">
								<ContentLoader
									uniqueKey="checkImei"
									primaryColor="#e4e6ef"
									secondaryColor="#f8f8f8"
									width="738"
									height={300}
								>
									<rect x="0" y="0" rx="3" ry="3" width="45%" height="40" />

									<rect x="0" y="60" rx="3" ry="3" width="15%" height="20" />
									<rect x="16%" y="60" rx="3" ry="3" width="29%" height="40" />

									<rect x="0" y="120" rx="3" ry="3" width="15%" height="20" />
									<rect x="16%" y="120" rx="3" ry="3" width="29%" height="40" />

									<rect x="0" y="180" rx="3" ry="3" width="15%" height="20" />
									<rect x="16%" y="180" rx="3" ry="3" width="29%" height="40" />

									<rect x="0" y="240" rx="3" ry="3" width="15%" height="20" />
									<rect x="16%" y="240" rx="3" ry="3" width="29%" height="40" />

									<rect x="0" y="250" rx="3" ry="3" width="15%" height="20" />
									<rect x="16%" y="250" rx="3" ry="3" width="29%" height="40" />

									<rect x="49%" y="0" rx="3" ry="3" width="49%" height="40" />
									<rect x="49%" y="60" rx="3" ry="3" width="49%" height="40" />

									<rect
										x="49%"
										y="120"
										rx="3"
										ry="3"
										width="49%"
										height="100"
									/>
									<rect
										x="49%"
										y="240"
										rx="3"
										ry="3"
										width="49%"
										height="100"
									/>
									<rect
										x="49%"
										y="360"
										rx="3"
										ry="3"
										width="49%"
										height="100"
									/>
								</ContentLoader>
							</div>
						</PcCheckImei>
						{#if step === 2}
							<div bind:this={infoEle} transition:fade>
								<TabletInfoAndGradeDevice onErrors={handleImeiMobileErrors} />
							</div>
						{/if}
						<div class="flex justify-center">
							<button
								on:click={() => (window.location.href = 'my-devices')}
								class="mt4 br2 bg-light-gray b--light-gray ba grow ttu h-60-px
									fw6 w4 tracked near-black"
							>
								{$_('device.back')}
							</button>
						</div>
					</div>
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
					<BreadcrumbItem active={true} message={$_('device.createDevice')} />
				</Breadcrumb>
				<div class="mw10 center pt5">
					<h2 class="ttc tc">{$_('device.createDevice')}</h2>
					<p class="tc f3 fw5 light-silver">
						{$_('device.createDeviceDesc')}
						<span class="relative pointer">
							<sup
								class="light-blue"
								on:mouseenter={handleMenuOpen}
								on:mouseleave={handleMenuClose}
							>
								&#9432;
							</sup>
							{#if isOpenMenu}
								<div
									class="z-max absolute ma0 pa4 bg-white br2 shadow-1 popup f6 fw4 near-black tl"
								>
									<h5 class="mb3 ttu">{$_('imei.whatIsTheImei')}</h5>
									<p class="mb3">
										<b>{$_('imei.labelImei')}</b>
										{$_('imei.headerImei')}
									</p>
									<p>{$_('imei.descImei')}</p>
								</div>
							{/if}
						</span>
					</p>
				</div>
				<div class="mw10 pt5 ph3 flex justify-center center">
					<div class="w-60">
						<p class="flex items-center justify-center f4 fw5 mb3">
							{$_('device.enterIMEI')}
							<MobileYourImeiDropDown />
						</p>
						<PcCheckImei
							onSuccess={handleImeiMobileSuccess}
							{step}
							onChangeImei={handleChangeImei}
						>
							<div slot="loader">
								<ContentLoader
									uniqueKey="checkImei"
									primaryColor="#e4e6ef"
									secondaryColor="#f8f8f8"
									width={config.containerDesktop - 30}
									height={300}
								>
									<rect x="0" y="0" rx="3" ry="3" width="45%" height="40" />

									<rect x="0" y="60" rx="3" ry="3" width="15%" height="20" />
									<rect x="16%" y="60" rx="3" ry="3" width="29%" height="40" />

									<rect x="0" y="120" rx="3" ry="3" width="15%" height="20" />
									<rect x="16%" y="120" rx="3" ry="3" width="29%" height="40" />

									<rect x="0" y="180" rx="3" ry="3" width="15%" height="20" />
									<rect x="16%" y="180" rx="3" ry="3" width="29%" height="40" />

									<rect x="0" y="240" rx="3" ry="3" width="15%" height="20" />
									<rect x="16%" y="240" rx="3" ry="3" width="29%" height="40" />

									<rect x="0" y="250" rx="3" ry="3" width="15%" height="20" />
									<rect x="16%" y="250" rx="3" ry="3" width="29%" height="40" />

									<rect x="49%" y="0" rx="3" ry="3" width="49%" height="40" />
									<rect x="49%" y="60" rx="3" ry="3" width="49%" height="40" />

									<rect
										x="49%"
										y="120"
										rx="3"
										ry="3"
										width="49%"
										height="100"
									/>
									<rect
										x="49%"
										y="240"
										rx="3"
										ry="3"
										width="49%"
										height="100"
									/>
									<rect
										x="49%"
										y="360"
										rx="3"
										ry="3"
										width="49%"
										height="100"
									/>
								</ContentLoader>
							</div>
						</PcCheckImei>
					</div>
				</div>
				<div class="mw10 pb5 ph3 center">
					{#if step === 2}
						<div bind:this={infoEle} transition:fade>
							<PcInfoAndGradeDevice onErrors={handleImeiPcErrors} />
						</div>
					{/if}
					<div class="flex justify-center">
						<button
							on:click={() => (window.location.href = 'my-devices')}
							class="mt4 br2 bg-light-gray b--light-gray ba grow ttu h-60-px fw6
								w4 tracked pointer near-black"
						>
							{$_('device.back')}
						</button>
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
	.popup {
		top: 100%;
		right: 0;
		width: 300px;
	}
</style>

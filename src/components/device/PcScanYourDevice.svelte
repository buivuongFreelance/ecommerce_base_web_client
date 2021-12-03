<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import QRCode from 'qrcode';
	import videojs from 'video.js';
	import 'video.js/dist/video-js.css';
	import ContentLoader from 'svelte-content-loader';
	import { onDestroy, onMount } from 'svelte';
	import { auth } from '../../stores';
	import config from '../../config';
	import * as animateScroll from 'svelte-scrollto';
	import { listScanHistory as apiListScanHistory } from '../../services/device';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';

	import IconArrowFollowing from '../icon/IconArrowFollowing.svelte';
	import IconArrowRight from '../icon/IconArrowRight.svelte';
	import PcModalListDeviceScan from '../modal/PcModalListDeviceScan.svelte';

	const { session } = stores();
	const { domainDevice } = $session;

	export let detail;

	let appleLink = 'https://apps.apple.com/ca/app/id1524735381';
	let googleLink =
		'https://play.google.com/store/apps/details?id=com.dingtoi.dingtoipro';
	let downloadQrCodeLink = '';
	let scanDeviceQrCodeLink = '';
	let isLoading = false;
	let isServerError = false;
	let opts = {
		//errorCorrectionLevel: 'H',
		type: 'image/png',
		quality: 0.4,
		margin: 1,
		color: {
			dark: '#000000',
			light: '#ffffff',
		},
	};
	let isChecked = '';
	let listScan = [];
	let isOpenModal = false;

	export let step = 1;
	let oldStep = 1;
	let video;
	let player;

	$: {
		if (isOpenModal) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
		if (step !== oldStep) {
			oldStep = step;
			if (step === 2) {
				if (player) {
					player.off();
				}
				setTimeout(() => {
					player = videojs(
						video,
						config.optionsTutorialScanQrCode,
						function onPlayerReady() {}
					);
					player.on('click', () => {
						player.requestFullscreen();
					});
					player.play();
				}, 300);
			}
		}
	}

	onDestroy(() => {
		document.body.classList.remove('noscroll');
	});

	const listScanHistory = () => {
		isLoading = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}

		return new Promise((resolve, reject) => {
			apiListScanHistory(domainDevice, {
				token: token,
				deviceId: detail.id,
			})
				.then((l) => {
					isLoading = false;
					listScan = l;
					resolve();
				})
				.catch(() => {
					isLoading = false;
					reject();
				});
		});
	};

	const init = () => {
		isLoading = true;
		let dataUrl = googleLink;
		if (detail.brand_name === 'Apple') {
			dataUrl = appleLink;
		}
		const data = `${$auth.email}%${detail.physical_grading}%${detail.id}%${detail.status}%${detail.imei}`;
		QRCode.toDataURL(dataUrl, opts, function (err, url) {
			if (err) {
				isLoading = false;
				throw err;
			}
			downloadQrCodeLink = url;
			QRCode.toDataURL(data, opts, function (errDeviceCode, urlDeviceCode) {
				if (errDeviceCode) {
					isLoading = false;
					throw errDeviceCode;
				}
				scanDeviceQrCodeLink = urlDeviceCode;
				isLoading = false;
				listScanHistory();
			});
		});
	};

	onMount(() => {
		init();
	});

	const onChangeChecked = (value) => {
		isChecked = value;
		if (value === config.yes) {
			isOpenModal = true;
		}
	};

	const handleCloseModal = () => {
		isOpenModal = false;
		isChecked = '';
	};
</script>

{#if isOpenModal}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal type="modal" onClick={handleCloseModal} />
		<PcModalListDeviceScan
			{detail}
			list={listScan}
			onClose={handleCloseModal}
		/>
	</Portal>
{/if}

{#if isServerError}
	<p class="mt4 red f4 tc">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<div>
		<ContentLoader width="800" uniqueKey="scanYourDevice">
			<rect x="0" y="0" rx="5" ry="5" width="800" height="400" />
		</ContentLoader>
	</div>
{:else if detail && downloadQrCodeLink && scanDeviceQrCodeLink}
	{#if listScan.length > 0}
		<div class="pa4 br2 warning">
			<div class="fw5 i blue">{$_('image.questionScan')}</div>
			<div class="mt4">
				<label class="radio pointer light-silver">
					<input
						type="radio"
						bind:group={isChecked}
						value={config.yes}
						on:change={(event) => onChangeChecked(event.target.value)}
					/>
					<span class="box" />
					<span class="fw6 ml3">{$_('image.labelQuestionScanYes')}</span>
				</label>
			</div>
			<div class="mt3">
				<label class="radio pointer light-silver">
					<input
						type="radio"
						bind:group={isChecked}
						value={config.no}
						on:change={(event) => onChangeChecked(event.target.value)}
					/>
					<span class="box" />
					<span class="fw6 ml3">{$_('image.labelQuestionScanNo')}</span>
				</label>
			</div>
		</div>
	{/if}
	{#if listScan.length === 0 || isChecked === config.no}
		{#if step >= 1}
			<div class="light-silver f4 pv5 bt bb b--light-gray mb5">
				<b>{$_('device.downApp')}</b>
				({$_('message.step')}
				1
				{$_('message.of')}
				3)
			</div>
			<div class="flex flex-column items-center">
				<div class="fw6 f3 light-silver">{$_('message.qrStep1')}</div>
				<div class="flex mv5 items-center">
					{#if detail.brand_name === 'Apple'}
						<a href={appleLink} target="_blank">
							<img
								src="images/download_scan_ios.png"
								alt=""
								width="196px"
								height="60px"
							/>
						</a>
					{:else}
						<a href={googleLink} target="_blank">
							<img
								src="images/download_scan_android.png"
								alt=""
								width="196px"
								height="60px"
							/>
						</a>
					{/if}
					<div class="flex items-center">
						<div class="light-gray f4 fw6 mh6">{$_('message.or')}</div>
					</div>
					<div class="flex items-center justify-center">
						<img src={downloadQrCodeLink} alt="" width="100px" />
					</div>
				</div>
			</div>
		{/if}
		{#if step >= 2}
			<div
				class="light-silver f4 pv5 bt bb b--light-gray mb5"
				id="scanYourDeviceStep2"
			>
				<b>{$_('device.openApp')} </b>
				({$_('message.step')}
				2
				{$_('message.of')}
				3)
			</div>
			<div class="flex justify-center">
				<div>
					<div class="fw6 f3 light-silver">{$_('message.qrStep2')}</div>
					<div class="mt5 f4 light-silver">{$_('device.stepOpenApp')}</div>
					<div class="flex mt2">
						<div>
							<IconArrowFollowing />
						</div>
						<div class="f4 light-silver mar5">{$_('device.goToScan')}</div>
					</div>
					<div class="flex mt2 mar24">
						<div>
							<IconArrowFollowing />
						</div>
						<div class="f4 light-silver mar5">
							{$_('message.qrCodeClickBtn')}
						</div>
					</div>
					{#if step == 2}
						<div class="mt5 flex">
							<button
								type="button"
								on:click={async () => {
									setTimeout(() => {
										animateScroll.scrollTo({
											element: document.getElementById('scanYourDeviceStep3'),
											offset: -200,
										});
									}, 300);
									step = step + 1;
								}}
								class="ml3 link bg-white b--dark-blue br2 ba fw6 ttu dark-blue
								pointer grow btn-width tracked f5"
							>
								<div class="flex items-center justify-center h-50-px">
									<div>{$_('message.next')}</div>
									<span class="ml3 ir"><IconArrowRight /></span>
								</div>
							</button>
						</div>
					{/if}
				</div>
				<div class="ml6">
					<!-- svelte-ignore a11y-media-has-caption -->
					<video
						id="video"
						class="video-js"
						loop
						preload="auto"
						width="0"
						height="0"
						bind:this={video}
					>
						<source src="videos/tutoirialScanQRcode.mp4" type="video/mp4" />
					</video>
				</div>
			</div>
		{/if}
		{#if step === 3}
			<div
				class="light-silver f4 pv5 bt bb b--light-gray mv5"
				id="scanYourDeviceStep3"
			>
				<b>{$_('message.scanYourDevice')}</b>
				({$_('message.step')}
				3
				{$_('message.of')}
				3)
			</div>
			<div class="flex items-center flex-column">
				<div class="fw6 light-silver f3">{$_('device.qrCode')}</div>
				<div class="mt3 light-silver">{$_('image.qrDeviceDesc')}</div>
				<div class="mv4">
					<img src={scanDeviceQrCodeLink} alt="" width="140px" />
				</div>
				<div class="mt3 light-silver">{$_('device.qrCodeDesc')}</div>
			</div>
		{/if}
		{#if step !== 2}
			<div
				class="mt6 flex"
				class:justify-center={step === 3}
				class:justify-end={step === 1}
			>
				{#if step < 3}
					<button
						type="button"
						on:click={async () => {
							step = step + 1;
							setTimeout(() => {
								animateScroll.scrollTo({
									element: document.getElementById('scanYourDeviceStep2'),
									offset: -200,
								});
							}, 300);
						}}
						class="link bg-white b--dark-blue br2 ba fw6 ttu dark-blue pointer
							grow btn-width tracked f5"
					>
						<div class="flex items-center justify-center h-50-px">
							<div>{$_('message.next')}</div>
							<span class="ml3 ir flex items-center"><IconArrowRight /></span>
						</div>
					</button>
				{:else}
					<button
						type="button"
						on:click={async () => {
							await goto('/my-devices');
						}}
						class="link bg-light-yellow b--light-yellow br2 ba fw6 ttu
							near-black pointer grow btn-width tracked f5"
					>
						<div class="flex items-center justify-center h-50-px">
							<div>{$_('message.complete')}</div>
						</div>
					</button>
				{/if}
			</div>
		{/if}
	{/if}
{/if}

<style>
	video:focus {
		outline: none;
	}
	.mar5 {
		margin-top: 5px;
	}
	.mar24 {
		margin-left: 24px;
	}
	.btn-width {
		width: 170px;
	}
	.warning {
		background-color: rgba(54, 153, 255, 0.1);
		border: 1px solid rgba(54, 153, 255, 0.5);
	}
	.radio {
		display: inline-flex;
		align-items: center;
	}
	.radio input {
		display: none;
	}
	.radio .box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2px solid #7e8299;
		box-sizing: border-box;
	}
	.radio .box:after {
		content: '';
		display: block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: #2f3a97;
		opacity: 0;
	}
	.radio > input:checked + .box {
		border-color: #2f3a97;
	}
	.radio > input:checked + .box:after {
		opacity: 1;
	}
</style>

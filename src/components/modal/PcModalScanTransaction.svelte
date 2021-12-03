<script>
	import { onMount } from 'svelte';

	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import PcContentTutorialStep1 from '../transaction/PcContentTutorialStep1.svelte';
	import PcContentTutorialStep2 from '../transaction/PcContentTutorialStep2.svelte';
	import PcContentTutorialStep3 from '../transaction/PcContentTutorialStep3.svelte';

	import QRCode from 'qrcode';
	import { auth } from '../../stores';
	import { listScanHistory as apiListScanHistory } from '../../services/device';
	import { stores } from '@sapper/app';

	export let onClose;
	export let item = null;

	let step = 0;
	let isDoneStep0 = false;
	let isDoneStep1 = false;
	let isDoneStep2 = false;
	let isDoneStep3 = false;

	let deviceBrand = '';

	const { session } = stores();
	const { domainDevice } = $session;
	let listScan = [];

	let appleLink = 'https://apps.apple.com/ca/app/id1524735381';
	let googleLink =
		'https://play.google.com/store/apps/details?id=com.dingtoi.dingtoipro';
	let downloadQrCodeLink = '';
	let scanDeviceQrCodeLink = '';
	let isLoading = false;
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

	let progressStepSS = 1;
	let progressStepIos = 1;
	let progressStep3 = 1;

	const listScanHistory = () => {
		isLoading = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}

		return new Promise((resolve, reject) => {
			apiListScanHistory(domainDevice, {
				token: token,
				deviceId: item.id,
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
		if (item.brand_name === 'Apple') {
			dataUrl = appleLink;
		}

		const data = `${item.id}%${$auth.email}%${item.physical_grading}%${item.status}%${item.imei_id}`;
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
				// listScanHistory();
			});
		});
	};

	onMount(() => {
		if (item) {
			if (item.brand_name) {
				deviceBrand = item.brand_name;
			}
		}
		init();
	});
</script>

<div class="fixed z-max wrapper" transition:fade>
	<div class="container">
		<div
			class="modal__header h-60-px flex items-center justify-between bg-light-gray
				b--pale-grey bb ph4 near-black fw5 f4 panel ttc"
		>
			<div>{$_('order.scanTrans')}</div>
			<div class="pointer flex items-center" on:click={onClose}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 0 24 24"
					fill="#7e8299"
					width="24"
					><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
					/></svg
				>
			</div>
		</div>
		<div class="modal__body content bg-white">
			{#if item}
				<div class="steps flex">
					<div class="steps__header br b--light-gray">
						<div class="steps__header__content">
							<div
								class="step"
								class:done={step >= 0}
								class:active={step === 0}
							>
								<div class="step__number">1</div>
								<div class="step__name">{$_('label.factoryReset')}</div>
							</div>
							{#if step > 0}
								<div
									class="step"
									class:done={step >= 1}
									class:active={step === 1}
								>
									<div class="step__number">2</div>
									<div class="step__name">{$_('label.downloadApp')}</div>
								</div>
							{/if}
							{#if step > 1}
								<div
									class="step"
									class:done={step >= 2}
									class:active={step === 2}
								>
									<div class="step__number">3</div>
									<div class="step__name">{$_('message.scanYourDevice')}</div>
								</div>
							{/if}
						</div>
					</div>
					<div class="steps__body">
						{#if step === 0}
							<div class="step__content pv5 ph6" transition:fade>
								<PcContentTutorialStep1
									bind:step
									bind:isChecked={isDoneStep0}
									{deviceBrand}
									bind:progressStepSS
									bind:progressStepIos
								/>
							</div>
						{:else if step === 1}
							<div class="step__content pv5 ph6" transition:fade>
								<PcContentTutorialStep2
									bind:step
									bind:isChecked={isDoneStep1}
									{isLoading}
									{downloadQrCodeLink}
								/>
							</div>
						{:else if step === 2}
							<div class="step__content pv5 ph6" transition:fade>
								<PcContentTutorialStep3
									bind:step
									bind:isChecked={isDoneStep2}
									{isLoading}
									{scanDeviceQrCodeLink}
									bind:progressStep={progressStep3}
									{onClose}
								/>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.wrapper {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		width: min(100%, 1200px);
	}
	.container {
		display: flex;
		flex-direction: column;
		height: calc(100vh);
	}
	.panel {
		min-height: 60px;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	.content {
		flex: 1;
		overflow: auto;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	.steps__header {
		width: 200px;
		background-color: #f3f6f9;
		padding: 30px 22px;
	}
	.steps__body {
		width: calc(100% - 200px);
		min-height: calc(100vh - 60px);
	}
	.steps__header__content {
		position: sticky;
		top: 30px;
	}

	.step {
		text-align: center;
		margin-bottom: 40px;
	}
	.step__number {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		font-size: 15px;
		font-weight: bold;
		line-height: 1;
		border-radius: 50%;
		background-color: white;
		color: #6c7293;
		margin: 0 auto 10px;
	}
	.step__name {
		color: #6c7293;
		text-transform: capitalize;
	}
	.step.done .step__number {
		/* background-color: #e4e6ef; */
		background-color: #2f3a97;
		color: white;
	}
	.step.active .step__number {
		/* background-color: #2f3a97; */
		/* color: #fff; */
		background-color: #fcdb05;
		color: #2f3a97;
	}
	.step.active .step__name {
		color: #2f3a97;
		font-weight: bold;
	}
</style>

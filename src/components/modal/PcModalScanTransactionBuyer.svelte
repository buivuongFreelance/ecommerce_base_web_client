<script>
	import { onMount } from 'svelte';

	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';

	import QRCode from 'qrcode';
	import { auth } from '../../stores';
	import PcContentTutorialBuyer from '../transaction/PcContentTutorialBuyer.svelte';

	export let onClose;
	export let item = null;

	let appleLink = 'https://apps.apple.com/ca/app/id1524735381';
	let googleLink =
		'https://play.google.com/store/apps/details?id=com.dingtoi.dingtoipro';

	let scanDeviceQrCodeLink = '';
	let downloadQrCodeLink = '';
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
	let progressStep = 1;

	const init = () => {
		isLoading = true;
		let dataUrl = googleLink;
		if (item.brand_name === 'Apple') {
			dataUrl = appleLink;
		}

		const data = `${item.transaction_code}%${$auth.email}%${item.physical_grading}%${item.id}%${item.status}%${item.imei_id}`;
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
			});
		});
	};

	onMount(() => {
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
							<div class="step active">
								<div class="step__number">3</div>
								<div class="step__name">{$_('message.scanYourDevice')}</div>
							</div>
						</div>
					</div>
					<div class="steps__body">
						<div class="step__content pv5 ph6" transition:fade>
							<PcContentTutorialBuyer
								{isLoading}
								{scanDeviceQrCodeLink}
								bind:progressStep
								{onClose}
							/>
						</div>
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
	.step.active .step__number {
		background-color: #fcdb05;
		color: #2f3a97;
	}
	.step.active .step__name {
		color: #2f3a97;
		font-weight: bold;
	}
</style>

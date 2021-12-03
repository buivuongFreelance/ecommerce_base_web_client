<script>
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import { auth } from '../../stores';
	import videojs from 'video.js';
	import 'video.js/dist/video-js.css';
	import config from '../../config';
	import TabletStepQrCode from './TabletStepQrCode.svelte';

	export let onClose;
	export let item;

	let appleLink = 'https://apps.apple.com/ca/app/id1524735381';
	let googleLink =
		'https://play.google.com/store/apps/details?id=com.dingtoi.dingtoipro';
	let downloadQrEle;
	let scanQrEle;
	let step = 1;
	let player;
	let video;

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

	const handleStep1 = () => {
		let dataUrl = googleLink;
		if (item.brand_name === 'Apple') {
			dataUrl = appleLink;
		}
		QRCode.toDataURL(dataUrl, opts, function (err, url) {
			if (err) throw err;
			var img = downloadQrEle;
			img.src = url;
		});
	};

	onMount(async () => {
		handleStep1();
	});
	const handleStep2 = () => {
		step = 2;
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
	};
	const handleStep3 = () => {
		step = 3;
		setTimeout(() => {
			const data = `${$auth.email}%${item.physical_grading}%${item.id}%${item.status}%${item.imei}`;
			QRCode.toDataURL(data, opts, function (err, url) {
				if (err) throw err;
				var img = scanQrEle;
				img.src = url;
			});
		}, 300);
	};
</script>

<style>
	.wrapper {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		height: calc(100vh - 120px);
		overflow: hidden;
		border-radius: 10px;
		width: 95%;
	}
	.container {
		height: calc(100vh - 120px);
	}
	.panel {
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	.content {
		max-height: calc(100vh - 180px);
		overflow: auto;
	}
	.btn-width {
		width: 170px;
	}
	/* .hr {
		width: 170px;
		height: 1px;
		background-color: #b5b5c3;
	} */
	.step {
		width: 40px;
		height: 40px;
		line-height: 40px;
		border-radius: 100%;
	}
</style>

<div class="fixed z-max wrapper" transition:fade>
	<div class="w-100 bg-white container">
		<div
			class="h-60-px flex items-center justify-between bg-light-gray
				b--pale-grey bb ph4 fw5 f4 panel">
			<div>{$_('device.qrCode')}</div>
			<div class="pointer flex items-center" on:click={onClose}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 0 24 24"
					fill="#7e8299"
					width="24"><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
			</div>
		</div>
		<div class="ph4 content pt5">
			<TabletStepQrCode
				{step}
				onStep={(st) => {
					step = st;
					if (st === 1) {
						setTimeout(() => {
							handleStep1();
						}, 500);
					} else if (st === 2) {
						handleStep2();
					}
				}} />
			<div />
			{#if step === 1}
				<div class="flex flex-column items-center">
					<div class="flex">
						<div class="flex-auto">
							<div class="f4 light-silver fw6 mb4 mt6">
								{$_('device.linkDownScan')}
							</div>
							<div class="flex justify-center">
								{#if item.brand_name === 'Apple'}
									<a href={appleLink} target="_blank">
										<img
											src="images/download_scan_ios.png"
											alt=""
											width="196px"
											height="60px" />
									</a>
								{:else}
									<a href={googleLink} target="_blank">
										<img
											src="images/download_scan_android.png"
											alt=""
											width="196px"
											height="60px" />
									</a>
								{/if}
							</div>
						</div>

						<div class="ph6 light-gray f4 fw6 mb3 mt6">{$_('message.or')}</div>

						<div class="flex-auto">
							<div class="f4 light-silver fw6 mb4 mt6">
								{$_('device.desQRcode')}
							</div>
							<div class="flex items-center justify-center">
								<img bind:this={downloadQrEle} src="" alt="" />
							</div>
						</div>
					</div>
					<div class="mt6 mb5">
						<button
							type="button"
							on:click={handleStep2}
							class="link bg-dark-blue b--dark-blue br2 ba fw6 ttu white flex
								pointer items-center justify-center grow h-60-px btn-width
								tracked f4">{$_('message.next')}</button>
					</div>
				</div>
			{:else if step === 2}
				<div class="pt5">
					<div class="flex items-center justify-center">
						<div class="flex">
							<div class="mt4">
								<div class="flex items-center">
									<span class="step bg-dark-blue white tc f4 fw6">1</span>
									<div class="ml4 fw6 light-silver f4">
										{$_('device.stepOpenApp')}
									</div>
								</div>
								<div class="flex items-center mt4">
									<span class="step bg-dark-blue white tc f4 fw6">2</span>
									<div class="ml4 fw6 light-silver f4">
										{$_('device.goToScan')}
									</div>
								</div>
								<div class="flex items-center mt4">
									<span class="step bg-dark-blue white tc f4 fw6">2</span>
									<div class="ml4 fw6 light-silver f4">
										{$_('message.qrCodeClickBtn')}
									</div>
								</div>
							</div>
							<div class="ml6">
								<!-- svelte-ignore a11y-media-has-caption -->
								<video
									id="video"
									class="video-js"
									loop
									preload="auto"
									bind:this={video}>
									<source
										src="videos/tutoirialScanQRcode.mp4"
										type="video/mp4" />
								</video>
							</div>
						</div>
					</div>
					<div class="mt6 mb5 flex justify-center">
						<button
							type="button"
							on:click={handleStep3}
							class="link bg-dark-blue b--dark-blue br2 ba fw6 ttu white flex
								pointer items-center justify-center grow h-60-px btn-width
								tracked f4">{$_('message.next')}</button>
					</div>
				</div>
			{:else if step === 3}
				<div class="w-100 flex flex-column items-center justify-center pt6">
					<div class="f4 light-silver fw6 mb5">{$_('device.scanThisQR')}</div>
					<img bind:this={scanQrEle} src="" alt="" width="auto" />
					<div class="f4 light-silver fw6 mt5">{$_('device.qrCodeDesc')}</div>
					<button
						type="button"
						on:click={onClose}
						class="link bg-dark-blue b--dark-blue br2 ba fw6 ttu white flex
							pointer items-center justify-center grow h-60-px btn-width tracked
							f4 mt6 mb5">{$_('message.close')}</button>
				</div>
			{/if}
		</div>
	</div>
</div>

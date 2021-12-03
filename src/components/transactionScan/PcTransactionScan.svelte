<script>
	import { onMount, onDestroy } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { fade } from 'svelte/transition';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import {
		auth,
		notifyTransactionChanged,
		scanTransactionStep,
		scanTransactionTimeout,
		scanTransactionId,
	} from '../../stores';
	import QRCode from 'qrcode';
	import { detailTransaction as apiDetailTransaction } from '../../services/transaction';
	import PcTransactionScanStep1 from './PcTransactionScanStep1.svelte';
	import PcTransactionScanStep2 from './PcTransactionScanStep2.svelte';
	import PcTransactionScanStep3 from './PcTransactionScanStep3.svelte';

	import PcTransactionConfirmScanComplete from './PcTransactionConfirmScanComplete.svelte';

	export let transCode;
	export let deviceName;
	export let deviceId;
	export let isBuyer;
	export let purchaseCode;
	export let saleCode;
	export let purchaseId;
	export let saleId;
	export let id;

	const { session, page } = stores();
	const { domainTransaction } = $session;
	let isLoading = false;
	let isServerError = false;
	let item = null;

	let step = 0;
	let isDoneStep0 = false;
	let isDoneStep1 = false;
	let isDoneStep2 = false;

	let deviceBrand = 'Apple';
	let progressStepSS = 1;
	let progressStepIos = 1;
	let progressStep3 = 1;

	let appleLink = 'https://apps.apple.com/ca/app/id1524735381';
	let googleLink =
		'https://play.google.com/store/apps/details?id=com.dingtoi.dingtoipro';
	let downloadQrCodeLink = '';
	let scanDeviceQrCodeLink = '';
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
	let brand = '';
	let mounted = false;

	const unsubscribeNotifyTransactionChanged = notifyTransactionChanged.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					step = 3;
					scanTransactionTimeout.set('');
					scanTransactionStep.set(-1);
					scanTransactionId.set('');
				}
			}
		}
	);
	const unsubscribeScanTransactionChanged = scanTransactionStep.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					if ($scanTransactionId == $page.params.id) {
						saveStep(value);
					}
				}
			}
		}
	);
	const saveStep = (s) => {
		if (s) {
			if (s == 1) {
				step = 2;
				progressStep3 = 6;
			} else if (s == 2) {
				step = 2;
				progressStep3 = 7;
			}
		}
	};
	onDestroy(() => {
		unsubscribeNotifyTransactionChanged();
		unsubscribeScanTransactionChanged();
		scanTransactionStep.set(-1);
		scanTransactionTimeout.set('');
		scanTransactionId.set('');
	});
	onMount(async () => {
		mounted = true;

		await detailTransaction();
		if (item) {
			if (item.brand_name) {
				deviceBrand = item.brand_name;
			}
			init();
		}
	});

	const init = () => {
		if (item) {
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
					saveStep($scanTransactionStep);
				});
			});
		}
	};

	const handleSkip = (number) => {
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
				title: 'Very Important!',
				text:
					'You will take full responsibility for skipping this step. Are you sure you have completed all the steps on the factory reset instructions ?',
			})
			.then((result) => {
				if (result.isConfirmed) {
					if (step === 0) {
						step++;
					}
				}
			});
	};

	const detailTransaction = () => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiDetailTransaction(domainTransaction, {
				token,
				id: $page.params.id,
			})
				.then((rs) => {
					item = rs;
					id = rs.id;
					transCode = rs.transaction_code;
					deviceName = rs.model;
					deviceBrand = rs.brand_name;
					deviceId = rs.device_id;
					isBuyer = rs.is_buyer;
					purchaseCode = rs.order_number;
					saleCode = rs.order_seller_number;
					purchaseId = rs.order_id;
					saleId = rs.order_seller_id;
					brand = rs.brand_name;

					isLoading = false;
					isServerError = false;
					resolve();
				})
				.catch((error) => {
					isLoading = false;
					isServerError = true;
					reject();
				});
		});
	};

	const gotoStep = (number) => {
		if (number === 0) {
			step = 0;
		}
		if (number === 1 && step > 1) {
			step = 1;
		}
		if (number === 2 && step > 2) {
			step = 2;
		}
	};
</script>

<h2>{$_('home.transactionScan')}</h2>
<div class="steps flex">
	<div class="steps__header br b--light-gray">
		<div class="steps__header__content">
			<div
				class="step"
				class:pointer={step > 0}
				class:done={step > 0}
				class:active={step === 0}
				on:click={() => gotoStep(0)}
			>
				<div class="step__number">1</div>
				<div class="step__name">{$_('label.factoryReset')}</div>
			</div>
			<div
				class="step"
				class:pointer={step > 1}
				class:done={step > 1}
				class:active={step === 1}
				on:click={() => gotoStep(1)}
			>
				<div class="step__number">2</div>
				<div class="step__name">{$_('label.downloadApp')}</div>
			</div>

			<div
				class="step"
				class:pointer={step > 2}
				class:done={step > 2}
				class:active={step === 2}
				on:click={() => gotoStep(2)}
			>
				<div class="step__number">3</div>
				<div class="step__name">{$_('message.scanYourDevice')}</div>
			</div>
		</div>
	</div>
	<div class="steps__body">
		{#if step === 0}
			<div class="step__content pv5 ph6" transition:fade>
				<PcTransactionScanStep1
					bind:step
					bind:isChecked={isDoneStep0}
					{deviceBrand}
					bind:progressStepSS
					bind:progressStepIos
					{handleSkip}
				/>
			</div>
		{:else if step === 1}
			<div class="step__content pv5 ph6" transition:fade>
				<PcTransactionScanStep2
					bind:step
					bind:isChecked={isDoneStep1}
					{isLoading}
					{downloadQrCodeLink}
					{deviceBrand}
				/>
			</div>
		{:else if step === 2}
			<div class="step__content pv5 ph6" transition:fade>
				<PcTransactionScanStep3
					bind:step
					bind:progressStep={progressStep3}
					{isLoading}
					{scanDeviceQrCodeLink}
				/>
			</div>
		{:else}
			<div class="step__content pv5 ph6">
				<PcTransactionConfirmScanComplete {brand} {id} />
			</div>
		{/if}
	</div>
</div>

<style>
	.steps {
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);
		border-radius: 10px;
	}
	.steps__header {
		width: 200px;
		background-color: #2f3a97;
		color: #b5b5c3;
		padding: 30px 22px;
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
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
		background-color: #b5b5c3;
		color: #3f4254;
		margin: 0 auto 10px;
	}
	.step__name {
		text-transform: capitalize;
	}
	.step.done .step__number {
		/* background-color: #e4e6ef; */
		background-color: #fff;
		color: #2f3a97;
	}
	.step.done .step__name {
		color: white;
	}
	.step.active .step__number {
		/* background-color: #2f3a97; */
		/* color: #fff; */
		background-color: #fcdb05;
		color: #2f3a97;
	}
	.step.active .step__name {
		font-weight: bold;
		color: #fff;
	}
</style>

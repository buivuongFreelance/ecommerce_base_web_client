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
	} from '../../stores';
	import QRCode from 'qrcode';
	import { detailTransaction as apiDetailTransaction } from '../../services/transaction';
	import MobileTransactionScanStep1 from './MobileTransactionScanStep1.svelte';

	import MobileTransactionConfirmScanComplete from './MobileTransactionConfirmScanComplete.svelte';
	import MobileTransactionScanStep2 from './MobileTransactionScanStep2.svelte';
	import MobileTransactionScanStep3 from './MobileTransactionScanStep3.svelte';

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
				}
			}
		}
	);
	const unsubscribeScanTransactionChanged = scanTransactionStep.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					saveStep(value);
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

<h1 class="page__title tc ttc">{$_('home.transactionScan')}</h1>
<div class="steps mt1rem">
	<div class="steps__header">
		<div class="steps__header__content">
			<div
				class="step"
				class:pointer={step > 0}
				class:done={step > 0}
				class:active={step === 0}
				on:click={() => gotoStep(0)}
			>
				<div class="step__number">
					<div class="number">1</div>
					<div class="line after" />
				</div>
				<div class="step__name">{$_('label.factoryReset')}</div>
			</div>
			<div
				class="step"
				class:pointer={step > 1}
				class:done={step > 1}
				class:active={step === 1}
				on:click={() => gotoStep(1)}
			>
				<div class="step__number">
					<div class="line before" />
					<div class="number">2</div>
					<div class="line after" />
				</div>
				<div class="step__name tc">{$_('label.downloadApp')}</div>
			</div>

			<div
				class="step"
				class:pointer={step > 2}
				class:done={step > 2}
				class:active={step === 2}
				on:click={() => gotoStep(2)}
			>
				<div class="step__number">
					<div class="line before" />
					<div class="number">3</div>
				</div>
				<div class="step__name tr">{$_('message.scanYourDevice')}</div>
			</div>
		</div>
	</div>
	<div class="steps__body">
		{#if step === 0}
			<div class="step__content mt2rem" transition:fade>
				<MobileTransactionScanStep1
					bind:step
					bind:isChecked={isDoneStep0}
					{deviceBrand}
					bind:progressStepSS
					bind:progressStepIos
					{handleSkip}
				/>
			</div>
		{:else if step === 1}
			<div class="step__content pv5 " transition:fade>
				<MobileTransactionScanStep2
					bind:step
					bind:isChecked={isDoneStep1}
					{isLoading}
					{downloadQrCodeLink}
					{deviceBrand}
				/>
			</div>
		{:else if step === 2}
			<div class="step__content pv5 " transition:fade>
				<MobileTransactionScanStep3
					bind:step
					bind:progressStep={progressStep3}
					{isLoading}
					{scanDeviceQrCodeLink}
				/>
			</div>
		{:else}
			<div class="step__content pv5 ">
				<MobileTransactionConfirmScanComplete {brand} {id} />
			</div>
		{/if}
	</div>
</div>

<style>
	.steps__header {
		color: #b5b5c3;
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
	}
	.steps__header__content {
		display: flex;
		justify-content: space-between;
	}

	.step {
		flex: 1;
	}
	.step__number {
		display: flex;
		align-items: center;
	}
	.step__number .number {
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		font-size: 1rem;
		font-weight: bold;
		line-height: 1;
		border-radius: 50%;
		background-color: #e4e6ef;
		color: #b5b5c3;
	}
	.line {
		display: block;
		flex: 1;
		border-bottom: 2px solid #e4e6ef;
	}

	.step__name {
		font-size: 0.75rem;
		text-transform: capitalize;
		margin-top: 10px;
	}
	.step.done .step__number .number {
		background-color: #2f3a97;
		color: #fff;
	}
	.step.done .step__number .line {
		border-color: #2f3a97;
	}
	.step.done .step__name {
		color: #3f4254;
	}
	.step.active .step__number .number {
		background-color: #fcdb05;
		color: #2f3a97;
	}
	.step.active .step__number .line.before {
		border-color: #2f3a97;
	}
	.step.active .step__name {
		font-weight: bold;
		color: #2f3a97;
	}
</style>

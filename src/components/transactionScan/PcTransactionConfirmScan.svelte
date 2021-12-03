<script>
	import { onDestroy, onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { fade } from 'svelte/transition';

	import {
		auth,
		notifyTransactionChanged,
		scanTransactionStep,
		scanTransactionTimeout,
	} from '../../stores';

	import { detailTransaction as apiDetailTransaction } from '../../services/transaction';

	import PcTransactionConfirmScanStep1 from './PcTransactionConfirmScanStep1.svelte';
	import PcTransactionConfirmScanStep2 from './PcTransactionConfirmScanStep2.svelte';
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
	let brand = '';
	let passcode = '';
	let step = 0;
	let isDoneStep0 = false;
	let isDoneStep1 = false;
	let mounted = false;
	let progressStepOfStep2 = 1;

	const unsubscribeNotifyTransactionChanged = notifyTransactionChanged.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					step = 2;
					scanTransactionTimeout.set('');
					scanTransactionStep.set(-1);
				}
			}
		}
	);

	onMount(async () => {
		mounted = true;
		await detailTransaction();
	});
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
			if (s == 2) {
				step = 1;
				progressStepOfStep2 = 5;
			}
		}
	};
	onDestroy(() => {
		unsubscribeNotifyTransactionChanged();
		unsubscribeScanTransactionChanged();
		scanTransactionStep.set(-1);
		scanTransactionTimeout.set('');
	});

	const detailTransaction = () => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiDetailTransaction(domainTransaction, {
				token,
				id: $page.params.id,
			})
				.then((rs) => {
					if (rs) {
						item = rs;
						id = rs.id;
						transCode = rs.transaction_code;
						deviceName = rs.model;
						deviceId = rs.device_id;
						isBuyer = rs.is_buyer;
						purchaseCode = rs.order_number;
						saleCode = rs.order_seller_number;
						purchaseId = rs.order_id;
						saleId = rs.order_seller_id;
						passcode = rs.passcode;
						brand = rs.brand_name;
					}
					isLoading = false;
					isServerError = false;
					resolve();
				})
				.catch((error) => {
					isLoading = false;
					isServerError = true;
					reject(error);
				});
		});
	};
</script>

<h2>{$_('transaction.transactionScanConfirm')}</h2>
<div class="steps flex">
	<div class="steps__header br b--light-gray">
		<div class="steps__header__content">
			<div
				class="step"
				class:pointer={step > 0}
				class:done={step > 0}
				class:active={step === 0}
			>
				<div class="step__number">1</div>
				<div class="step__name">Open phone</div>
			</div>
			<div
				class="step"
				class:pointer={step > 1}
				class:done={step > 1}
				class:active={step === 1}
			>
				<div class="step__number">2</div>
				<div class="step__name">Confirm scan</div>
			</div>
		</div>
	</div>
	<div class="steps__body">
		{#if step === 0}
			<div class="step__content pv5 ph6" transition:fade>
				<PcTransactionConfirmScanStep1
					bind:step
					bind:isChecked={isDoneStep0}
					{passcode}
				/>
			</div>
		{:else if step === 1}
			<div class="step__content pv5 ph6" transition:fade>
				<PcTransactionConfirmScanStep2
					bind:step
					bind:isChecked={isDoneStep1}
					bind:progressStep={progressStepOfStep2}
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
		min-height: calc(100vh - 150px - 52px - 120px);
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
		background-color: #fff;
		color: #2f3a97;
	}
	.step.done .step__name {
		color: white;
	}
	.step.active .step__number {
		background-color: #fcdb05;
		color: #2f3a97;
	}
	.step.active .step__name {
		font-weight: bold;
		color: #fff;
	}
</style>

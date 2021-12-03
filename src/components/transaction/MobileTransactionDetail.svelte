<script>
	import { _ } from 'svelte-i18n';
	import {
		detailTransaction as apiDetailTransaction,
		shippingFakeStatus as apiShippingFakeStatus,
	} from '../../services/transaction';
	import config from '../../config';
	import { stores } from '@sapper/app';
	import { auth, notifyTransactionChanged } from '../../stores';
	import { onDestroy, onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import PcTransactionProgressBar from './PcTransactionProgressBar.svelte';
	import PcModalImageScan from '../modal/PcModalImageScan.svelte';
	import Portal from 'svelte-portal';
	import DimmerModal from '../../components/loading/DimmerModal.svelte';
	import PcRating from '../input/PcRating.svelte';
	import PcViewScanReport from '../device/PcViewScanReport.svelte';
	import IconShipping from '../icon/IconShipping.svelte';
	import PcViewCompareScanReport from '../device/PcViewCompareScanReport.svelte';
	import MobileViewCompareScanReport from '../device/MobileViewCompareScanReport.svelte';

	const { session, page } = stores();
	const { domainTransaction } = $session;

	let isLoading = false;
	let isServerError = false;
	let detail = null;
	let mounted = false;
	let isOpenImageScan = false;
	let isOpenImageScanTouch = false;
	let isOpenImageCompareScanTouch = false;

	export let transCode;
	export let deviceName;
	export let deviceId;
	export let isBuyer;
	export let purchaseCode;
	export let saleCode;
	export let purchaseId;
	export let saleId;

	$: {
		if (
			isOpenImageScan ||
			isOpenImageScanTouch ||
			isOpenImageCompareScanTouch
		) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	}
	const unsubscribeNotifyTransactionChanged = notifyTransactionChanged.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					detailTransaction();
				}
			}
		}
	);

	onMount(async () => {
		mounted = true;
		await detailTransaction();
	});
	onDestroy(() => {
		document.body.classList.remove('noscroll');
		unsubscribeNotifyTransactionChanged();
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
					detail = rs;
					transCode = rs.transaction_code;
					deviceName = rs.model;
					deviceId = rs.device_id;
					isBuyer = rs.is_buyer;
					purchaseCode = rs.order_number;
					saleCode = rs.order_seller_number;
					purchaseId = rs.order_id;
					saleId = rs.order_seller_id;
					isLoading = false;

					isServerError = false;

					if (
						rs.status === config.transaction.buyerAccept ||
						rs.status === config.transaction.buyerRejected
					) {
						setTimeout(() => {
							new BeforeAfter({
								id: '#eleCompare',
							});
						}, 1000);
					}
					resolve();
				})
				.catch((error) => {
					isLoading = false;
					isServerError = true;
					reject();
				});
		});
	};
	const isExchangeDevice = (d) => {
		if (d.type == config.buyer || d.type == config.order.group) {
			return false;
		} else if (d.type == config.seller) {
			return true;
		}
	};
	const shippingFakeStatus = (status) => {
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiShippingFakeStatus(domainTransaction, {
				id: detail.order_seller_id,
				status,
				token,
				isExchange: isExchangeDevice(detail),
			})
				.then((rs) => {
					isServerError = false;
					resolve();
				})
				.catch((error) => {
					reject();
				});
		});
	};

	const handleFakeStatusShipped = async () => {
		await shippingFakeStatus('SHIPPED');
		await detailTransaction();
	};
	const handleFakeStatusDelivered = async () => {
		await shippingFakeStatus('BUYER_RECEIVED');
		await detailTransaction();
	};
	const statusToBeShippedOnward = (detail) => {
		return (
			detail.status == config.order.toBeShipped ||
			detail.status == config.order.shipped ||
			detail.status == config.order.buyerReceived ||
			detail.status == config.order.buyerAccept
		);
	};
</script>

{#if isServerError}
	<p class="red f4">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<ContentLoader
		uniqueKey="filterOrder"
		primaryColor="#e4e6ef"
		secondaryColor="#f8f8f8"
		width={config.containerDesktop - 30}
		height="40"
	>
		<rect x="0" y="0" rx="3" ry="3" width="100%" height="40" />
	</ContentLoader>
{:else if detail}
	<div class="" />
	<PcTransactionProgressBar {detail} />
	{#if detail.status != config.order.ownerScanned && detail.status != config.order.created}
		{#if detail.shipping_rate_buyer != null}
			{#if statusToBeShippedOnward(detail)}
				<div class="mt2rem pt1rem bt b--light-gray b--dashed" />
				<h4>{$_('transaction.trackingYourTransaction')}</h4>
				<div class="flex mt1rem">
					<IconShipping fill="#6C7293" size="48" />
					<div class="flex-1 ml1rem">
						<div class="light-silver f7 ttu">
							{$_('checkout.trackingNumber')}
						</div>
						<div class="">
							{detail.shipping_rate_buyer.selectedRatePaid.tracking_number}
						</div>

						{#if detail.status == config.order.toBeShipped}
							<div class="bg-blue-10 br2 pa1rem mt2 light-silver i">
								{$_('transaction.descToBeShipped')}
							</div>
						{:else if detail.status == config.order.buyerReceived}
							<div class="bg-blue-10 br2 pa1rem mt2 light-silver i">
								{$_('transaction.descDelivered')}
							</div>
						{/if}

						<div class="mt2">
							<a
								target="_blank"
								class="fw6 dib h-40-px lh-40-px tc min-w200px bg-dark-blue white br2 ph2rem grow pointer text-decoration-none"
								href={detail.shipping_rate_buyer.selectedRatePaid
									.tracking_url_provider}
							>
								{$_('transaction.trackingYourTransaction')}
							</a>
						</div>
					</div>
				</div>
			{/if}
			{#if detail.status == config.order.toBeShipped}
				{#if (detail.email != $auth.email && detail.type == config.buyer) || (detail.email != $auth.email && detail.type == config.order.group) || (detail.email == $auth.email && detail.type == config.seller)}
					<button
						type="button"
						class="bn fw6 bg-silver white pointer grow h-40-px br2 center db ph1rem tc min-w200px absolute top0 right0"
						on:click={handleFakeStatusShipped}
					>
						Fake status shipped
					</button>
				{/if}
				<!-- <span class="db tc">{$_('transaction.descToBeShipped')}</span> -->
			{:else if detail.status == config.order.shipped}
				{#if (detail.email != $auth.email && detail.type == config.buyer) || (detail.email != $auth.email && detail.type == config.order.group) || (detail.email == $auth.email && detail.type == config.seller)}
					<button
						type="button"
						class="bn  fw6 bg-silver white pointer grow h-40-px br2 center db ph1rem tc min-w200px absolute top0 right0"
						on:click={handleFakeStatusDelivered}
					>
						Fake status delivered
					</button>
				{/if}
				<span class="db tc">{$_('transaction.descShipped')}</span>
				<!-- {:else if detail.status == config.order.buyerReceived}
				<span class="db tc">{$_('transaction.descDelivered')}</span> -->
			{/if}
		{/if}
	{/if}
	{#if (detail.email != $auth.email && detail.type == config.buyer) || (detail.email != $auth.email && detail.type == config.order.group) || (detail.email == $auth.email && detail.type == config.seller)}
		{#if statusToBeShippedOnward(detail)}
			<div class="mt2rem pt1rem bt b--light-gray b--dashed">
				<div class="">
					<h4 class="ttc">
						{$_('pickup.pickupInfo')}
					</h4>
					<div class="mt1rem">
						<a
							target="_blank"
							class="tc min-w200px dib grow pointer bg-dark-blue white br2 pv3 ph2rem fw6 text-decoration-none"
							href={detail.shipping_rate_buyer.selectedRatePaid.label_url}
						>
							{$_('checkout.getShippingLabel')}
						</a>
					</div>
				</div>
				{#if detail.shipping_rate_seller.selectedPickup}
					<table class="table-default tl mt1rem">
						<tbody>
							<tr>
								<td width="50%" class="ttc light-silver bg-light-gray"
									>{$_('checkout.firstName')}</td
								>
								<td>
									{detail.shipping_rate_seller.selectedPickup.firstNameShip}
								</td>
							</tr>
							<tr>
								<td width="50%" class="ttc light-silver bg-light-gray"
									>{$_('checkout.lastName')}</td
								>
								<td>
									{detail.shipping_rate_seller.selectedPickup.lastNameShip}
								</td>
							</tr>
							<tr>
								<td width="50%" class="ttc light-silver bg-light-gray"
									>{$_('checkout.address')}</td
								>
								<td>
									{detail.shipping_rate_seller.selectedPickup.addressShip}
								</td>
							</tr>
							<tr>
								<td width="50%" class="ttc light-silver bg-light-gray"
									>{$_('checkout.phoneNo')}</td
								>
								<td>
									{detail.shipping_rate_seller.selectedPickup.phoneShip}
								</td>
							</tr>
							<tr>
								<td width="50%" class="ttc light-silver bg-light-gray"
									>{$_('pickup.buildingLocationType')}</td
								>
								<td>
									{detail.shipping_rate_seller.selectedPickup
										.buildingLocationType}
								</td>
							</tr>
							<tr>
								<td width="50%" class="ttc light-silver bg-light-gray"
									>{$_('pickup.buildingType')}</td
								>
								<td>
									{detail.shipping_rate_seller.selectedPickup.buildingType}
								</td>
							</tr>
						</tbody>
					</table>
				{/if}
			</div>
		{/if}
	{/if}

	{#if detail.status !== config.transaction.created && detail.status !== config.transaction.buyerAccept && detail.status !== config.transaction.buyerRejected}
		{#if detail.device_last_scan}
			{#if detail.device_last_scan.main_info}
				<div class="bt b--light-gray b--dashed mt2rem pt1rem" />
				<div class="">
					<div class="">
						<h4 class="ttc">
							{$_('device.scanResult')}
						</h4>
						<div class="mt2">
							<div class="flex items-center">
								<span class="mr1 light-silver"
									>{$_('device.physicalGrading')}:</span
								>
								<span class="grade mr3 dark-blue b"
									>{$_('device.grade')}
									{detail.device_last_scan.physical_grading}</span
								>
							</div>
							<div class="flex items-center">
								<span class="mr1 light-silver"
									>{$_('label.dingtoiRating')}:</span
								>
								<PcRating
									rating={detail.device_last_scan.main_info.diamondRating}
								/>
							</div>
						</div>
						<div class="mt1">
							<div class="">
								<span class="light-silver">{$_('device.latestVersion')}:</span>
								<span>{detail.device_last_scan.main_info.released}</span>
							</div>
							<div class="">
								<span class="light-silver">{$_('device.strCa')}:</span>
								<span
									>{detail.device_last_scan.main_info.storageUsed}
									{$_('device.of')}
									{detail.device_last_scan.main_info.storage}
									{$_('device.used')}</span
								>
							</div>
						</div>
						<div class="mt3">
							<button
								type="button"
								class="bg-light-blue white h-40-px ph2rem pointer bn br2 fw6 min-w200px"
								on:click={() => (isOpenImageScan = true)}
								>{$_('device.viewScanReport')}</button
							>
						</div>
					</div>

					<PcViewScanReport
						item={detail.device_last_scan}
						bind:isOpenImageScanTouch
					/>

					{#if isOpenImageScan}
						<Portal target={document.getElementById('portal')}>
							<DimmerModal
								type="modal"
								onClick={() => (isOpenImageScan = false)}
							/>
							<PcModalImageScan
								onClose={() => (isOpenImageScan = false)}
								imageScan={detail.device_last_scan.main_info.url_summary_report}
							/>
						</Portal>
					{/if}
					{#if isOpenImageScanTouch}
						<Portal target={document.getElementById('portal')}>
							<DimmerModal
								type="modal"
								onClick={() => (isOpenImageScanTouch = false)}
							/>
							<PcModalImageScan
								onClose={() => (isOpenImageScanTouch = false)}
								imageScan={detail.device_last_scan.main_info.touch_url}
							/>
						</Portal>
					{/if}
				</div>
			{/if}
		{/if}
	{/if}

	{#if detail.status === config.proposal.buyerAccept || detail.status === config.transaction.buyerRejected}
		{#if detail.device_compare_scan}
			<div class=" bt b--light-gray b--dashed mt2rem pt2rem">
				<div class="">
					<h4 class="">{$_('transaction.compareScan')}</h4>
				</div>
				<div class="mt1rem">
					{#if detail.device_compare_scan.main_info}
						<MobileViewCompareScanReport
							compare={detail.device_compare_scan.main_info}
							item={detail.device_last_scan.main_info}
							bind:isOpenImageCompareScanTouch
							bind:isOpenImageScanTouch
						/>
						{#if isOpenImageCompareScanTouch}
							<Portal target={document.getElementById('portal')}>
								<DimmerModal
									type="modal"
									onClick={() => (isOpenImageCompareScanTouch = false)}
								/>
								<PcModalImageScan
									onClose={() => (isOpenImageCompareScanTouch = false)}
									imageScan={detail.device_compare_scan.main_info.touch_url}
								/>
							</Portal>
						{/if}
						{#if isOpenImageScanTouch}
							<Portal target={document.getElementById('portal')}>
								<DimmerModal
									type="modal"
									onClick={() => (isOpenImageScanTouch = false)}
								/>
								<PcModalImageScan
									onClose={() => (isOpenImageScanTouch = false)}
									imageScan={detail.device_last_scan.main_info.touch_url}
								/>
							</Portal>
						{/if}
					{/if}
				</div>
			</div>
		{/if}
	{/if}

	{#if detail.device_last_scan && detail.device_compare_scan}
		{#if detail.status === config.transaction.buyerAccept || detail.status === config.transaction.buyerRejected}
			<div class="bt b--light-gray b--dashed mt2rem pt2rem">
				<div class="tc">
					<h4 class="">{$_('transaction.imgCompareScan')}</h4>
					<div class="mt3 light-silver">
						{$_('transaction.hoverImage')}
					</div>
				</div>
				<div class="mt2rem relative flex justify-between items-start">
					<div class="f4 position-sticky caption caption--left">
						{$_('device.lastDeviceScan')}
						<small class="f6 light-silver"
							>({$_('transaction.isOnLeftSide')})</small
						>
					</div>
					<div class="beforeAfterContainer w-80 center">
						<div id="eleCompare" class="bal-container">
							<div class="bal-after">
								<img
									src={detail.device_compare_scan.main_info.url_summary_report}
									alt="before"
								/>
								<div class="bal-afterPosition afterLabel">
									{$_('transaction.after')}
								</div>
							</div>

							<div class="bal-before">
								<div class="bal-before-inset">
									<img
										src={detail.device_last_scan.main_info.url_summary_report}
										alt="after"
										class="afterImage"
									/>
									<div class="bal-beforePosition beforeLabel">
										{$_('transaction.before')}
									</div>
								</div>
							</div>

							<div class="bal-handle">
								<span class=" handle-left-arrow" />
								<span class="handle-right-arrow" />
							</div>
						</div>
					</div>
					<div class="f4 position-sticky caption caption--right">
						{$_('device.lastBuyerScan')}
						<small class="f6 light-silver"
							>({$_('transaction.isOnRightSide')})</small
						>
					</div>
				</div>
			</div>
		{/if}
	{/if}
{/if}

<style>
	.beforeAfterContainer {
		width: 250px;
		height: 1674px;
	}

	.afterImage {
		filter: grayscale(50%);
	}
	.caption {
		position: sticky;
		position: -webkit-sticky;
		top: 100px;
		white-space: nowrap;
		writing-mode: vertical-lr;
	}
	.caption--left {
		left: 0;
	}
	.caption--right {
		right: 0;
	}
	@media (min-width: 1199px) {
		.bal-container {
			margin: 0;
		}
	}
	@media (max-width: 479px) {
		.bal-container {
			margin: 0;
		}
	}
</style>

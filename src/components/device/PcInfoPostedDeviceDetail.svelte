<script>
	import { _ } from 'svelte-i18n';
	import { goto, stores } from '@sapper/app';
	import is, { today } from 'is_js';
	import { onMount } from 'svelte';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import { deletePostedDevice as apiDeletePostedDevice } from '../../services/device';
	import { infoImei, auth, currency } from '../../stores';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import {
		displayCurrency,
		displayDateDefault,
		displayExchangeStr,
		isObjectEmpty,
		isPastDate,
	} from '../../functions';

	import Portal from 'svelte-portal';
	import DimmerModal from '../../components/loading/DimmerModal.svelte';
	import PcModalImageScan from '../modal/PcModalImageScan.svelte';
	import PcPostDeviceImages from './PcPostDeviceImages.svelte';
	import config from '../../config';
	import PcModalLowerPriceSell from '../modal/PcModalLowerPriceSell.svelte';
	import PcButtonLowerYourPrice from '../button/PcButtonLowerYourPrice.svelte';
	import PcRating from '../input/PcRating.svelte';
	import PcScanReportItem from '../transaction/PcScanReportItem.svelte';
	import PcViewScanReport from './PcViewScanReport.svelte';

	export let onSuccessLowerPrice = null;

	const { session } = stores();
	const { domainDevice } = $session;

	let visible = false;
	let isLoadingDelete = false;
	let isOpenImageScan = false;
	let isOpenImageScanTouch = false;
	let accessories = [];

	let isOpenModalLowerPrice = false;
	let isLoadingDetail = false;
	let isServerErrorDetail = false;

	$: {
		if (isOpenImageScan) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}

		if (isOpenImageScanTouch) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	}

	const handleGotoEdit = async () => {
		await goto('my-devices/post-device/edit/' + $infoImei.id);
	};

	const deletePostedDevice = () => {
		isLoadingDelete = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiDeletePostedDevice(domainDevice, {
				token,
				postedId: $infoImei.available_id,
			})
				.then(() => {
					isLoadingDelete = false;
					resolve();
				})
				.catch(() => {
					isLoadingDelete = false;
					reject();
				});
		});
	};

	const handleDelete = () => {
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
				title: $_('device.removePostDevice'),
				text: $_('device.questionRemoveCreated'),
			})
			.then((result) => {
				if (result.value) {
					deletePostedDevice().then(() => {
						swal.fire({
							toast: true,
							position: 'top-end',
							icon: 'success',
							title: $_('message.actionSuccess'),
							showConfirmButton: false,
							timerProgressBar: true,
							timer: 1500,
							onOpen: (toast) => {
								toast.addEventListener('mouseenter', swal.stopTimer);
								toast.addEventListener('mouseleave', swal.resumeTimer);
							},
						});
						goto('/my-devices');
					});
				}
			});
	};

	onMount(() => {
		visible = true;
		if ($infoImei.accessories) {
			for (let key in $infoImei.accessories) {
				if ($infoImei.accessories[key] !== '') {
					accessories.push({ key: key, value: $infoImei.accessories[key] });
				}
			}
		}
	});
</script>

{#if isOpenModalLowerPrice}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal type="modal" onClick={() => (isOpenModalLowerPrice = false)} />
		<PcModalLowerPriceSell
			onSuccess={onSuccessLowerPrice}
			isLoading={isLoadingDetail}
			isServerError={isServerErrorDetail}
			item={$infoImei}
			onClose={() => (isOpenModalLowerPrice = false)}
		/>
	</Portal>
{/if}

{#if visible}
	<div
		class="h-60-px white bg-dark-blue mt5 b--light-gray br--top br2 flex
			items-center f4 fw6 pl4"
	>
		{$_('device.postDeviceInformation')}
	</div>
	<div class="w-100 b--light-gray br2 br--bottom ba">
		<div class="flex">
			<div class="w-50 pr5 pl4">
				{#if $infoImei}
					{#if $infoImei.main_info}
						{#if !isObjectEmpty($infoImei.other_detail)}
							<details class="more-infomation mt4" open>
								<summary
									class="link u pointer br2 fw6 ph4 pv3 bg-dark-blue white dib"
								>
									{$_('device.dingtoiScanReport')}
								</summary>
								<h4 class="mb3 mt4">
									{$infoImei.main_info.model}
								</h4>
								<div class="content-info mt4">
									<div class="flex mt3">
										<div class="flex items-center">
											<span class="mr1 light-silver"
												>{$_('device.physicalGrading')}:</span
											>
											<span class="grade mr3 dark-blue b"
												>{$_('device.grade')}
												{$infoImei.physical_grading}</span
											>
										</div>
										<div class="flex items-center">
											<span class="mr1 light-silver"
												>{$_('label.dingtoiRating')}:</span
											>
											<PcRating rating={$infoImei.main_info.diamondRating} />
										</div>
									</div>
									<div class="flex mt1 mb4">
										<div class="">
											<span>{$_('device.latestVersion')}:</span>
											<span>{$infoImei.main_info.released}</span>
										</div>
										<div class="ml2">
											<span>{$_('device.strCa')}:</span>
											<span
												>{$infoImei.main_info.storageUsed}
												{$_('device.of')}
												{$infoImei.main_info.storage}
												{$_('device.used')}</span
											>
										</div>
									</div>

									<div class="mb4">
										<button
											on:click={() => (isOpenImageScan = true)}
											type="button"
											class="bg-light-blue white h-40-px ph4 pointer bn br2 fw6"
											>{$_('device.viewScanReport')}</button
										>
									</div>

									<div class="center mt1rem">
										<PcViewScanReport
											item={$infoImei}
											bind:isOpenImageScanTouch
										/>
									</div>

									<!-- <div class="ba b--light-gray">
										{#each Object.entries($infoImei.main_info) as [key, value]}
											{#if value === 'y' || value === 'n'}
												<div class="row flex">
													<span class="pa3 b--light-gray flex-auto fw6 br ttc"
														>{key}</span
													>
													<span
														class="pa3 b--light-gray mw150 flex justify-end
															items-center"
													>
														{#if value === 'n'}
															<button
																on:click={() => (isOpenImageScanTouch = true)}
																type="button"
																class="btn-view mr3 h-30-px bn bg-light-blue
																	white br2 ph4 pointer fw6"
																>{$_('device.view')}</button
															>
														{/if}
														<PcIconYesNo status={value} />
													</span>
												</div>
											{/if}
										{/each}
									</div> -->
								</div>
							</details>
							{#if isOpenImageScan}
								<Portal target={document.getElementById('portal')}>
									<DimmerModal
										type="modal"
										onClick={() => (isOpenImageScan = false)}
									/>
									<PcModalImageScan
										onClose={() => (isOpenImageScan = false)}
										imageScan={$infoImei.main_info.url_summary_report}
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
										imageScan={$infoImei.main_info.touch_url}
									/>
								</Portal>
							{/if}
						{/if}
					{/if}
				{/if}
				{#if $infoImei.real_sale_price > 0}
					<div
						class="flex justify-center items-center mt4 b--pale-grey ba br10 pv4 mb3"
					>
						<div class="f4 fw6 near-black">
							{$_('device.sellingPrice')}
							({$currency}):
						</div>
						<div class="ml5 b f2 near-black">
							{displayCurrency($infoImei.real_sale_price, $currency)}
						</div>
					</div>
					{#if $infoImei.status !== config.device.inTransaction}
						<div class="flex justify-end">
							<PcButtonLowerYourPrice
								onClickButton={() => (isOpenModalLowerPrice = true)}
							/>

							<!-- <button
							class="dib bn h-40-px ph3 bg-dark-blue white br2 grow pointer fw6"
							on:click={() => (isOpenModalLowerPrice = true)}>
							{$_('label.lowerPrice')}
						</button> -->
						</div>
					{/if}
				{/if}
				{#if $infoImei.exchange_model}
					<div
						class="mt4 b--pale-grey ba br10 pv4 flex items-center justify-center"
					>
						<div class="flex">
							<div>
								<div class="f4 fw6 near-black">
									{$_('device.exchangePrice')}
									({$currency}):
								</div>
								<div class="steel-two tr">
									{$_(displayExchangeStr($infoImei.real_exchange_price))}
								</div>
							</div>
							<div
								class="ml5 b f2"
								class:red={$infoImei.real_exchange_price < 0}
								class:dark-blue={$infoImei.real_exchange_price >= 0}
							>
								{displayCurrency($infoImei.real_exchange_price, $currency)}
							</div>
						</div>
					</div>
					<div class="mt4 near-black b f4">
						{$_('device.deviceExchangeInfo')}
					</div>
					<div class="mt3">
						<div class="flex">
							<div class="br2 b--light-gray ba mr4">
								<img
									class="image pa3"
									src={$infoImei.exchange_model.model_image_url}
									alt="no"
								/>
							</div>
							<div>
								<div class="near-black fw6">
									{$infoImei.exchange_model.model_name}
								</div>
								<div class="mt3">
									{$_('device.color')}:
									<span class="fw6">{$infoImei.exchange_model.color_name}</span>
								</div>
								<div class="mt3">
									{$_('device.strCa')}:
									<span class="fw6"
										>{$infoImei.exchange_model.capacity_name}</span
									>
								</div>
							</div>
						</div>
					</div>
				{/if}

				{#if $infoImei.is_warranty === config.yes}
					{#if $infoImei.warranty_expire_date}
						<div class="mt4 f4 b near-black">{$_('device.warranty')}</div>
						<div class="mt3">
							<ul class="near-black d-list-item">
								<li class="">
									<b class="green i">{$_('message.expireDate')}</b>
									<span class="ph3 gray">:</span>
									{#if !isPastDate($infoImei.warranty_expire_date)}
										<span
											>{displayDateDefault(
												$infoImei.warranty_expire_date
											)}</span
										>
									{:else}<span>{$_('device.descExpired')}</span>{/if}
								</li>
							</ul>
						</div>
					{/if}
				{:else if $infoImei.is_warranty === config.unknown}
					<div class="mt4 f4 b near-black">{$_('device.warranty')}</div>
					<div class="mt3">
						<ul class="near-black d-list-item">
							<li class="light-silver">
								<b class="i">{$_('message.idontknow')}</b>
							</li>
						</ul>
					</div>
				{:else}
					<div class="mt4 f4 b near-black">{$_('device.warranty')}</div>
					<div class="mt3">
						<ul class="near-black d-list-item">
							<li class="">
								<b class="red i">{$_('device.expired')}</b>
								<span class="ph3 gray">:</span>
								<span>{$_('device.descExpired')}</span>
							</li>
						</ul>
					</div>
				{/if}

				{#if !is.empty($infoImei.additional_warranty) && $infoImei.additional_warranty}
					<div class="mt4 f4 b near-black">
						{$_('device.additionalWarranty')}
					</div>
					<div class="mt3">{$infoImei.additional_warranty}</div>
				{/if}

				{#if !is.empty($infoImei.accessories) && $infoImei.accessories}
					{#if !isObjectEmpty($infoImei.accessories)}
						<div class="mt4 mb3 b f4 near-black">
							{$_('device.accessories')}
						</div>

						{#if accessories.length > 0}
							<div class="flex flex-wrap">
								{#each accessories as accessory}
									{#if accessory.value}
										<div
											class="accessory br1 bg-white ba b--dark-blue dark-blue
												ph4 pv3 mr3 mb3"
										>
											<div class="fw6">{$_(accessory.key)}</div>
										</div>
									{/if}
								{/each}
							</div>
						{:else}
							<p class="fw5">{$_('message.noItems')}</p>
						{/if}
					{:else}
						<p class="fw5">{$_('message.noItems')}</p>
					{/if}
				{/if}
				{#if !is.empty($infoImei.additional_accessories) && $infoImei.additional_accessories}
					<div class="mt4 f4 b near-black">
						{$_('device.additionalAccessories')}
					</div>
					<div class="mt3">{$infoImei.additional_accessories}</div>
				{/if}
			</div>
			<div class="w-50 pl6 pr4">
				<div class="mt4">
					<PcPostDeviceImages images={$infoImei.images} />
				</div>
			</div>
		</div>

		{#if $infoImei.status !== config.device.inTransaction}
			<div class="flex justify-end mt5 mb5 pr4">
				<button
					type="button"
					on:click={handleGotoEdit}
					class="br2 bg-yellow b--yellow ba grow ttu h-50-px fw6 w-20 tracked mr3
					near-black pointer"
				>
					{$_('device.editPostDevice')}
				</button>
				{#if isLoadingDelete}
					<button
						type="button"
						class="br2 bg-red b--red ba grow ttu h-50-px fw6 w-20 tracked ml3
						white pointer"
					>
						<div class="flex items-center justify-center">
							<LoadingDefault />
						</div>
					</button>
				{:else}
					<button
						type="button"
						on:click={handleDelete}
						class="br2 bg-red b--red ba grow ttu h-50-px fw6 w-20 tracked ml3
						white pointer"
					>
						{$_('device.removePostDevice')}
					</button>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	.image {
		width: 120px;
		height: 160px;
		object-fit: cover;
	}

	/* .mw150 {
		min-width: 150px;
	} */
	summary:focus {
		outline: none;
	}
	/* .row:nth-child(even) {
		background-color: #f3f6f9;
	} */
	.d-list-item {
		list-style: disc;
	}
	.d-list-item li {
		display: list-item;
		margin-left: 3rem;
	}
	.accessory > * {
		line-height: 1;
	}
</style>

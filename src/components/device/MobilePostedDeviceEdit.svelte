<script>
	import { _ } from 'svelte-i18n';

	import { stores } from '@sapper/app';
	import {
		detailDevice as apiDetailDevice,
		updateDevicePosted as apiUpdateDevicePosted,
	} from '../../services/device';
	import ContentLoader from 'svelte-content-loader';
	import {
		selectedExchangeDevice,
		currency,
		selectedAccountItem,
	} from '../../stores';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import * as animateScroll from 'svelte-scrollto';

	const { session } = stores();
	const { domainDevice } = $session;
	import { auth } from '../../stores';
	import { onDestroy, onMount } from 'svelte';

	import { convertToUsd, displayCurrencyDb, isPastDate } from '../../functions';
	import config from '../../config.js';
	import * as yup from 'yup';
	import { extractError, extractErrors } from '../../functions';

	import IconArrowRight from '../icon/IconArrowRight.svelte';
	import IconArrowLeft from '../icon/IconArrowLeft.svelte';
	import MobilePostedDeviceStep from './MobilePostedDeviceStep.svelte';

	import MobilePostedSellDeviceAdd from './MobilePostedSellDeviceAdd.svelte';
	import MobilePostedDeviceInformationAdd from './MobilePostedDeviceInformationAdd.svelte';
	import MobilePostedExchangeDeviceAdd from './MobilePostedExchangeDeviceAdd.svelte';
	import MobilePostedImageAdd from './MobilePostedImageAdd.svelte';
	import MobileDeviceShippingBilling from './MobileDeviceShippingBilling.svelte';
	import MobileScanYourDevice from './MobileScanYourDevice.svelte';

	export let id;

	let step = 1;
	let errors = {};
	let errorAccessories = '';
	let isLoading = false;
	let isLoadingComplete = false;
	let detail = null;
	let isServerDetailError = false;
	let sellPrice = 0;
	let exchangePrice = 0;
	let accessories = {};
	let additionalAccessories = '';
	let warrantyExpireDate = null;
	let additionalWarranty = '';
	let isWarranty = null;
	let typeExchange = null;

	const schema = yup.object().shape({
		sellPrice: yup
			.number($_('error.number'))
			.required($_('error.required'))
			.min(1, $_('error.postedSell')),
		isWarranty: yup
			.string($_('error.string'))
			.required($_('error.warrantySell')),
	});

	onMount(async () => {
		await detailDevice();
	});

	onDestroy(() => {
		selectedExchangeDevice.set(null);
	});

	const updateDevicedPosted = () => {
		isLoadingComplete = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiUpdateDevicePosted(domainDevice, {
				availableId: detail.available_id,
				token,
				salePrice: convertToUsd(sellPrice, $currency),
				exchangePrice:
					typeExchange == config.exchangeType.offer
						? convertToUsd(-exchangePrice, $currency)
						: convertToUsd(exchangePrice, $currency),
				exchangeModel: $selectedExchangeDevice,
				accessories: accessories,
				warrantyExpireDate: isWarranty ? warrantyExpireDate : null,
				additionalAccessories: additionalAccessories,
				additionalWarranty: additionalWarranty,
				isWarranty: isWarranty,
			})
				.then(() => {
					isLoadingComplete = false;
					resolve();
				})
				.catch((error) => {
					isLoadingComplete = false;
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.serverErrorTitle'),
						text: $_('error.serverErrorMessage'),
						reverseButtons: true,
						customClass: {
							icon: 'icon-error',
						},
					});
					reject(error);
				});
		});
	};

	const detailDevice = () => {
		isLoading = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}

		return new Promise((resolve, reject) => {
			apiDetailDevice(domainDevice, {
				id,
				token,
			})
				.then((info) => {
					isLoading = false;
					detail = info;
					sellPrice = displayCurrencyDb(info.real_sale_price, $currency);
					exchangePrice = displayCurrencyDb(
						Math.abs(info.real_exchange_price),
						$currency
					);
					if (info.real_exchange_price >= 0) {
						typeExchange = config.exchangeType.request;
					} else {
						typeExchange = config.exchangeType.offer;
					}
					selectedExchangeDevice.set(info.exchange_model);
					accessories = info.accessories ? info.accessories : {};
					(additionalAccessories = info.additional_accessories),
						(additionalWarranty = info.additional_warranty),
						(warrantyExpireDate = info.warranty_expire_date
							? new Date(info.warranty_expire_date)
							: info.warranty_expire_date);
					isWarranty = info.is_warranty;
					isServerDetailError = false;
					resolve();
				})
				.catch(() => {
					isLoading = false;
					isServerDetailError = true;
					reject();
				});
		});
	};

	const handleComplete = async () => {
		try {
			await updateDevicedPosted();

			if (detail.status === config.device.waitingForScan) {
				selectedAccountItem.set({
					id: detail.id,
					status: detail.status,
					imei: detail.imei,
				});
			}
			step = 5;
			animateScroll.scrollToTop();
		} catch (error) {}
	};

	const handleStep3 = () => {
		if (typeExchange == config.exchangeType.request) {
			if (Number(exchangePrice) < sellPrice) {
				step = 3;
				animateScroll.scrollToTop();
			} else {
				swal.fire({
					position: 'top',
					icon: 'error',
					title: $_('error.formError'),
					text: $_('error.exchangePriceSmall', {
						values: { number: sellPrice + ' ' + $currency },
					}),
					reverseButtons: true,
					customClass: {
						icon: 'icon-error',
					},
				});
			}
		} else {
			step = 3;
			animateScroll.scrollToTop();
		}
	};

	const handleStep4 = () => {
		step = 4;
		animateScroll.scrollToTop();
	};

	const handleStep2 = async () => {
		try {
			await schema.validate(
				{
					sellPrice: sellPrice,
					isWarranty: isWarranty,
				},
				{ abortEarly: false }
			);
			let flag = true;
			if (isWarranty === config.yes) {
				if (
					warrantyExpireDate === null ||
					warrantyExpireDate === '' ||
					isPastDate(warrantyExpireDate)
				) {
					flag = false;
				}
			}
			let flagAccess = false;
			errorAccessories = true;
			for (const [key, value] of Object.entries(accessories)) {
				if (value) {
					flagAccess = true;
					errorAccessories = false;
					break;
				}
			}
			//flag = flagAccess;
			if (flag && flagAccess) {
				step = 2;
				animateScroll.scrollToTop();
			} else {
				animateScroll.scrollTo({
					element: document.getElementById('isWarranty'),
					offset: -250,
				});
				swal.fire({
					toast: true,
					position: 'top-end',
					icon: 'error',
					title: $_('error.commonErrorForm'),
					showConfirmButton: false,
					timerProgressBar: true,
					timer: 1500,
					onOpen: (toast) => {
						toast.addEventListener('mouseenter', swal.stopTimer);
						toast.addEventListener('mouseleave', swal.resumeTimer);
					},
				});
			}
		} catch (error) {
			if (error) {
				errors = extractErrors(error);
				animateScroll.scrollTo({
					element: document.getElementById(Object.keys(errors)),
					offset: -250,
				});
				swal.fire({
					toast: true,
					position: 'top-end',
					icon: 'error',
					title: $_('error.commonErrorForm'),
					showConfirmButton: false,
					timerProgressBar: true,
					timer: 1500,
					onOpen: (toast) => {
						toast.addEventListener('mouseenter', swal.stopTimer);
						toast.addEventListener('mouseleave', swal.resumeTimer);
					},
				});
			}
		}
	};

	const validate = async (field, value) => {
		try {
			await schema.validateAt(field, {
				[field]: value,
			});
			errors[field] = '';
		} catch (error) {
			errors[field] = extractError(error, field);
		}
	};
</script>

{#if isServerDetailError}
	<p class="red f4">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<ContentLoader
		uniqueKey="postedDevice"
		primaryColor="#e4e6ef"
		secondaryColor="#f8f8f8"
		width={375}
		height="200"
	>
		<rect x="0" y="0" rx="3" ry="3" width="45%" height="40" />
		<rect x="0" y="60" rx="3" ry="3" width="45%" height="20" />
		<rect x="0" y="100" rx="3" ry="3" width="45%" height="20" />
		<rect x="0" y="140" rx="3" ry="3" width="45%" height="20" />
		<rect x="0" y="180" rx="3" ry="3" width="45%" height="20" />
		<rect x="50%" y="0" rx="3" ry="3" width="50%" height="200" />
	</ContentLoader>
{:else if detail}
	<h3 class="page__title ttc tc">
		<small class="page__subtitle db f4 mb2 fw4 light-silver">
			{$_('device.editPostDevice')}
		</small>
		{detail.model}
	</h3>

	<div class="mt5">
		<MobilePostedDeviceStep {step} onStep={(st) => (step = st)} />
	</div>

	{#if step === 1}
		<h4 class="light-silver mt2rem tc">{$_('device.sellYourDevice')}</h4>
		<div class="mt4">
			<div id="sellPrice">
				<MobilePostedSellDeviceAdd
					onUpdate={(value) => validate('sellPrice', value)}
					bind:bindValue={sellPrice}
					error={errors.sellPrice}
				/>
			</div>
			<hr class="hr mv1rem" />
			<div class="" id="isWarranty">
				<MobilePostedDeviceInformationAdd
					onChangeWarranty={(value) => validate('isWarranty', value)}
					error={errors.isWarranty}
					bind:accessories
					bind:isWarranty
					bind:warrantyExpireDate
					bind:errorAccessories
				/>
			</div>
		</div>
		<div class="flex justify-end">
			<button
				type="button"
				on:click={handleStep2}
				class="link bg-white b--dark-blue br2 ba fw6 ttu dark-blue pointer
					grow btn-width tracked f5"
			>
				<div class="flex items-center justify-center h-50-px">
					<div>{$_('message.next')}</div>
					<span class="ml3 ir flex items-center"><IconArrowRight /></span>
				</div>
			</button>
		</div>
	{:else if step === 2}
		<div class="mt5">
			<MobilePostedExchangeDeviceAdd
				{sellPrice}
				bind:typeExchange
				bind:bindValue={exchangePrice}
				onNextStep={handleStep3}
			/>
		</div>
		<div class="mt5 flex justify-end">
			<div>
				<button
					type="button"
					on:click={() => {
						animateScroll.scrollToTop();
						step = 1;
					}}
					class="link bg-white br2 ba fw6 ttu near-black b--pale-grey pointer
						flex items-center justify-center grow btn-width-back tracked f5"
					><div class="flex items-center justify-center h-50-px">
						<IconArrowLeft />
					</div></button
				>
			</div>
			<button
				type="button"
				on:click={handleStep3}
				class="ml3 link bg-white b--dark-blue br2 ba fw6 ttu dark-blue pointer
					grow btn-width tracked f5"
			>
				<div class="flex items-center justify-center h-50-px">
					<div>{$_('message.next')}</div>
					<span class="ml3 ir flex items-center"><IconArrowRight /></span>
				</div>
			</button>
		</div>
	{:else if step === 3}
		<div class="mt6">
			<MobilePostedImageAdd {id} />
		</div>
		<div class="flex justify-end mt5">
			<div>
				<button
					type="button"
					on:click={() => {
						animateScroll.scrollToTop();
						step = 2;
					}}
					class="link bg-white br2 ba fw6 ttu near-black b--pale-grey pointer
						flex items-center justify-center grow btn-width-back tracked f5"
					><div class="flex items-center justify-center h-50-px">
						<IconArrowLeft />
					</div></button
				>
			</div>
			<button
				type="button"
				on:click={handleStep4}
				class="ml3 link bg-white b--dark-blue br2 ba fw6 ttu dark-blue
						pointer grow btn-width tracked f5"
			>
				<div class="flex items-center justify-center h-50-px">
					<div>{$_('message.next')}</div>
					<span class="ml3 ir flex items-center"><IconArrowRight /></span>
				</div>
			</button>
		</div>
	{:else if step === 4}
		<div class="mt6">
			<MobileDeviceShippingBilling
				bind:step
				onComplete={handleComplete}
				{isLoadingComplete}
			/>
		</div>
	{:else if step === 5}
		<div class="mt6">
			<MobileScanYourDevice {detail} />
		</div>
	{/if}
{/if}

<style>
	.btn-width {
		width: 120px;
	}
	.btn-width-back {
		width: 40px;
	}
	.hr {
		background-color: #e4e6ef;
		border: 0;
		height: 1px;
	}
</style>

<script>
	import { _ } from 'svelte-i18n';
	import MobilePostedDeviceStep from './MobilePostedDeviceStep.svelte';
	import MobilePostedSellDeviceAdd from './MobilePostedSellDeviceAdd.svelte';
	import { stores } from '@sapper/app';
	import {
		detailDevice as apiDetailDevice,
		updateDeviceWaitingForScan as apiUpdateDeviceWaitingForScan,
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
	import * as yup from 'yup';
	import { extractError, extractErrors } from '../../functions';

	import { auth } from '../../stores';
	import { onDestroy, onMount } from 'svelte';
	import MobilePostedExchangeDeviceAdd from './MobilePostedExchangeDeviceAdd.svelte';
	import MobilePostedDeviceInformationAdd from './MobilePostedDeviceInformationAdd.svelte';
	import MobilePostedImageAdd from './MobilePostedImageAdd.svelte';
	import { convertToUsd } from '../../functions';
	import config from '../../config.js';
	import MobileScanYourDevice from './MobileScanYourDevice.svelte';
	import IconArrowRight from '../icon/IconArrowRight.svelte';
	import IconArrowLeft from '../icon/IconArrowLeft.svelte';
	import MobileDeviceShippingBilling from './MobileDeviceShippingBilling.svelte';
	import LoadingDefault from '../loading/LoadingDefault.svelte';

	const { session } = stores();
	const { domainDevice } = $session;
	export let id;

	let step = 1;
	let errorAccessories = '';

	let errors = {};
	let isLoading = false;
	let isLoadingComplete = false;
	let detail = null;
	let isServerDetailError = false;
	let sellPrice = 0;
	let exchangePrice = 0;
	let accessories = {
		'server.noAccessories': false,
	};
	let warrantyExpireDate = null;
	let isWarranty = null;
	let typeExchange = config.exchangeType.offer;

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

	const updateDeviceWaitingForScan = () => {
		isLoadingComplete = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiUpdateDeviceWaitingForScan(domainDevice, {
				deviceId: id,
				token,
				salePrice: convertToUsd(sellPrice, $currency),
				exchangePrice:
					typeExchange == config.exchangeType.offer
						? convertToUsd(-exchangePrice, $currency)
						: convertToUsd(exchangePrice, $currency),
				exchangeModel: $selectedExchangeDevice,
				accessories: accessories,
				warrantyExpireDate: isWarranty ? warrantyExpireDate : null,
				isWarranty: isWarranty,
				isImage: step === 3 ? true : false,
			})
				.then((obj) => {
					isLoadingComplete = false;
					resolve(obj);
				})
				.catch((error) => {
					let text = $_('error.serverErrorMessage');
					const {
						response: { data },
					} = error;
					if (data) {
						const { obj } = data;
						if (obj === 'no image') {
							text = $_('error.noImage');
						}
					}
					isLoadingComplete = false;
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.serverErrorTitle'),
						reverseButtons: true,
						text: text,
						customClass: {
							icon: 'icon-error',
						},
					});
					reject();
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
			const id = await updateDeviceWaitingForScan();
			selectedAccountItem.set({
				id,
			});
			step = 5;
			animateScroll.scrollToTop();
		} catch (error) {}
	};

	const handleStep3 = () => {
		if (typeExchange == config.exchangeType.request) {
			if (Number(exchangePrice) < Number(sellPrice)) {
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
	const handleStep4 = async () => {
		try {
			const id = await updateDeviceWaitingForScan();
			selectedAccountItem.set({
				id,
			});
			step = 4;
			animateScroll.scrollToTop();
		} catch (error) {}
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
				if (warrantyExpireDate === null || warrantyExpireDate == '') {
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
			//	flag = flagAccess;
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
		width="375"
		height="200"
	>
		<rect x="0" y="0" rx="3" ry="3" width="200" height="40" />
		<rect x="0" y="60" rx="3" ry="3" width="200" height="20" />
		<rect x="0" y="100" rx="3" ry="3" width="200" height="20" />
		<rect x="0" y="140" rx="3" ry="3" width="200" height="20" />
		<rect x="0" y="180" rx="3" ry="3" width="200" height="20" />
		<rect x="210" y="0" rx="3" ry="3" width="100" height="200" />
	</ContentLoader>
{:else if detail}
	<h3 class="ttc tc">{$_('device.postDevice')}</h3>
	<p class="tc f4 fw5 light-silver">{detail.model}</p>
	<div class="mt5">
		<MobilePostedDeviceStep {step} onStep={(st) => (step = st)} />
	</div>
	{#if step === 1}
		<h3 class="light-silver mt5 b tc">{$_('device.sellYourDevice')}</h3>
		<div class="mt3">
			<div id="sellPrice">
				<MobilePostedSellDeviceAdd
					onUpdate={(value) => validate('sellPrice', value)}
					bind:bindValue={sellPrice}
					error={errors.sellPrice}
				/>
			</div>
			<hr class="hr mv5" />
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
				class="link bg-white b--dark-blue br2 ba fw6 ttu dark-blue btn-width
					tracked f5"
			>
				<div class="flex items-center justify-center h-40-px">
					<div>{$_('message.next')}</div>
					<span class="ml3 ir flex items-center"><IconArrowRight /></span>
				</div>
			</button>
		</div>
	{:else if step === 2}
		<div class="mt5">
			<MobilePostedExchangeDeviceAdd
				bind:typeExchange
				{sellPrice}
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
					><div class="flex items-center justify-center h-40-px">
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
				<div class="flex items-center justify-center h-40-px">
					<div>{$_('message.next')}</div>
					<span class="ml3 ir"><IconArrowRight /></span>
				</div>
			</button>
		</div>
	{:else if step === 3}
		<div class="mt6">
			<MobilePostedImageAdd {id} />
		</div>
		<div class="flex justify-end">
			<div>
				<button
					type="button"
					on:click={() => {
						animateScroll.scrollToTop();
						step = 2;
					}}
					class="link bg-white br2 ba fw6 ttu near-black b--pale-grey pointer
						flex items-center justify-center grow btn-width-back tracked f5"
					><div class="flex items-center justify-center h-40-px">
						<IconArrowLeft />
					</div></button
				>
			</div>
			{#if isLoadingComplete}
				<button
					type="button"
					class="ml3 link bg-white b--dark-blue br2 ba fw6 ttu dark-blue pointer
						grow btn-width tracked f5"
				>
					<div class="flex items-center justify-center h-40-px">
						<LoadingDefault />
					</div>
				</button>
			{:else}
				<button
					type="button"
					on:click={handleStep4}
					class="ml3 link bg-white b--dark-blue br2 ba fw6 ttu dark-blue pointer
						grow btn-width tracked f5"
				>
					<div class="flex items-center justify-center h-40-px">
						<div>{$_('message.next')}</div>
						<span class="ml3 ir"><IconArrowRight /></span>
					</div>
				</button>
			{/if}
		</div>
	{:else if step === 4}
		<div class="mt6">
			<MobileDeviceShippingBilling
				bind:step
				{isLoadingComplete}
				onComplete={handleComplete}
			/>
		</div>
	{:else if step === 5}
		<div class="mt5">
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

<script>
	import { _ } from 'svelte-i18n';
	import { goto, stores } from '@sapper/app';
	import * as yup from 'yup';
	import {
		convertCurrency,
		displayCurrency,
		extractError,
		extractErrors,
		isObjectEmpty,
		isSameShippingFunc,
		postCanadaGetExtractDesc,
	} from '../../functions';
	import * as animateScroll from 'svelte-scrollto';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import {
		createShipping as apiCreateShipping,
		createBilling as apiCreateBilling,
		getShippingAndBilling as apiGetShippingAndBilling,
		confirmOrder as apiConfirmOrder,
		validationAddress as apiValidationAddress,
		shipments as apiShipments,
	} from '../../services/transaction';
	import {
		auth,
		selectedItemsCheckout,
		totalShipping as storeTotalShipping,
		settings,
		selectListConfirm,
		listCartFailed,
		currency,
	} from '../../stores';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import ContentLoader from 'svelte-content-loader';
	import { onMount } from 'svelte';
	import config from '../../config';
	import MobileStepCheckout from './MobileStepCheckout.svelte';
	import MobileShippingAddress from './MobileShippingAddress.svelte';
	import MobileBillingAddress from './MobileBillingAddress.svelte';
	import MobileConfirmCart from './MobileConfirmCart.svelte';
	import MobilePayment from './MobilePayment.svelte';

	const { session } = stores();
	const { domainTransaction, domainProposal, domainModel } = $session;

	let listConfirm = {};

	let isLoadingContinue = false;
	let isLoading = false;
	let isLoadingShippo = false;
	let isLoadingShippoExchange = false;
	let totalReceive = 0;
	let totalPay = 0;
	let totalDingtoiFee = 0;
	let totalShip = 0;
	let totalShipExchange = 0;
	let realTotal = 0;
	let isValidate = true;

	let isServerError = false;
	let detailShipping = null;

	let step = 1;
	let oldStep = 1;
	let errors = {};
	let values = {
		firstNameShip: '',
		lastNameShip: '',
		addressShip: '',
		cityShip: '',
		provinceShip: '',
		postalCodeShip: '',
		phoneShip: '',
		countryShip: '',
		optionalShip: '',
		firstNameBill: '',
		lastNameBill: '',
		addressBill: '',
		cityBill: '',
		provinceBill: '',
		postalCodeBill: '',
		phoneBill: '',
		countryBill: '',
		optionalBill: '',
	};
	let isSameShipping = true;
	let isSelect = false;

	const schema = yup.object().shape({
		firstNameShip: yup
			.string($_('error.string'))
			.required($_('error.required')),
		lastNameShip: yup.string($_('error.string')).required($_('error.required')),
		addressShip: yup.string($_('error.string')).required($_('error.required')),
		phoneShip: yup.string($_('error.string')).required($_('error.required')),
		firstNameBill: yup
			.string($_('error.string'))
			.required($_('error.required')),
		lastNameBill: yup.string($_('error.string')).required($_('error.required')),
		addressBill: yup.string($_('error.string')).required($_('error.required')),
		phoneBill: yup.string($_('error.string')).required($_('error.required')),
	});

	const schemaShipping = yup.object().shape({
		firstNameShip: yup
			.string($_('error.string'))
			.required($_('error.required')),
		lastNameShip: yup.string($_('error.string')).required($_('error.required')),
		addressShip: yup.string($_('error.string')).required($_('error.required')),
		phoneShip: yup.string($_('error.string')).required($_('error.required')),
	});

	$: {
		if (step !== oldStep) {
			oldStep = step;
			if (step === 1) {
				getShippingAndBilling();
			}
		}
	}

	onMount(async () => {
		if ($selectedItemsCheckout.length === 0) {
			await goto('/cart');
		} else {
			try {
				if (step === 1) {
					await getShippingAndBilling();
				}
			} catch (error) {}
		}
	});

	const onStep3 = () => {
		let flag = true;
		for (const [key, value] of Object.entries(listConfirm)) {
			if (!value[0].selectedRate && !value[0].ratesExchange) {
				flag = false;
			}
		}
		if (flag) {
			selectListConfirm.set(listConfirm);
			storeTotalShipping.set(
				Number(displayCurrency(totalShip + totalShipExchange, $currency))
			);
			step = 3;
			animateScroll.scrollToTop();
		} else {
			swal.fire({
				position: 'top',
				icon: 'error',
				title: $_('error.error'),
				text: $_('error.pleaseSelectShipping'),
				reverseButtons: true,
				customClass: {
					icon: 'icon-error',
				},
			});
		}
	};
	const handleBack = async () => {
		if (step === 1) {
			await goto('/cart');
		} else if (step === 2) step = 1;
		else step = 2;
	};
	const validate = async (field, value) => {
		try {
			values[field] = value;
			if (!isSameShipping) await schema.validateAt(field, values);
			else await schemaShipping.validateAt(field, values);
			errors[field] = '';
		} catch (error) {
			errors[field] = extractError(error, field);
		}
	};

	const getShippingAndBilling = () => {
		isLoading = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiGetShippingAndBilling(domainTransaction, {
				token,
			})
				.then((obj) => {
					if (!isObjectEmpty(obj)) {
						const sh = obj.shipping;
						const bl = obj.billing;
						if (sh) {
							detailShipping = sh;
						}

						if (!isSameShippingFunc(sh, bl)) {
							isSameShipping = false;
						}
						values = {
							firstNameShip: sh ? sh.first_name : '',
							lastNameShip: sh ? sh.last_name : '',
							addressShip: sh ? sh.address : '',
							phoneShip: sh ? sh.phone_number : '',
							firstNameBill: bl ? bl.first_name : '',
							lastNameBill: bl ? bl.last_name : '',
							addressBill: bl ? bl.address : '',
							phoneBill: bl ? bl.phone_number : '',
						};
					}

					isLoading = false;
					isServerError = false;
					resolve(obj);
				})
				.catch((error) => {
					isLoading = false;
					isServerError = true;
					reject();
				});
		});
	};

	const createShipping = (objAddressShip) => {
		isLoadingContinue = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiCreateShipping(domainTransaction, {
				token,
				firstName: values.firstNameShip,
				lastName: values.lastNameShip,
				address: objAddressShip.street,
				city: objAddressShip.city,
				postalCode: objAddressShip.postalCode,
				country: config.selectedCountry,
				phoneNumber: values.phoneShip,
				province: objAddressShip.state,
				extension: '',
			})
				.then(() => {
					detailShipping.address = values.addressShip;
					detailShipping.city_name = objAddressShip.cityName;
					detailShipping.firstName = values.firstNameShip;
					detailShipping.lastName = values.lastNameShip;
					detailShipping.phoneNumber = values.phoneShip;
					detailShipping.postalCode = objAddressShip.postalCode;
					detailShipping.province = objAddressShip.state;
					detailShipping = detailShipping;

					isLoadingContinue = false;
					resolve();
				})
				.catch((error) => {
					isLoadingContinue = false;
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
					reject();
				});
		});
	};

	const createBilling = (objAddressShip, objAddressBill) => {
		isLoadingContinue = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiCreateBilling(domainTransaction, {
				token,
				firstName: isSameShipping ? values.firstNameShip : values.firstNameBill,
				lastName: isSameShipping ? values.lastNameShip : values.lastNameBill,
				address: isSameShipping ? objAddressShip.street : objAddressBill.street,
				city: isSameShipping ? objAddressShip.city : objAddressBill.city,
				postalCode: isSameShipping
					? objAddressShip.postalCode
					: objAddressBill.postalCode,
				country: config.selectedCountry,
				province: isSameShipping ? objAddressShip.state : objAddressBill.state,
				phoneNumber: isSameShipping ? values.phoneShip : values.phoneBill,
				extension: '',
			})
				.then(() => {
					isLoadingContinue = false;
					resolve();
				})
				.catch((error) => {
					isLoadingContinue = false;
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
					reject();
				});
		});
	};
	const validateAddresses = () => {
		isLoadingContinue = true;
		return new Promise((resolve, reject) => {
			apiValidationAddress(config.domainCanadaPostAddressComplete, {
				token: config.canadaPostAddressCompleteToken,
				keyword: values.addressShip,
			})
				.then((result) => {
					isLoadingContinue = false;
					resolve(result);
				})
				.catch((error) => {
					isLoadingContinue = false;
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
					reject();
				});
		});
	};

	const shipments = (addressFrom, parcelsShip) => {
		isLoadingShippo = true;
		let countryTo = '';
		let cityTo = '';

		return new Promise((resolve, reject) => {
			apiShipments(config.domainShippo, {
				token: config.shippoToken,
				address_from: {
					name: addressFrom.name,
					street1: addressFrom.street1,
					city: addressFrom.city,
					state: addressFrom.state,
					zip: addressFrom.zip,
					country: addressFrom.country,
				},
				address_to: {
					name: values.firstNameShip + ' ' + values.lastNameShip,
					street1: values.addressShip,
					city: cityTo,
					state: values.provinceShip,
					zip: values.postalCodeShip,
					country: countryTo,
					phone: values.phoneShip,
					email: $auth.email,
				},
				parcels: parcelsShip,
			})
				.then((obj) => {
					isLoadingShippo = false;
					resolve(obj.data.rates);
				})
				.catch((error) => {
					isLoadingShippo = false;
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
					reject();
				});
		});
	};
	const shipmentsForExchange = (addressTo, parcelsShip) => {
		isLoadingShippoExchange = true;
		let countryTo = '';
		let cityTo = '';

		return new Promise((resolve, reject) => {
			apiShipments(config.domainShippo, {
				token: config.shippoToken,
				address_from: {
					name: values.firstNameShip + ' ' + values.lastNameShip,
					street1: values.addressShip,
					city: cityTo,
					state: values.provinceShip,
					zip: values.postalCodeShip,
					country: countryTo,
					phone: values.phoneShip,
					email: $auth.email,
				},
				address_to: {
					name: addressTo.name,
					street1: addressTo.street1,
					city: addressTo.city,
					state: addressTo.state,
					zip: addressTo.zip,
					country: addressTo.country,
				},
				parcels: parcelsShip,
			})
				.then((obj) => {
					isLoadingShippoExchange = false;
					resolve(obj.data.rates);
				})
				.catch((error) => {
					isLoadingShippoExchange = false;
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
					reject();
				});
		});
	};
	const confirmOrder = () => {
		isLoading = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiConfirmOrder(domainTransaction, {
				token,
				listCart: $selectedItemsCheckout,
			})
				.then((l) => {
					listConfirm = l.list;
					totalReceive = l.totalReceive;
					totalPay = l.totalPay;
					totalDingtoiFee = l.totalDingtoiFee;
					isValidate = l.validate;
					totalShip = 0;
					totalShipExchange = 0;
					if (l.validate) {
						for (const [key, value] of Object.entries(listConfirm)) {
							const checkType =
								value[0].proposal_type !== config.exchange
									? config.sell
									: config.exchange;
							let countDeviceExchange = 0;
							for (let i = 0; i < value.length; i++) {
								if (value[i].proposal_type === config.exchange) {
									if (value[i].proposal_exchange_devices) {
										countDeviceExchange +=
											value[i].proposal_exchange_devices.length;
									}
								}
							}
							const addressSeller = {
								name: value[0].first_name + ' ' + value[0].last_name,
								street1: value[0].address,
								city: value[0].city,
								state: value[0].state_code,
								zip: value[0].zip,
								country: value[0].country_code,
							};

							let parcelShip = {
								length: config.deviceMobile.length * value.length,
								width: config.deviceMobile.width * value.length,
								height: config.deviceMobile.height * value.length,
								weight: config.deviceMobile.weight * value.length,
								mass_unit: config.deviceMobile.mass_unit,
								distance_unit: config.deviceMobile.distance_unit,
							};

							if (checkType === config.sell) {
								shipments(addressSeller, [parcelShip]).then((rates) => {
									rates = rates.reverse();
									listConfirm[key][0].rates = rates;

									if (rates.length > 0) {
										let ratesMin = rates[0];
										for (let i = 0; i < rates.length; i++) {
											if (Number(rates[i].amount) < Number(ratesMin.amount)) {
												ratesMin = rates[i];
											}
										}
										listConfirm[key][0].selectedRate = ratesMin;
										totalShip += Number(
											convertCurrency(
												ratesMin.amount,
												ratesMin.currency,
												$settings
											)
										);
									} else {
										listConfirm[key][0].ratesError = true;
									}
									realTotal =
										Number(totalPay) +
										Number(totalDingtoiFee) +
										Number(totalShip) +
										Number(totalShipExchange);
								});
							} else {
								parcelShip = {
									length: config.deviceMobile.length * countDeviceExchange,
									width: config.deviceMobile.width * countDeviceExchange,
									height: config.deviceMobile.height * countDeviceExchange,
									weight: config.deviceMobile.weight * countDeviceExchange,
									mass_unit: config.deviceMobile.mass_unit,
									distance_unit: config.deviceMobile.distance_unit,
								};
								shipmentsForExchange(addressSeller, [parcelShip]).then(
									(rates) => {
										rates = rates.reverse();
										listConfirm[key][0].ratesExchange = rates;
										if (rates.length > 0) {
											let ratesMin = rates[0];
											for (let i = 0; i < rates.length; i++) {
												if (Number(rates[i].amount) < Number(ratesMin.amount)) {
													ratesMin = rates[i];
												}
											}
											listConfirm[key][0].selectedRateExchange = ratesMin;
											totalShipExchange += Number(
												convertCurrency(
													ratesMin.amount,
													ratesMin.currency,
													$settings
												)
											);
										} else {
											listConfirm[key][0].ratesErrorExchange = true;
										}
										realTotal =
											Number(totalPay) +
											Number(totalDingtoiFee) +
											Number(totalShip) +
											Number(totalShipExchange);
									}
								);
							}
						}

						isLoading = false;
					} else {
						listCartFailed.set(l.listFailed);
						isLoading = false;
					}
					resolve();
				})
				.catch((error) => {
					isLoading = false;
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
	const handleStepOne = async () => {
		try {
			if (!isSameShipping) await schema.validate(values, { abortEarly: false });
			else await schemaShipping.validate(values, { abortEarly: false });

			if (isSameShipping) {
				values.firstNameBill = values.firstNameShip;
				values.lastNameBill = values.lastNameShip;
				values.addressBill = values.addressShip;
				values.phoneBill = values.phoneShip;

				values = values;
			}
			await validateAddresses();

			const objAddressShip = await postCanadaGetExtractDesc(
				values.addressShip,
				domainModel
			);

			const objAddressBill = await postCanadaGetExtractDesc(
				values.addressBill,
				domainModel
			);

			await createShipping(objAddressShip);
			await createBilling(objAddressShip, objAddressBill);
			await confirmOrder();
			step = 2;
			animateScroll.scrollToTop();
		} catch (error) {
			if (error) {
				errors = extractErrors(error);
				animateScroll.scrollTo({
					element: document.getElementById(Object.keys(errors)[0]),
					offset: -240,
				});
				swal.fire({
					toast: true,
					position: 'top-end',
					icon: 'error',
					text: $_('error.commonErrorForm'),
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

	const handleSubmit = () => {
		if (step === 1) {
			handleStepOne();
		}
	};
</script>

<div class="ph1rem">
	<MobileStepCheckout {step} onStep={(st) => (step = st)} />
</div>

{#if isServerError}
	<p class="ph1rem red f4 tc">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<div class="ph1rem">
		<ContentLoader width="900" uniqueKey="checkout">
			<rect x="0" y="0" rx="5" ry="5" width="1170" height="400" />
		</ContentLoader>
	</div>
{:else}
	<div class="">
		{#if step == 1}
			<form on:submit|preventDefault={handleSubmit} novalidate>
				<div class="mt5 ph1rem">
					<MobileShippingAddress {values} {errors} {validate} />
				</div>
				<div class="mt5 ph1rem">
					<MobileBillingAddress
						{values}
						{errors}
						{validate}
						bind:isSameShipping
					/>
				</div>

				<div class="sticky-bottom white flex mt5">
					<button
						on:click={handleBack}
						type="button"
						class="flex-1 bg-light-gray bn grow ttu h-50-px fw6 tracked near-black btn-width pointer"
					>
						{$_('device.back')}
					</button>
					{#if isLoadingContinue}
						<button
							type="button"
							class="flex-1 bg-light-yellow bn grow ttu h-50-px fw6 tracked near-black btn-width pointer flex items-center justify-center"
						>
							<LoadingDefault />
						</button>
					{:else}
						<button
							type="submit"
							class="flex-1 bg-light-yellow bn grow ttu h-50-px fw6 tracked near-black btn-width pointer"
						>
							{$_('checkout.continue')}
						</button>
					{/if}
				</div>
			</form>
		{:else if step == 2}
			<MobileConfirmCart
				shipping={detailShipping}
				{listConfirm}
				{isValidate}
				{isLoadingShippo}
				{isLoadingShippoExchange}
				{totalDingtoiFee}
				{totalPay}
				{totalReceive}
				bind:totalShipExchange
				bind:totalShip
				bind:realTotal
				bind:isSelect
			/>

			<div class="sticky-bottom bg-white flex mt4">
				{#if isValidate == false}
					<button
						on:click={() => {
							goto('/cart');
						}}
						class="bg-light-gray bn grow ttu w-50 h-50-px fw6 tracked near-black pointer"
					>
						{$_('checkout.backToCart')}
					</button>
				{:else}
					<button
						type="button"
						on:click={handleBack}
						class="flex-1 bg-light-gray bn grow ttu h-50-px fw6 tracked near-black pointer"
					>
						{$_('device.back')}
					</button>
					{#if isLoading}
						<button
							type="button"
							class="flex-1 bg-yellow bn grow ttu h-50-px fw6 tracked near-black pointer"
						>
							<LoadingDefault />
						</button>
					{:else if !isSelect}
						<button
							type="button"
							disabled={true}
							class="flex-1 bg-light-yellow bn grow ttu h-50-px fw6 tracked near-black pointer o-50"
						>
							{$_('message.payNow')}
						</button>
					{:else}
						<button
							on:click={onStep3}
							type="button"
							class="flex-1 bg-light-yellow bn grow ttu h-50-px fw6 tracked near-black pointer"
						>
							{$_('message.payNow')}
						</button>
					{/if}
				{/if}
			</div>
		{:else}
			<MobilePayment
				{handleBack}
				listConfirm={$selectedItemsCheckout}
				valuesShip={values}
			/>
		{/if}
	</div>
{/if}

<style>
	.sticky-bottom {
		position: sticky;
		bottom: 0;
		left: 0;
	}
	.btn-width {
		padding: 10px 30px;
	}
</style>

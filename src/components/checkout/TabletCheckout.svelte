<script>
	import { _ } from 'svelte-i18n';
	import { goto, stores } from '@sapper/app';
	import PcConfirmCart from './PcConfirmCart.svelte';
	import PcPayment from './PcPayment.svelte';
	import * as yup from 'yup';
	import {
		convertCurrency,
		displayCurrency,
		extractError,
		extractErrors,
		extractNamesFromCity,
		extractNamesFromCountries,
		isObjectEmpty,
		isSameShippingFunc,
		isValidAddress,
		isValidZip,
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
	import { checkProposalsTimeout as apiCheckProposalsTimeout } from '../../services/proposal';
	import {
		auth,
		selectedItemsCheckout,
		countries,
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
	import TabletStepCheckout from './TabletStepCheckout.svelte';
	import TabletShippingAddress from './TabletShippingAddress.svelte';
	import TabletBilliingAddress from './TabletBilliingAddress.svelte';

	const { session } = stores();
	const { domainTransaction, domainProposal } = $session;

	let listConfirm = {};
	let listCities = [];
	let listCitiesBill = [];

	let isLoadingContinue = false;
	let isLoading = false;
	let isLoadingShippo = false;
	let isLoadingShippoExchange = false;
	let total = 0;
	let totalReceive = 0;
	let totalPay = 0;
	let totalDingtoiFee = 0;
	let totalShip = 0;
	let totalShipExchange = 0;
	let detail = null;
	let realTotal = 0;
	let isValidate = true;

	let isServerError = false;
	let detailShipping = null;
	let detailBilling = null;

	let step = 1;
	let oldStep = 1;
	let errors = {};
	let errorAddress = false;
	let errorZip = false;
	let errorZipBill = false;
	let errorAddressBill = false;
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
		cityShip: yup.string($_('error.string')).required($_('error.required')),
		provinceShip: yup.string($_('error.string')).required($_('error.required')),
		postalCodeShip: yup
			.string($_('error.string'))
			.required($_('error.required')),
		phoneShip: yup.string($_('error.string')).required($_('error.required')),
		countryShip: yup.string($_('error.string')).required($_('error.required')),
		firstNameBill: yup
			.string($_('error.string'))
			.required($_('error.required')),
		lastNameBill: yup.string($_('error.string')).required($_('error.required')),
		addressBill: yup.string($_('error.string')).required($_('error.required')),
		cityBill: yup.string($_('error.string')).required($_('error.required')),
		provinceBill: yup.string($_('error.string')).required($_('error.required')),
		postalCodeBill: yup
			.string($_('error.string'))
			.required($_('error.required')),
		phoneBill: yup.string($_('error.string')).required($_('error.required')),
		countryBill: yup.string($_('error.string')).required($_('error.required')),
	});

	const schemaShipping = yup.object().shape({
		firstNameShip: yup
			.string($_('error.string'))
			.required($_('error.required')),
		lastNameShip: yup.string($_('error.string')).required($_('error.required')),
		addressShip: yup.string($_('error.string')).required($_('error.required')),
		cityShip: yup.string($_('error.string')).required($_('error.required')),
		provinceShip: yup.string($_('error.string')).required($_('error.required')),
		postalCodeShip: yup
			.string($_('error.string'))
			.required($_('error.required')),
		phoneShip: yup.string($_('error.string')).required($_('error.required')),
		countryShip: yup.string($_('error.string')).required($_('error.required')),
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
						detail = obj;
						const sh = obj.shipping;
						const bl = obj.billing;
						if (sh) {
							detailShipping = sh;
						}
						if (bl) {
							detailBilling = bl;
						}
						if (!isSameShippingFunc(sh, bl)) {
							isSameShipping = false;
						}
						values = {
							firstNameShip: sh ? sh.first_name : '',
							lastNameShip: sh ? sh.last_name : '',
							addressShip: sh ? sh.address : '',
							cityShip: sh ? sh.city : '',
							provinceShip: sh ? sh.province : '',
							postalCodeShip: sh ? sh.postal_code : '',
							phoneShip: sh ? sh.phone_number : '',
							countryShip: sh ? sh.country_id : '',
							firstNameBill: bl ? bl.first_name : '',
							lastNameBill: bl ? bl.last_name : '',
							addressBill: bl ? bl.address : '',
							cityBill: bl ? bl.city : '',
							provinceBill: bl ? bl.province : '',
							postalCodeBill: bl ? bl.postal_code : '',
							phoneBill: bl ? bl.phone_number : '',
							countryBill: bl ? bl.country_id : '',
						};
					} else {
						detail = null;
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

	const checkProposalsTimeout = () => {
		isLoadingContinue = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiCheckProposalsTimeout(domainProposal, {
				token,
				listIds: [],
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

	const createShipping = () => {
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
				address: values.addressShip,
				city: values.cityShip,
				postalCode: values.postalCodeShip,
				country: values.countryShip,
				phoneNumber: values.phoneShip,
				province: values.provinceShip,
				extension: values.optionalShip,
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

	const createBilling = () => {
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
				address: isSameShipping ? values.addressShip : values.addressBill,
				city: isSameShipping ? values.cityShip : values.cityBill,
				postalCode: isSameShipping
					? values.postalCodeShip
					: values.postalCodeBill,
				country: isSameShipping ? values.countryShip : values.countryBill,
				province: isSameShipping ? values.provinceShip : values.provinceBill,
				phoneNumber: isSameShipping ? values.phoneShip : values.phoneBill,
				extension: isSameShipping ? values.optionalShip : values.optionalBill,
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
		let country = '';
		let city = '';
		if ($countries.length > 0) {
			country = extractNamesFromCountries($countries, values.countryShip);
		}
		if (listCities.length > 0) {
			city = extractNamesFromCity(listCities, values.cityShip);
		}
		return new Promise((resolve, reject) => {
			apiValidationAddress(config.domainShippo, {
				token: config.shippoToken,
				name: values.firstNameShip,
				company: 'Dingtoi Corporation',
				street1: values.addressShip,
				city: city,
				state: values.provinceShip,
				zip: values.postalCodeShip,
				country: country,
				email: $auth.email,
				validate: true,
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
	const validateAddressesBilling = () => {
		isLoadingContinue = true;
		let country = '';
		let city = '';
		if ($countries.length > 0) {
			country = extractNamesFromCountries($countries, values.countryBill);
		}
		if (listCitiesBill.length > 0) {
			city = extractNamesFromCity(listCitiesBill, values.cityBill);
		}
		return new Promise((resolve, reject) => {
			apiValidationAddress(config.domainShippo, {
				token: config.shippoToken,
				name: values.firstNameBill,
				company: 'Dingtoi Corporation',
				street1: values.addressBill,
				city: city,
				state: values.provinceBill,
				zip: values.postalCodeBill,
				country: country,
				email: $auth.email,
				validate: true,
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
		if ($countries.length > 0) {
			countryTo = extractNamesFromCountries($countries, values.countryShip);
		}
		if (listCities.length > 0) {
			cityTo = extractNamesFromCity(listCities, values.cityShip);
		}
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
		if ($countries.length > 0) {
			countryTo = extractNamesFromCountries($countries, values.countryShip);
		}
		if (listCities.length > 0) {
			cityTo = extractNamesFromCity(listCities, values.cityShip);
		}
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
					total = l.total;
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

			errorZip = false;
			errorAddress = false;
			errorZipBill = false;
			errorAddressBill = false;
			const result = await validateAddresses();
			let errorMessage = '';
			errorZip = !isValidZip(values.postalCodeShip, result.data.zip);
			errorMessage = !errorZip ? '' : $_('checkout.invalidZip');
			if (!errorZip) {
				errorAddress = !isValidAddress(result.data.validation_results);
				errorMessage = !errorAddress ? '' : $_('checkout.invalidAddress');
				if (!errorMessage) {
					if (!isSameShipping) {
						const resultBill = await validateAddressesBilling();
						errorZipBill = !isValidZip(
							values.postalCodeBill,
							resultBill.data.zip
						);
						errorMessage = !errorZipBill ? '' : $_('checkout.invalidZip');
						if (!errorZipBill) {
							errorAddressBill = !isValidAddress(
								resultBill.data.validation_results
							);
							errorMessage = !errorAddressBill
								? ''
								: $_('checkout.invalidAddress');
						}
					} else {
						values.firstNameBill = values.firstNameShip;
						values.lastNameBill = values.lastNameShip;
						values.addressBill = values.addressShip;
						values.cityBill = values.cityShip;
						values.provinceBill = values.provinceShip;
						values.postalCodeBill = values.postalCodeShip;
						values.phoneBill = values.phoneShip;
						values.countryBill = values.countryShip;

						values = values;
					}
				}
			}
			if (errorMessage) {
				swal.fire({
					position: 'top',
					icon: 'warning',
					title: $_('error.formError'),
					text: errorMessage,
					reverseButtons: true,
					customClass: {
						icon: 'icon-warning',
					},
				});
			} else {
				await createShipping();
				await createBilling();
				await confirmOrder();
				step = 2;
				animateScroll.scrollToTop();
			}
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

<style>
	.btn-width {
		width: 150px;
	}
	/* .checkbox .box {
		height: 20px;
		width: 20px;
		border: 2px solid #7e8299;
		border-radius: 3px;
		box-sizing: border-box;
	}
	.checkbox .box:after {
		content: '';
		display: block;
		width: 4px;
		height: 10px;
		transform: rotate(45deg);
		border-bottom: 2px solid #2f3a97;
		border-right: 2px solid #2f3a97;
		opacity: 0;
	}
	.checkbox > input:checked + .box {
		border-color: #2f3a97;
	}
	.checkbox > input:checked + .box:after {
		opacity: 1;
	}
	.checkbox input {
		display: none;
	} */
</style>

<div class="w-100">
	<TabletStepCheckout {step} onStep={(st) => (step = st)} />
	{#if isServerError}
		<p class="red f4 mt5 tc">{$_('error.serverErrorMessage')}</p>
	{:else if isLoading}
		<div class="mt5">
			<ContentLoader width="375" uniqueKey="checkout">
				<rect x="0" y="0" rx="5" ry="5" width="1170" height="400" />
			</ContentLoader>
		</div>
	{:else}
		<div class="mt6">
			{#if step == 1}
				<form on:submit|preventDefault={handleSubmit}>
					<TabletShippingAddress
						bind:listCities
						{values}
						{errors}
						{validate}
						{errorAddress}
						detail={detailShipping}
						{errorZip} />
					<TabletBilliingAddress
						bind:listCitiesBill
						{values}
						{errors}
						{validate}
						detail={detailBilling}
						{errorAddressBill}
						{errorZipBill}
						bind:isSameShipping />
					<div class="flex justify-end">
						<button
							on:click={handleBack}
							type="button"
							class="mt4 br2 bg-light-gray b--light-gray ba grow ttu h-50-px fw6
										tracked near-black btn-width pointer">
							{$_('device.back')}
						</button>
						{#if isLoadingContinue}
							<button
								type="button"
								class="mt4 ml3 br2 bg-light-yellow b--light-yellow ba grow ttu h-50-px fw6
											tracked near-black btn-width pointer flex items-center justify-center">
								<LoadingDefault />
							</button>
						{:else}
							<button
								type="submit"
								class="mt4 ml3 br2 bg-light-yellow b--light-yellow ba grow ttu h-50-px fw6
											tracked near-black btn-width pointer">
								{$_('checkout.continue')}
							</button>
						{/if}
					</div>
				</form>
			{:else if step == 2}
				<div class="">
					<PcConfirmCart
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
						bind:isSelect />
				</div>
				<div class="flex flex-column items-end">
					{#if isValidate == false}
						<button
							on:click={() => {
								goto('/cart');
							}}
							class="mt4 br2 bg-light-gray b--light-gray ba grow ttu h-50-px fw6
										tracked near-black btn-width pointer">
							{$_('checkout.backToCart')}
						</button>
					{:else}
						<div class="flex">
							<button
								type="button"
								on:click={handleBack}
								class="mt4 br2 bg-light-gray b--light-gray ba grow ttu h-50-px fw6
										tracked near-black btn-width pointer">
								{$_('device.back')}
							</button>
							{#if isLoading}
								<button
									type="button"
									class="mt4 br2 bg-yellow b--yellow ba grow ttu h-50-px fw6 tracked
											near-black btn-width pointer flex items-center justify-center">
									<LoadingDefault />
								</button>
							{:else if !isSelect}
								<button
									type="button"
									disabled={true}
									class="mt4 ml3 br2 bg-light-yellow b--light-yellow ba grow ttu h-50-px fw6 tracked
											near-black btn-width pointer o-50">
									{$_('message.payNow')}
								</button>
							{:else}
								<button
									on:click={onStep3}
									type="button"
									class="mt4 ml3 br2 bg-light-yellow b--light-yellow ba grow ttu h-50-px fw6 tracked
											near-black btn-width pointer">
									{$_('message.payNow')}
								</button>
							{/if}
						</div>
					{/if}
				</div>
			{:else}
				<PcPayment
					{listCities}
					{listCitiesBill}
					{handleBack}
					listConfirm={$selectedItemsCheckout}
					valuesShip={values} />
			{/if}
		</div>
	{/if}
</div>

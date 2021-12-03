<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import * as yup from 'yup';
	import {
		extractError,
		extractErrors,
		extractNamesFromCity,
		extractNamesFromCountries,
		isObjectEmpty,
		isSameShippingFunc,
		isValidAddress,
		isValidZip,
	} from '../../functions';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import * as animateScroll from 'svelte-scrollto';
	import {
		createShipping as apiCreateShipping,
		createBilling as apiCreateBilling,
		updateShipping as apiUpdateShipping,
		updateBilling as apiUpdateBilling,
		getShippingAndBilling as apiGetShippingAndBilling,
		validationAddress as apiValidationAddress,
	} from '../../services/transaction';
	import { auth, countries } from '../../stores';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import PcMyAccountShipping from './PcMyAccountShipping.svelte';
	import PcMyAccountBilling from './PcMyAccountBilling.svelte';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import config from '../../config';
	import TabletMyAccountShipping from './TabletMyAccountShipping.svelte';
	import TabletMyAccountBilling from './TabletMyAccountBilling.svelte';
	const { session } = stores();
	const { domainTransaction } = $session;
	let detail = null;
	let listCities = [];
	let listCitiesBill = [];
	let isSameShipping = true;
	let errors = {};
	let errorAddress = false;
	let errorAddressBill = false;
	let errorZip = false;
	let errorZipBill = false;
	let isServerError = false;
	let isLoadingCreate = false;
	let isLoading = false;
	let detailShipping = null;
	let detailBilling = null;
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

	$: {
		getShippingAndBilling();
	}
	onMount(async () => {
		try {
			await getShippingAndBilling();
		} catch (error) {}
	});
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
		isLoading = false;
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
	const createShipping = () => {
		isLoadingCreate = true;
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
					isLoadingCreate = false;
					resolve();
				})
				.catch((error) => {
					isLoadingCreate = false;
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
		isLoadingCreate = true;
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
					isLoadingCreate = false;
					resolve();
				})
				.catch((error) => {
					isLoadingCreate = false;
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
	const updateShipping = () => {
		isLoadingCreate = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiUpdateShipping(domainTransaction, {
				token,
				id: detail.shipping.id,
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
					isLoadingCreate = false;
					resolve();
				})
				.catch((error) => {
					isLoadingCreate = false;
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

	const updateBilling = () => {
		isLoadingCreate = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiUpdateBilling(domainTransaction, {
				token,
				id: detail.billing.id,
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
					isLoadingCreate = false;
					resolve();
				})
				.catch((error) => {
					isLoadingCreate = false;
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
		isLoadingCreate = true;
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
					isLoadingCreate = false;
					resolve(result);
				})
				.catch((error) => {
					isLoadingCreate = false;
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
		isLoadingCreate = true;
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
					isLoadingCreate = false;
					resolve(result);
				})
				.catch((error) => {
					isLoadingCreate = false;
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
	const handleSubmit = async () => {
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
</script>

{#if isServerError}
	<p class="red f4 mt5 tc">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<div class="mt5">
		<ContentLoader width="768" uniqueKey="checkout">
			<rect x="0" y="0" rx="5" ry="5" width="1170" height="400" />
		</ContentLoader>
	</div>
{:else}
	<form on:submit|preventDefault={handleSubmit} novalidate>
		<TabletMyAccountShipping
			{values}
			{validate}
			{errors}
			detail={detailShipping}
			bind:listCities
			{errorAddress}
			{errorZip} />

		<TabletMyAccountBilling
			bind:listCitiesBill
			{errorAddressBill}
			{errorZipBill}
			{validate}
			{values}
			{errors}
			detail={detailBilling}
			bind:isSameShipping />
		<div class="flex justify-end mt5">
			{#if isLoadingCreate}
				<button
					type="button"
					class="btn h-50-px tc ph5 fw6 bg-dark-blue white ba b--dark-blue br1 pointer grow">
					<LoadingDefault />
				</button>
			{:else}
				<button
					type="submit"
					class="btn h-50-px tc ph5 fw6 bg-dark-blue white ba b--dark-blue br1 pointer grow">{$_('message.save')}</button>
			{/if}
		</div>
	</form>
{/if}

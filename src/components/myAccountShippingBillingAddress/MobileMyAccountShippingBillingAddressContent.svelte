<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import * as yup from 'yup';
	import {
		extractError,
		extractErrors,
		isObjectEmpty,
		isSameShippingFunc,
		postCanadaGetExtractDesc,
	} from '../../functions';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import * as animateScroll from 'svelte-scrollto';
	import {
		createShipping as apiCreateShipping,
		createBilling as apiCreateBilling,
		getShippingAndBilling as apiGetShippingAndBilling,
		validationAddress as apiValidationAddress,
	} from '../../services/transaction';
	import { auth } from '../../stores';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';

	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import config from '../../config';
	import MobileMyAccountShipping from './MobileMyAccountShipping.svelte';
	import MobileMyAccountBilling from './MobileMyAccountBilling.svelte';
	const { session } = stores();
	const { domainTransaction, domainModel } = $session;
	let isSameShipping = true;
	let errors = {};
	let isServerError = false;
	let isLoadingCreate = false;
	let isLoading = false;

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
						const sh = obj.shipping;
						const bl = obj.billing;

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
				address: objAddressShip.street,
				city: objAddressShip.city,
				postalCode: objAddressShip.postalCode,
				country: config.selectedCountry,
				phoneNumber: values.phoneShip,
				province: objAddressShip.state,
				extension: '',
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

	const createBilling = (objAddressShip, objAddressBill) => {
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

		return new Promise((resolve, reject) => {
			apiValidationAddress(config.domainCanadaPostAddressComplete, {
				token: config.canadaPostAddressCompleteToken,
				keyword: values.addressShip,
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
		<MobileMyAccountShipping {values} {validate} {errors} />
		<div class="mt2rem pt2rem bt b--light-gray b--dashed" />
		<MobileMyAccountBilling {validate} {values} {errors} bind:isSameShipping />
		<div class="flex justify-end mt2rem pt2rem bt b--light-gray b--dashed">
			{#if isLoadingCreate}
				<button
					type="button"
					class="btn w-100 h-40-px tc ph5 fw6 bg-dark-blue white ba b--dark-blue br1 pointer grow"
				>
					<LoadingDefault />
				</button>
			{:else}
				<button
					type="submit"
					class="btn w-100 h-40-px tc ph5 fw6 bg-dark-blue white ba b--dark-blue br1 pointer grow"
					>{$_('message.save')}</button
				>
			{/if}
		</div>
	</form>
{/if}

<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import PcDeviceShipping from './PcDeviceShipping.svelte';
	import * as yup from 'yup';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import {
		extractError,
		extractErrors,
		isObjectEmpty,
		postCanadaGetExtractDesc,
	} from '../../functions';
	import IconArrowLeft from '../icon/IconArrowLeft.svelte';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import IconArrowRight from '../icon/IconArrowRight.svelte';
	import * as animateScroll from 'svelte-scrollto';
	import {
		createShipping as apiCreateShipping,
		getShippingAndBilling as apiGetShippingAndBilling,
		validationAddress as apiValidationAddress,
	} from '../../services/transaction';
	import { auth } from '../../stores';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import config from '../../config';

	export let step;
	export let onComplete = () => {};
	export let isLoadingComplete;

	const { session } = stores();
	const { domainTransaction, domainModel } = $session;

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
	};
	let oldStep = 4;

	$: {
		if (step !== oldStep) {
			oldStep = step;
			if (step === 4) {
				getShippingAndBilling();
			}
		}
	}
	onMount(async () => {
		try {
			await getShippingAndBilling();
		} catch (error) {}
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
			await schemaShipping.validateAt(field, values);
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

						values = {
							firstNameShip: sh ? sh.first_name : '',
							lastNameShip: sh ? sh.last_name : '',
							addressShip: sh ? sh.full_address : '',
							phoneShip: sh ? sh.phone : '',
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
				// city: objAddressShip.city,
				// postalCode: objAddressShip.postalCode,
				// country: config.selectedCountry,
				phoneNumber: values.phoneShip,
				// province: objAddressShip.state,
				// extension: '',
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
		isLoadingComplete = true;
		try {
			await schemaShipping.validate(values, { abortEarly: false });

			// const objAddressShip = await postCanadaGetExtractDesc(
			// 	values.addressShip,
			// 	domainModel
			// );

			// await createShipping(objAddressShip);
			await createShipping();
			isLoadingComplete = false;
			onComplete();
		} catch (error) {
			isLoadingComplete = false;
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
		<ContentLoader width="900" uniqueKey="checkout">
			<rect x="0" y="0" rx="5" ry="5" width="1170" height="400" />
		</ContentLoader>
	</div>
{:else}
	<form on:submit|preventDefault={handleSubmit} novalidate>
		<PcDeviceShipping {values} {validate} {errors} />
		<div class="flex justify-end mt5">
			<div>
				<button
					type="button"
					on:click={() => {
						animateScroll.scrollToTop();
						step = 3;
					}}
					class="link bg-white br2 ba fw6 ttu near-black b--pale-grey pointer
					flex items-center justify-center grow btn-width-back tracked f5"
					><div class="flex items-center justify-center h-50-px">
						<IconArrowLeft />
					</div></button
				>
			</div>
			{#if isLoadingCreate && isLoadingComplete}
				<button
					type="button"
					class="ml3 link bg-dark-blue b--dark-blue br2 ba fw6 ttu dark-blue
					pointer grow btn-width tracked f5"
				>
					<div class="flex items-center justify-center h-50-px">
						<LoadingDefault />
					</div>
				</button>
			{:else}
				<button
					type="submit"
					class="ml3 link bg-white b--dark-blue br2 ba fw6 ttu dark-blue
					pointer grow btn-width tracked f5"
				>
					<div class="flex items-center justify-center h-50-px">
						<div>{$_('message.next')}</div>
						<span class="ml3 ir flex items-center"><IconArrowRight /></span>
					</div>
				</button>
			{/if}
		</div>
	</form>
{/if}

<style>
	.btn-width {
		width: 170px;
	}
	.btn-width-back {
		width: 50px;
	}
</style>

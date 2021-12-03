<script>
	import { _ } from 'svelte-i18n';
	import { goto, stores } from '@sapper/app';
	import CreditCard from 'svelte-credit-cards';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import * as yup from 'yup';
	import { extractError, extractErrors } from '../../functions';
	import { fade } from 'svelte/transition';
	import PcMaskInput from '../form/PcMaskInput.svelte';
	import PcInputCleave from '../form/PcInputCleave.svelte';
	import {
		auth,
		selectListConfirm,
		totalCheckout,
		totalShipping,
		checkoutAmountInfo,
	} from '../../stores';
	import { createOrder as apiCreateOrder } from '../../services/transaction';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import config from '../../config';

	const { session } = stores();
	const { domainTransaction } = $session;

	export let listConfirm = [];
	export let valuesShip = {};
	export let handleBack;

	let values = {
		number: '',
		name: '',
		cvc: '',
		expiry: '',
	};
	let isLoading = false;
	let errors = {};

	const schema = yup.object().shape({
		number: yup.string($_('error.string')).required($_('error.required')),
		name: yup.string($_('error.string')).required($_('error.required')),
		cvc: yup.string($_('error.string')).required($_('error.required')),
		expiry: yup.string($_('error.string')).required($_('error.required')),
	});
	const validate = async (field) => {
		try {
			await schema.validateAt(field, values);
			errors[field] = '';
		} catch (error) {
			errors[field] = extractError(error, field);
		}
	};
	const createOrder = () => {
		isLoading = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiCreateOrder(domainTransaction, {
				token,
				listCart: listConfirm,
				listConfirm: $selectListConfirm,
				firstNameShip: valuesShip.firstNameShip,
				lastNameShip: valuesShip.lastNameShip,
				addressShip: valuesShip.addressShip,
				cityShip: '',
				provinceShip: valuesShip.provinceShip,
				postalCodeShip: valuesShip.postalCodeShip,
				phoneShip: valuesShip.phoneShip,
				countryShip: config.selectedCountry,
				firstNameBill: valuesShip.firstNameBill,
				lastNameBill: valuesShip.lastNameBill,
				addressBill: valuesShip.addressBill,
				cityBill: '',
				provinceBill: valuesShip.provinceBill,
				postalCodeBill: valuesShip.postalCodeBill,
				phoneBill: valuesShip.phoneBill,
				countryBill: config.selectedCountry,
				totalShipping: $totalShipping,
				totalCheckout: $totalCheckout,
				cardNumber: values.number,
				cardName: values.name,
				cvc: values.cvc,
				exp: values.expiry,
				amountInfo: $checkoutAmountInfo,
			})
				.then((l) => {
					isLoading = false;
					if (l.validate) {
						swal.fire({
							toast: true,
							position: 'top-end',
							icon: 'success',
							title: $_('cart.paymentSuccess'),
							showConfirmButton: false,
							timerProgressBar: true,
							timer: 2000,
							onOpen: (toast) => {
								toast.addEventListener('mouseenter', swal.stopTimer);
								toast.addEventListener('mouseleave', swal.resumeTimer);
							},
						});
						goto('/my-purchases/' + l.id);
					} else {
						swal.fire({
							position: 'top',
							icon: 'warning',
							title: 'Device has been sold!',
							text: 'Some devices have already been sold',
							reverseButtons: true,
							customClass: {
								icon: 'icon-warning',
							},
							preConfirm: () => {
								goto('cart');
							},
						});
					}

					resolve(l);
				})
				.catch((error) => {
					isLoading = false;
					if (error.response) {
						if (error.response.status === 500) {
							if (error.response.data.obj === config.payment.errorNumber) {
								swal.fire({
									position: 'top',
									icon: 'warning',
									title: $_('error.error'),
									text: $_('error.numberPayment'),
									reverseButtons: true,
									customClass: {
										icon: 'icon-warning',
									},
								});
							} else if (
								error.response.data.obj === config.payment.errorExpYear
							) {
								swal.fire({
									position: 'top',
									icon: 'warning',
									title: $_('error.error'),
									text: $_('error.errorExpYear'),
									reverseButtons: true,
									customClass: {
										icon: 'icon-warning',
									},
								});
							} else if (
								error.response.data.obj === config.payment.errorExpMonth
							) {
								swal.fire({
									position: 'top',
									icon: 'warning',
									title: $_('error.error'),
									text: $_('error.errorExpMonth'),
									reverseButtons: true,
									customClass: {
										icon: 'icon-warning',
									},
								});
							} else if (error.response.data.obj === config.payment.errorCvc) {
								swal.fire({
									position: 'top',
									icon: 'warning',
									title: $_('error.error'),
									text: $_('error.errorCvc'),
									reverseButtons: true,
									customClass: {
										icon: 'icon-warning',
									},
								});
							} else {
								swal.fire({
									position: 'top',
									icon: 'error',
									title: $_('error.serverErrorTitle'),
									text: $_('error.serverErrorMessage'),
									reverseButtons: true,
									customClass: {
										icon: 'icon-error',
									},
									preConfirm: () => {
										//goto('cart');
									},
								});
							}
						} else {
							swal.fire({
								position: 'top',
								icon: 'error',
								title: $_('error.serverErrorTitle'),
								text: $_('error.serverErrorMessage'),
								reverseButtons: true,
								customClass: {
									icon: 'icon-error',
								},
								preConfirm: () => {
									//goto('cart');
								},
							});
						}
					}
					reject();
				});
		});
	};
	const handleSubmit = async () => {
		try {
			await schema.validate(values, { abortEarly: false });
			errors = {};
			await createOrder();
		} catch (error) {
			if (error) {
				errors = extractErrors(error);
			} else {
				// values.number = '';
				// values.name = '';
				// values.cvc = '';
				// values.expiry = '';
			}
		}
	};
</script>

<h4 class="ph1rem mt5 tc">{$_('checkout.payment')}</h4>
<form autocomplete="off" on:submit|preventDefault={handleSubmit} novalidate>
	<div class="pa1rem ma1rem ba b--light-gray br3">
		<h5 class="dark-blue b pb1rem bb b--light-gray">
			{$_('checkout.cardInfo')}
		</h5>
		<div class="">
			<div class="mb1rem">
				<div class="mb4">
					<label for="number" class="fw6 mb3 db">{$_('checkout.cardNum')}</label
					>
					<PcMaskInput
						onInput={() => validate('number')}
						className={errors.number
							? 'b--red w-100 ba  br2 h-40-px pl4'
							: 'w-100 ba b--light-gray br2 h-40-px pl4'}
						bind:value={values.number}
						mask="0000-0000-0000-0000"
						name="number"
					/>
					{#if errors.number}
						<div class="red fw6 mt2" transition:fade>{errors.number}</div>
					{/if}
				</div>
				<div class="mb4">
					<label for="name" class="fw6 mb3 db">{$_('checkout.cardName')}</label>
					<input
						class="w-100 ba b--light-gray br2 h-40-px pl4"
						class:b--red={errors.name}
						bind:value={values.name}
						on:input={() => validate('name')}
						on:blur={() => validate('name')}
						name="name"
						id="name"
					/>
					{#if errors.name}
						<div class="red fw6 mt2" transition:fade>{errors.name}</div>
					{/if}
				</div>
				<div class="flex justify-between">
					<div class="mr4">
						<label for="cvc" class="fw6 mb3 db">{$_('checkout.CVC')}</label>
						<PcMaskInput
							onInput={() => validate('cvc')}
							className={errors.cvc
								? 'b--red w-100 ba br2 h-40-px pl4'
								: 'w-100 ba b--light-gray br2 h-40-px pl4'}
							bind:value={values.cvc}
							mask="000"
							name="cvc"
						/>
						{#if errors.cvc}
							<div class="red fw6 mt2" transition:fade>{errors.cvc}</div>
						{/if}
					</div>
					<div>
						<label class="fw6 mb3 db" for="expiry">{$_('checkout.exp')}</label>
						<PcInputCleave
							error={errors.expiry}
							name="expiry"
							bind:value={values.expiry}
							onInput={() => validate('expiry')}
						/>
						{#if errors.expiry}
							<div class="red fw6 mt2" transition:fade>{errors.expiry}</div>
						{/if}
					</div>
				</div>
			</div>
			<CreditCard
				number={values.number}
				name={values.name}
				cvc={values.cvc}
				expiry={values.expiry}
				preview={true}
			/>
		</div>
	</div>
	<div class="sticky-bottom white flex mt4">
		<button
			on:click={handleBack}
			type="button"
			class="flex-1 bg-light-gray bn grow ttu h-50-px fw6 tracked near-black pointer"
		>
			{$_('device.back')}
		</button>
		{#if isLoading}
			<button
				type="button"
				class="flex-1 bg-light-yellow b--yellow bn grow ttu h-50-px fw6 tracked
					near-black pointer flex items-center justify-center"
			>
				<LoadingDefault />
			</button>
		{:else}
			<button
				type="submit"
				class="flex-1 bg-light-yellow bn grow ttu h-50-px fw6 tracked near-black pointer"
			>
				{$_('message.complete')}
			</button>
		{/if}
	</div>
</form>

<style>
	.sticky-bottom {
		position: sticky;
		bottom: 0;
		left: 0;
	}
</style>

<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { createBilling as apiCreateBilling } from '../../services/transaction';
	import { onMount } from 'svelte';
	import PcMaskInput from '../form/PcMaskInput.svelte';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import {
		extractError,
		extractErrors,
		postCanadaGetExtractDesc,
	} from '../../functions';
	import * as animateScroll from 'svelte-scrollto';

	import * as yup from 'yup';
	import { auth } from '../../stores';
	import PcSearchAddressBilling from '../myAccountShippingBillingAddress/PcSearchAddressBilling.svelte';
	import config from '../../config';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	const { session } = stores();
	const { domainModel, domainTransaction } = $session;

	let isServerError = false;
	let errors = {};
	let isLoadingContinue;
	let oldDetailBill = null;

	export let isSameShipping;
	export let detailBill;
	export let values;
	export let step;
	export let detailShip;
	export let handleBack;

	onMount(() => {
		if (detailBill !== oldDetailBill) {
			oldDetailBill = detailBill;
		}
	});
	const schema = yup.object().shape({
		firstNameBill: yup
			.string($_('error.string'))
			.required($_('error.required')),
		lastNameBill: yup.string($_('error.string')).required($_('error.required')),
		addressBill: yup.string($_('error.string')).required($_('error.required')),
		phoneBill: yup.string($_('error.string')).required($_('error.required')),
	});
	const validate = async (field, value) => {
		try {
			values[field] = value;
			await schema.validateAt(field, values);
			errors[field] = '';
		} catch (error) {
			errors[field] = extractError(error, field);
		}
	};

	const createBilling = (objAddressBill) => {
		isLoadingContinue = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiCreateBilling(domainTransaction, {
				token,
				firstName: isSameShipping
					? detailShip.first_name
					: values.firstNameBill,
				lastName: isSameShipping ? detailShip.last_name : values.lastNameBill,
				address: objAddressBill.street,
				city: objAddressBill.city,
				postalCode: objAddressBill.postalCode,
				country: config.selectedCountry,
				province: objAddressBill.state,
				phoneNumber: isSameShipping
					? detailShip.phone_number
					: values.phoneBill,
				extension: null,
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

	const handleSubmit = async () => {
		try {
			await schema.validate(values, { abortEarly: false });
			errors = {};
			let objAddressBill = null;
			if (isSameShipping) {
				objAddressBill = await postCanadaGetExtractDesc(
					detailShip.address,
					domainModel
				);
			} else {
				objAddressBill = await postCanadaGetExtractDesc(
					values.addressBill,
					domainModel
				);
			}

			await createBilling(objAddressBill);
			step = 2;
			animateScroll.scrollToTop();
		} catch (error) {
			console.log(error);
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
	const onChange = (event) => {
		if (!event.target.checked) {
			detailBill = oldDetailBill;
			values = {
				firstNameBill: oldDetailBill.first_name,
				lastNameBill: oldDetailBill.last_name,
				addressBill: oldDetailBill.address,
				cityBill: oldDetailBill.city,
				provinceBill: oldDetailBill.province,
				postalCodeBill: oldDetailBill.postal_code,
				phoneBill: oldDetailBill.phone_number,
				countryBill: oldDetailBill.country_id,
			};
		} else {
			detailBill = detailShip;
			values = {
				firstNameBill: detailShip.first_name,
				lastNameBill: detailShip.last_name,
				addressBill: detailShip.address,
				cityBill: detailShip.city,
				provinceBill: detailShip.province,
				postalCodeBill: detailShip.postal_code,
				phoneBill: detailShip.phone_number,
				countryBill: detailShip.country_id,
			};
		}
	};
</script>

{#if values}
	<form on:submit|preventDefault={handleSubmit} novalidate>
		<div class="flex justify-center">
			<div>
				<div class="w-100">
					<h3 class="mb5">{$_('checkout.billingAdd')}</h3>

					<label class="checkbox flex items-center mb4 pointer">
						<input
							type="checkbox"
							on:change={onChange}
							bind:checked={isSameShipping}
						/>
						<span class="box flex items-center justify-center" />
						<span class="label ml3">{$_('checkout.sameShipping')} </span>
					</label>

					<div class="flex">
						<div class="mr4" id="firstNameBill">
							<label
								class="fw6 db"
								class:red={errors.firstNameBill}
								for="firstNameBill">{$_('checkout.firstName')}</label
							>
							<input
								disabled={isSameShipping ? true : false}
								class="ba b--light-gray br2 fw6 f6 light-silver h-40-px mt3 ph3 w-large"
								type="text"
								class:b--red={errors.firstNameBill}
								on:input={(event) =>
									validate('firstNameBill', event.target.value)}
								bind:value={values.firstNameBill}
								name="firstNameBill"
							/>
							{#if errors.firstNameBill}
								<div class="red fw6 mt2">{errors.firstNameBill}</div>
							{/if}
						</div>
						<div id="lastNameBill">
							<label
								class="fw6 db"
								class:red={errors.lastNameBill}
								for="lastNameBill">{$_('checkout.lastName')}</label
							>
							<input
								disabled={isSameShipping ? true : false}
								class="ba b--light-gray br2 fw6 f6 light-silver w-100 h-40-px mt3 ph3
							w-large"
								type="text"
								class:b--red={errors.lastNameBill}
								on:input={(event) =>
									validate('lastNameBill', event.target.value)}
								bind:value={values.lastNameBill}
								name="lastNameBill"
							/>
							{#if errors.lastNameBill}
								<div class="red fw6 mt2">{errors.lastNameBill}</div>
							{/if}
						</div>
					</div>
					<div class="mt40" id="addressBill">
						<label
							class="fw6 db"
							for="addressBill"
							class:red={errors.addressBill}>{$_('checkout.address')}</label
						>
						<PcSearchAddressBilling
							bind:isSameShipping
							error={errors.addressBill}
							{validate}
							bind:values
						/>
					</div>
					<div class="mt40" id="phoneBill">
						<label
							class="fw6 db"
							for="phoneBill"
							class:b--red={errors.phoneBill}>{$_('checkout.phoneNo')}</label
						>
						<PcMaskInput
							disabled={!isSameShipping && values.countryBill ? false : true}
							onInput={(value) => {}}
							className={errors.phoneBill
								? 'ba b--red br2 fw6 f6 light-silver h-40-px mt3 ph3 w-small pl3'
								: 'pl3 ba b--light-gray br2 fw6 f6 light-silver h-40-px mt3 ph3 w-small'}
							bind:value={values.phoneBill}
							mask="000-000-0000"
							name="phoneBill"
						/>
						{#if errors.phoneBill}
							<div class="red fw6 mt2">{errors.phoneBill}</div>
						{/if}
					</div>
				</div>
				<div class="flex justify-end mt4">
					<button
						on:click={handleBack}
						type="button"
						class="br2 bg-light-gray b--light-gray ba grow ttu h-50-px fw6
									tracked near-black btn-width pointer"
					>
						{$_('device.back')}
					</button>
					{#if isLoadingContinue}
						<button
							type="button"
							class="ml3 br2 bg-light-yellow b--light-yellow ba grow ttu h-50-px fw6
							tracked near-black btn-width pointer flex items-center justify-center"
						>
							<LoadingDefault />
						</button>
					{:else}
						<button
							type="submit"
							class="ml3 br2 bg-light-yellow b--light-yellow ba grow ttu h-50-px fw6
							tracked near-black btn-width pointer"
						>
							{$_('checkout.continue')}
						</button>
					{/if}
				</div>
			</div>
		</div>
	</form>
{/if}

<style>
	.mt40 {
		margin-top: 40px;
	}
	.w-large {
		width: 377px;
	}

	input[type='checkbox'] {
		display: none;
	}
	.checkbox .box {
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
	.checkbox > input:checked ~ .label {
		color: #2f3a97;
	}
	.btn-width {
		width: 150px;
	}
</style>

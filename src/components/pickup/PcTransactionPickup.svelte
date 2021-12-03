<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import ContentLoader from 'svelte-content-loader';
	import * as yup from 'yup';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import {
		transactionPickup as apiTransactionPickup,
		detailSale as apiDetailSale,
		getShippingAndBilling as apiGetShippingAndBilling,
		createPickup as apiCreatePickup,
	} from '../../services/transaction';
	import { auth } from '../../stores';
	import { onMount } from 'svelte';
	import config from '../../config';
	import PcMaskInput from '../form/PcMaskInput.svelte';
	import { isObjectEmpty, extractError, extractErrors } from '../../functions';
	import PcSearchAddress from '../myAccountShippingBillingAddress/PcSearchAddress.svelte';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import PcServerError from '../error/PcServerError.svelte';

	const { session, page } = stores();
	const { domainTransaction } = $session;

	let isLoading = false;
	let isLoadingSubmit = false;
	let isServerError = false;
	let detail = null;
	let errors = {};

	let values = {
		firstNameShip: '',
		lastNameShip: '',
		addressShip: '',
		phoneShip: '',
		buildingLocationType: '',
		buildingType: '',
		instructions: '',
	};

	export let saleCode;
	export let saleId;

	onMount(async () => {
		await transactionPickup();
		if (detail.length > 0) {
			await detailSale();
		}
		await getShippingAndBilling();
	});
	const schema = yup.object().shape({
		firstNameShip: yup
			.string($_('error.string'))
			.required($_('error.required')),
		lastNameShip: yup.string($_('error.string')).required($_('error.required')),
		addressShip: yup.string($_('error.string')).required($_('error.required')),
		phoneShip: yup.string($_('error.string')).required($_('error.required')),
		buildingLocationType: yup
			.string($_('error.string'))
			.required($_('error.required')),
		buildingType: yup.string($_('error.string')).required($_('error.required')),
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
							addressShip: sh ? sh.address : '',
							phoneShip: sh ? sh.phone_number : '',
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
	const detailSale = () => {
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiDetailSale(domainTransaction, {
				token,
				id: detail[0].order_seller_id,
			})
				.then((rs) => {
					saleCode = rs.code;
					saleId = rs.id;
					isServerError = false;
					resolve();
				})
				.catch(() => {
					isServerError = true;
					reject();
				});
		});
	};
	const transactionPickup = () => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiTransactionPickup(domainTransaction, {
				token,
				id: $page.params.id,
			})
				.then((rs) => {
					detail = rs;
					isLoading = false;
					resolve();
				})
				.catch((error) => {
					isLoading = false;
					isServerError = true;
					reject();
				});
		});
	};
	const createPickup = () => {
		isLoadingSubmit = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiCreatePickup(domainTransaction, {
				token,
				id: $page.params.id,
				objPickup: values,
			})
				.then((rs) => {
					isLoadingSubmit = false;
					resolve();
				})
				.catch((error) => {
					isLoadingSubmit = false;
					isServerError = true;
					reject();
				});
		});
	};
	const handleSubmit = async () => {
		isLoadingSubmit = true;
		try {
			await schema.validate(values, { abortEarly: false });

			// const objAddressShip = await postCanadaGetExtractDesc(
			// 	values.addressShip,
			// 	domainModel
			// );

			await createPickup();
			await goto('my-sales/' + $page.params.id);
			isLoadingSubmit = false;
		} catch (error) {
			isLoadingSubmit = false;
			if (error) {
				errors = extractErrors(error);

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
	<PcServerError />
{:else if isLoading}
	<ContentLoader
		uniqueKey="filterOrder"
		primaryColor="#e4e6ef"
		secondaryColor="#f8f8f8"
		width={config.containerDesktop - 30}
		height="40"
	>
		<rect x="0" y="0" rx="3" ry="3" width="100%" height="40" />
	</ContentLoader>
{:else if detail}
	<h1 class="page__title tc ttc">{$_('pickup.createPickup')}</h1>

	<div class="flex box-default br3">
		<div class="w-30 bg-dark-blue white  box__info">
			<h3 class="fw4">Devices</h3>
			{#if detail.length > 0}
				<ul class="ul">
					{#each detail as item}
						<li open class="b mt2rem bb b--light-gray b--dashed pb1rem mb2rem">
							{item.model}
							{item.capacity}{$_('label.GB')}
							{item.color}
						</li>
					{/each}
				</ul>
				<div class="mt6">
					<div class="flex items-center mt3 ">
						<div class="ttc gray">Height</div>
						<div class="flex-1 bb b--gray b--dashed mh1rem" />
						<div>
							{config.deviceMobile.height} x {detail.length}
							({config.deviceMobile.distance_unit})
						</div>
					</div>
					<div class="flex items-center mt3 ">
						<div class="ttc gray">width</div>
						<div class="flex-1 bb b--gray b--dashed mh1rem" />
						<div>
							{config.deviceMobile.width} x {detail.length}
							({config.deviceMobile.distance_unit})
						</div>
					</div>
					<div class="flex items-center mt3 ">
						<div class="ttc gray">length</div>
						<div class="flex-1 bb b--gray b--dashed mh1rem" />
						<div>
							{config.deviceMobile.length} x {detail.length}
							({config.deviceMobile.distance_unit})
						</div>
					</div>
					<div class="flex items-center mt3 ">
						<div class="ttc gray">weight</div>
						<div class="flex-1 bb b--gray b--dashed mh1rem" />
						<div>
							{config.deviceMobile.weight} x {detail.length}
							({config.deviceMobile.mass_unit})
						</div>
					</div>
				</div>
			{/if}
		</div>
		<div class="w-70 box__form">
			<h3 class="fw4">Pickup address</h3>
			<form class="mt1rem" on:submit|preventDefault={handleSubmit} novalidate>
				<div class="flex flex-gap2rem">
					<div id="firstNameShip" class="flex-1">
						<label
							class="fw6 db"
							class:red={errors.firstNameShip}
							for="firstNameShip">{$_('checkout.firstName')}</label
						>
						<input
							class="ba b--light-gray br2 fw6 f6 light-silver w-100 h-40-px mt3 ph3
						"
							type="text"
							class:b--red={errors.firstNameShip}
							on:input={(event) =>
								validate('firstNameShip', event.target.value)}
							bind:value={values.firstNameShip}
							autocomplete="off"
							name="firstNameShip"
							placeholder={$_('checkout.firstName')}
						/>
						{#if errors.firstNameShip}
							<div class="red fw6 mt2">{errors.firstNameShip}</div>
						{/if}
					</div>
					<div id="lastNameShip" class="flex-1">
						<label
							class="fw6 db"
							class:red={errors.lastNameShip}
							for="lastNameShip">{$_('checkout.lastName')}</label
						>
						<input
							class="ba b--light-gray br2 fw6 f6 light-silver w-100 h-40-px mt3 ph3
						w-100"
							type="text"
							class:b--red={errors.lastNameShip}
							on:input={(event) => validate('lastNameShip', event.target.value)}
							bind:value={values.lastNameShip}
							name="lastNameShip"
							autocomplete="off"
							placeholder={$_('checkout.lastName')}
						/>
						{#if errors.lastNameShip}
							<div class="red fw6 mt2">{errors.lastNameShip}</div>
						{/if}
					</div>
				</div>
				<div class="mt2rem" id="addressShip">
					<label
						class="fw6 db mb3"
						for="addressShip"
						class:red={errors.addressShip}>{$_('checkout.address')}</label
					>

					<PcSearchAddress error={errors.addressShip} {validate} bind:values />
				</div>
				<div class="mt2rem w-50 pr1rem" id="phoneShip">
					<label class="fw6 db" for="phoneShip" class:b--red={errors.phoneShip}
						>{$_('checkout.phoneNo')}</label
					>
					<PcMaskInput
						onInput={(value) => validate('phoneShip', value)}
						className={errors.phoneShip
							? 'pl3 ba b--red br2 fw6 f6 light-silver h-40-px mt3 ph1rem w-100'
							: 'pl3 ba b--light-gray br2 fw6 f6 light-silver h-40-px mt3 ph1rem w-100'}
						bind:value={values.phoneShip}
						mask="000-000-0000"
						name="phoneShip"
					/>
					{#if errors.phoneShip}
						<div class="red fw6 mt2">{errors.phoneShip}</div>
					{/if}
				</div>

				<div class="flex mt2rem flex-gap2rem">
					<div class="flex-1">
						<label
							for="building_location_type"
							class="db fw6 mb3 ttc"
							class:red={errors.buildingLocationType}
						>
							{$_('pickup.buildingLocationType')}
						</label>
						<!-- svelte-ignore a11y-no-onchange -->
						<select
							on:change={(event) =>
								validate('buildingLocationType', event.target.value)}
							value={values.buildingLocationType}
							class="select h-40-px w-100 ba b--light-gray bg-white br2 ph1rem light-silver fw6"
							class:b--red={errors.buildingLocationType}
							id="building_location_type"
						>
							<option value="" disabled selected
								>{$_('transaction.placeholderBuidingLocation')}</option
							>
							{#if config.buildingLocationType.length > 0}
								{#each config.buildingLocationType as type}
									<option value={type.value}>{type.name}</option>
								{/each}
							{/if}
						</select>
						{#if errors.buildingLocationType}
							<div class="red fw6 mt2">{errors.buildingLocationType}</div>
						{/if}
					</div>
					<div class="flex-1 ">
						<label
							for="building_type"
							class="db fw6 mb3 ttc"
							class:red={errors.buildingType}
						>
							{$_('pickup.buildingType')}
						</label>
						<!-- svelte-ignore a11y-no-onchange -->
						<select
							on:change={(event) =>
								validate('buildingType', event.target.value)}
							value={values.buildingType}
							class="select h-40-px w-100 ba b--light-gray bg-white br2 ph1rem light-silver fw6"
							class:b--red={errors.buildingType}
							id="building_type"
						>
							<option value="" disabled selected
								>{$_('transaction.placeholderBuidingType')}</option
							>
							{#if config.buildingType.length}
								{#each config.buildingType as type}
									<option value={type.value}>{type.name}</option>
								{/each}
							{/if}
						</select>
						{#if errors.buildingType}
							<div class="red fw6 mt2">{errors.buildingType}</div>
						{/if}
					</div>
				</div>

				<div class="w-100 mt2rem">
					<label for="instructions" class="fw6 db mb3 ttc">
						{$_('pickup.instructions')}
					</label>
					<input
						bind:value={values.instructions}
						type="text"
						id="instructions"
						class="ba b--light-gray br2 fw6 f6 light-silver w-100 h-40-px mt3 ph3"
						placeholder={$_('pickup.placeholderInstructions')}
					/>
				</div>

				<div class="mt2rem flex justify-center">
					{#if isLoadingSubmit}
						<button
							type="submit"
							class="btn--submit h-40-px ph1rem bg-dark-blue white bn br2 pointer grow fw6 flex items-center justify-center"
						>
							<LoadingDefault size={30} />
						</button>
					{:else}
						<button
							type="submit"
							class="btn--submit h-40-px ph1rem bg-dark-blue white bn br2 pointer grow fw6"
						>
							{$_('message.submit')}
						</button>
					{/if}
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.box-default {
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);
	}
	.box__info {
		padding: 3rem 2rem;
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
	}
	.box__form {
		padding: 3rem 2rem;
	}
	.btn--submit {
		min-width: 200px;
	}
</style>

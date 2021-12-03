<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import {
		listCountries as apiListCountries,
		listState as apiListState,
		listCity as apiListCity,
	} from '../../services/model';
	import ContentLoader from 'svelte-content-loader';
	import { onMount } from 'svelte';
	import PcMaskInput from '../form/PcMaskInput.svelte';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	const { session } = stores();
	const { domainModel } = $session;

	export let values;
	export let errors = {};
	export let validate;
	export let isSameShipping = false;
	export let detail;
	export let errorAddressBill;
	export let errorZipBill;

	let isLoadingCountry = false;
	let isLoadingState = false;
	let isLoadingCity = false;
	let isServerError = false;
	let countries = [];
	let listStates = [];
	export let listCitiesBill = [];
	let oldDetail = null;

	$: {
		if (JSON.stringify(detail) !== JSON.stringify(oldDetail)) {
			oldDetail = detail;
			listState(detail.country_id);
			listCity(detail.country_id, detail.province);
		}
	}

	onMount(async () => {
		if (countries.length === 0) countries = await listCountries();
	});

	const listCountries = () => {
		isLoadingCountry = true;
		return new Promise((resolve, reject) => {
			apiListCountries(domainModel)
				.then((list) => {
					isLoadingCountry = false;
					isServerError = false;
					resolve(list);
				})
				.catch(() => {
					isLoadingCountry = false;
					isServerError = true;
					reject();
				});
		});
	};
	const listState = (countryId) => {
		isLoadingState = true;
		return new Promise((resolve, reject) => {
			apiListState(domainModel, { countryId })
				.then((list) => {
					listStates = list;
					isLoadingState = false;
					isServerError = false;
					resolve(list);
				})
				.catch(() => {
					isLoadingState = false;
					isServerError = true;
					reject();
				});
		});
	};
	const handleChangeCountry = (event) => {
		listState(event.target.value);
		values.provinceBill = '';
		values.cityBill = '';
		values.phoneBill = '';
		listStates = [];
		listCitiesBill = [];
		validate('countryBill', event.target.value);
	};
	const listCity = (countryId, stateCode) => {
		isLoadingCity = true;
		return new Promise((resolve, reject) => {
			apiListCity(domainModel, { countryId, stateCode })
				.then((list) => {
					listCitiesBill = list;
					isLoadingCity = false;
					isServerError = false;
					resolve(list);
				})
				.catch(() => {
					isLoadingCity = false;
					isServerError = true;
					reject();
				});
		});
	};
	const handleChangeState = (event) => {
		listCity(values.countryBill, event.target.value);
		values.cityBill = '';
		listCitiesBill = [];
		validate('provinceBill', event.target.value);
	};
</script>

<style>
	.mt40 {
		margin-top: 40px;
	}
	.w-large {
		width: 360px;
	}
	.w-small {
		width: 150px;
	}

	.w-740px {
		width: 740px;
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
</style>

{#if values}
	<div class="w-740px center">
		<h3 class="mb5">{$_('checkout.billingAdd')}</h3>
		<div class="pb5 flex">
			<label class="checkbox flex items-center mb3 pointer">
				<input type="checkbox" bind:checked={isSameShipping} />
				<span class="box flex items-center justify-center" />
				<span class="label ml3">{$_('checkout.sameShipping')} </span>
			</label>
		</div>
		{#if !isSameShipping}
			<div class="flex">
				<div class="mr4" id="firstNameBill">
					<label
						class="fw6 db"
						class:red={errors.firstNameBill}
						for="firstNameBill">{$_('checkout.firstName')}</label>
					<input
						class="ba b--light-gray br2 fw6 f6 light-silver h-40-px mt3 ph3 w-large"
						type="text"
						class:b--red={errors.firstNameBill}
						on:input={(event) => validate('firstNameBill', event.target.value)}
						bind:value={values.firstNameBill}
						name="firstNameBill" />
					{#if errors.firstNameBill}
						<div class="red fw6 mt2">{errors.firstNameBill}</div>
					{/if}
				</div>
				<div id="lastNameBill">
					<label
						class="fw6 db"
						class:red={errors.lastNameBill}
						for="lastNameBill">{$_('checkout.lastName')}</label>
					<input
						class="ba b--light-gray br2 fw6 f6 light-silver w-100 h-40-px mt3 ph3
					w-large"
						type="text"
						class:b--red={errors.lastNameBill}
						on:input={(event) => validate('lastNameBill', event.target.value)}
						bind:value={values.lastNameBill}
						name="lastNameBill" />
					{#if errors.lastNameBill}
						<div class="red fw6 mt2">{errors.lastNameBill}</div>
					{/if}
				</div>
			</div>
			<div class="mt40" id="addressBill">
				<label
					class="fw6 db"
					for="addressBill"
					class:red={errors.addressBill}>{$_('checkout.address')}</label>
				<input
					class="ba b--light-gray br2 fw6 f6 light-silver w-740px h-40-px mt3 ph3"
					type="text"
					class:b--red={errors.addressBill}
					on:input={(event) => validate('addressBill', event.target.value)}
					bind:value={values.addressBill}
					name="addressBill" />
				{#if errors.addressBill}
					<div class="red fw6 mt2">{errors.addressBill}</div>
				{:else if errorAddressBill}
					<div class="red fw6 mt2">{$_('checkout.invalidAddress')}</div>
				{/if}
			</div>
			<div class="flex mt40">
				<div id="countryBill" class="mr4">
					<label
						class="fw6 db"
						for="countryBill"
						class:red={errors.countryBill}>{$_('checkout.country')}</label>
					{#if isServerError}
						<p class="red">{$_('error.serverErrorMessage')}</p>
					{:else if isLoadingCountry}
						<ContentLoader
							width="300"
							height="30"
							uniqueKey="shippingAdressCountry">
							<rect x="0" y="0" rx="5" ry="5" width="300" height="30" />
						</ContentLoader>
					{:else if countries.length > 0}
						<!-- svelte-ignore a11y-no-onchange -->
						<select
							class:b--red={errors.countryBill}
							on:change={handleChangeCountry}
							bind:value={values.countryBill}
							name="countryBill"
							class="b--light-gray light-silver br2 ba fw6 ph3 h-40-px ttc bg-white mt3 w-large">
							<option value="" disabled>
								{$_('device.placeholderCountry')}
							</option>
							{#each countries as country}
								<option value={country.id}>{country.name}</option>
							{/each}
						</select>
						{#if errors.countryBill}
							<div class="red fw6 mt2">{errors.countryBill}</div>
						{/if}
					{/if}
				</div>
				<div id="provinceBill">
					<label
						class="fw6 db"
						for="provinceBill"
						class:red={errors.provinceBill}>{$_('checkout.state')}</label>

					{#if isServerError}
						<p class="red">{$_('error.serverErrorMessage')}</p>
					{:else if isLoadingState}
						<ContentLoader
							width="300"
							height="30"
							uniqueKey="shippingAdressCountry">
							<rect x="0" y="0" rx="5" ry="5" width="300" height="30" />
						</ContentLoader>
					{:else}
						<!-- svelte-ignore a11y-no-onchange -->
						<select
							disabled={values.countryBill ? false : true}
							class:b--red={errors.provinceBill}
							on:change={handleChangeState}
							bind:value={values.provinceBill}
							name="provinceBill"
							class="b--light-gray light-silver br2 ba fw6 ph3 h-40-px ttc bg-white
								mt3 w-large">
							<option value="" disabled>{$_('device.placeholderState')}</option>
							{#if listStates.length > 0}
								{#each listStates as state}
									<option value={state.code}>{state.name}</option>
								{/each}
							{/if}
						</select>
						{#if errors.provinceBill}
							<div class="red fw6 mt2">{errors.provinceBill}</div>
						{/if}
					{/if}
				</div>
			</div>
			<div class="flex mt40">
				<div id="cityBill" class="mr4">
					<label
						class="fw6 db"
						for="cityBill"
						class:red={errors.cityBill}>{$_('checkout.city')}</label>
					{#if isServerError}
						<p class="red">{$_('error.serverErrorMessage')}</p>
					{:else if isLoadingCity}
						<ContentLoader
							width="300"
							height="30"
							uniqueKey="shippingAdressCountry">
							<rect x="0" y="0" rx="5" ry="5" width="300" height="30" />
						</ContentLoader>
					{:else}
						<!-- svelte-ignore a11y-no-onchange -->
						<select
							disabled={values.countryBill ? false : true}
							class:b--red={errors.cityBill}
							on:change={(event) => validate('cityBill', event.target.value)}
							bind:value={values.cityBill}
							name="cityBill"
							class="b--light-gray light-silver br2 ba fw6 ph3 h-40-px ttc bg-white
								mt3 w-large">
							<option value="" disabled>{$_('device.placeholderCity')}</option>
							{#if listCitiesBill.length > 0}
								{#each listCitiesBill as city}
									<option value={city.id}>{city.name}</option>
								{/each}
							{/if}
						</select>
						{#if errors.cityBill}
							<div class="red fw6 mt2">{errors.cityBill}</div>
						{/if}
					{/if}
				</div>
				<div class="flex">
					<div class="mr4" id="phoneBill">
						<label
							class="fw6 db"
							for="phoneBill"
							class:b--red={errors.phoneBill}>{$_('checkout.phoneNo')}</label>
						<PcMaskInput
							disabled={values.countryBill ? false : true}
							onInput={(value) => validate('phoneBill', value)}
							className={errors.phoneBill ? 'ba b--red br2 fw6 f6 light-silver h-40-px mt3 ph3 w-small pl3' : 'pl3 ba b--light-gray br2 fw6 f6 light-silver h-40-px mt3 ph3 w-small'}
							bind:value={values.phoneBill}
							mask="000-000-0000"
							name="phoneBill" />
						{#if errors.phoneBill}
							<div class="red fw6 mt2">{errors.phoneBill}</div>
						{/if}
					</div>
					<div id="postalCodeBill">
						<label
							class="fw6 db"
							class:red={errors.postalCodeBill}
							for="postalCodeBill">{$_('checkout.postalCode')}</label>
						<input
							class="ba b--light-gray br2 fw6 f6 light-silver h-40-px mt3 ph3 w-small"
							type="text"
							class:b--red={errors.postalCodeBill}
							on:input={(event) => validate('postalCodeBill', event.target.value)}
							bind:value={values.postalCodeBill}
							name="postalCodeBill" />
						{#if errors.postalCodeBill}
							<div class="red fw6 mt2">{errors.postalCodeBill}</div>
						{:else if errorZipBill}
							<div class="red fw6 mt2">{$_('checkout.invalidZip')}</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}

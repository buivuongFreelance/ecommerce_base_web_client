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
	import { countries } from '../../stores';
	import PcMaskInput from '../form/PcMaskInput.svelte';

	const { session } = stores();
	const { domainModel } = $session;

	export let values;
	export let errors = {};
	export let validate;
	export let detail;
	export let listCities;
	export let errorAddress;
	export let errorZip;

	let isServerError = false;
	let isLoadingCountry = false;
	let isLoadingState = false;
	let isLoadingCity = false;
	let listStates = [];
	let oldDetail = null;

	$: {
		if (JSON.stringify(detail) !== JSON.stringify(oldDetail)) {
			oldDetail = detail;
			listState(detail.country_id);
			listCity(detail.country_id, detail.province);
		}
	}

	onMount(async () => {
		if ($countries.length === 0) {
			countries.set(await listCountries());
		}
	});

	const handleChangeCountry = (event) => {
		listState(event.target.value);
		values.provinceShip = '';
		values.cityShip = '';
		values.phoneShip = '';
		listStates = [];
		listCities = [];
		validate('countryShip', event.target.value);
	};
	const handleChangeState = (event) => {
		listCity(values.countryShip, event.target.value);
		values.cityShip = '';
		listCities = [];
		validate('provinceShip', event.target.value);
	};
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
	const listCity = (countryId, stateCode) => {
		isLoadingCity = true;
		return new Promise((resolve, reject) => {
			apiListCity(domainModel, { countryId, stateCode })
				.then((list) => {
					listCities = list;
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
</script>

<style>
	.mt40 {
		margin-top: 40px;
	}
	.w-large {
		width: 359px;
	}
</style>

{#if values}
	<div class="w-100 mb6">
		<h3 class="mb5">{$_('checkout.shippingAdd')}</h3>
		<div class="flex">
			<div class="mr4" id="firstNameShip">
				<label
					class="fw6 db"
					class:red={errors.firstNameShip}
					for="firstNameShip">{$_('checkout.firstName')}</label>
				<input
					class="ba b--light-gray br2 fw6 f6 light-silver h-40-px mt3 ph3
						w-large"
					type="text"
					class:b--red={errors.firstNameShip}
					on:input={(event) => validate('firstNameShip', event.target.value)}
					bind:value={values.firstNameShip}
					name="firstNameShip" />
				{#if errors.firstNameShip}
					<div class="red fw6 mt2">{errors.firstNameShip}</div>
				{/if}
			</div>
			<div id="lastNameShip">
				<label
					class="fw6 db"
					class:red={errors.lastNameShip}
					for="lastNameShip">{$_('checkout.lastName')}</label>
				<input
					class="ba b--light-gray br2 fw6 f6 light-silver w-100 h-40-px mt3 ph3
						w-large"
					type="text"
					class:b--red={errors.lastNameShip}
					on:input={(event) => validate('lastNameShip', event.target.value)}
					bind:value={values.lastNameShip}
					name="lastNameShip" />
				{#if errors.lastNameShip}
					<div class="red fw6 mt2">{errors.lastNameShip}</div>
				{/if}
			</div>
		</div>
		<div class="mt40" id="addressShip">
			<label
				class="fw6 db"
				for="addressShip"
				class:red={errors.addressShip}>{$_('checkout.address')}</label>
			<input
				class="ba b--light-gray br2 fw6 f6 light-silver w-100 h-40-px mt3 ph3
					w-100"
				type="text"
				class:b--red={errors.addressShip}
				on:input={(event) => validate('addressShip', event.target.value)}
				bind:value={values.addressShip}
				name="addressShip" />
			{#if errors.addressShip}
				<div class="red fw6 mt2">{errors.addressShip}</div>
			{:else if errorAddress}
				<div class="red fw6 mt2">{$_('checkout.invalidAddress')}</div>
			{/if}
		</div>

		<div class="flex mt40">
			<div id="countryShip" class="mr4">
				<label
					class="fw6 db"
					for="countryShip"
					class:red={errors.countryShip}>{$_('checkout.country')}</label>
				{#if isServerError}
					<p class="red">{$_('error.serverErrorMessage')}</p>
				{:else if isLoadingCountry}
					<ContentLoader
						width="300"
						height="30"
						uniqueKey="shippingAdressCountry">
						<rect x="0" y="0" rx="5" ry="5" width="300" height="30" />
					</ContentLoader>
				{:else if $countries.length > 0}
					<!-- svelte-ignore a11y-no-onchange -->
					<select
						class:b--red={errors.countryShip}
						on:change={handleChangeCountry}
						bind:value={values.countryShip}
						name="countryShip"
						class="b--light-gray light-silver br2 ba fw6 ph3 h-40-px ttc bg-white
							mt3 w-large">
						<option value="" disabled>{$_('device.placeholderCountry')}</option>
						{#each $countries as country}
							<option value={country.id}>{country.name}</option>
						{/each}
					</select>
					{#if errors.countryShip}
						<div class="red fw6 mt2">{errors.countryShip}</div>
					{/if}
				{/if}
			</div>
			<div id="provinceShip">
				<label
					class="fw6 db"
					for="provinceShip"
					class:red={errors.provinceShip}>{$_('checkout.state')}</label>

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
						disabled={values.countryShip ? false : true}
						class:b--red={errors.provinceShip}
						on:change={handleChangeState}
						bind:value={values.provinceShip}
						name="provinceShip"
						class="b--light-gray light-silver br2 ba fw6 ph3 h-40-px ttc bg-white
							mt3 w-large">
						<option value="" disabled>{$_('device.placeholderState')}</option>
						{#if listStates.length > 0}
							{#each listStates as state}
								<option value={state.code}>{state.name}</option>
							{/each}
						{/if}
					</select>
					{#if errors.provinceShip}
						<div class="red fw6 mt2">{errors.provinceShip}</div>
					{/if}
				{/if}
			</div>
		</div>
		<div class="flex mt40">
			<div id="cityShip" class="mr4">
				<label
					class="fw6 db"
					for="cityShip"
					class:red={errors.cityShip}>{$_('checkout.city')}</label>
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
						disabled={values.countryShip ? false : true}
						class:b--red={errors.cityShip}
						on:change={(event) => validate('cityShip', event.target.value)}
						bind:value={values.cityShip}
						name="cityShip"
						class="b--light-gray light-silver br2 ba fw6 ph3 h-40-px ttc bg-white
							mt3 w-large">
						<option value="" disabled>{$_('device.placeholderCity')}</option>
						{#if listCities.length > 0}
							{#each listCities as city}
								<option value={city.id}>{city.name}</option>
							{/each}
						{/if}
					</select>
					{#if errors.cityShip}
						<div class="red fw6 mt2">{errors.cityShip}</div>
					{/if}
				{/if}
			</div>
			<div class="flex">
				<div class="mr4" id="phoneShip">
					<label
						class="fw6 db"
						for="phoneShip"
						class:b--red={errors.phoneShip}>{$_('checkout.phoneNo')}</label>
					<PcMaskInput
						disabled={values.countryShip ? false : true}
						onInput={(value) => validate('phoneShip', value)}
						className={errors.phoneShip ? 'pl3 ba b--red br2 fw6 f6 light-silver h-40-px mt3 ph3 w-smallxyz' : 'pl3 ba b--light-gray br2 fw6 f6 light-silver h-40-px mt3 ph3 w-smallxyz'}
						bind:value={values.phoneShip}
						mask="000-000-0000"
						name="phoneShip" />
					{#if errors.phoneShip}
						<div class="red fw6 mt2">{errors.phoneShip}</div>
					{/if}
				</div>
				<div id="postalCodeShip">
					<label
						class="fw6 db"
						class:red={errors.postalCodeShip}
						for="postalCodeShip">{$_('checkout.zip')}</label>
					<input
						class="ba b--light-gray br2 fw6 f6 light-silver h-40-px mt3 ph3
						w-smallxyz"
						type="text"
						class:b--red={errors.postalCodeShip}
						on:input={(event) => validate('postalCodeShip', event.target.value)}
						bind:value={values.postalCodeShip}
						name="postalCodeShip" />
					{#if errors.postalCodeShip}
						<div class="red fw6 mt2">{errors.postalCodeShip}</div>
					{:else if errorZip}
						<div class="red fw6 mt2">{$_('checkout.invalidZip')}</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

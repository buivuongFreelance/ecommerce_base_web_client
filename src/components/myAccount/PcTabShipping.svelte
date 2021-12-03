<script>
	import { _ } from 'svelte-i18n';
	import ContentLoader from 'svelte-content-loader';
	import * as yup from 'yup';
	import { extractError, extractErrors } from '../../functions';
	import LoadingDefault from '../loading/LoadingDefault.svelte';

	export let values;
	export let errors = {};
	export let countries = [];
	export let isLoadingSubmit = false;

	export let isLoading = false;
	export let isServerError = false;
	export let isLoadingCountry = false;
	export let isServerErrorCountry = false;
	export let submit;

	let isSameShipping = true;
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
			if (isSameShipping) {
				await schemaShipping.validateAt(field, values);
			}
			errors[field] = '';
		} catch (error) {
			errors[field] = extractError(error, field);
		}
	};
	const handleSubmit = async () => {
		try {
			await schemaShipping.validate(values, { abortEarly: false });
			submit();
		} catch (error) {
			errors = extractErrors(error);
		}
	};
</script>

<style>
	select:invalid {
		color: #b5b5c3;
	}
	.flex-1 {
		flex: 1;
	}
</style>

{#if isServerError}
	<p class="red">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<ContentLoader width="300" height="300" uniqueKey="shippingAdressCountry">
		<rect x="0" y="0" rx="5" ry="5" width="300" height="300" />
	</ContentLoader>
{:else}
	<form class="" on:submit|preventDefault={handleSubmit} novalidate>
		<h4 class="fw6 mb4">{$_('checkout.shippingAdd')}</h4>
		<div class="flex mb4">
			<div class="flex-1 pr2" id="firstNameShip">
				<label
					class="fw6 db"
					class:red={errors.firstNameShip}
					for="firstNameShip">{$_('checkout.firstName')}</label>
				<input
					class="ba b--light-gray br1 fw6 f6 light-silver w-100 h-50-px mt3 ph3
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
			<div class="flex-1 pl2" id="lastNameShip">
				<label
					class="fw6 db"
					class:red={errors.lastNameShip}
					for="lastNameShip">{$_('checkout.lastName')}</label>
				<input
					class="ba b--light-gray br1 fw6 f6 light-silver w-100 h-50-px mt3 ph3
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
		<div class="mb4" id="addressShip">
			<label
				class="fw6 db"
				for="addressShip"
				class:red={errors.addressShip}>{$_('checkout.address')}</label>
			<input
				class="ba b--light-gray br1 fw6 f6 light-silver w-100 h-50-px mt3 ph3
					w-100"
				type="text"
				class:b--red={errors.addressShip}
				on:input={(event) => validate('addressShip', event.target.value)}
				bind:value={values.addressShip}
				name="addressShip" />
			{#if errors.addressShip}
				<div class="red fw6 mt2">{errors.addressShip}</div>
			{/if}
		</div>
		<div class="flex mb4" id="cityShip">
			<div class="flex-1 pr2">
				<label
					class="fw6 db"
					for="cityShip"
					class:red={errors.cityShip}>{$_('checkout.city')}</label>
				<input
					class="ba b--light-gray br1 fw6 f6 light-silver w-100 h-50-px mt3 ph3
						w-large"
					type="text"
					class:b--red={errors.cityShip}
					on:input={(event) => validate('cityShip', event.target.value)}
					bind:value={values.cityShip}
					name="cityShip" />
				{#if errors.cityShip}
					<div class="red fw6 mt2">{errors.cityShip}</div>
				{/if}
			</div>
			<div class="flex-1 ph2" id="provinceShip">
				<label
					class="fw6 db"
					for="provinceShip"
					class:red={errors.provinceShip}>{$_('checkout.province')}</label>
				<input
					class="ba b--light-gray br1 fw6 f6 light-silver w-100 h-50-px mt3 ph3
						w-small"
					type="text"
					class:b--red={errors.provinceShip}
					on:input={(event) => validate('provinceShip', event.target.value)}
					bind:value={values.provinceShip}
					name="cityShip" />
				{#if errors.provinceShip}
					<div class="red fw6 mt2">{errors.provinceShip}</div>
				{/if}
			</div>
			<div class="flex-1 pl2" id="postalCodeShip">
				<label
					class="fw6 db"
					class:red={errors.postalCodeShip}
					for="postalCodeShip">{$_('checkout.postalCode')}</label>
				<input
					class="ba b--light-gray br1 fw6 f6 light-silver w-100 h-50-px mt3 ph3
						w-small"
					type="text"
					class:b--red={errors.postalCodeShip}
					on:input={(event) => validate('postalCodeShip', event.target.value)}
					bind:value={values.postalCodeShip}
					name="postalCodeShip" />
				{#if errors.postalCodeShip}
					<div class="red fw6 mt2">{errors.postalCodeShip}</div>
				{/if}
			</div>
		</div>
		<div class="flex mb4">
			<div class="w-50 pr2" id="countryShip">
				<label
					class="fw6 db"
					for="countryShip"
					class:red={errors.countryShip}>{$_('checkout.country')}</label>
				{#if isServerErrorCountry}
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
						class:b--red={errors.countryShip}
						on:change={(event) => validate('countryShip', event.target.value)}
						bind:value={values.countryShip}
						name="countryShip"
						class="b--light-gray near-black br1 ba fw6 ph3 w-100 h-50-px ttc bg-white
							mt3 w-large">
						<option value="">{$_('device.placeholderCountry')}</option>
						{#each countries as country}
							<option value={country.id}>{country.name}</option>
						{/each}
					</select>
					{#if errors.countryShip}
						<div class="red fw6 mt2">{errors.countryShip}</div>
					{/if}
				{:else}
					<ContentLoader
						width="300"
						height="30"
						uniqueKey="shippingAdressCountry">
						<rect x="0" y="0" rx="5" ry="5" width="300" height="30" />
					</ContentLoader>
				{/if}
			</div>
		</div>
		<div class="flex mb4" id="phoneShip">
			<div class="w-25 pr2">
				<label
					class="fw6 db"
					for="phoneShip"
					class:red={errors.phoneShip}>{$_('checkout.phoneNo')}</label>
				<input
					class="ba b--light-gray br1 fw6 f6 light-silver w-100 h-50-px mt3 ph3
						w-small"
					type="text"
					class:b--red={errors.phoneShip}
					on:input={(event) => validate('phoneShip', event.target.value)}
					bind:value={values.phoneShip}
					name="phoneShip" />
				{#if errors.phoneShip}
					<div class="red fw6 mt2">{errors.phoneShip}</div>
				{/if}
			</div>
			<div class="w-25 ph2">
				<label class="fw6 db" for="last name">{$_('checkout.optional')}</label>
				<input
					class="ba b--light-gray br1 fw6 f6 light-silver w-100 h-50-px mt3 ph3
						w-small"
					type="text"
					on:input={(event) => validate('optionalShip', event.target.value)}
					bind:value={values.optionalShip}
					name="optionalShip" />
			</div>
		</div>
		<div class="flex justify-end">
			{#if isLoadingSubmit}
				<button
					type="submit"
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

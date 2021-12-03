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
	export let isSameShipping = false;
	export let valuesShipping = {};

	let oldValues = {};

	$: {
		if (JSON.stringify(values) !== JSON.stringify(oldValues)) {
			oldValues = Object.assign({}, values);
		}
		checkMapValuesShipping();
	}

	const schema = yup.object().shape({
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

	const validate = async (field, value) => {
		isSameShipping = false;
		try {
			values[field] = value;
			if (isSameShipping) {
				await schema.validateAt(field, values);
			}
			errors[field] = '';
		} catch (error) {
			errors[field] = extractError(error, field);
		}
	};
	const handleSubmit = async () => {
		try {
			await schema.validate(values, { abortEarly: false });
			submit();
		} catch (error) {
			if (isSameShipping) {
				submit();
			}
			errors = extractErrors(error);
		}
	};

	const handleChecked = (e) => {
		if (e.target.checked) {
			values = {
				firstNameBill: valuesShipping.firstNameShip,
				lastNameBill: valuesShipping.lastNameShip,
				addressBill: valuesShipping.addressShip,
				cityBill: valuesShipping.cityShip,
				provinceBill: valuesShipping.provinceShip,
				postalCodeBill: valuesShipping.postalCodeShip,
				phoneBill: valuesShipping.phoneShip,
				countryBill: valuesShipping.countryShip,
				optionalBill: valuesShipping.optionalShip,
			};
		} else {
			values = oldValues;
		}
	};
	const checkMapValuesShipping = () => {
		if (
			values.firstNameBill === valuesShipping.firstNameShip &&
			values.lastNameBill === valuesShipping.lastNameShip &&
			values.addressBill === valuesShipping.addressShip &&
			values.cityBill === valuesShipping.cityShip &&
			values.provinceBill === valuesShipping.provinceShip &&
			values.postalCodeBill === valuesShipping.postalCodeShip &&
			values.phoneBill === valuesShipping.phoneShip &&
			values.countryBill === valuesShipping.countryShip &&
			values.optionalBill === valuesShipping.optionalShip
		) {
			isSameShipping = true;
		} else {
			isSameShipping = false;
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

{#if isServerError}
	<p class="red">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<ContentLoader width="300" height="300" uniqueKey="shippingAdressCountry">
		<rect x="0" y="0" rx="5" ry="5" width="300" height="300" />
	</ContentLoader>
{:else}
	<form class="" on:submit|preventDefault={handleSubmit} novalidate>
		<h4 class="fw6 mb4">{$_('checkout.billingAdd')}</h4>
		<div class="pb5 flex">
			<label class="checkbox flex items-center mb3 pointer">
				<input
					type="checkbox"
					bind:checked={isSameShipping}
					on:click={(e) => handleChecked(e)} />
				<span class="box flex items-center justify-center" />
				<span class="label ml3">{$_('checkout.sameShipping')} </span>
			</label>
		</div>

		<div class="flex mb4">
			<div class="flex-1 pr2" id="firstNameBill">
				<label
					class="fw6 db"
					class:red={errors.firstNameShip}
					for="firstNameBill">{$_('checkout.firstName')}</label>
				<input
					class="ba b--light-gray br1 fw6 f6 light-silver w-100 h-50-px mt3 ph3
						w-large"
					type="text"
					class:b--red={errors.firstNameBill}
					on:input={(event) => validate('firstNameBill', event.target.value)}
					bind:value={values.firstNameBill}
					name="firstNameBill" />
				{#if errors.firstNameBill}
					<div class="red fw6 mt2">{errors.firstNameBill}</div>
				{/if}
			</div>
			<div class="flex-1 pl2" id="lastNameBill">
				<label
					class="fw6 db"
					class:red={errors.lastNameBill}
					for="lastNameBill">{$_('checkout.lastName')}</label>
				<input
					class="ba b--light-gray br1 fw6 f6 light-silver w-100 h-50-px mt3 ph3
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
		<div class="mb4" id="addressBill">
			<label
				class="fw6 db"
				for="addressBill"
				class:red={errors.addressBill}>{$_('checkout.address')}</label>
			<input
				class="ba b--light-gray br1 fw6 f6 light-silver w-100 h-50-px mt3 ph3
					w-100"
				type="text"
				class:b--red={errors.addressBill}
				on:input={(event) => validate('addressBill', event.target.value)}
				bind:value={values.addressBill}
				name="addressBill" />
			{#if errors.addressBill}
				<div class="red fw6 mt2">{errors.addressBill}</div>
			{/if}
		</div>
		<div class="flex mb4" id="cityBill">
			<div class="flex-1 pr2">
				<label
					class="fw6 db"
					for="cityBill"
					class:red={errors.cityBill}>{$_('checkout.city')}</label>
				<input
					class="ba b--light-gray br1 fw6 f6 light-silver w-100 h-50-px mt3 ph3
						w-large"
					type="text"
					class:b--red={errors.cityBill}
					on:input={(event) => validate('cityBill', event.target.value)}
					bind:value={values.cityBill}
					name="cityBill" />
				{#if errors.cityBill}
					<div class="red fw6 mt2">{errors.cityBill}</div>
				{/if}
			</div>
			<div class="flex-1 ph2" id="provinceBill">
				<label
					class="fw6 db"
					for="provinceBill"
					class:red={errors.provinceBill}>{$_('checkout.province')}</label>
				<input
					class="ba b--light-gray br1 fw6 f6 light-silver w-100 h-50-px mt3 ph3
						w-small"
					type="text"
					class:b--red={errors.provinceBill}
					on:input={(event) => validate('provinceBill', event.target.value)}
					bind:value={values.provinceBill}
					name="cityBill" />
				{#if errors.provinceBill}
					<div class="red fw6 mt2">{errors.provinceBill}</div>
				{/if}
			</div>
			<div class="flex-1 pl2" id="postalCodeBill">
				<label
					class="fw6 db"
					class:red={errors.postalCodeBill}
					for="postalCodeBill">{$_('checkout.postalCode')}</label>
				<input
					class="ba b--light-gray br1 fw6 f6 light-silver w-100 h-50-px mt3 ph3
						w-small"
					type="text"
					class:b--red={errors.postalCodeBill}
					on:input={(event) => validate('postalCodeBill', event.target.value)}
					bind:value={values.postalCodeBill}
					name="postalCodeBill" />
				{#if errors.postalCodeBill}
					<div class="red fw6 mt2">{errors.postalCodeBill}</div>
				{/if}
			</div>
		</div>
		<div class="flex mb4">
			<div class="w-50 pr2" id="countryBill">
				<label
					class="fw6 db"
					for="countryBill"
					class:red={errors.countryBill}>{$_('checkout.country')}</label>
				{#if isServerErrorCountry}
					<p class="red">{$_('error.serverErrorMessage')}</p>
				{:else if isLoadingCountry}
					<ContentLoader
						width="300"
						height="30"
						uniqueKey="bilingAdressCountry">
						<rect x="0" y="0" rx="5" ry="5" width="300" height="30" />
					</ContentLoader>
				{:else if countries.length > 0}
					<!-- svelte-ignore a11y-no-onchange -->
					<select
						class:b--red={errors.countryBill}
						on:change={(event) => validate('countryBill', event.target.value)}
						bind:value={values.countryBill}
						name="countryBill"
						class="b--light-gray near-black br1 ba fw6 ph3 w-100 h-50-px ttc bg-white
							mt3 w-large">
						<option value="">{$_('device.placeholderCountry')}</option>
						{#each countries as country}
							<option value={country.id}>{country.name}</option>
						{/each}
					</select>
					{#if errors.countryBill}
						<div class="red fw6 mt2">{errors.countryBill}</div>
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
		<div class="flex mb4" id="phoneBill">
			<div class="w-25 pr2">
				<label
					class="fw6 db"
					for="phoneBill"
					class:red={errors.phoneBill}>{$_('checkout.phoneNo')}</label>
				<input
					class="ba b--light-gray br1 fw6 f6 light-silver w-100 h-50-px mt3 ph3
						w-small"
					type="text"
					class:b--red={errors.phoneBill}
					on:input={(event) => validate('phoneBill', event.target.value)}
					bind:value={values.phoneBill}
					name="phoneBill" />
				{#if errors.phoneBill}
					<div class="red fw6 mt2">{errors.phoneBill}</div>
				{/if}
			</div>
			<div class="w-25 ph2">
				<label class="fw6 db" for="last name">{$_('checkout.optional')}</label>
				<input
					class="ba b--light-gray br1 fw6 f6 light-silver w-100 h-50-px mt3 ph3
						w-small"
					type="text"
					on:input={(event) => validate('optionalBill', event.target.value)}
					bind:value={values.optionalBill}
					name="optionalBill" />
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

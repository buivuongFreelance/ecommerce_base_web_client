<script>
	import { _ } from 'svelte-i18n';
	import MaskInput from 'svelte-input-mask/MaskInput.svelte';
	import { stores } from '@sapper/app';
	import { onMount } from 'svelte';
	import { listCountries } from '../../services/model';
	import ContentLoader from 'svelte-content-loader';

	export let value = '';

	let selectedCountry = 'ca';
	let mask = '000-000-0000';

	let isServerError = false;
	let isLoading = false;
	const { session } = stores();
	const { domainModel } = $session;

	let countries = [];

	onMount(async () => {
		countries = await getListCountries();
	});
	const getListCountries = () => {
		return new Promise((resolve, reject) => {
			isLoading = true;
			listCountries(domainModel)
				.then((obj) => {
					isServerError = false;
					isLoading = false;
					resolve(obj);
				})
				.catch((error) => {
					isServerError = true;
					isLoading = false;
					reject(error);
				});
		});
	};

	const handleChangeCountry = () => {
		if (selectedCountry === 'CA') mask = '000-000-0000';
		else {
			mask = '0-000-000-0000';
		}
	};
</script>

<style>
	select {
		border-right: none;
	}
</style>

{#if isServerError}
	<p class="red f4 tc">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<div class="flex justify-center mv4">
		<ContentLoader width="1170" uniqueKey="myAccount">
			<rect x="0" y="0" rx="5" ry="5" width="1170" height="400" />
		</ContentLoader>
	</div>
{:else if countries.length == 0}
	<p class="i">{$_('label.thereIsNotCountry')}</p>
{:else if countries.length > 0}
	<div class="flex">
		<!-- svelte-ignore a11y-no-onchange -->
		<select
			bind:value={selectedCountry}
			on:change={handleChangeCountry}
			class="form-control ba b--light-gray h-50-px pl3 pr5">
			<option value={0}>Select country</option>
			{#each countries as country}
				<option value={country.id}>{country.name}</option>
			{/each}
		</select>
		<MaskInput
			value
			class="w-100 h-50-px ba b--light-gray ph4 flex-auto"
			alwaysShowMask={true}
			{mask}
			maskChar="_" />
	</div>
{/if}

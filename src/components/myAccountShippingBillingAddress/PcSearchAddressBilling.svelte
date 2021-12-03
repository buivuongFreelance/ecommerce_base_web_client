<script>
	import { _ } from 'svelte-i18n';
	import { validationAddress as apiValidationAddress } from '../../services/transaction';
	import config from '../../config';
	import PcSearchDropdownAddress from './PcSearchDropdownAddress.svelte';

	export let error = '';
	export let values;
	export let validate;
	export let isSameShipping = false;

	let isOpenSearch = false;
	let value = '';
	let addresses = [];
	let oldAddressBill = '';

	let timer;
	let rootEle;

	$: {
		if (values.addressBill !== oldAddressBill) {
			oldAddressBill = values.addressBill;
			if (value !== values.addressBill) {
				value = values.addressBill;
			}
		}
	}

	const debounce = (v, keyCode) => {
		if (keyCode !== 38 && keyCode !== 40) {
			isOpenSearch = true;
			clearTimeout(timer);
			timer = setTimeout(() => {
				if (value.length >= 1) {
					getAddresses();
				}
			}, 250);
		}
	};
	const getAddresses = async () => {
		try {
			const addressFilter = [];
			const addressesTemp = await apiValidationAddress(
				config.domainCanadaPostAddressComplete,
				{
					token: config.canadaPostAddressCompleteToken,
					keyword: value,
				}
			);

			addressesTemp.map((ad) => {
				if (ad.IsRetrievable) {
					addressFilter.push(ad);
				}
			});
			addresses = addressFilter;
		} catch (error) {}
	};
	const handleSelectAddress = (address) => {
		values.addressBill = address.Text + ', ' + address.Description;
		validate('addressBill', values.addressBill);
		isOpenSearch = false;
	};
	const handleBlurAddress = () => {
		setTimeout(() => {
			isOpenSearch = false;
			if (!values.addressBill) {
				value = '';
			} else {
				value = values.addressBill;
			}
			validate('addressBill', values.addressBill);
		}, 400);
	};
</script>

<div class="relative">
	<input
		disabled={isSameShipping ? true : false}
		class="ba b--light-gray br2 fw6 f6 light-silver w-100 h-40-px mt3 ph3 input-search"
		type="search"
		class:b--red={error}
		on:keyup={(event) => debounce(event.target.value, event.keyCode)}
		bind:this={rootEle}
		on:blur={handleBlurAddress}
		bind:value
		name="addressBill"
	/>
	{#if error}
		<div class="red fw6 mt2">{error}</div>
	{/if}
	{#if isOpenSearch}
		<PcSearchDropdownAddress
			{addresses}
			onSelect={handleSelectAddress}
			{error}
		/>
	{/if}
</div>

<style>
	.input-search:focus {
		border-color: transparent;
	}
	input[type='search']::-webkit-search-decoration,
	input[type='search']::-webkit-search-cancel-button,
	input[type='search']::-webkit-search-results-button,
	input[type='search']::-webkit-search-results-decoration {
		-webkit-appearance: none;
	}
	input[type='search']::-webkit-input-placeholder {
		/* Edge */
		color: #3f4254;
	}
	input[type='search']:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: #3f4254;
	}

	input[type='search']::placeholder {
		color: #3f4254;
	}
</style>

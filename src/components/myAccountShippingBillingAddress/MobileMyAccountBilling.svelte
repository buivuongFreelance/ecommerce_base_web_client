<script>
	import { _ } from 'svelte-i18n';
	import PcMaskInput from '../form/PcMaskInput.svelte';
	import PcSearchAddressBilling from './PcSearchAddressBilling.svelte';

	export let values;
	export let errors = {};
	export let validate;
	export let isSameShipping = false;
</script>

{#if values}
	<div class="">
		<h4 class="page__title tc ttc">{$_('checkout.billingAdd')}</h4>
		<div class="mt2rem flex">
			<label class="checkbox flex items-center pointer">
				<input type="checkbox" bind:checked={isSameShipping} />
				<span class="box flex items-center justify-center" />
				<span class="label ml3">{$_('checkout.sameShipping')} </span>
			</label>
		</div>
		{#if !isSameShipping}
			<div class="mt2rem" id="firstNameBill">
				<label
					class="fw6 db mb1"
					class:red={errors.firstNameBill}
					for="firstNameBill">{$_('checkout.firstName')}</label
				>
				<input
					class="ba b--light-gray br2 fw6 f6 light-silver w-100 h-40-px ph3 "
					type="text"
					class:b--red={errors.firstNameBill}
					on:input={(event) => validate('firstNameBill', event.target.value)}
					bind:value={values.firstNameBill}
					name="firstNameBill"
				/>
				{#if errors.firstNameBill}
					<div class="red fw6 mt2">{errors.firstNameBill}</div>
				{/if}
			</div>
			<div class="mt2rem" id="lastNameBill">
				<label class="fw6 db" class:red={errors.lastNameBill} for="lastNameBill"
					>{$_('checkout.lastName')}</label
				>
				<input
					class="ba b--light-gray br2 fw6 f6 light-silver w-100 w-100 h-40-px ph3
				"
					type="text"
					class:b--red={errors.lastNameBill}
					on:input={(event) => validate('lastNameBill', event.target.value)}
					bind:value={values.lastNameBill}
					name="lastNameBill"
				/>
				{#if errors.lastNameBill}
					<div class="red fw6 mt2">{errors.lastNameBill}</div>
				{/if}
			</div>

			<div class="mt2rem" id="addressBill">
				<label
					class="fw6 db mb1"
					for="addressBill"
					class:red={errors.addressBill}>{$_('checkout.address')}</label
				>
				<PcSearchAddressBilling
					error={errors.addressBill}
					{validate}
					bind:values
				/>
			</div>
			<div class="mt2rem" id="phoneBill">
				<label
					class="fw6 db mb1"
					for="phoneBill"
					class:b--red={errors.phoneBill}>{$_('checkout.phoneNo')}</label
				>
				<PcMaskInput
					onInput={(value) => validate('phoneBill', value)}
					className={errors.phoneBill
						? 'ba b--red br2 fw6 f6 light-silver h-40-px ph3 pl3'
						: 'pl3 ba b--light-gray br2 fw6 f6 light-silver h-40-px ph3'}
					bind:value={values.phoneBill}
					mask="000-000-0000"
					name="phoneBill"
				/>
				{#if errors.phoneBill}
					<div class="red fw6 mt2">{errors.phoneBill}</div>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
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

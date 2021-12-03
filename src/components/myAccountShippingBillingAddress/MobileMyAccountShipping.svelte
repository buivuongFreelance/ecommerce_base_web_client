<script>
	import { _ } from 'svelte-i18n';
	import PcMaskInput from '../form/PcMaskInput.svelte';
	import PcSearchAddress from './PcSearchAddress.svelte';

	export let values;
	export let errors = {};
	export let validate;
</script>

{#if values}
	<div class="">
		<h4 class="page__title tc ttc">{$_('checkout.shippingAdd')}</h4>
		<div class="mt2rem" id="firstNameShip">
			<label
				class="fw6 db mb1"
				class:red={errors.firstNameShip}
				for="firstNameShip">{$_('checkout.firstName')}</label
			>
			<input
				class="ba b--light-gray br2 fw6 f6 light-silver w-100 h-40-px ph3
					"
				type="text"
				class:b--red={errors.firstNameShip}
				on:input={(event) => validate('firstNameShip', event.target.value)}
				bind:value={values.firstNameShip}
				name="firstNameShip"
			/>
			{#if errors.firstNameShip}
				<div class="red fw6 mt2">{errors.firstNameShip}</div>
			{/if}
		</div>
		<div id="lastNameShip" class="mt2rem">
			<label
				class="fw6 db mb1"
				class:red={errors.lastNameShip}
				for="lastNameShip">{$_('checkout.lastName')}</label
			>
			<input
				class="ba b--light-gray br2 fw6 f6 light-silver w-100 h-40-px ph3
					"
				type="text"
				class:b--red={errors.lastNameShip}
				on:input={(event) => validate('lastNameShip', event.target.value)}
				bind:value={values.lastNameShip}
				name="lastNameShip"
			/>
			{#if errors.lastNameShip}
				<div class="red fw6 mt2">{errors.lastNameShip}</div>
			{/if}
		</div>

		<div class="mt2rem" id="addressShip">
			<label class="fw6 db mb1" for="addressShip" class:red={errors.addressShip}
				>{$_('checkout.address')}</label
			>
			<PcSearchAddress error={errors.addressShip} {validate} bind:values />
		</div>
		<div class="mt2rem" id="phoneShip">
			<label class="fw6 db mb1" for="phoneShip" class:b--red={errors.phoneShip}
				>{$_('checkout.phoneNo')}</label
			>
			<PcMaskInput
				onInput={(value) => validate('phoneShip', value)}
				className={errors.phoneShip
					? 'pl3 ba b--red br2 fw6 f6 light-silver h-40-px ph3'
					: 'pl3 ba b--light-gray br2 fw6 f6 light-silver h-40-px ph3 '}
				bind:value={values.phoneShip}
				mask="000-000-0000"
				name="phoneShip"
			/>
			{#if errors.phoneShip}
				<div class="red fw6 mt2">{errors.phoneShip}</div>
			{/if}
		</div>
	</div>
{/if}

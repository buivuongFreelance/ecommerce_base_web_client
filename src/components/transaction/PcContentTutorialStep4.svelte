<script>
	import { _ } from 'svelte-i18n';

	export let step = 0;
	export let isChecked = false;

	let noPassword = false;

	const handleComplete = () => {
		alert('complete');
		step = 3;
	};
</script>

<div class="custom">
	<h4 class="mb3">{$_('label.passwordToOpenYourPhone')}</h4>
	<p class="i">This password will send to Dingtoi's system</p>

	<div class="input mt5 db">
		<input
			type="text"
			class="ph5 w-100 h-60-px db ba b--light-gray f4 bg-white near-black"
			placeholder="Please, enter password your phone"
		/>
	</div>

	<div class="mt5 pb5 bb b--light-gray b--dashed">
		<label class="checkbox-default pointer">
			<input type="checkbox" bind:checked={noPassword} />
			<span />
			<span class="ml3">{$_('message.yourPhoneNoPassword')}</span>
		</label>
	</div>

	<div class="mt5">
		<label class="checkbox-default pointer">
			<input type="checkbox" bind:checked={isChecked} />
			<span />
			<span
				class="ml3 fw6"
				class:flash={!isChecked}
				class:animated={!isChecked}
				class:infinite={!isChecked}
				>{$_('label.confirmNextStepScanTransaction')}</span
			>
		</label>
	</div>
	<div class="flex justify-end mt5">
		<button
			type="button"
			on:click={() => step--}
			class="btn--cancel bn br2 bg-light-gray pv3 ph5 near-black pointer grow ttc fw6 mr3"
		>
			{$_('device.back')}
		</button>
		<button
			type="button"
			disabled={!isChecked}
			on:click={handleComplete}
			class="btn--primary bn br2 bg-dark-blue pv3 ph5 white pointer grow ttc fw6"
			>{$_('message.complete')}
		</button>
	</div>
</div>

<style>
	.btn--primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.input {
		width: min(100%, 500px);
	}
	.input input {
		border-radius: 30px;
	}
	.custom :global(.animated) {
		-webkit-animation-duration: 3s;
		animation-duration: 3s;
		-webkit-animation-fill-mode: both;
		animation-fill-mode: both;
	}
</style>

<script>
	import { _ } from 'svelte-i18n';

	export let step = 1;
	export let onStep;
</script>

<style>
	.hr {
		height: 5px;
		width: 100px;
	}
</style>

<div class="w-100 flex items-center justify-center">
	<div
		class="h-40-px w2 br-100 ba bw2 b--dark-blue flex items-center
			justify-center f4 fw6"
		on:click={() => {
			if (step > 1) {
				onStep(1);
			}
		}}
		class:dark-blue={step !== 1}
		class:white={step === 1}
		class:bg-dark-blue={step === 1}
		class:pointer={step > 1}>
		1
	</div>
	<div class="f4 fw6 ml3">{$_('checkout.shippingNBilling')}</div>

	<div
		class="hr mh5"
		class:bg-pale-grey={step < 2}
		class:bg-dark-blue={step >= 2} />

	<div
		class="h-40-px w2 br-100 ba bw2 flex items-center justify-center f4 fw6"
		on:click={() => {
			if (step > 2) {
				onStep(2);
			}
		}}
		class:dark-blue={step > 2}
		class:b--dark-blue={step > 2}
		class:steel-two={step < 2}
		class:bg-light-gray={step < 2}
		class:b--pale-grey={step < 2}
		class:white={step === 2}
		class:bg-dark-blue={step === 2}
		class:pointer={step > 2}>
		2
	</div>
	<div class="f4 fw6 ml3" class:steel-two={step < 2}>
		{$_('checkout.confirmCart')}
	</div>

	<div
		class="hr mh5"
		class:bg-dark-blue={step === 3}
		class:bg-pale-grey={step !== 3} />

	<div
		class="h-40-px w2 br-100 ba bw2 flex items-center justify-center f4 fw6"
		class:white={step === 3}
		class:bg-dark-blue={step === 3}
		class:steel-two={step !== 3}
		class:bg-light-gray={step !== 3}
		class:b--pale-grey={step != 3}>
		3
	</div>
	<div class="f4 fw6 ml3" class:steel-two={step !== 3}>
		{$_('checkout.payment')}
	</div>
</div>

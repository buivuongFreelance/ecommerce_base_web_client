<script>
	import { _ } from 'svelte-i18n';

	export let step = 1;
	export let onStep;
</script>

<div class="w-100">
	<div
		class="h-40-px box-width br2 ba bw2 b--dark-blue flex items-center
			justify-center fw6"
		on:click={() => {
			if (step > 1) {
				onStep(1);
			}
		}}
		class:dark-blue={step !== 1}
		class:white={step === 1}
		class:bg-dark-blue={step === 1}
		class:pointer={step > 1}
	>
		1. {$_('device.downApp')}
	</div>
	<div
		class="hr"
		class:bg-pale-grey={step < 2}
		class:bg-dark-blue={step >= 2}
	/>

	<div
		class="h-40-px box-width br2 ba bw2 flex items-center justify-center fw6"
		on:click={() => {
			if (step > 2) {
				onStep(2);
			}
		}}
		class:dark-blue={step > 2}
		class:b--dark-blue={step === 2}
		class:steel-two={step < 2}
		class:bg-light-gray={step < 2}
		class:b--pale-grey={step < 2}
		class:white={step === 2}
		class:bg-dark-blue={step === 2}
		class:pointer={step > 2}
	>
		2. {$_('device.openApp')}
	</div>
	<div
		class="hr"
		class:bg-dark-blue={step === 3}
		class:bg-pale-grey={step !== 3}
	/>
	<div
		class="h-40-px box-width br2 ba bw2 flex items-center justify-center fw6"
		class:white={step === 3}
		class:bg-dark-blue={step === 3}
		class:b--dark-blue={step === 3}
		class:steel-two={step !== 3}
		class:bg-light-gray={step !== 3}
		class:b--pale-grey={step != 3}
	>
		3. {$_('device.scanQR')}
	</div>
</div>

<style>
	.box-width {
		width: 250px;
		margin: 0 auto;
	}
	.hr {
		height: 31px;
		width: 7px;
		margin: 0 auto;
	}
</style>

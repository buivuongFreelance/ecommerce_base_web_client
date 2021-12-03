<script>
	import { _ } from 'svelte-i18n';
	import IconCheck from '../icon/IconCheck.svelte';

	export let step = 1;
	export let onStep;

	let steps = [
		{
			step: 1,
			name: $_('home.sell'),
		},
		{
			step: 2,
			name: $_('home.exchange'),
		},
		{
			step: 3,
			name: $_('message.uploadPhotos'),
		},
		{
			step: 4,
			name: $_('checkout.shippingAdd'),
		},
		{
			step: 5,
			name: $_('message.scanYourDevice'),
		},
	];
</script>

<div class="w-100 flex ">
	{#each steps as st}
		<div class="flex items-center" class:flex-1={st.step < 5}>
			<div
				class="box-circle ba bw3 b--light-gray flex items-center
						justify-center f7 fw6"
				on:click={() => {
					if (step > st.step) {
						onStep(st.step);
					}
				}}
				class:bg-dark-blue={step > st.step}
				class:light-silver={step !== st.step}
				class:dark-blue={step === st.step}
				class:bg-light-yellow={step === st.step}
				class:pointer={step > st.step}
			>
				{#if step > st.step}
					<IconCheck />
				{:else}{st.step}{/if}
			</div>
			{#if st.step !== 5}
				<div
					class="hr"
					class:bg-dark-blue={step > st.step}
					class:bg-pale-grey={step <= st.step}
				/>
			{/if}

			<!-- <div
				class="b mt3 ttu f7"
				class:p-1={st.step === 1}
				class:p-2={st.step === 2}
				class:p-3={st.step === 3}
				class:p-4={st.step === 4}
				class:dark-blue={step === st.step}
				class:near-black={step !== st.step}
			>
				{st.name}
			</div> -->
		</div>
	{/each}
</div>

<style>
	.flex-1 {
		flex: 1;
	}
	.box-circle {
		width: 30px;
		height: 30px;
		border-radius: 50%;
	}
	.hr {
		height: 6px;
		width: calc(100% - 30px);
	}
</style>

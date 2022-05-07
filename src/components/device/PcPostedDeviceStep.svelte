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

<div class="w-100 flex items-center justify-center">
	{#each steps as st}
		<div class="flex flex-column" class:p-5={st.step === 5}>
			<div class="flex justify-center items-center">
				<div
					class="box-circle ba bw5 b--light-gray flex items-center
			justify-center f4 fw6"
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
			</div>
			<div
				class="b mt3 ttu"
				class:p-1={st.step === 1}
				class:p-2={st.step === 2}
				class:p-3={st.step === 3}
				class:p-4={st.step === 4}
				class:dark-blue={step === st.step}
				class:near-black={step !== st.step}
			>
				{st.name}
			</div>
		</div>
	{/each}
</div>

<style>
	.box-circle {
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}
	.hr {
		height: 10px;
		width: 130px;
	}
	.p-1 {
		margin-left: 8px;
	}
	.p-2 {
		margin-left: -15px;
	}
	.p-3 {
		margin-left: -35px;
	}
	.p-4 {
		margin-left: -48px;
	}
	.p-5 {
		margin-left: -48px;
	}
</style>

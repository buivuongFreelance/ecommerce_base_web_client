<script>
	import { onDestroy, onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	import PcFactoryResetForSamsung from '../transaction/PcFactoryResetForSamsung.svelte';
	import PcFactoryResetForIos from '../transaction/PcFactoryResetForIos.svelte';

	export let step = 0;
	export let deviceBrand = 'Samsung';
	export let isChecked = false;

	export let progressStepSS = 1;
	export let progressStepIos = 1;
	export let handleSkip;

	onMount(() => {});
	onDestroy(() => {});
	const handleNext = () => {
		step++;
		isChecked = false;
	};
</script>

<div class="custom">
	{#if deviceBrand === 'Samsung'}
		<PcFactoryResetForSamsung bind:progressStep={progressStepSS} {handleSkip} />
	{:else}
		<PcFactoryResetForIos bind:progressStep={progressStepIos} {handleSkip} />
	{/if}

	{#if progressStepSS === 7 || progressStepIos === 11}
		<div class="flex items-center justify-between mt3">
			<div class="relative">
				<label class="checkbox-default pointer">
					<input type="checkbox" bind:checked={isChecked} />
					<span />
					<span class="fw6 ml3">
						{$_('label.confirmNextStepScanTransaction')}
					</span>
				</label>
				<img
					src="images/hand_guide.png"
					alt="hand_guide"
					class="arrow-guide bounce animated infinite slower"
				/>
			</div>
			<div class="flex justify-end">
				<button
					type="button"
					disabled={!isChecked}
					on:click={handleNext}
					class="btn--primary bn br2 bg-dark-blue pv3 ph5 white pointer grow ttc fw6"
					>{$_('message.completeFactoryReset')}
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.arrow-guide {
		position: absolute;
		bottom: 100%;
		left: 0;
		width: 50px;
	}
</style>

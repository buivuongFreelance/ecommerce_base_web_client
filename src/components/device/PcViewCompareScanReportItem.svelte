<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import { calculatePhysicalGrading } from '../../functions';
	import PcIconYesNo from '../input/PcIconYesNo.svelte';
	import PcRating from '../input/PcRating.svelte';

	export let feature;
	export let isOpenImage = false;
</script>

<div class="flex justify-end items-center">
	{#if feature === config.no}
		<button
			on:click={() => (isOpenImage = true)}
			type="button"
			class="btn-view mr3 h-30-px bn bg-light-blue
										white br2 ph4 pointer fw6"
		>
			{$_('device.view')}
		</button>
		<PcIconYesNo status={feature} />
	{:else if feature === config.yes}
		<PcIconYesNo status={feature} />
	{:else if feature === 1 || feature === 2 || feature === 3 || feature === 4 || feature === 5}
		<PcRating rating={feature} />
	{:else if feature === 10 || feature === 20 || feature === 30 || feature === 40 || feature === 50}
		{calculatePhysicalGrading(feature)}
	{:else}
		<span class="ttc yellow">
			{feature === 'not_verified' ? $_('device.notVerified') : feature}
		</span>
	{/if}
</div>

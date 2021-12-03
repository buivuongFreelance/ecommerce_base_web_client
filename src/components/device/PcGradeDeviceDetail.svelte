<script>
	import { _ } from 'svelte-i18n';
	import { fieldPhysicalGrading } from '../../stores';
	import PcPhysicalGradingCheckbox from '../form/PcPhysicalGradingCheckbox.svelte';
</script>

{#if $fieldPhysicalGrading === 'A'}
	<PcPhysicalGradingCheckbox
		onClick={() => {}}
		title={$_('device.grade') + ' ' + $fieldPhysicalGrading}
		selected={$fieldPhysicalGrading === 'A'}>
		<div class="flex flex-column justify-center h-100-px" slot="desc">
			<p>{$_('device.almostNew')}</p>
			<p>{$_('device.veryFewScratches')}</p>
			<p>{$_('device.veryMinimal')}</p>
		</div>
	</PcPhysicalGradingCheckbox>
{:else if $fieldPhysicalGrading === 'B'}
	<PcPhysicalGradingCheckbox
		onClick={() => {}}
		selected={$fieldPhysicalGrading === 'B'}
		title={$_('device.grade') + ' ' + $fieldPhysicalGrading}>
		<div class="flex flex-column justify-center h-100-px" slot="desc">
			<p>{$_('device.almostGradeA')}</p>
		</div>
	</PcPhysicalGradingCheckbox>
{:else if $fieldPhysicalGrading === 'C'}
	<PcPhysicalGradingCheckbox
		onClick={() => {}}
		selected={$fieldPhysicalGrading === 'C'}
		title={$_('device.grade') + ' ' + $fieldPhysicalGrading}>
		<div class="flex flex-column justify-center h-100-px" slot="desc">
			<p>{$_('device.obviousSignOf')}</p>
			<p>{$_('device.manyScratches')}</p>
		</div>
	</PcPhysicalGradingCheckbox>
{:else}
	<PcPhysicalGradingCheckbox
		onClick={() => {}}
		selected={$fieldPhysicalGrading === 'D'}
		title={$_('device.grade') + ' ' + $fieldPhysicalGrading}>
		<div class="flex flex-column justify-center h-100-px" slot="desc">
			<p>{$_('device.visibleCrack')}</p>
			<p>{$_('device.deepScratches')}</p>
		</div>
	</PcPhysicalGradingCheckbox>
{/if}

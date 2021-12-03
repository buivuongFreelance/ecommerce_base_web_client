<script>
	import { _ } from 'svelte-i18n';
	import { fieldPhysicalGrading } from '../../stores';
	import MobilePhysicalGradingCheckbox from '../form/MobilePhysicalGradingCheckbox.svelte';
</script>

{#if $fieldPhysicalGrading === 'A'}
	<MobilePhysicalGradingCheckbox
		onClick={() => {}}
		title={$fieldPhysicalGrading}
		selected={$fieldPhysicalGrading === 'A'}
	>
		<div class="flex flex-column justify-center h-100-px" slot="desc">
			<p>{$_('device.almostNew')}</p>
			<p>{$_('device.veryFewScratches')}</p>
			<p>{$_('device.veryMinimal')}</p>
		</div>
	</MobilePhysicalGradingCheckbox>
{:else if $fieldPhysicalGrading === 'B'}
	<MobilePhysicalGradingCheckbox
		onClick={() => {}}
		selected={$fieldPhysicalGrading === 'B'}
		title={$fieldPhysicalGrading}
	>
		<div class="flex flex-column justify-center h-100-px" slot="desc">
			<p>{$_('device.almostGradeA')}</p>
		</div>
	</MobilePhysicalGradingCheckbox>
{:else if $fieldPhysicalGrading === 'C'}
	<MobilePhysicalGradingCheckbox
		onClick={() => {}}
		selected={$fieldPhysicalGrading === 'C'}
		title={$fieldPhysicalGrading}
	>
		<div class="flex flex-column justify-center h-100-px" slot="desc">
			<p>{$_('device.obviousSignOf')}</p>
			<p>{$_('device.manyScratches')}</p>
		</div>
	</MobilePhysicalGradingCheckbox>
{:else}
	<MobilePhysicalGradingCheckbox
		onClick={() => {}}
		selected={$fieldPhysicalGrading === 'D'}
		title={$fieldPhysicalGrading}
	>
		<div class="flex flex-column justify-center h-100-px" slot="desc">
			<p>{$_('device.visibleCrack')}</p>
			<p>{$_('device.deepScratches')}</p>
		</div>
	</MobilePhysicalGradingCheckbox>
{/if}

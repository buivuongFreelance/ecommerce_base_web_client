<script>
	import { _ } from 'svelte-i18n';
	import PcPhysicalGradingCheckbox from '../form/PcPhysicalGradingCheckbox.svelte';
	import { fieldPhysicalGrading } from '../../stores';
	import { onDestroy } from 'svelte';

	onDestroy(() => {
		fieldPhysicalGrading.set('');
	});
</script>

<PcPhysicalGradingCheckbox
	title={$_('device.grade') + ' A'}
	onClick={() => fieldPhysicalGrading.set('A')}
	selected={$fieldPhysicalGrading === 'A'}>
	<div class="flex flex-column justify-center h-100-px" slot="desc">
		<p>{$_('device.almostNew')}</p>
		<p>{$_('device.veryFewScratches')}</p>
		<p>{$_('device.veryMinimal')}</p>
	</div>
</PcPhysicalGradingCheckbox>
<PcPhysicalGradingCheckbox
	title={$_('device.grade') + ' B'}
	onClick={() => fieldPhysicalGrading.set('B')}
	selected={$fieldPhysicalGrading === 'B'}>
	<div class="flex flex-column justify-center h-100-px" slot="desc">
		<p>{$_('device.almostGradeA')}</p>
	</div>
</PcPhysicalGradingCheckbox>
<PcPhysicalGradingCheckbox
	title={$_('device.grade') + ' C'}
	onClick={() => fieldPhysicalGrading.set('C')}
	selected={$fieldPhysicalGrading === 'C'}>
	<div class="flex flex-column justify-center h-100-px" slot="desc">
		<p>{$_('device.obviousSignOf')}</p>
		<p>{$_('device.manyScratches')}</p>
	</div>
</PcPhysicalGradingCheckbox>
<PcPhysicalGradingCheckbox
	title={$_('device.grade') + ' D'}
	onClick={() => fieldPhysicalGrading.set('D')}
	selected={$fieldPhysicalGrading === 'D'}>
	<div class="flex flex-column justify-center h-100-px" slot="desc">
		<p>{$_('device.visibleCrack')}</p>
		<p>{$_('device.deepScratches')}</p>
	</div>
</PcPhysicalGradingCheckbox>

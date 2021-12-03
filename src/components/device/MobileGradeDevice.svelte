<script>
	import { _ } from 'svelte-i18n';
	import MobilePhysicalGradingCheckbox from '../form/MobilePhysicalGradingCheckbox.svelte';
	import { fieldPhysicalGrading } from '../../stores';
	import { onDestroy } from 'svelte';

	onDestroy(() => {
		fieldPhysicalGrading.set('');
	});
</script>

<MobilePhysicalGradingCheckbox
	title={'A'}
	onClick={() => fieldPhysicalGrading.set('A')}
	selected={$fieldPhysicalGrading === 'A'}
>
	<div class="flex flex-column justify-center h-100-px" slot="desc">
		<p>{$_('device.almostNew')}</p>
		<p>{$_('device.veryFewScratches')}</p>
		<p>{$_('device.veryMinimal')}</p>
	</div>
</MobilePhysicalGradingCheckbox>
<MobilePhysicalGradingCheckbox
	title={'B'}
	onClick={() => fieldPhysicalGrading.set('B')}
	selected={$fieldPhysicalGrading === 'B'}
>
	<div class="flex flex-column justify-center h-100-px" slot="desc">
		<p>{$_('device.almostGradeA')}</p>
	</div>
</MobilePhysicalGradingCheckbox>
<MobilePhysicalGradingCheckbox
	title={'C'}
	onClick={() => fieldPhysicalGrading.set('C')}
	selected={$fieldPhysicalGrading === 'C'}
>
	<div class="flex flex-column justify-center h-100-px" slot="desc">
		<p>{$_('device.obviousSignOf')}</p>
		<p>{$_('device.manyScratches')}</p>
	</div>
</MobilePhysicalGradingCheckbox>
<MobilePhysicalGradingCheckbox
	title={'D'}
	onClick={() => fieldPhysicalGrading.set('D')}
	selected={$fieldPhysicalGrading === 'D'}
>
	<div class="flex flex-column justify-center h-100-px" slot="desc">
		<p>{$_('device.visibleCrack')}</p>
		<p>{$_('device.deepScratches')}</p>
	</div>
</MobilePhysicalGradingCheckbox>

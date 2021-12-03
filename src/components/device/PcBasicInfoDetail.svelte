<script>
	import { _ } from 'svelte-i18n';
	import MobileInputReadOnly from '../input/MobileInputReadOnly.svelte';
	import { infoImei } from '../../stores';
</script>

<style>
	.w-label {
		width: 200px;
		margin-right: 30px;
	}
</style>

{#if $infoImei}
	<h3 class="tc mv5">{$_('device.basicInfo')}</h3>
	<div class="mb5 flex items-center justify-between">
		<label class="fw6 f6 tr w-label" for="Model">{$_('device.model')}</label>
		<MobileInputReadOnly bindValue={$infoImei.model} name="model" />
	</div>
	<div class="mb5 flex items-center justify-between">
		<label class="fw6 f6 tr w-label" for="Brand">{$_('device.brand')}</label>
		<MobileInputReadOnly bindValue={$infoImei.brand_name} name="brand" />
	</div>
	<div class="mb5 flex items-center justify-between">
		<label class="fw6 f6 tr w-label" for="Model">{$_('device.color')}</label>
		<MobileInputReadOnly bindValue={$infoImei.color} name="color" />
	</div>
	<div class="mb5 flex items-center justify-between">
		<label class="fw6 f6 tr w-label" for="Model">{$_('device.strCa')}</label>
		<MobileInputReadOnly
			bindValue={$infoImei.capacity + ' GB'}
			name="capacity" />
	</div>
	<div class="mb5 flex items-center justify-between">
		<label class="fw6 f6 tr w-label" for="Model">{$_('device.ram')}</label>
		<MobileInputReadOnly bindValue={$infoImei.ram_value + ' GB'} name="ram" />
	</div>
{/if}

<script>
	import { _ } from 'svelte-i18n';
	import MobileInputReadOnly from '../input/MobileInputReadOnly.svelte';
	import { fieldCapacity, fieldColor, fieldRam, infoImei } from '../../stores';
</script>

{#if $infoImei}
	<h4 class="tc mt2rem mb1rem">{$_('device.basicInfo')}</h4>
	<table class="table-default">
		<tr>
			<td class="bg-blue-10 light-silver">{$_('device.model')}</td>
			<td class="tr">{$infoImei.model}</td>
		</tr>
		<tr>
			<td class="bg-blue-10 light-silver">{$_('device.brand')}</td>
			<td class="tr">{$infoImei.brand_name}</td>
		</tr>
		<tr>
			<td class="bg-blue-10 light-silver">{$_('device.color')}</td>
			<td class="tr">{$infoImei.color}</td>
		</tr>
		<tr>
			<td class="bg-blue-10 light-silver">{$_('device.strCa')}</td>
			<td class="tr">{$infoImei.capacity + 'GB'}</td>
		</tr>
		<tr>
			<td class="bg-blue-10 light-silver">{$_('device.ram')}</td>
			<td class="tr">{$infoImei.ram_value + 'GB'}</td>
		</tr>
	</table>
	<!-- <div class="mb5 w-100">
		<label class="fw6 f6" for="Model">{$_('device.model')}</label>
		<MobileInputReadOnly bindValue={$infoImei.model} name="model" />
	</div>
	<div class="mb5 w-100">
		<label class="fw6 f6" for="Model">{$_('device.brand')}</label>
		<MobileInputReadOnly bindValue={$infoImei.brand_name} name="brand" />
	</div>
	<div class="mb5 w-100">
		<label class="fw6 f6" for="Model">{$_('device.color')}</label>
		<MobileInputReadOnly bindValue={$infoImei.color} name="color" />
	</div>
	<div class="mb5 w-100">
		<label class="fw6 f6" for="Model">{$_('device.strCa')}</label>
		<MobileInputReadOnly
			bindValue={$infoImei.capacity + ' GB'}
			name="capacity"
		/>
	</div>
	<div class="mb5 w-100">
		<label class="fw6 f6" for="Model">{$_('device.ram')}</label>
		<MobileInputReadOnly bindValue={$infoImei.ram_value + ' GB'} name="ram" />
	</div> -->
{/if}

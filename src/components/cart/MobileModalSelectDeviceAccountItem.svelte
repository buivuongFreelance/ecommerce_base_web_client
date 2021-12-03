<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import PcTagDevice from '../device/PcTagDevice.svelte';

	export let item;
	export let onSelect;
</script>

<style>
</style>

{#if item}
	<div
		class="flex justify-between ph3 ba b--black-10 bt-0 items-center relative
			item-device pv4">
		<div class="flex items-center justify-between w-100">
			<div class="w-60">
				<div class="flex-column flex mb3">
					<div class="light-blue fw6" on:click={() => onSelect(item)}>
						{item.model}
						-
						{item.color}
						-
						{item.capacity}
						GB
					</div>
					<span class="light-silver">{item.imei}</span>
				</div>
				<div class="mb3">
					<span
						class="green fw5">{$_('device.grade') + ' ' + item.physical_grading}</span>
				</div>
				<div>
					<PcTagDevice status={item.status} />
				</div>
			</div>
			<div>
				<button
					type="button"
					on:click={() => onSelect(item)}
					class="link fw6 ph3 h-40-px br2 white bg-blue bn flex items-center
						grow pointer">
					{$_('message.selectItem')}
				</button>
			</div>
		</div>
	</div>
{/if}

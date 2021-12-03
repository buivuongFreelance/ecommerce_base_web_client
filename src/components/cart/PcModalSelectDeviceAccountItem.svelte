<script>
	import { _ } from 'svelte-i18n';
	import PcTagDevice from '../device/PcTagDevice.svelte';

	export let item;
	export let onSelect;
</script>

<style>
	.w-dn {
		width: 440px;
	}
	.w-pg {
		width: 190px;
	}
	.w-sta {
		width: 260px;
	}
	.w-ext {
		width: 250px;
	}
</style>

{#if item}
	<div class="flex ph5 h-70-px ba b--black-10 bt-0 items-center relative">
		<div class="w-dn flex-column flex">
			<div class="link light-blue fw6 pointer" on:click={() => onSelect(item)}>
				{item.model}
				-
				{item.color}
				-
				{item.capacity}
				GB
			</div>
			<span class="light-silver">{item.imei}</span>
		</div>
		<div class="w-pg">
			<span
				class="green fw5">{$_('device.grade') + ' ' + item.physical_grading}</span>
		</div>

		<div class="w-sta">
			<PcTagDevice status={item.status} />
		</div>

		<div class="flex items-center justify-end w-ext">
			<button
				type="button"
				on:click={() => onSelect(item)}
				class="link fw6 ph3 h-40-px br2 white bg-blue bn flex items-center grow
					pointer">
				{$_('message.selectItem')}
			</button>
		</div>
	</div>
{/if}

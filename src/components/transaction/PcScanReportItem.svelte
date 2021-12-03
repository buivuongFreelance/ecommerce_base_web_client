<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import PcIconYesNo from '../input/PcIconYesNo.svelte';
	export let key = '';
	export let value = '';
	export let isOpenImageScanTouch = false;
</script>

<tr class="">
	<td class="pa3 ttc">
		{key}
	</td>
	<td width="1">
		<div class="flex justify-end items-center">
			{#if value === config.no}
				<button
					on:click={() => (isOpenImageScanTouch = true)}
					type="button"
					class="btn-view mr3 h-30-px bn bg-light-blue
                                                    white br2 ph4 pointer fw6"
				>
					{$_('device.view')}
				</button>
				<PcIconYesNo status={value} />
			{:else if value === config.yes}
				<PcIconYesNo status={value} />
			{:else}
				<span class="ttc yellow"
					>{value === 'not_verified' ? $_('device.notVerified') : value}</span
				>
			{/if}
		</div>
	</td>
</tr>

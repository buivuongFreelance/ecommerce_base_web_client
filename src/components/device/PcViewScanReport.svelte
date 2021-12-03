<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import PcScanReportItem from '../transaction/PcScanReportItem.svelte';

	export let item;
	export let isOpenImageScanTouch;

	const findValueInArrayOfObject = (key, array) => {
		let obj = array.find((x) => x.key === key);
		if (obj) return obj.label;
		else return null;
	};
</script>

<table class="table-record">
	{#if item.main_info.blacklistStatus}
		<tbody>
			<tr class="">
				<td colspan="2" class="b bg-blue-10 ttu">Blacklist</td>
			</tr>
			<tr>
				<td colspan="">{$_('device.blacklistStatus')}</td>
				<td class="tr" width="1">
					<span class="yellow">
						{item.main_info.blacklistStatus}
					</span>
				</td>
			</tr>
		</tbody>
	{/if}
	<tbody>
		<tr>
			<td colspan="2" class="b bg-blue-10 ttu">General</td>
		</tr>

		{#each Object.entries(item.main_info) as [key, value]}
			{#if config.groupGeneral.find((x) => x.key === key)}
				<PcScanReportItem
					key={findValueInArrayOfObject(key, config.groupGeneral)}
					{value}
					bind:isOpenImageScanTouch
				/>
			{/if}
		{/each}
	</tbody>

	<tbody>
		<tr>
			<td colspan="2" class="b bg-blue-10 ttu">Connection</td>
		</tr>
		{#each Object.entries(item.main_info) as [key, value]}
			{#if config.groupConnection.find((x) => x.key === key)}
				<PcScanReportItem
					key={findValueInArrayOfObject(key, config.groupConnection)}
					{value}
					bind:isOpenImageScanTouch
				/>
			{/if}
		{/each}
	</tbody>
	{#if item.main_info.voiceInbound && item.main_info.voiceOutbound}
		<tbody>
			<tr>
				<td colspan="2" class="b bg-blue-10 ttu">Phone</td>
			</tr>
			{#each Object.entries(item.main_info) as [key, value]}
				{#if config.groupPhone.find((x) => x.key === key)}
					<PcScanReportItem
						key={findValueInArrayOfObject(key, config.groupPhone)}
						{value}
						bind:isOpenImageScanTouch
					/>
				{/if}
			{/each}
		</tbody>
	{/if}
	{#if item.main_info.textInbound && item.main_info.textOutbound}
		<tbody>
			<tr>
				<td colspan="2" class="b bg-blue-10 ttu">SMS</td>
			</tr>
			{#each Object.entries(item.main_info) as [key, value]}
				{#if config.groupSMS.find((x) => x.key === key)}
					<PcScanReportItem
						key={findValueInArrayOfObject(key, config.groupSMS)}
						{value}
						bind:isOpenImageScanTouch
					/>
				{/if}
			{/each}
		</tbody>
	{/if}
</table>

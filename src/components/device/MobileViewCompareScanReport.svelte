<script>
	import { _ } from 'svelte-i18n';
	import PcViewCompareScanReportItem from './PcViewCompareScanReportItem.svelte';

	export let compare;
	export let item;
	export let isOpenImageCompareScanTouch = false;
	export let isOpenImageScanTouch = false;
</script>

<table class="table-default tr">
	<thead class="bg-dark-blue white">
		<tr>
			<th class="tc">{$_('device.lastDeviceScan')}</th>
			<th class="tc">{$_('device.lastBuyerScan')}</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td colspan="2" class="bg-blue-10 ttc tc b"
				>{$_('deviceDetail.physicalGrading')} + {$_('label.dingtoiRating')}</td
			>
		</tr>
		<tr>
			<td colspan="2" class="tc bg-light-gray ttc"
				>{$_('deviceDetail.physicalGrading')}</td
			>
		</tr>
		<tr>
			<td class="">
				<PcViewCompareScanReportItem
					feature={item.physicalGrading}
					bind:isOpenImage={isOpenImageScanTouch}
				/>
			</td>
			<td class="">
				<PcViewCompareScanReportItem
					feature={compare.physicalGrading}
					bind:isOpenImage={isOpenImageCompareScanTouch}
				/>
			</td>
		</tr>
		<tr>
			<td colspan="2" class="tc bg-light-gray ttc"
				>{$_('label.dingtoiRating')}</td
			>
		</tr>
		<tr>
			<td class="">
				<PcViewCompareScanReportItem
					feature={item.diamondRating}
					bind:isOpenImage={isOpenImageScanTouch}
				/>
			</td>
			<td class="">
				<PcViewCompareScanReportItem
					feature={compare.diamondRating}
					bind:isOpenImage={isOpenImageCompareScanTouch}
				/>
			</td>
		</tr>

		<tr>
			<td colspan="2" class="bg-blue-10 ttc tc b">{$_('device.blackList')}</td>
		</tr>
		<tr>
			<td colspan="2" class="tc bg-light-gray ttc"
				>{$_('device.blacklistStatus')}</td
			>
		</tr>
		<tr>
			<td class="">
				<PcViewCompareScanReportItem
					feature={item.blacklistStatus}
					bind:isOpenImage={isOpenImageScanTouch}
				/>
			</td>
			<td class="">
				<PcViewCompareScanReportItem
					feature={compare.blacklistStatus}
					bind:isOpenImage={isOpenImageCompareScanTouch}
				/>
			</td>
		</tr>
		<tr>
			<td colspan="2" class="bg-blue-10 ttc tc b">{$_('device.general')}</td>
		</tr>
		<tr>
			<td colspan="2" class="tc bg-light-gray ttc">{$_('device.flash')}</td>
		</tr>
		<tr>
			<td class="">
				<PcViewCompareScanReportItem
					feature={item.flash}
					bind:isOpenImage={isOpenImageScanTouch}
				/>
			</td>
			<td class="">
				<PcViewCompareScanReportItem
					feature={compare.flash}
					bind:isOpenImage={isOpenImageCompareScanTouch}
				/>
			</td>
		</tr>
		<tr>
			<td colspan="2" class="tc bg-light-gray ttc">{$_('device.camera')}</td>
		</tr>
		<tr>
			<td class="">
				<PcViewCompareScanReportItem
					feature={item.camera}
					bind:isOpenImage={isOpenImageScanTouch}
				/>
			</td>
			<td class="">
				<PcViewCompareScanReportItem
					feature={compare.camera}
					bind:isOpenImage={isOpenImageCompareScanTouch}
				/>
			</td>
		</tr>
		<tr>
			<td colspan="2" class="tc bg-light-gray ttc">{$_('device.finger')}</td>
		</tr>
		<tr>
			<td class="">
				<PcViewCompareScanReportItem
					feature={item.finger}
					bind:isOpenImage={isOpenImageScanTouch}
				/>
			</td>
			<td class="">
				<PcViewCompareScanReportItem
					feature={compare.finger}
					bind:isOpenImage={isOpenImageCompareScanTouch}
				/>
			</td>
		</tr>
		<tr>
			<td colspan="2" class="tc bg-light-gray ttc">{$_('device.volume')}</td>
		</tr>
		<tr>
			<td class="">
				<PcViewCompareScanReportItem
					feature={item.volume}
					bind:isOpenImage={isOpenImageScanTouch}
				/>
			</td>
			<td class="">
				<PcViewCompareScanReportItem
					feature={compare.volume}
					bind:isOpenImage={isOpenImageCompareScanTouch}
				/>
			</td>
		</tr>
		<tr>
			<td colspan="2" class="tc bg-light-gray ttc">{$_('device.microphone')}</td
			>
		</tr>
		<tr>
			<td class="">
				<PcViewCompareScanReportItem
					feature={item.microphone}
					bind:isOpenImage={isOpenImageScanTouch}
				/>
			</td>
			<td class="">
				<PcViewCompareScanReportItem
					feature={compare.microphone}
					bind:isOpenImage={isOpenImageCompareScanTouch}
				/>
			</td>
		</tr>
		<tr>
			<td colspan="2" class="tc bg-light-gray ttc"
				>{$_('device.touchscreen')}</td
			>
		</tr>
		<tr>
			<td class="">
				<PcViewCompareScanReportItem
					feature={item.touchscreen}
					bind:isOpenImage={isOpenImageScanTouch}
				/>
			</td>
			<td class="">
				<PcViewCompareScanReportItem
					feature={compare.touchscreen}
					bind:isOpenImage={isOpenImageCompareScanTouch}
				/>
			</td>
		</tr>
		<tr>
			<td colspan="2" class="bg-blue-10 ttc tc b">{$_('device.connection')}</td>
		</tr>
		<tr>
			<td colspan="2" class="tc bg-light-gray ttc">{$_('device.wife')}</td>
		</tr>
		<tr>
			<td class="">
				<PcViewCompareScanReportItem
					feature={item.wifi}
					bind:isOpenImage={isOpenImageScanTouch}
				/>
			</td>
			<td class="">
				<PcViewCompareScanReportItem
					feature={compare.wifi}
					bind:isOpenImage={isOpenImageCompareScanTouch}
				/>
			</td>
		</tr>
		<tr>
			<td colspan="2" class="tc bg-light-gray ttc">{$_('device.bluetooth')}</td>
		</tr>
		<tr>
			<td class="">
				<PcViewCompareScanReportItem
					feature={item.bluetooth}
					bind:isOpenImage={isOpenImageScanTouch}
				/>
			</td>
			<td class="">
				<PcViewCompareScanReportItem
					feature={compare.bluetooth}
					bind:isOpenImage={isOpenImageCompareScanTouch}
				/>
			</td>
		</tr>
		<tr>
			<td colspan="2" class="bg-blue-10 ttc tc b">{$_('device.voice')}</td>
		</tr>
		<tr>
			<td colspan="2" class="tc bg-light-gray ttc"
				>{$_('device.voiceInbound')}</td
			>
		</tr>
		<tr>
			<td class="">
				<PcViewCompareScanReportItem
					feature={item.voiceInbound}
					bind:isOpenImage={isOpenImageScanTouch}
				/>
			</td>
			<td class="">
				<PcViewCompareScanReportItem
					feature={compare.voiceInbound}
					bind:isOpenImage={isOpenImageCompareScanTouch}
				/>
			</td>
		</tr>
		<tr>
			<td colspan="2" class="tc bg-light-gray ttc"
				>{$_('device.voiceOutbound')}</td
			>
		</tr>
		<tr>
			<td class="">
				<PcViewCompareScanReportItem
					feature={item.voiceOutbound}
					bind:isOpenImage={isOpenImageScanTouch}
				/>
			</td>
			<td class="">
				<PcViewCompareScanReportItem
					feature={compare.voiceOutbound}
					bind:isOpenImage={isOpenImageCompareScanTouch}
				/>
			</td>
		</tr>
		<tr>
			<td colspan="2" class="bg-blue-10 ttc tc b">{$_('device.sms')}</td>
		</tr>
		<tr>
			<td colspan="2" class="tc bg-light-gray ttc">{$_('device.smsInbound')}</td
			>
		</tr>
		<tr>
			<td class="">
				<PcViewCompareScanReportItem
					feature={item.textInbound}
					bind:isOpenImage={isOpenImageScanTouch}
				/>
			</td>
			<td class="">
				<PcViewCompareScanReportItem
					feature={compare.textInbound}
					bind:isOpenImage={isOpenImageCompareScanTouch}
				/>
			</td>
		</tr>
		<tr>
			<td colspan="2" class="tc bg-light-gray ttc"
				>{$_('device.smsOutbound')}</td
			>
		</tr>
		<tr>
			<td class="">
				<PcViewCompareScanReportItem
					feature={item.textOutbound}
					bind:isOpenImage={isOpenImageScanTouch}
				/>
			</td>
			<td class="">
				<PcViewCompareScanReportItem
					feature={compare.textOutbound}
					bind:isOpenImage={isOpenImageCompareScanTouch}
				/>
			</td>
		</tr>
	</tbody>
</table>

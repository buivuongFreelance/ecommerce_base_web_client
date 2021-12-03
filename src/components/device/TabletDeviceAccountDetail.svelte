<script>
	import { _ } from 'svelte-i18n';
	import { goto } from '@sapper/app';
	import { auth, infoImei } from '../../stores';
	import { displayDateDefault } from '../../functions';
	import PcInputImeiReadOnly from '../input/PcInputImeiReadOnly.svelte';
	import TabletInfoAndGradeDeviceDetail from '../form/TabletInfoAndGradeDeviceDetail.svelte';
	import TabletInfoPostedDeviceDetail from './TabletInfoPostedDeviceDetail.svelte';
	import config from '../../config';
	import PcTagDevice from './PcTagDevice.svelte';

	export let handleGotoEdit;
	export let handleDelete;
	export let id;
</script>

<style>
	.btn-width {
		width: 170px;
	}
</style>

<div class="w-100 spacing-ext center pv5">
	<div class="relative">
		{#if $infoImei}
			<h3 class="ttc tc">
				{$infoImei.model}
				{$infoImei.color}
				{$infoImei.capacity}
				{$_('label.GB')}
			</h3>
			{#if $infoImei.proposals.length > 0}
				<button
					on:click={() => goto('my-devices/offers/' + id)}
					class="absolute right-0 top-0 mt3 fw6 ph3 h-40-px ba br2 white bg-blue b--blue flex
	items-center pointer grow">{$_('device.viewOffers')}</button>
			{/if}
		{/if}
	</div>
	<p class="tc f3 fw5 light-silver">
		{$_('message.createdDate')}:
		{displayDateDefault($infoImei.created_at)}
	</p>
	<div class="mt3 flex items-center justify-center">
		<div class="near-black fw6 mr2">{$_('device.status')}</div>
		{#if $infoImei.charge_stripe == null && $infoImei.transaction_type != config.buyer && $infoImei.status == config.device.inTransaction}
			{#if $infoImei.transaction_email_buyer != $auth.email}
				<PcTagDevice status={config.order.waitingForDevicePayment} />
			{:else}
				<PcTagDevice status={config.order.waitingForOwnerPayment} />
			{/if}
		{:else}
			<PcTagDevice status={$infoImei.status} />
		{/if}
	</div>
</div>
<div class="w-100 spacing-ext pb5 flex flex-column items-center justify-center">
	<div class="w-70">
		<PcInputImeiReadOnly label={$_('device.yourIMEI')} />
	</div>
	<div class="w-100">
		<TabletInfoAndGradeDeviceDetail {handleGotoEdit} {handleDelete} />
	</div>
</div>

{#if $infoImei.status !== config.device.created}
	<div class="w-100 spacing-ext">
		<TabletInfoPostedDeviceDetail />
	</div>
{/if}
<div class="w-100 spacing-ext mv5">
	<button
		on:click={() => (window.location.href = 'my-devices')}
		class="br2 bg-light-gray b--light-gray ba grow ttu h-60-px fw6 btn-width
			tracked near-black">
		{$_('device.back')}
	</button>
</div>

<script>
	import { goto } from '@sapper/app';

	import { _ } from 'svelte-i18n';
	import { auth, infoImei } from '../../stores';
	import { displayDateDefault } from '../../functions';
	import MobileInputImeiReadOnly from '../input/MobileInputImeiReadOnly.svelte';
	import MobileInfoAndGradeDeviceDetail from '../form/MobileInfoAndGradeDeviceDetail.svelte';
	import MobileInfoPostedDeviceDetail from './MobileInfoPostedDeviceDetail.svelte';
	import config from '../../config';
	import PcTagDevice from './PcTagDevice.svelte';

	export let handleGotoEdit;
	export let handleDelete;
	export let id;
	export let onSuccessLowerPrice = null;
</script>

<div class="w-100 spacing-ext center">
	{#if $infoImei}
		<h4 class="page__title ttc tc">
			{$infoImei.model}
			{$infoImei.capacity}
			{$_('label.GB')}
			{$infoImei.color}
		</h4>
	{/if}

	<p class="tc f5 fw5 light-silver">
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
	{#if $infoImei}
		{#if $infoImei.proposals.length > 0}
			<div class="tc mt3">
				<button
					on:click={() => goto('my-devices/offers/' + id)}
					class="ml3 fw6 ph2 f7 h-30-px ba br2 white bg-blue b--blue flex items-center"
					>{$_('device.viewOffers')}</button
				>
			</div>
		{/if}
	{/if}
</div>

<div class="spacing-ext pt2rem">
	<MobileInputImeiReadOnly label={$_('device.yourIMEI')} />
	<div class="">
		<MobileInfoAndGradeDeviceDetail {handleGotoEdit} {handleDelete} />
	</div>
</div>

{#if $infoImei.status != config.device.created}
	<div class="spacing-ext bt b--light-gray">
		<MobileInfoPostedDeviceDetail {onSuccessLowerPrice} />
	</div>
{/if}
<div class="spacing-ext mt1rem mb2rem pt1rem bt b--light-gray">
	<button
		on:click={() => (window.location.href = 'my-devices')}
		class="br2 bg-light-gray b--light-gray ba ttu h-40-px fw6 w-100 tracked
			near-black"
	>
		{$_('device.back')}
	</button>
</div>

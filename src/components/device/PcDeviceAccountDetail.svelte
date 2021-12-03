<script>
	import { _ } from 'svelte-i18n';
	import { goto } from '@sapper/app';
	import { auth, infoImei } from '../../stores';
	import PcInfoAndGradeDeviceDetail from '../../components/form/PcInfoAndGradeDeviceDetail.svelte';
	import { displayDateDefault } from '../../functions';
	import PcInputImeiReadOnly from '../input/PcInputImeiReadOnly.svelte';
	import PcInfoPostedDeviceDetail from './PcInfoPostedDeviceDetail.svelte';
	import config from '../../config';
	import PcTagDevice from './PcTagDevice.svelte';
	import PcButtonViewOffer from '../button/PcButtonViewOffer.svelte';

	export let handleGotoEdit;
	export let handleDelete;
	export let id;

	export let onSuccessLowerPrice = null;
</script>

<div class="mw10 center pt5">
	<div class="relative">
		{#if $infoImei}
			<h3 class="ttc tc">
				{$infoImei.model}
				{$infoImei.color}
				{$infoImei.capacity}
				{$_('label.GB')}
			</h3>
			{#if $infoImei.proposals.length > 0}
				<PcButtonViewOffer
					bg="bg-blue"
					className="absolute right-0 top-0 mt3"
					onClickButton={() => goto('my-devices/offers/' + id)}
				/>
			{/if}
		{/if}
	</div>

	<p class="tc f4 fw5 light-silver">
		{$_('message.createdDate')}:
		{displayDateDefault($infoImei.created_at)}
	</p>
	<div class="mt3 flex items-center justify-center">
		<div class="near-black fw6 mr2">{$_('device.status')}</div>
		<!-- {#if $infoImei.status != config.device.inTransaction}
			<PcTagDevice status={$infoImei.status} />
		{:else if $infoImei.transaction_type == config.buyer}
			<PcTagDevice status={config.order.processTransaction} />
		{:else if $infoImei.charge_stripe == null}
			{#if $infoImei.transaction_email_buyer != $auth.email}
				<PcTagDevice status={config.order.waitingForDevicePayment} />
			{:else}
				<PcTagDevice status={config.order.waitingForOwnerPayment} />
			{/if}
		{:else}
			<PcTagDevice status={config.order.processTransaction} />
		{/if} -->
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
<div class="mw10 pt5 ph3 flex justify-center center">
	<div class="w-60">
		<PcInputImeiReadOnly label={$_('device.yourIMEI')} />
	</div>
</div>
<div class="mw10 center">
	<div>
		<PcInfoAndGradeDeviceDetail {handleGotoEdit} {handleDelete} />
	</div>
</div>

{#if $infoImei.status != config.device.created}
	<div class="mw10 center">
		<PcInfoPostedDeviceDetail {onSuccessLowerPrice} />
	</div>
{/if}

<div class="mw10 pb5 mt5 center">
	<button
		type="button"
		on:click={() => goto('my-devices')}
		class="br2 bg-light-gray b--light-gray ba grow ttu h-60-px fw6 btn-width
			tracked pointer near-black pointer"
	>
		{$_('device.back')}
	</button>
</div>

<!-- {#if $infoImei.status !== config.device.created || $infoImei.status !== config.device.inTransaction} -->
<style>
	.btn-width {
		width: 170px;
	}
</style>

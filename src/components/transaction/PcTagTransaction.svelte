<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	export let status;
	export let item = null;
	import { onMount, beforeUpdate, afterUpdate } from 'svelte';
</script>

{#if status == config.device.inTransaction}
	<div class="relative  ">
		<span class="dib ttu f7 pv1 ph2 br1 dark-blue bb b--dark-blue text-nowrap">
			{$_('message.inTransaction')}</span
		>
	</div>
{:else if status == config.device.created}
	<div class="relative  ">
		<span class="dib ttu f7 pv1 ph2 br1 blue ba b--blue text-nowrap">
			{$_('message.started')}</span
		>
	</div>
{:else if status == config.order.ownerScanned && item.passcode == null}
	<div class="relative">
		<span class="dib ttu f7 pv1 ph2 br1 blue ba b--blue text-nowrap">
			{$_('message.inPrepared')}</span
		>
	</div>
{:else if status == config.order.ready}
	<div class="relative">
		<span class="dib ttu f7 pv1 ph2 br1 blue ba b--blue text-nowrap">
			{$_('message.ready')}
		</span>
	</div>
{:else if status == config.order.toBeShipped}
	<div class="relative">
		<span class="dib ttu f7 pv1 ph2 br1 blue ba b--blue text-nowrap">
			{$_('message.toBeShipped')}
		</span>
	</div>
{:else if status == config.order.shipped}
	<div class="relative">
		<span class="dib ttu f7 pv1 ph2 br1 blue ba b--blue text-nowrap">
			{$_('message.shipped')}
		</span>
	</div>
{:else if status == config.order.buyerReceived}
	<div class="relative">
		<span class="dib ttu f7 pv1 ph2 br1 blue ba b--blue text-nowrap">
			{$_('message.delivered')}
		</span>
	</div>
{:else if status === config.order.buyerRejected}
	<div class="relative  ">
		<span class="dib ttu f7 pv1 ph2 br1 red ba b--red text-nowrap">
			{$_('message.inDispute')}</span
		>
	</div>
{:else if status === config.proposal.buyerAccept}
	<div class="relative  ">
		<span class="dib ttu f7 pv1 ph2 br1 green ba b--green text-nowrap">
			{$_('message.confirmed')}</span
		>
	</div>
{/if}

<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';

	export let shippingBuyer = '';
	export let shippingSeller = '';
	export let mode = config.sell;
	export let items = [];
</script>

{#if mode === config.exchange || mode === config.order.group}
	<div class="f6 light-silver">
		{$_('label.theShippingChargesForYourDevices')}:
	</div>
	{#each items as item}
		{#if item.proposal_exchange_devices}
			{#if item.proposal_exchange_devices.length > 0}
				{#each item.proposal_exchange_devices as i}
					<div class="">
						{i.model}
						{i.capacity}{$_('label.GB')}
						{i.color}
					</div>
				{/each}
			{/if}
		{/if}
	{/each}
	<div class="">
		<div class="">
			<div class="f6 light-silver ttc">{$_('label.from')}:</div>
			<span class="dark-blue ">{shippingBuyer}</span>
		</div>
		<div class="">
			<div class="f6 light-silver ttc">{$_('label.to')}:</div>
			<span class="dark-blue ">{shippingSeller}</span>
		</div>
	</div>
{:else}
	<div class="f6 light-silver">{$_('label.theShippingChargesFor')}:</div>
	{#each items as item}
		<div class="">
			{item.model}
			{item.capacity}{$_('label.GB')}
			{item.color}
		</div>
	{/each}
	<div class="">
		<div class="">
			<div class="f6 light-silver ttc">{$_('label.from')}:</div>
			<span class="dark-blue ">{shippingSeller}</span>
		</div>
		<div class="">
			<div class="f6 light-silver ttc">{$_('label.to')}:</div>
			<span class="dark-blue ">{shippingBuyer}</span>
		</div>
	</div>
{/if}

<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';

	export let shippingBuyer = '';
	export let shippingSeller = '';
	export let mode = config.sell;
</script>

{#if mode === config.exchange || mode === config.order.group}
	<div>
		{$_('message.shipFeeForDistance')}
		<span class="dark-blue fw6">{shippingBuyer}</span>
		{$_('cart.and')}
		<span class="dark-blue fw6">{shippingSeller}</span>
		<sup>ⓘ</sup>
	</div>
{:else}
	<div>
		{$_('message.shipFeeForDistance')}
		<span class="dark-blue fw6">{shippingSeller}</span>
		{$_('cart.and')}
		<span class="dark-blue fw6">{shippingBuyer}</span>
		<sup>ⓘ</sup>
	</div>
{/if}

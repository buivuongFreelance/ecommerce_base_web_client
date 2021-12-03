<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';

	export let email = '';
	export let mode = config.sell;
</script>

{#if mode === config.exchange}
	<p>{$_('message.sendTo')} <span class="b dark-blue">{email}</span></p>
{:else}
	<p>{$_('message.fromBy')} <span class="b dark-blue">{email}</span></p>
{/if}

<!--<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';

	export let shippingBuyer = '';
	export let shippingSeller = '';
	export let mode = config.sell;
</script>{#if mode === config.exchange}
	<p>
		{$_('shipping.fromTitle')} <span class="b dark-blue">{shippingBuyer}</span>
		{$_('shipping.toTitle')} <span class="b dark-blue">{shippingSeller}</span>
	</p>
{:else}
	<p>
		{$_('shipping.fromTitle')}
		<span class="b dark-blue">{shippingSeller}</span>
		{$_('shipping.toTitle')} <span class="b dark-blue">{shippingBuyer}</span>
	</p>
{/if} -->

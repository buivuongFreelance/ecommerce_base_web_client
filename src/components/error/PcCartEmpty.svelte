<script>
	import { _ } from 'svelte-i18n';
</script>

<div class="pv2rem">
	<img src="images/cart_empty.png" alt="cart_empty" class="cart_empty" />
	<div class="tc f4 light-silver mt1rem">
		{$_('cart.yourCartIsEmpty')}...
	</div>
</div>

<script>
	import { onMount } from 'svelte';
	import { goto } from '@sapper/app';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import { _ } from 'svelte-i18n';

	import PcConfirmCartItem from './PcConfirmCartItem.svelte';
	let mounted = false;

	export let listConfirm;
	export let isValidate = true;

	$: {
		if (mounted)
			if (!isValidate) {
				swal.fire({
					position: 'top',
					icon: 'warning',
					title: 'Device has been sold!',
					text: 'Some devices have already been sold',
					reverseButtons: true,
					customClass: {
						icon: 'icon-warning',
					},
					preConfirm: () => {
						goto('cart');
					},
				});
			}
	}

	onMount(() => {
		mounted = true;
	});
</script>

<style>
</style>

<div class="w-confirm">
	<h3 class="mb5">{$_('checkout.confirmCart')}</h3>
	<div class="flex justify-between pb3 bb b--light-gray">
		<div class="fw6">{$_('cart.name')}</div>
		<div class="fw6">{$_('cart.price')}</div>
	</div>
	{#if isValidate}
		{#if listConfirm.length > 0}
			{#each listConfirm as item}
				<PcConfirmCartItem {item} />
			{/each}
		{/if}
	{/if}
	<p class="mt4 mb3">{$_('checkout.postExpedited')}</p>
	<p>{$_('checkout.deliveresAsEarly')} 29/10/2020</p>
</div>

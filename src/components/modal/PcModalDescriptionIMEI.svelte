<script>
	import { onDestroy, onMount } from 'svelte';

	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import IconClose from '../icon/IconClose.svelte';
	export let onClose;

	onMount(() => {
		document.body.classList.add('noscroll');
	});
	onDestroy(() => {
		document.body.classList.remove('noscroll');
	});
</script>

<div class="fixed z-max wrapper bg-white br3" transition:fade>
	<div class="tr">
		<span class="dib pointer pt1rem pr1rem" on:click={onClose}>
			<IconClose />
		</span>
	</div>

	<div class="pa1rem content">
		<h4 class="ttu tc">{$_('imei.whatIsTheImei')}</h4>
		<p class="mt1rem">
			<b>{$_('imei.labelImei')}</b>
			{$_('imei.headerImei')}.
		</p>
		<p class="mt1rem">{$_('imei.descImei')}</p>
	</div>
</div>

<style>
	.wrapper {
		top: 8rem;
		left: 0;
		right: 0;
		margin: auto;
		overflow: hidden;
		width: min(calc(100% - 30px), 375px);
		max-height: calc(100vh - 8rem);
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}
	.content {
		line-height: 2;
	}
</style>

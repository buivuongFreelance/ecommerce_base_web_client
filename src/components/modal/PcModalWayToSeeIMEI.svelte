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

<div class="fixed z-max wrapper bg-white br3 shadow-1" transition:fade>
	<div class="tr">
		<span class="dib pointer pt1rem pr1rem" on:click={onClose}>
			<IconClose />
		</span>
	</div>

	<div class="pa1rem content">
		<h4 class="tc">{$_('device.howToFindYourIMEI')}</h4>
		<ul class="list mt1rem">
			<li class=""><span><b>1. </b>{$_('imei.step1')}</span></li>
			<li class=""><span><b>2. </b>{$_('imei.step2')}</span></li>
			<li class=""><span><b>3. </b>{$_('imei.step3')} </span></li>
			<li class=" mv3"><b>{$_('imei.anotherWay')} </b></li>
			<li class=""><span><b>1. </b>{$_('imei.step11')}</span></li>
			<li class=""><span><b>2. </b>{$_('imei.step22')} </span></li>
			<li class=""><span><b>3. </b>{$_('imei.step33')}</span></li>
		</ul>
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
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}
	.content {
		line-height: 2;
	}
</style>

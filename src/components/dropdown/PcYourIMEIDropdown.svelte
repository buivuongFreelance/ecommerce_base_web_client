<script>
	import { _ } from 'svelte-i18n';

	let isOpenMenu = false;
	const handleMenuOpen = () => {
		if (!isOpenMenu) isOpenMenu = true;
	};
	const handleMenuClose = () => {
		if (isOpenMenu) isOpenMenu = false;
	};
</script>

<style>
	.popup {
		top: 39px;
		right: -23px;
		width: 300px;
	}
</style>

<div
	class="pl3 relative h-40-px pointer flex items-center"
	on:mouseenter={handleMenuOpen}
	on:mouseleave={handleMenuClose}>
	<i class="ml3 flex items-center"> &#9432; </i>
	{#if isOpenMenu}
		<ul class="z-max absolute list ma0 pa4 bg-white br2 shadow-1 popup top-2">
			<li class="lh-copy f6"><span><b>1. </b>{$_('imei.step1')}</span></li>
			<li class="lh-copy f6"><span><b>2. </b>{$_('imei.step2')}</span></li>
			<li class="lh-copy f6"><span><b>3. </b>{$_('imei.step3')} </span></li>
			<li class="lh-copy f6 mv3"><b>{$_('imei.anotherWay')} </b></li>
			<li class="lh-copy f6"><span><b>1. </b>{$_('imei.step11')}</span></li>
			<li class="lh-copy f6"><span><b>2. </b>{$_('imei.step22')} </span></li>
			<li class="lh-copy f6"><span><b>3. </b>{$_('imei.step33')}</span></li>
		</ul>
	{/if}
</div>

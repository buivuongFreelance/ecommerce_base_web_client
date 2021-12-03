<script>
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { currency } from '../../stores';

	let isOpen = false;
	let visible = false;

	onMount(() => {
		visible = true;
	});

	const handleOpen = () => {
		if (!isOpen) isOpen = true;
	};

	const handleClose = () => {
		if (isOpen) isOpen = false;
	};

	const handleChange = (item) => {
		currency.set(item);
		handleClose();
		location.reload();
	};
</script>

<style>
	.popup {
		top: 30px;
		right: 0;
		min-width: 100px;
	}
	.flag {
		height: 24px;
	}
</style>

{#if visible}
	<div
		transition:fade
		class="white pointer relative"
		on:mouseenter={handleOpen}
		on:mouseleave={handleClose}>
		<div class="flex items-center  h-30-px f7 ttu fw5">
			{$currency}
			<img src="images/canada.png" alt="canada" class="flag ml3" />
		</div>
		{#if isOpen}
			<ul
				class="z-max absolute list ma0 pa0 bg-white br2 shadow-1 popup"
				transition:fade>
				<!-- <li class="lh-copy" on:click={() => handleChange('USD')}>
					<div class="pv3 spacing-ext flex items-center self-center">
						{#if $currency === 'USD'}
							<img src="images/canada.png" alt="canada" class="flag" />
							<span class="ml3 light-blue fw6">USD</span>
						{:else}<span class="ml3 near-black fw6"> USD </span>{/if}
					</div>
				</li> -->
				<li class="lh-copy" on:click={() => handleChange('CAD')}>
					<div class="pv3 spacing-ext flex items-center self-center">
						{#if $currency === 'CAD'}
							<img src="images/canada.png" alt="canada" class="flag" />
							<span class="ml3 light-blue fw6">CAD</span>
						{:else}<span class="ml3 near-black fw6">CAD</span>{/if}
					</div>
				</li>
			</ul>
		{/if}
	</div>
{/if}

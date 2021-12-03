<script>
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { currency } from '../../stores';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import Portal from 'svelte-portal';

	let visible = false;
	let isOpen = false;
	let rootEle;
	let top = 0;
	let left = 0;

	onMount(() => {
		visible = true;
	});

	const handleChange = (item) => {
		currency.set(item);
		location.reload();
	};

	const handleClick = () => {
		isOpen = true;
		const boundingClientRect = rootEle.getBoundingClientRect();
		top =
			parseFloat(boundingClientRect.y) + parseFloat(boundingClientRect.height);
		left =
			parseFloat(boundingClientRect.x) +
			parseFloat(boundingClientRect.width) -
			100;
	};
</script>

<style>
	.popup {
		top: var(--top);
		left: var(--left);
		width: 100px;
	}
	.flag {
		height: 24px;
	}
</style>

{#if visible}
	<div
		transition:fade
		class="white pointer lh-30-px"
		on:click={handleClick}
		bind:this={rootEle}>
		<div class="flex items-center ttu fw5">
			{$currency}
			<img src="images/canada.png" alt="canada" class="flag ml3" />
		</div>
	</div>
	{#if isOpen}
		<Portal target={document.getElementById('overlay')}>
			<DimmerModal onClick={() => (isOpen = false)} />
			<ul
				class="fixed z-max list ma0 pv3 ph0 bg-white br2 shadow-1 popup"
				style="--top: {top}px; --left: {left}px"
				transition:fade>
				<!-- <li class="lh-copy" on:click={() => handleChange('USD')}>
					<div class="pv3 spacing-ext flex items-center">
						{#if $currency === 'USD'}
							<span class="ml3 light-blue fw6">USD</span>
						{:else}<span class="ml3 near-black fw6">USD</span>{/if}
					</div>
				</li> -->
				<li class="lh-copy" on:click={() => handleChange('CAD')}>
					<div class="pv3 spacing-ext flex items-center">
						{#if $currency === 'CAD'}
							<span class="ml3 light-blue fw6">CAD</span>
						{:else}<span class="ml3 near-black fw6">CAD</span>{/if}
					</div>
				</li>
			</ul>
		</Portal>
	{/if}
{:else}
	<div class="white f7 mr3 h-30-px flex items-center">
		<LoadingDefault size={20} />
	</div>
{/if}

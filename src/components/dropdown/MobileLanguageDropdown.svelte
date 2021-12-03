<script>
	import { _, locale, locales } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import Portal from 'svelte-portal';

	let localeValue;
	let visible = false;
	let isOpen = false;
	let rootEle;
	let top = 0;
	let left = 0;

	locale.subscribe((value) => {
		localeValue = value;
	});

	onMount(() => {
		visible = true;
	});

	const handleChangeLanguage = (item) => {
		$locale = item;
		setTimeout(() => {
			location.reload();
		}, 300);
	};

	const handleClick = () => {
		isOpen = true;
		const boundingClientRect = rootEle.getBoundingClientRect();
		top =
			parseFloat(boundingClientRect.y) + parseFloat(boundingClientRect.height);
		left =
			parseFloat(boundingClientRect.x) +
			parseFloat(boundingClientRect.width) -
			150;
	};
</script>

<style>
	.popup {
		top: var(--top);
		left: var(--left);
		width: 150px;
	}
</style>

{#if visible}
	<div
		transition:fade
		class="white pointer lh-30-px f7"
		on:click={handleClick}
		bind:this={rootEle}>
		<span>{$_('languages.' + localeValue.replace('-', '_'))}</span>
	</div>

	{#if isOpen}
		<Portal target={document.getElementById('overlay')}>
			<DimmerModal onClick={() => (isOpen = false)} />
			<ul
				class="fixed z-max list ma0 pv3 ph0 bg-white br2 shadow-1 popup tc"
				style="--top: {top}px; --left: {left}px"
				transition:fade>
				{#each $locales as item}
					<li class="lh-copy" on:click={() => handleChangeLanguage(item)}>
						<div class="pv3 spacing-ext flex items-center self-center">
							{#if localeValue === item}
								<span class="ml3 light-blue fw6">
									{$_('languages.' + item.replace('-', '_'))}
								</span>
							{:else}
								<span
									class="ml3 near-black fw6">{$_('languages.' + item.replace('-', '_'))}
								</span>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		</Portal>
	{/if}
{:else}
	<div class="white f7 mr3 h-30-px flex items-center">
		<LoadingDefault size={20} />
	</div>
{/if}

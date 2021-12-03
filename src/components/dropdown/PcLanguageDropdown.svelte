<script>
	import { _, locale, locales } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { onDestroy, onMount } from 'svelte';
	import LoadingDefault from '../loading/LoadingDefault.svelte';

	let localeValue;
	let isOpenLanguage = false;
	let visible = false;

	const localeUnsubscribe = locale.subscribe((value) => {
		localeValue = value;
	});

	onMount(() => {
		visible = true;
	});

	onDestroy(() => {
		localeUnsubscribe();
	});

	const handleLanguageOpen = () => {
		if (!isOpenLanguage) isOpenLanguage = true;
	};

	const handleLanguageClose = () => {
		if (isOpenLanguage) isOpenLanguage = false;
	};

	const handleChangeLanguage = (item) => {
		$locale = item;
		handleLanguageClose();
		setTimeout(() => {
			location.reload();
		}, 300);
	};
</script>

<style>
	.popup {
		top: 30px;
		right: 0;
		width: auto;
	}
</style>

{#if visible}
	<div
		transition:fade
		class="white lh-30-px pointer relative"
		on:mouseenter={handleLanguageOpen}
		on:mouseleave={handleLanguageClose}>
		<span
			class="fw5 ttu f7">{$_('languages.' + localeValue.replace('-', '_'))}</span>
		{#if isOpenLanguage}
			<ul
				class="z-max absolute list ma0 pa0 bg-white br2 shadow-1 popup"
				transition:fade>
				{#each $locales as item}
					<li class="lh-copy" on:click={() => handleChangeLanguage(item)}>
						<div class="pv3 spacing-ext flex items-center self-center">
							{#if localeValue === item}
								<span
									class="ml3 light-blue fw6">{$_('languages.' + item.replace('-', '_'))}</span>
							{:else}
								<span
									class="ml3 near-black fw6">{$_('languages.' + item.replace('-', '_'))}</span>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
{:else}
	<div class="white f7 mr3 h-30-px flex items-center">
		<LoadingDefault size={20} />
	</div>
{/if}

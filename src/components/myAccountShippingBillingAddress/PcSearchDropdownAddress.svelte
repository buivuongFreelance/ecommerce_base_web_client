<script>
	import { stores, goto } from '@sapper/app';
	import ContentLoader from 'svelte-content-loader';
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';

	export let addresses;
	export let onSelect = null;
	export let error = false;

	const handleSelect = (item) => {
		onSelect(item);
	};
</script>

<div
	transition:fade
	class="z-max absolute ma0 pv3 ph0 bg-white br2 br--bottom shadow-2 top-drop"
	class:error
>
	{#if addresses.length === 0}
		<div class="ph3">{$_('message.noItems')}</div>
	{:else}
		<ul class="list">
			{#each addresses as item}
				<li on:click={() => handleSelect(item)}>
					<div class="db ph3 h-40-px lh-40-px near-black pointer">
						{item.Text}
						{item.Description}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.top-drop {
		width: 774px;
	}
	.error {
		top: 50px;
	}

	li:hover {
		background-color: rgba(47, 58, 151, 0.1);
	}
</style>

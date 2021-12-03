<script>
	import { onMount } from 'svelte';
	import { stores, goto } from '@sapper/app';
	import ContentLoader from 'svelte-content-loader';
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { auth, anonymous, linkToBack, searchValue } from '../../stores';

	import { listSearchPopup as apiListSearchPopup } from '../../services/device';

	const { session } = stores();
	const { domainDevice } = $session;

	export let top = 0;
	export let left = 0;

	let isServerError = false;
	let isLoading = false;
	export let name = '';
	let items = [];

	const listSearchPopup = () => {
		isLoading = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiListSearchPopup(domainDevice, { token, anonymous: $anonymous, name })
				.then((items) => {
					isServerError = false;
					isLoading = false;
					resolve(items);
				})
				.catch((error) => {
					isServerError = true;
					isLoading = false;
					reject(error);
				});
		});
	};

	onMount(async () => {
		items = await listSearchPopup();
	});
	const handleCategoryEmpty = (name) => {
		searchValue.set(name);
		linkToBack.set('category');
		goto('empty');
	};
</script>

<style>
	.top-drop {
		width: 460px;
		top: var(--top);
		left: var(--left);
	}

	li:hover {
		background-color: rgba(47, 58, 151, 0.1);
	}
</style>

<div
	transition:fade
	style="--top: {top - 0}px; --left: {left}px"
	class="z-max fixed ma0 pv3 ph0 bg-white br2 br--bottom shadow-2 top-drop">
	{#if isServerError}
		<p class="red f5 ph3">{$_('error.serverErrorMessage')}</p>
	{:else if isLoading}
		<div
			transition:fade
			style="--top: {top - 0}px; --left: {left}px"
			class="z-max fixed ma0 pv3 ph0 bg-white br2 br--bottom shadow-2 top-drop ph3">
			<ContentLoader width="440" height="225" uniqueKey="searchContentLoading">
				<rect x="0" y="0" rx="5" ry="5" width="440" height="50" />
				<rect x="0" y="60" rx="5" ry="5" width="440" height="50" />
				<rect x="0" y="120" rx="5" ry="5" width="440" height="50" />
				<rect x="0" y="180" rx="5" ry="5" width="440" height="50" />
			</ContentLoader>
		</div>
	{:else if items.length === 0}
		<div class="ph3">{$_('message.noItems')}</div>
	{:else}
		<ul class="list">
			{#each items as item}
				<li>
					<div
						on:click={() => handleCategoryEmpty(item.model)}
						class="db ph3 h-40-px lh-40-px near-black pointer">
						{item.model}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

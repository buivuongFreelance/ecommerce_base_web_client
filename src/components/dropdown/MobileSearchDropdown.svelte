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

	let isServerError = false;
	let isLoading = false;

	let items = [];

	const listSearchPopup = () => {
		isLoading = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiListSearchPopup(domainDevice, {
				token,
				anonymous: $anonymous,
				name: $searchValue,
			})
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
		width: 100%;
		top: 60px;
		right: 0;
	}
</style>

<div transition:fade class="z-max absolute bg-white top-drop">
	{#if isServerError}
		<p class="red f4 pa4">{$_('error.serverErrorMessage')}</p>
	{:else if isLoading}
		<ContentLoader width="345" height="225" uniqueKey="searchContentLoading">
			<rect x="20" y="0" rx="5" ry="5" width="345" height="50" />
			<rect x="20" y="60" rx="5" ry="5" width="345" height="50" />
			<rect x="20" y="120" rx="5" ry="5" width="345" height="50" />
			<rect x="20" y="180" rx="5" ry="5" width="345" height="50" />
		</ContentLoader>
	{:else if items.length === 0}
		<div class="pa4 f4">{$_('message.noItems')}</div>
	{:else}
		<ul class="list">
			{#each items as item}
				<li>
					<div
						on:click={() => handleCategoryEmpty(item.model)}
						class="db ph4 h-50-px lh-50-px near-black pointer">
						{item.model}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

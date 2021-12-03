<script>
	import { onMount } from 'svelte';
	import { stores } from '@sapper/app';
	import ContentLoader from 'svelte-content-loader';
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { auth, anonymous } from '../../stores';

	import { listCompareDevices as apiListCompareDevices } from '../../services/device';

	const { session } = stores();
	const { domainDevice } = $session;

	export let top = 0;
	export let left = 0;

	let isServerError = false;
	let isLoading = false;

	export let name = '';
	export let ids = [];
	export let handleSelected;

	let items = [];

	onMount(async () => {
		items = await postCompareDevices();
	});

	const postCompareDevices = () => {
		isLoading = true;
		return new Promise((resolve, reject) => {
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiListCompareDevices(domainDevice, {
				token,
				anonymous: $anonymous,
				ids,
				name,
			})
				.then((obj) => {
					isServerError = false;
					isLoading = false;
					resolve(obj);
				})
				.catch((error) => {
					isServerError = true;
					isLoading = false;
					reject(error);
				});
		});
	};
	const chooseDevice = (item) => {
		item.id = item.device_id;

		handleSelected(item);
	};
</script>

<style>
	.top-drop {
		width: 360px;
		top: var(--top);
		left: var(--left);
	}

	li:hover {
		background-color: rgba(47, 58, 151, 0.1);
	}
	.image {
		width: 40px;
	}
	.dropdown-content {
		max-height: 300px;
		overflow-y: auto;
		overflow-x: hidden;
	}
	.list li span {
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>

<div
	transition:fade
	style="--top: {top - 0}px; --left: {left}px"
	class="dropdown-content z-max fixed ma0 ph0 bg-white br2 br--bottom shadow-2 top-drop">
	{#if isServerError}
		<p class="red f5 pa3">{$_('error.serverErrorMessage')}</p>
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
		<div class="pa3">{$_('message.noItems')}</div>
	{:else}
		<ul class="list">
			{#each items as item}
				<li
					on:click={() => chooseDevice(item)}
					class="db pa3 h-50-px near-black pointer flex items-center">
					<img src={item.url} alt={item.model} class="image mr3" />
					<span> {item.model} </span>
				</li>
			{/each}
		</ul>
	{/if}
</div>

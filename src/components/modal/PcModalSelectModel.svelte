<script>
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { stores } from '@sapper/app';
	import { listBrand as apiListBrand } from '../../services/model';
	import ContentLoader from 'svelte-content-loader';
	import { onMount } from 'svelte';
	import PcModalListModel from './PcModalListModel.svelte';
	import config from '../../config.js';

	const { session } = stores();
	const { domainModel } = $session;

	export let onClose;

	let isLoadingBrand = false;
	let isServerBrand = false;
	let brands = [];
	let selectedBrand = {};

	onMount(async () => {
		brands = await listBrand();
	});

	const listBrand = () => {
		isLoadingBrand = true;
		return new Promise((resolve, reject) => {
			apiListBrand(domainModel)
				.then((list) => {
					isLoadingBrand = false;
					isServerBrand = false;
					resolve(list);
				})
				.catch(() => {
					isLoadingBrand = false;
					isServerBrand = true;
					reject();
				});
		});
	};
	const handleSelectedBrand = (item) => {
		selectedBrand = item;
	};
</script>

<style>
	.wrapper {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		height: calc(100vh - 120px);
		overflow: hidden;
		border-radius: 10px;
	}
	.container {
		height: calc(100vh - 120px);
	}
	.panel {
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	.content {
		max-height: calc(100vh - 180px);
		overflow: auto;
	}
	.brand {
		width: 170px;
		cursor: pointer;
	}
</style>

<div class="fixed z-max w-90 wrapper" transition:fade>
	<div class="w-100 bg-white container">
		<div
			class="h-60-px flex items-center justify-between bg-light-gray
				b--pale-grey bb ph4 near-black fw5 f4 panel">
			<div>{$_('message.selectItem')}</div>
			<div class="pointer flex items-center" on:click={onClose}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 0 24 24"
					fill="#7e8299"
					width="24"><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
			</div>
		</div>
		<div class="ph4 content">
			{#if isServerBrand}
				<p class="red f4 mt5">{$_('error.serverErrorMessage')}</p>
			{:else if isLoadingBrand}
				<div class="mt5">
					<ContentLoader
						uniqueKey="brand"
						primaryColor="#e4e6ef"
						secondaryColor="#f8f8f8"
						width={config.containerDesktop - 30}
						height="40">
						<rect x="0" y="0" rx="3" ry="3" width="40%" height="40" />
					</ContentLoader>
				</div>
			{:else}
				<div class="mt5 near-black fw6 f4">{$_('device.selectBrand')}</div>
				<div class="mt3 flex">
					{#each brands as item, i}
						<button
							type="button"
							on:click={() => handleSelectedBrand(item)}
							class:br--left={i === 0}
							class:br--right={i === brands.length - 1}
							class:bg-dark-blue={selectedBrand.id === item.id}
							class:white={selectedBrand.id === item.id}
							class:bg-light-gray={selectedBrand.id !== item.id}
							class:near-black={selectedBrand.id !== item.id}
							class="link br2 bn fw6 flex items-center brand justify-center
								h-60-px btn-width tracked f4">{item.name}</button>
					{/each}
				</div>

				<div class="mv4">
					<PcModalListModel {selectedBrand} {onClose} />
				</div>
			{/if}
		</div>
	</div>
</div>

<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { stores } from '@sapper/app';
	import ContentLoader from 'svelte-content-loader';
	import { listBrand as apiListBrand } from '../../services/model';
	import { category } from '../../stores';

	const { session } = stores();
	const { domainModel } = $session;

	let isLoadingBrand = false;
	let isServerBrand = false;

	export let selectedBrands = [];

	export let brands = [];

	onMount(async () => {
		if (brands.length === 0) {
			brands = await listBrand();
		}
		if ($category) {
			if ($category.brands) {
				selectedBrands = $category.brands;
			}
		}
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
				.catch((error) => {
					isServerBrand = true;
					isLoadingBrand = false;
					reject(error);
				});
		});
	};
</script>

<style>
	.checkbox .box {
		height: 20px;
		width: 20px;
		border: 2px solid #7e8299;
		border-radius: 3px;
		box-sizing: border-box;
	}
	.checkbox .box:after {
		content: '';
		display: block;
		width: 4px;
		height: 10px;
		transform: rotate(45deg);
		border-bottom: 2px solid #2f3a97;
		border-right: 2px solid #2f3a97;
		opacity: 0;
	}
	.checkbox > input:checked + .box {
		border-color: #2f3a97;
	}
	.checkbox > input:checked + .box:after {
		opacity: 1;
	}
	.checkbox > input:checked ~ .label {
		color: #2f3a97;
	}
	.checkbox input {
		display: none !important;
	}
</style>

{#if isServerBrand}
	<p class="red f5">{$_('error.serverErrorMessage')}</p>
{:else if isLoadingBrand}
	<ContentLoader
		uniqueKey="brand"
		primaryColor="#e4e6ef"
		secondaryColor="#f8f8f8"
		width={270}
		height="40">
		<rect x="0" y="0" rx="3" ry="3" width="100%" height="40" />
	</ContentLoader>
{:else}
	<div class="accordion">
		<div
			class="accordion-header h-60-px flex items-center bb b--light-gray mb3">
			<h4 class="accordion-title flex-auto">{$_('device.brands')}</h4>
		</div>
		<div class="accordion-body">
			{#if brands.length === 0}
				<p class="mv4 fw5">{$_('message.noItems')}</p>
			{:else}
				{#each brands as brand}
					<div class="mb3">
						<label class="checkbox flex items-center">
							<input
								type="checkbox"
								bind:group={selectedBrands}
								value={brand.id} />
							<span class="box flex items-center justify-center" />
							<span class="label fw6 ml3">{brand.name}</span>
						</label>
					</div>
				{/each}
			{/if}
		</div>
	</div>
{/if}

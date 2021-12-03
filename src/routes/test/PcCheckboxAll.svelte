<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { stores } from '@sapper/app';
	import ContentLoader from 'svelte-content-loader';
	import { listBrand as apiListBrand } from '../../services/model';

	const { session } = stores();
	const { domainModel } = $session;

	let isLoadingBrand = false;
	let isServerBrand = false;
	let brands = [];
	let selectedBrands = [];

	let all = false;

	$: {
		if (selectedBrands.length > 0 && brands.length > 0) {
			let count = 0;
			for (var i = 0; i < brands.length; i++) {
				let brand = brands[i];
				for (var j = 0; j < selectedBrands.length; j++) {
					let selectedBrand = selectedBrands[j];
					if (selectedBrand === brand.id) {
						count++;
						break;
					}
				}
			}
			all = count === brands.length ? true : false;
		}
	}

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
				.catch((error) => {
					isServerBrand = true;
					isLoadingBrand = false;
					reject(error);
				});
		});
	};

	const handleAll = () => {
		for (var i = 0; i < brands.length; i++) {
			selectedBrands.push(brands[i].id);
		}
		selectedBrands = selectedBrands;
	};
</script>

<style>
	.checkbox .box {
		height: 24px;
		width: 24px;
	}
	.checkbox > input + .box > svg:first-child {
		display: block;
	}
	.checkbox > input + .box > svg:last-child {
		display: none;
	}
	.checkbox > input:checked + .box > svg:first-child {
		display: none;
	}
	.checkbox > input:checked + .box > svg:last-child {
		display: block;
	}
	.checkbox > input:checked ~ .label {
		color: #2f3a97;
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
			<h4 class="accordion-title flex-auto">Brands</h4>
		</div>
		<div class="accordion-body">
			<div class="mb3">
				<label class="checkbox flex items-center">
					<input
						type="checkbox"
						checked={all}
						disabled={all}
						on:change={handleAll} />
					{all}
					<span class="box flex items-center justify-center">
						<svg
							fill="#7E8299"
							xmlns="http://www.w3.org/2000/svg"
							height="24"
							viewBox="0 0 24 24"
							width="24"><path d="M0 0h24v24H0V0z" fill="none" />
							<path
								d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" /></svg>
						<svg
							fill="#2F3A97"
							xmlns="http://www.w3.org/2000/svg"
							height="24"
							viewBox="0 0 24 24"
							width="24"><path d="M0 0h24v24H0V0z" fill="none" />
							<path
								d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z" /></svg>
					</span>
					<span class="label fw6 ml1">All</span>
				</label>
			</div>
			{#each brands as brand}
				<div class="mb3">
					<label class="checkbox flex items-center">
						<input
							type="checkbox"
							bind:group={selectedBrands}
							value={brand.id} />
						<span class="box flex items-center justify-center">
							<svg
								fill="#7E8299"
								xmlns="http://www.w3.org/2000/svg"
								height="24"
								viewBox="0 0 24 24"
								width="24"><path d="M0 0h24v24H0V0z" fill="none" />
								<path
									d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" /></svg>
							<svg
								fill="#2F3A97"
								xmlns="http://www.w3.org/2000/svg"
								height="24"
								viewBox="0 0 24 24"
								width="24"><path d="M0 0h24v24H0V0z" fill="none" />
								<path
									d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z" /></svg>
						</span>
						<span class="label fw6 ml1">{brand.name}</span>
					</label>
				</div>
			{/each}
		</div>
	</div>
{/if}

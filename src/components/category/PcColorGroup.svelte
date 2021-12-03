<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { stores } from '@sapper/app';
	import ContentLoader from 'svelte-content-loader';
	import { listColor as apiListColor } from '../../services/model';

	export let selectedColors = [];

	const { session } = stores();
	const { domainModel } = $session;

	let isLoading = false;
	let isServer = false;
	export let colors = [];

	onMount(async () => {
		if (colors.length === 0) {
			colors = await getColors();
		}
	});

	const getColors = () => {
		isLoading = true;
		return new Promise((resolve, reject) => {
			apiListColor(domainModel)
				.then((list) => {
					isLoading = false;
					isServer = false;
					resolve(list);
				})
				.catch((error) => {
					isServer = true;
					isLoading = false;
					reject(error);
				});
		});
	};
</script>

<style>
	.color {
		width: 30px;
		height: 30px;
		background-color: #e0e6ef;
	}
	.color > span {
		width: 24px;
		height: 24px;
		background-color: #e0e6ef;
		border-radius: 3px;
	}
	.color > input:checked + span {
		box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
	}
	.color > input + span:after {
		content: '';
		z-index: 2;
		position: absolute;
		bottom: 0;
		right: 0;
		height: 9px;
		width: 3px;
		display: block;
		border-bottom: 2px solid #308800;
		border-right: 2px solid #308800;
		opacity: 0;
		transform: rotate(45deg);
	}
	.color > input:checked + span:before {
		content: '';
		position: absolute;
		bottom: -5px;
		right: -8px;
		width: 20px;
		height: 20px;
		display: block;
		background-color: white;
		border-radius: 50%;
	}
	.color > input:checked + span:after {
		opacity: 1;
	}
	input[type='checkbox'] {
		display: none !important;
	}
</style>

{#if isServer}
	<p class="red f5">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<ContentLoader
		uniqueKey="type"
		primaryColor="#e4e6ef"
		secondaryColor="#f8f8f8"
		width={240}
		height="40">
		<rect x="0" y="0" rx="3" ry="3" width="100%" height="40" />
	</ContentLoader>
{:else}
	<div class="accordion">
		<div
			class="accordion-header h-60-px flex items-center bb b--light-gray mb3">
			<h4 class="accordion-title flex-auto">{$_('device.colors')}</h4>
		</div>
		<div class="accordion-body">
			{#if colors.length === 0}
				<p class="mv4 fw5">{$_('message.noItems')}</p>
			{:else}
				<div class="colors flex flex-wrap">
					{#each colors as color}
						<label
							class="color flex items-center justify-center relative mr3 mb3 br2"
							title={color.name}>
							<input
								type="checkbox"
								bind:group={selectedColors}
								value={color.id} />
							<span
								class="box flex items-center justify-center"
								style="background-color: #{color.color_code}" />
						</label>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}

<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';

	let isLoading = false;
	let isServer = false;
	export let types = [];
	export let selectedTypes = [];

	onMount(async () => {});
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

{#if isServer}
	<p class="red f5">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<ContentLoader
		uniqueKey="type"
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
			<h4 class="accordion-title flex-auto">{$_('device.type')}</h4>
		</div>
		<div class="accordion-body">
			{#if types.length === 0}
				<p class="mv4 fw5">{$_('message.noItems')}</p>
			{:else}
				<div class="flex flex-wrap">
					{#each types as type}
						<label class="checkbox flex items-center mb3">
							<input
								type="checkbox"
								bind:group={selectedTypes}
								value={type.id} />
							<span class="box flex items-center justify-center" />
							<span class="label fw6 ml3 ttc">{type.value}</span>
						</label>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}

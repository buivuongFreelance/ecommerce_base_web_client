<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import PcRating from '../input/PcRating.svelte';

	let isLoading = false;
	let isServer = false;

	export let dingtoiRatings = [];
	export let selectedDingtoiRating = null;

	onMount(async () => {});
</script>

{#if isServer}
	<p class="red f5">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<ContentLoader
		uniqueKey="type"
		primaryColor="#e4e6ef"
		secondaryColor="#f8f8f8"
		width={270}
		height="40"
	>
		<rect x="0" y="0" rx="3" ry="3" width="100%" height="40" />
	</ContentLoader>
{:else}
	<div class="accordion">
		<div
			class="accordion-header h-60-px flex items-center bb b--light-gray mb3"
		>
			<h4 class="accordion-title flex-auto">{$_('label.dingtoiRating')}</h4>
		</div>
		<div class="accordion-body">
			<div class="mb3">
				<button
					on:click={() => (selectedDingtoiRating = null)}
					class="pointer bg-transparent bn light-blue ph0"
					>✖
					{$_('label.clear')}</button
				>
			</div>
			{#each dingtoiRatings as dingtoiRating}
				<label class="checkbox flex items-center mb1 pointer">
					<input
						type="radio"
						name="dingtoiRating"
						bind:group={selectedDingtoiRating}
						value={dingtoiRating}
					/>
					<PcRating rating={dingtoiRating} />
					<span class="label  ml3 ttc">
						{#if dingtoiRating < 5}& <b>{$_('label.up')}</b>{/if}
					</span>
				</label>
			{/each}
		</div>
	</div>
{/if}

<style>
	.checkbox {
		height: 22px;
	}
	.checkbox > input {
		display: none !important;
	}
	.checkbox > input ~ .label {
		color: #b5b5c3;
	}
	.checkbox > input:checked ~ .label {
		color: #2f3a97;
	}
	.checkbox > input:checked ~ .label:after {
		content: '✓';
		margin-left: 4px;
	}
</style>

<script>
	import { onMount } from 'svelte';

	import { PaginationNav } from 'svelte-paginate';
	import config from '../../config';

	export let totalItems;
	export let offset = 0;
	export let onPage;

	$: {
		if (visible) {
			currentPage =
				offset >= totalItems ? -1 : parseInt(offset / config.limit) + 1;
		}
	}

	let currentPage = 1;
	let visible = false;

	onMount(() => {
		visible = true;
	});
</script>

{#if visible}
	<div class="custom">
		<PaginationNav
			{totalItems}
			pageSize={config.limit}
			{currentPage}
			limit={3}
			showStepOptions={true}
			on:setPage={(e) => {
				if (e.detail.page !== currentPage) {
					onPage(e.detail.page);
				}
			}}
		/>
	</div>
{/if}

<style>
	.custom :global(.pagination-nav) {
		width: 100%;
		display: flex;
		justify-content: center;
	}
	.custom :global(.option) {
		border-radius: 4px;
		border: 1px solid #e6e5ea;
		box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.16);
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: 0.2s all ease-out;
		user-select: none;
		font-weight: bold;
		width: 40px;
		height: 40px;
		color: #53646f;
		font-size: 15px;
		margin-left: 10px;
		cursor: pointer;
	}
	.custom :global(.option.active) {
		color: #ffffff;
		border-color: #2f3a97;
		background-color: #2f3a97;
		cursor: default;
	}
	.custom :global(.option.disabled) {
		background-color: #e6e5ea;
		cursor: default;
		opacity: 0.5;
	}
	.custom :global(.option.number) {
		padding: 0;
	}
	.custom :global(.option.prev) {
		padding: 0;
	}
	.custom :global(.option.next) {
		padding: 0;
	}
</style>

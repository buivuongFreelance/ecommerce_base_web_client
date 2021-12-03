<script>
	import { onMount } from 'svelte';

	import { PaginationNav } from 'svelte-paginate';
	import config from '../../config';

	export let totalItems;
	export let offset = 0;
	export let onPage;

	$: {
		if (visible) {
			currentPage = pageNumber();
		}
	}

	let currentPage = 1;
	let visible = false;

	onMount(() => {
		visible = true;
	});

	const pageNumber = () => {
		return offset >= totalItems
			? -1
			: parseInt(offset / config.limitMobile) + 1;
	};
</script>

<style>
	.custom :global(.pagination-nav) {
		width: 100%;
		display: flex;
		justify-content: center;
		background: #fff;
	}
	.custom :global(.option) {
		border-radius: 50%;
		border: 1px solid #e6e5ea;
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
		background-color: #2f3a97;
	}
	.custom :global(.option.disabled) {
		background-color: #e6e5ea;
		cursor: default;
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

{#if visible}
	<div class="custom">
		<PaginationNav
			{totalItems}
			pageSize={config.limitMobile}
			{currentPage}
			limit={3}
			showStepOptions={true}
			on:setPage={(e) => {
				if (e.detail.page !== currentPage) {
					onPage(e.detail.page);
				}
			}} />
	</div>
{/if}

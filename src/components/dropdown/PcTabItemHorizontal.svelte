<script>
	export let headers = [];
	export let active;

	const handleTab = (header) => {
		active = header.key;
	};
</script>

<style>
	.tab-header {
		display: flex;
	}
	.tab-link {
		height: 60px;
		line-height: 60px;
		min-width: 100px;
		transition: color 0.3s;
	}
	.tab-link:hover:not(.active) {
		cursor: pointer;
		background-color: #e0e6ef;
	}
	.tab-link.active {
		color: #2f3a97;
		box-shadow: inset 0 -4px 0 #2f3a97;
	}
</style>

<div class="tab-header bg-light-gray">
	{#each headers as header}
		<div
			class="tab-link b tc ph4"
			class:active={header.key === active}
			on:click={() => handleTab(header)}>
			{header.name}
		</div>
	{/each}
</div>
<div class="tab-body">
	<div class="pt5">
		<slot name="content" />
	</div>
</div>

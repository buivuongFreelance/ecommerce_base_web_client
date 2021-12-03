<script>
	export let headers = [];
	export let active;

	const handleTab = (header) => {
		active = header.key;
	};
</script>

<style>
	.tab-link {
		height: 50px;
		line-height: 50px;
		width: 100%;
		transition: color 0.3s;
	}
	.tab-link:hover:not(.active) {
		cursor: pointer;
		background-color: #e0e6ef;
	}
	.tab-link.active {
		color: #2f3a97;
		box-shadow: inset 3px 0 0 #2f3a97;
		background-color: #fff;
	}
</style>

<div class="flex">
	<div class="tab-header w-30 bg-light-gray mr6">
		{#each headers as header}
			<div
				class="tab-link ph4 light-silver b"
				class:active={header.key === active}
				on:click={() => handleTab(header)}>
				{header.name}
			</div>
		{/each}
	</div>
	<div class="tab-body w-70">
		<slot name="content" />
	</div>
</div>

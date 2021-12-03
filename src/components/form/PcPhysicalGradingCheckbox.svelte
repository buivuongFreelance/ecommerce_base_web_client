<script>
	export let title;
	export let selected = false;
	export let onClick;
</script>

<div
	class="flex items-center ba br2 mb3 pointer"
	on:click={onClick}
	class:b--light-gray={!selected}
	class:b--blue={selected}
>
	<div
		class="w-grade flex items-center justify-center br h-100-px"
		class:b--light-gray={!selected}
		class:b--blue={selected}
	>
		<div class="flex items-center mr2">
			{#if selected}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="#3699ff"
					width="24px"
					height="24px"
					><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
					/>
					<circle cx="12" cy="12" r="5" />
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="#b5b5c3"
					width="24px"
					height="24px"
					><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
					/>
				</svg>
			{/if}
		</div>
		<h4 class="fw6 mb0" class:blue={selected} class:light-silver={!selected}>
			{title}
		</h4>
	</div>
	<div
		class="w-graC ph3 f6"
		class:blue={selected}
		class:light-silver={!selected}
	>
		<slot name="desc" />
	</div>
</div>

<style>
	.w-grade {
		width: 160px;
	}
	.w-graC {
		width: calc(100% - 160px);
	}
</style>

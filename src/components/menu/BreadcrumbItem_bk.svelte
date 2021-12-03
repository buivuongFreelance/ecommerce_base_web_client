<script>
	export let active = false;
	export let message;
	export let href = '';
</script>

{#if active}
	<span class="mr2 flex ">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="#6c7293"
			width="20px"
			height="20px"
		>
			<path d="M0 0h24v24H0z" fill="none" width="20px" height="20px" />
			<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
		</svg>
	</span>
	<span class="link fw6 light-silver dib">{message}</span>
{:else}
	<span class="mr2 flex flex-wrap">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="#6c7293"
			width="20px"
			height="20px"
		>
			<path d="M0 0h24v24H0z" fill="none" width="20px" height="20px" />
			<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
		</svg>
	</span>
	<a {href} class="link dim blue fw6 dib">{message}</a>
{/if}

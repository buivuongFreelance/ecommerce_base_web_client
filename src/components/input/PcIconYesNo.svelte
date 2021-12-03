<script>
	export let status = 'n';
</script>

<style>
</style>

{#if status === 'y'}
	<svg
		fill="#308800"
		xmlns="http://www.w3.org/2000/svg"
		height="24"
		viewBox="0 0 24 24"
		width="24"><path d="M0 0h24v24H0V0z" fill="none" class="db" />
		<path
			d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z" /></svg>
{:else}
	<svg
		fill="#F64E60"
		xmlns="http://www.w3.org/2000/svg"
		height="24"
		viewBox="0 0 24 24"
		width="24"><path d="M0 0h24v24H0V0z" fill="none" class="db" />
		<path
			d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
{/if}

<script>
	import { _ } from 'svelte-i18n';

	export let title;
	export let selected = false;
	export let onClick;
</script>

<div
	class="flex items-center ba br2 mt1rem transition"
	on:click={onClick}
	class:b--light-gray={!selected}
	class:b--blue={selected}
>
	<div
		class="w-grade ph1rem flex justify-between transition"
		class:b--light-gray={!selected}
		class:b--blue={selected}
	>
		{#if selected}
			<div class="flex items-center mr1rem">
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
			</div>
		{:else}
			<div class="flex items-center mr1rem">
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
			</div>
		{/if}
		<div
			class="tc transition"
			class:blue={selected}
			class:light-silver={!selected}
		>
			<div class="b">{$_('device.grade')}</div>
			<div class="f3 b grade">{title}</div>
		</div>
	</div>
	<div
		class="w-graC pa1rem f6 bl b--light-gray transition"
		class:blue={selected}
		class:light-silver={!selected}
	>
		<slot name="desc" />
	</div>
</div>

<style>
	.w-graC {
		flex: 1;
	}

	.transition {
		transition: 0.7s ease;
		-webkit-transition: 0.7s ease;
	}
	.grade {
		line-height: 1;
	}
</style>

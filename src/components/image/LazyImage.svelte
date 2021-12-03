<script>
	import LazyLoad from 'vanilla-lazyload';
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let src;
	export let alt;
	export let width = 150;
	export let height = '100%';

	let rootEle;
	let containerEle;
	let visible = false;
	let observer;

	onMount(() => {
		visible = true;
		setTimeout(() => {
			if (containerEle) {
				observer = new LazyLoad({
					container: containerEle,
					elements_selector: '.lazy',
				});
				observer.update();
			}
		}, 500);
	});

	onDestroy(() => {
		if (observer) {
			if (typeof observer.destroy === 'function') {
				observer.destroy();
			}
		}
	});
</script>

{#if visible}
	<div bind:this={containerEle} class="flex items-center">
		<img
			class="lazy"
			src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 3 2'%3E%3C/svg%3E"
			data-src={src}
			{alt}
			{width}
			{height}
			bind:this={rootEle}
			transition:fade />
	</div>
{:else}
	<slot name="fallback">{alt}</slot>
{/if}

<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import { checkDeviceType } from '../../functions';

	const deviceType = checkDeviceType();
</script>

{#if deviceType === config.isMobile}
	<div class="flex items-center pt5 w-100 spacing-ext text-nowrap flex-wrap">
		<a class="dim link blue dib mr2 flex items-center" href="/" title="Link 1">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="#6c7293"
				width="20px"
				height="17px"
			>
				<path d="M0 0h24v24H0z" fill="none" />
				<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
			</svg>
			<span class="ml2 fw6"> {$_('nav.home')}</span>
		</a>
		<slot />
	</div>
{:else if deviceType == config.isTablet}
	<div class="flex items-center pt5 w-100 spacing-ext">
		<a class="dim link blue dib mr2 flex items-center" href="/" title="Link 1">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="#6c7293"
				width="20px"
				height="17px"
			>
				<path d="M0 0h24v24H0z" fill="none" />
				<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
			</svg>
			<span class="ml2 fw6"> {$_('nav.home')}</span>
		</a>
		<slot />
	</div>
{:else}
	<div class="flex items-center pt5 mw10 center">
		<a class="dim link blue dib mr2 flex items-center" href="/" title="Link 1">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="#6c7293"
				width="20px"
				height="17px"
			>
				<path d="M0 0h24v24H0z" fill="none" />
				<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
			</svg>
			<span class="ml2 fw6"> {$_('nav.home')}</span>
		</a>
		<slot />
	</div>
{/if}

<style>
	.text-nowrap {
		white-space: nowrap;
	}
</style>

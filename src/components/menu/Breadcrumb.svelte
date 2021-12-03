<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import { checkDeviceType } from '../../functions';
	import IconHome from '../icon/IconHome.svelte';

	const deviceType = checkDeviceType();
</script>

<div class="breadcrumbs-wrapper bg-white">
	{#if deviceType === config.isMobile}
		<div class="breadcrumbs center text-nowrap flex flex-wrap">
			<a
				class="breadcrumb dim link blue flex items-center h-40-px"
				href="/"
				title="Link 1"
			>
				<IconHome fill="#6c7293" size="20" />
				<span class="ml2 fw6"> {$_('nav.home')}</span>
			</a>
			<slot />
		</div>
	{:else if deviceType == config.isTablet}
		<div class="breadcrumbs center text-nowrap flex flex-wrap">
			<a
				class="breadcrumb dim link blue flex items-center h-40-px"
				href="/"
				title="Link 1"
			>
				<IconHome fill="#6c7293" size="20" />
				<span class="ml2 fw6"> {$_('nav.home')}</span>
			</a>
			<slot />
		</div>
	{:else}
		<div class="breadcrumbs center text-nowrap flex flex-wrap">
			<a
				class="breadcrumb dim link blue flex items-center h-40-px"
				href="/"
				title="Link 1"
			>
				<IconHome fill="#6c7293" size="20" />
				<span class="ml2 fw6"> {$_('nav.home')}</span>
			</a>
			<slot />
		</div>
	{/if}
</div>

<style>
	.text-nowrap {
		white-space: nowrap;
	}
</style>

<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import TransactionWrapper from '../../components/transition/TransactionWrapper.svelte';

	import { onMount } from 'svelte';
	import LoadingPage from '../../components/loading/LoadingPage.svelte';
	import { checkDeviceType } from '../../functions';
	import PcNotfound from '../../components/error/PcNotfound.svelte';

	const deviceType = checkDeviceType();

	let visible = false;

	onMount(() => {
		visible = true;
	});
</script>

<svelte:head>
	<title>{$_('nav.home') + ' ' + $_('message.page')}</title>
</svelte:head>
{#if visible}
	<TransactionWrapper id="privacy-screen">
		{#if deviceType === config.isMobile}
			<section class="">
				<PcNotfound />
			</section>
		{:else if deviceType == config.isTablet}
			<div class="content-tablet">
				<section class="">
					<PcNotfound />
				</section>
			</div>
		{:else}
			<div class="content-desktop">
				<section class="">
					<PcNotfound />
				</section>
			</div>
		{/if}
	</TransactionWrapper>
{:else}
	<LoadingPage />
{/if}

<style>
</style>

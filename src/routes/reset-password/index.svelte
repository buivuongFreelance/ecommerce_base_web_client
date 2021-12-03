<script>
	import { _ } from 'svelte-i18n';
	import { goto } from '@sapper/app';
	import config from '../../config';
	import { auth } from '../../stores.js';
	import PcSignInSocial from '../../components/auth/PcSignInSocial.svelte';
	import Breadcrumb from '../../components/menu/Breadcrumb.svelte';
	import BreadcrumbItem from '../../components/menu/BreadcrumbItem.svelte';
	import TransactionWrapper from '../../components/transition/TransactionWrapper.svelte';
	import LazyImage from '../../components/image/LazyImage.svelte';
	import PcNav from '../../components/menu/PcNav.svelte';
	import { onMount } from 'svelte';
	import LoadingPage from '../../components/loading/LoadingPage.svelte';
	import TabletNav from '../../components/menu/TabletNav.svelte';
	import MobileNav from '../../components/menu/MobileNav.svelte';
	import PcFooter from '../../components/footer/PcFooter.svelte';
	import TabletFooter from '../../components/footer/TabletFooter.svelte';
	import MobileFooter from '../../components/footer/MobileFooter.svelte';
	import PcForgotPassword from '../../components/form/PcForgotPassword.svelte';
	import { checkDeviceType } from '../../functions';
	import PcResetPassword from '../../components/resetPassword/PcResetPassword.svelte';

	const deviceType = checkDeviceType();
	let visible = false;

	if ($auth) {
		goto('');
	}

	onMount(() => {
		visible = true;
	});

	const goToSignIn = async () => {
		await goto('/sign-in');
	};
</script>

<style>
</style>

<svelte:head>
	<title>{$_('account.resetPassword') + ' ' + $_('message.page')}</title>
</svelte:head>

{#if visible}
	<TransactionWrapper id="forgot-password-screen">
		{#if deviceType === config.isMobile}
			<div class="content-mobile" />
		{:else if deviceType == config.isTablet}
			<div class="content-tablet" />
		{:else}
			<div class="content-desktop">
				<section class="mw10 center pv6">
					<div class="flex items-center justify-center">
						<div class="w5">
							<div class="dark-blue f2 b tc">{$_('account.resetPassword')}</div>
							<div class="tc light-silver f4 mb5">
								{$_('account.resetPasswordDesc')}
							</div>
							<PcResetPassword onSuccess={goToSignIn} />
						</div>
					</div>
				</section>
			</div>
		{/if}
	</TransactionWrapper>
{:else}
	<LoadingPage />
{/if}

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
	import PcSignIn from '../../components/form/PcSignIn.svelte';
	import { checkDeviceType } from '../../functions';

	const deviceType = checkDeviceType();
	let visible = false;

	if ($auth) {
		goto('');
	}

	onMount(() => {
		visible = true;
	});

	const goToSignUp = async () => {
		await goto('sign-up');
	};

	const goToHome = async () => {
		await goto('');
	};
</script>

<svelte:head>
	<title>{$_('account.signInPage')}</title>
</svelte:head>

{#if visible}
	<TransactionWrapper id="sign-in-screen">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('account.signUp')} />
				</Breadcrumb>
				<section class="pt2rem spacing-ext">
					<div class="tc">
						<h1 class="page__title ttc tc dark-blue w-90 center">
							{$_('account.signIn')}
						</h1>
						<PcSignIn onSuccess={goToHome} />
					</div>
				</section>
				<section class="w-100 spacing-ext pt5 flex items-center justify-center">
					<div class="w4 tc">
						<PcSignInSocial />
					</div>
				</section>
				<section
					class="w-100 spacing-ext pt5 pb6 flex items-center justify-center"
				>
					<div class="w4 tc fw6 f5">
						<span>{$_('account.dontHaveAccount')}</span>
						<a href="sign-up" class="blue">{$_('account.signUp')}</a>
					</div>
				</section>
			</div>
			<MobileFooter />
		{:else if deviceType == config.isTablet}
			<TabletNav />
			<div class="content-tablet">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('account.signIn')} />
				</Breadcrumb>
				<section class="pt2rem spacing-ext pt6">
					<div class="tc w-60 center">
						<h1 class="page__title tc ttc dark-blue w-90 center">
							{$_('account.signIn')}
						</h1>
						<PcSignIn onSuccess={goToHome} />
					</div>
				</section>
				<section class="w-100 spacing-ext pt5 flex items-center justify-center">
					<div class="tc">
						<PcSignInSocial />
					</div>
				</section>
				<section
					class="w-100 spacing-ext pt5 pb6 flex items-center justify-center"
				>
					<div class="tc fw6 f5">
						<span>{$_('account.dontHaveAccount')}</span>
						<a href="sign-up" class="blue">{$_('account.signUp')}</a>
					</div>
				</section>
			</div>
			<TabletFooter />
		{:else}
			<PcNav />
			<div class="content-desktop">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('account.signIn')} />
				</Breadcrumb>
				<section class="mw10 center pv6">
					<div class="flex items-center justify-between">
						<div class="w5">
							<div class="dark-blue f2 b tc">{$_('account.signIn')}</div>
							<PcSignIn onSuccess={goToHome} />

							<div class="mt5 tc">
								<PcSignInSocial />
							</div>
						</div>

						<div class="w5">
							<LazyImage
								src="images/bg-signin.svg"
								alt={$_('account.signIn')}
								width="470px"
								height="375px"
							/>
							<div class="pt5 tc">
								<h2 class="near-black">{$_('account.newHere')}</h2>
								<p class="f5 mt4 mb5 light-silver fw6">
									{$_('account.desnewHere')}
								</p>
								<button
									class="bw2 br2 bg-white ba grow ttu dark-blue b--dark-blue
										h-50-px f5 ph5 fw6 tracked width-btn pointer"
									on:click={goToSignUp}
								>
									{$_('account.signUp')}
								</button>
							</div>
						</div>
					</div>
				</section>
			</div>
			<PcFooter />
		{/if}
	</TransactionWrapper>
{:else}
	<LoadingPage />
{/if}

<style>
	.width-btn {
		width: 170px;
	}
</style>

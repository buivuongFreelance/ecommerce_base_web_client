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
	import PcSignUp from '../../components/form/PcSignUp.svelte';
	import { checkDeviceType } from '../../functions';

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

<svelte:head>
	<title>{$_('account.signUpPage')}</title>
</svelte:head>

{#if visible}
	<TransactionWrapper id="sign-up-screen">
		{#if deviceType === config.isMobile}
			<MobileNav />
			<div class="content-mobile">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('account.signUp')} />
				</Breadcrumb>
				<section class="pt2rem spacing-ext">
					<div class="tc">
						<h1 class="page__title tc ttc w-90 center dark-blue">
							{$_('account.signUp')}
						</h1>
						<PcSignUp onSuccess={goToSignIn} />
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
						<span>{$_('account.alreadySignUp')}</span>
						<a href="/sign-in" class="blue">{$_('account.signIn')}</a>
					</div>
				</section>
			</div>
		{:else if deviceType == config.isTablet}
			<TabletNav />
			<div class="content-tablet">
				<Breadcrumb>
					<BreadcrumbItem active={true} message={$_('account.signUp')} />
				</Breadcrumb>
				<section class="w-100 spacing-ext pt6 flex items-center justify-center">
					<div class="w-60 center tc">
						<h1 class="page__title tc ttc dark-blue">
							{$_('account.signUp')}
						</h1>
						<PcSignUp onSuccess={goToSignIn} />
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
					<div class="w5 tc fw6 f5">
						<span>{$_('account.alreadySignUp')}</span>
						<a href="/sign-in" class="blue">{$_('account.signIn')}</a>
					</div>
				</section>
			</div>
		{:else}
			<PcNav />
			<div class="content-desktop">
				<Breadcrumb>
					<BreadcrumbItem active={true} message="Sign Up" />
				</Breadcrumb>
				<section class="mw10 center pv6">
					<div class="flex items-center justify-between">
						<div class="w5">
							<div class="dark-blue f2 b tc">{$_('account.signUp')}</div>
							<PcSignUp onSuccess={goToSignIn} />
							<div class="mt5 tc justify-center">
								<PcSignInSocial />
							</div>
						</div>

						<div class="w5">
							<LazyImage
								src="images/bg-signup.svg"
								alt={$_('account.signUp')}
								width="470px"
								height="375px"
							/>
							<div class="pt5 tc">
								<h2 class="near-black">Get Start</h2>
								<p class="f5 mt4 mb5 light-silver fw6">
									Create a free mail account to explore all device expect your
									on marketplace us
								</p>
								<button
									class="bw2 br2 bg-white ba grow ttu dark-blue b--dark-blue
										h-50-px f5 ph5 fw6 tracked width-btn pointer"
									on:click={goToSignIn}
								>
									{$_('account.signIn')}
								</button>
							</div>
						</div>
					</div>
				</section>
			</div>
		{/if}
		{#if deviceType === config.isMobile}
			<MobileFooter />
		{:else if deviceType == config.isTablet}
			<TabletFooter />
		{:else}
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

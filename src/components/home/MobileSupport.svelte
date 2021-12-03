<script>
	import { _ } from 'svelte-i18n';
</script>

<div class="custom">
	<div class="spacing-ext center">
		<header class="tc ttu mb5">
			<h3 class="page__title tc ttc">{$_('home.WelcomeToDingtoiSupport')}</h3>
			<h4 class="ttc fw6 light-silver">
				{$_('home.alwaysOnYourSideWhenYouNeedHelp')}
			</h4>
		</header>
		<main>
			<div class="supports">
				<div
					class="support w-100 bg-dark-blue white ph4 pt4 pb6 br2 relative mb6"
				>
					<picture class="mr4">
						<svg
							fill="rgba(255,255,255,.5)"
							xmlns="http://www.w3.org/2000/svg"
							height="68"
							viewBox="0 0 24 24"
							width="68"
							><path d="M0 0h24v24H0z" fill="none" />
							<path
								d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2c0-4.97-4.03-9-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z"
							/></svg
						>
					</picture>
					<div class="">
						<h4 class="ttu fw4 mb3">{$_('home.haveAnyQuestion')}</h4>
						<h3 class="ttu light-yellow mb3">{$_('home.callUsNow')}</h3>
						<div class="mb4">
							<p>{$_('home.thisNumberIsTollFree')}</p>
							<p class="bold">443 221 2234</p>
						</div>
					</div>
					<button
						type="button"
						class="button h-50-px pointer bn br1 fw6 bg-light-yellow dark-blue ph5 flex items-center"
					>
						<span class="mr3">{$_('home.knowMore')}</span>
						<svg
							fill="#2F3A97"
							xmlns="http://www.w3.org/2000/svg"
							enable-background="new 0 0 24 24"
							height="22"
							viewBox="0 0 24 24"
							width="22"
							><rect fill="none" height="22" width="22" />
							<path
								d="M15,5l-1.41,1.41L18.17,11H2V13h16.17l-4.59,4.59L15,19l7-7L15,5z"
							/></svg
						>
					</button>
				</div>
				<div
					class="support w-100 bg-near-black white ph4 pt4 pb6 br2 relative mb4"
				>
					<picture class="mr4">
						<svg
							fill="rgba(255,255,255,.5)"
							xmlns="http://www.w3.org/2000/svg"
							height="68"
							viewBox="0 0 24 24"
							width="68"
							><path d="M0 0h24v24H0V0z" fill="none" />
							<path
								d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"
							/></svg
						>
					</picture>
					<div class="">
						<h4 class="ttu fw4 mb3">{$_('home.wannaTalkToUs')}</h4>
						<h3 class="ttu light-yellow mb3">{$_('home.liveChatNow')}</h3>
						<div class="mb4">
							<p>
								{$_('home.desliveChatNow')}
							</p>
							<!-- <p>Duis leo.Lorem ipsum dolor</p> -->
						</div>
					</div>
					<button
						type="button"
						class="button h-50-px pointer bn br1 fw6 bg-light-yellow dark-blue ph5 flex items-center"
					>
						<span class="mr3">{$_('home.contact')}</span>
						<svg
							fill="#2F3A97"
							xmlns="http://www.w3.org/2000/svg"
							enable-background="new 0 0 24 24"
							height="22"
							viewBox="0 0 24 24"
							width="22"
							><rect fill="none" height="22" width="22" />
							<path
								d="M15,5l-1.41,1.41L18.17,11H2V13h16.17l-4.59,4.59L15,19l7-7L15,5z"
							/></svg
						>
					</button>
				</div>
			</div>
		</main>
	</div>
</div>

<style>
	.button {
		position: absolute;
		bottom: -15px;
		left: 0;
		right: 0;
		margin: auto;
	}
	.bg-near-black {
		background-color: #141a47;
	}
</style>

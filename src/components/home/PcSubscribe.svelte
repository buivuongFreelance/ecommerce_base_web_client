<script>
	import { _ } from 'svelte-i18n';
</script>

<style>
	section {
		background-image: url(images/bg_subscrible.jpg);
		background-size: cover;
		background-position: center top;
	}
	input {
		width: 300px;
	}
</style>

<section class="pv6">
	<div class="mw10 center">
		<div class="w-60">
			<h3 class="light-silver fw4 ttu ma0 text-stroke">
				{$_('footer.subcribe')}
			</h3>
			<h2 class="dark-blue ttu ma0 text-stroke">{$_('footer.getOur')}</h2>
			<h4 class="fw4 ttu ma0 text-stroke mt3">{$_('footer.yourPersonal')}</h4>
			<form class="flex self-center mt6">
				<input
					class="input-reset ba br1 br--left bg-white b--transparent f4
                    pl4 h-80-px input-footer"
					type="email"
					placeholder={$_('footer.emailAdd')} />
				<button
					class="bg-dark-blue b--transparent pointer h-80-px w-80-px br1 br--right
                    button-footer">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="white"
						height="40"
						width="40">
						<path d="M0 0h24v24H0V0z" fill="none" />
						<path
							d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z" /></svg>
				</button>
			</form>
		</div>
	</div>
</section>

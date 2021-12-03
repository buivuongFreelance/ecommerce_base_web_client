<script>
	import { _ } from 'svelte-i18n';
</script>

<section class="spacing-ext center pv6">
	<div class="w-70">
		<h2 class="page__title dark-blue">
			<div class="page__subtitle light-silver f4 fw4 mb1rem">
				{$_('footer.subcribe')}
			</div>
			{$_('footer.getOur')}
		</h2>
		<h4 class="fw4">{$_('footer.yourPersonal')}</h4>

		<form class="flex self-center mt2rem">
			<input
				class="input-reset ba br2 br--left bg-white b--transparent f4
                    pl4 h-80-px input-footer"
				type="email"
				placeholder={$_('footer.emailAdd')}
			/>
			<button
				class="bg-dark-blue b--transparent pointer h-80-px w-80-px br2 br--right
                    button-footer"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="white"
					height="40"
					width="40"
				>
					<path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z"
					/></svg
				>
			</button>
		</form>
	</div>
</section>

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

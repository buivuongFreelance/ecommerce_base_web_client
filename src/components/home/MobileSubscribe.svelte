<script>
	import { _ } from 'svelte-i18n';
</script>

<section class="spacing-ext center pv6">
	<div class="w-70">
		<h4 class="light-silver ttc text-stroke fw6">
			{$_('footer.subcribe')}
		</h4>
		<h3 class="page__title dark-blue ttc text-stroke mt1rem">
			{$_('footer.getOur')}
		</h3>
		<h5 class="ttc text-stroke fw6">{$_('footer.yourPersonal')}</h5>
	</div>
	<form class="flex self-center mt5">
		<input
			class="input-reset ba br1 br--left bg-white b--transparent
				pl4 h-50-px input-footer"
			type="email"
			placeholder={$_('footer.emailAdd')}
		/>
		<button
			class="bg-dark-blue b--transparent pointer h-50-px w-50-px br1 br--right
				button-footer"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="white"
				height="24"
				width="24"
			>
				<path d="M0 0h24v24H0V0z" fill="none" />
				<path
					d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z"
				/></svg
			>
		</button>
	</form>
</section>

<style>
	section {
		background-image: url(images/bg_subscrible.jpg);
		background-repeat: no-repeat;
		background-size: cover;
		background-position: 58% bottom;
	}
	input {
		width: 300px;
	}
</style>

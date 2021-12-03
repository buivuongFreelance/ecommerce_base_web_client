<script>
	import { _ } from 'svelte-i18n';
</script>

<div class="flex items-center container-custom">
	<div class="w-50">
		<h2 class="page-title fw4 mb4 ttc">
			{$_('error.internal')} <br />
			<span class="dark-blue">{$_('error.serverErrorTitle')}</span>
		</h2>
		<p class="desc-custom mb5 light-silver">
			{$_('error.serverErrorMessage')}
			<!-- It's always time for a coffee break. We should be back by the time you
			finish your coffee. -->
		</p>
		<a
			href="/"
			class="btn-custom dib fw6 h-50-px lh-50-px ph5 br2 bn bg-dark-blue white grow pointer"
			>{$_('message.goBackHome')}</a
		>
	</div>
	<div class="w-50">
		<img src="images/500.svg" alt="500" class="w-100 db" />
	</div>
</div>

<style>
	.container-custom {
		font-size: 1.2rem;
		font-family: 'Montserrat', sans-serif;
	}
	.btn-custom {
		text-decoration: none;
	}
</style>

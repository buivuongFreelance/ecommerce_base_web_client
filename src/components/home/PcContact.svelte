<script>
	import { _ } from 'svelte-i18n';
</script>

<div class="custom">
	<section class="pv6">
		<div class="mw10 center">
			<h2 class="dark-blue ttu ma0 text-stroke">{$_('home.contact')}</h2>
			<h4 class="fw4 ttu ma0 text-stroke mt3">{$_('home.contactDesc')}</h4>
			<form method="post">
				<div class="form-group">
					<input type="text" placeholder="Email Address" />
				</div>
				<div class="form-row flex mb4">
					<div class="form-group mr3">
						<input
							type="text"
							class="db w-100 h-50-px ph3 "
							placeholder="First Name"
						/>
					</div>
					<div class="form-group mr3">
						<input
							type="text"
							class="db w-100 h-50-px ph3 "
							placeholder="Last Name"
						/>
					</div>
				</div>
				<div class="form-group mb4">
					<input type="text" placeholder="Subject" />
				</div>
				<div class="form-group">
					<textarea rows="10" placeholde="Message" />
				</div>
			</form>
		</div>
	</section>
</div>

<style>
	section {
		background-image: url(images/bg_subscrible.jpg);
		background-size: cover;
		background-position: center top;
	}
</style>

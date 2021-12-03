<script>
	import { _ } from 'svelte-i18n';
</script>

<div class="custom innovativeQualities">
	<section class="mw10 center pv6 white">
		<h2 class="ttu tc mb3">{$_('home.innovativeQualitiesAndFeatures')}</h2>
		<p class="ttu tc f4 mb6">{$_('home.showYoursToTheWorld')}</p>
		<div class="feafures-container flex items-center">
			<div class="feafures  ">
				<div class="feature mb6">
					<div class="flex mb4">
						<img
							src="images/icon_rocket.svg"
							alt="fast"
							class="w-40-px h-40-px"
						/>
					</div>
					<div class="content">
						<h3 class="ttu mb3 fw6 light-yellow">{$_('home.fast')}</h3>
						<p>{$_('home.fastContent')}</p>
					</div>
				</div>
				<div class="feature mb6">
					<div class="flex mb4">
						<img
							src="images/scan_report.svg"
							alt="scan_report"
							class="w-40-px h-40-px"
						/>
					</div>
					<div class="content">
						<h3 class="ttu mb3 fw6 light-yellow">{$_('home.scanReport')}</h3>
						<p>{$_('home.scanReportContent')}</p>
					</div>
				</div>
			</div>
			<div class="image flex justify-center">
				<img src="images/mockup-13.png" alt="mockup-13" />
			</div>
			<div class="feafures  tr">
				<div class="feature mb6">
					<div class="flex justify-end mb4">
						<img
							src="images/icon_smile.svg"
							alt="smile"
							class="w-40-px h-40-px"
						/>
					</div>
					<div class="content ml-auto">
						<h3 class="ttu mb3 fw6 light-yellow">{$_('home.easyToUse')}</h3>
						<p>{$_('home.easyToUseContent')}</p>
					</div>
				</div>
				<div class="feature mb6">
					<div class="flex justify-end mb4">
						<img
							src="images/icon_share.svg"
							alt="share"
							class="w-40-px h-40-px"
						/>
					</div>
					<div class="content ml-auto">
						<h3 class="ttu mb3 fw6 light-yellow">{$_('home.share')}</h3>
						<p>{$_('home.shareContent')}</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	.innovativeQualities {
		background-image: url(images/bg2.jpg);
		background-size: cover;
		background-position: center center;
		background-repeat: no-repeat;
	}
	.feafures {
		flex: 1;
	}
	.feature img {
		transition: transform 0.3s;
	}
	.feature:hover img {
		transform: translateY(-10px);
	}
	.image {
		flex: 1;
	}
	.content {
		max-width: 70%;
	}
	.ml-auto {
		margin-left: auto;
	}
</style>

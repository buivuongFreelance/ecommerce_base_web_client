<script>
	import { _ } from 'svelte-i18n';
	import { goto } from '@sapper/app';
	import Breadcrumb from '../../components/menu/Breadcrumb.svelte';
	import BreadcrumbItem from '../../components/menu/BreadcrumbItem.svelte';
	import PcNav from '../../components/menu/PcNav.svelte';
	import { onDestroy, onMount } from 'svelte';
	import PcFooter from '../../components/footer/PcFooter.svelte';
	import { checkDeviceType } from '../../functions';
	import { auth, isVendor } from '../../stores';

	const deviceType = checkDeviceType();

	let visible = false;

	onMount(async () => {
		if (!$auth) {
			await goto('');
		}
	});
	onDestroy(() => {
		isVendor.set(false);
	});
</script>

<svelte:head>
	<title>Open Dispute</title>
</svelte:head>

<PcNav />
<div class="content-desktop">
	<Breadcrumb>
		<BreadcrumbItem active={true} message={'Open Dispute'} />
	</Breadcrumb>
	<section class="spacing-ext mw10 center pt3 pb5">
		<button
			type="button"
			class="fw6 tc ba b--light-yellow bg-light-yellow
								dark-blue f4 br2 dim pointer h-60-px flex items-center
                                pl3 pr3
								justify-center"
		>
			Create Open Dispute
		</button>
	</section>
</div>
<PcFooter />

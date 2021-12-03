<script>
	import { goto } from '@sapper/app';
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import 'sweetalert2/dist/sweetalert2.min.css';

	export let id;
	let isOpenMenu = false;
	const handleMenuOpen = () => {
		if (!isOpenMenu) isOpenMenu = true;
	};
	const handleMenuClose = () => {
		if (isOpenMenu) isOpenMenu = false;
	};
</script>

<style>
	.popup {
		top: 39px;
		right: 0;
		width: 200px;
	}
	.btn-icon {
		width: 40px;
		height: 40px;
		display: grid;
		place-items: center;
		border-radius: 4px;
	}
</style>

<div
	class="ml3 relative btn-icon pointer ba b--light-gray bg-light-gray "
	on:mouseenter={handleMenuOpen}
	on:mouseleave={handleMenuClose}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="#3F4254"
		width="24px"
		height="24px">
		<path d="M0 0h24v24H0z" fill="none" />
		<path
			d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2
				2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9
				2-2-.9-2-2-2z" />
	</svg>
	{#if isOpenMenu}
		<ul
			transition:fade
			class="z-max absolute list ma0 pv3 ph0 bg-white br2 shadow-1 popup top-2">
			<!-- edit device -->
			<li
				class="lh-copy pointer"
				on:click={async () => {
					await goto('my-transactions/' + id);
				}}>
				<div class="pv3 spacing-ext flex items-center self-center dim">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24"
						fill="#9fb0c9"
						viewBox="0 0 24 24"
						width="24">
						<path d="M0 0h24v24H0V0z" fill="none" />
						<path
							d="M12 6.5c3.79 0 7.17 2.13 8.82 5.5-1.65 3.37-5.02 5.5-8.82 5.5S4.83 15.37 3.18 12C4.83 8.63 8.21 6.5 12 6.5m0-2C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5m0-2c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5z" />
					</svg>
					<span class="ml3 fw6"> {$_('home.viewDetail')} </span>
				</div>
			</li>
		</ul>
	{/if}
</div>

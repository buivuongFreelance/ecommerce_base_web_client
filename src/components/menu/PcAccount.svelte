<script>
	import { _ } from 'svelte-i18n';
	import { auth } from '../../stores';
	import PcAccountDropdown from '../dropdown/PcAccountDropdown.svelte';
</script>

<style>
	.menu-icon {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}
</style>

{#if !$auth}
	<a class="link dim dark-blue pl3 h-70-px flex items-center" href="sign-in">
		<div
			class="relative menu-icon flex items-center justify-center ba b--dark-blue">
			<svg
				fill="#2F3A97"
				xmlns="http://www.w3.org/2000/svg"
				height="24"
				viewBox="0 0 24 24"
				width="24"><path d="M0 0h24v24H0V0z" fill="none" />
				<path
					d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
			</svg>
		</div>
		<div class="flex-column flex justify-center ml2">
			<span class="lh-solid ttc">{$_('account.signIn')}</span>
		</div>
	</a>
{:else}
	<PcAccountDropdown />
{/if}

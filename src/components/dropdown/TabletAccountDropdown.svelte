<script>
	import { _ } from 'svelte-i18n';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import { stores, goto } from '@sapper/app';
	import { fade } from 'svelte/transition';
	import { auth } from '../../stores';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import {
		extractNameFromEmail,
		extractDomainFromEmail,
	} from '../../functions';
	import { logout as apiLogout } from '../../services/user';
	import LoadingPage from '../loading/LoadingPage.svelte';

	const { session } = stores();
	const { domainAuthWeb } = $session;

	let isLoading = false;
	let isOpen = false;
	let rootEle;
	let top = 0;
	let left = 0;

	const logout = () => {
		isOpen = false;
		const token = $auth.accessToken;
		isLoading = true;

		apiLogout(domainAuthWeb, { token })
			.then(() => {
				swal.fire({
					toast: true,
					position: 'top-end',
					icon: 'success',
					title: $_('account.logoutSuccess'),
					showConfirmButton: false,
					timerProgressBar: true,
					timer: 1500,
					onOpen: (toast) => {
						toast.addEventListener('mouseenter', swal.stopTimer);
						toast.addEventListener('mouseleave', swal.resumeTimer);
					},
				});
				auth.set(null);
				isLoading = false;
				goto('sign-in');
			})
			.catch(() => {
				isLoading = false;
				swal.fire({
					icon: 'error',
					title: $_('error.serverErrorTitle'),
					reverseButtons: true,
					text: $_('error.serverErrorMessage'),
				});
			});
	};

	const handleLogout = () => {
		isOpen = false;
		swal
			.fire({
				position: 'top',
				title: $_('account.logout'),
				text: $_('account.logoutDesc'),
				icon: 'question',
				position: 'top',
				showCancelButton: true,
				reverseButtons: true,
				cancelButtonText: $_('message.no'),
				confirmButtonText: $_('message.yes'),
				customClass: {
					icon: 'icon-question',
				},
			})
			.then((result) => {
				if (result.value) {
					logout();
				}
			});
	};

	const handleClick = () => {
		isOpen = true;
		const boundingClientRect = rootEle.getBoundingClientRect();
		top =
			parseFloat(boundingClientRect.y) + parseFloat(boundingClientRect.height);
		left =
			parseFloat(boundingClientRect.x) +
			parseFloat(boundingClientRect.width) -
			150;
	};
</script>

<style>
	.popup {
		top: var(--top);
		left: var(--left);
		width: 155px;
	}
</style>

{#if isLoading}
	<Portal target={document.getElementById('portal')}>
		<LoadingPage />
	</Portal>
{/if}

<div
	class="link dark-blue pl3 h-70-px flex items-center pointer fw6"
	on:click={handleClick}
	bind:this={rootEle}>
	<div class="flex items-center">
		<svg
			fill="#2F3A97"
			xmlns="http://www.w3.org/2000/svg"
			height="24"
			viewBox="0 0 24 24"
			width="24"><path d="M0 0h24v24H0V0z" fill="none" />
			<path
				d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
		</svg>
		<div class="flex-column flex justify-center ml2">
			<span class="lh-solid">{extractNameFromEmail($auth.email)}</span>
			<span class="lh-title">@{extractDomainFromEmail($auth.email)}</span>
		</div>
	</div>
</div>

{#if isOpen}
	<Portal target={document.getElementById('overlay')}>
		<DimmerModal onClick={() => (isOpen = false)} />
		{#if $auth}
			<ul
				transition:fade
				class="fixed z-max list ma0 pv3 ph0 bg-white br2 shadow-1 popup"
				style="--top: {top - 11}px; --left: {left}px">
				<li class="lh-copy" on:click={async () => await goto('my-devices')}>
					<div class="pv3 spacing-ext flex items-center self-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="#3f4254"
							width="24px"
							height="24px">
							<path d="M0 0h24v24H0V0z" fill="none" />
							<path
								d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
						</svg>
						<span class="ml3 fw6">{$_('device.listDevice')}</span>
					</div>
				</li>
				<li
					class="lh-copy"
					on:click={async () => {
						await goto('my-wishlists');
					}}>
					<div class="pv3 spacing-ext flex items-center self-center">
						<svg
							fill="#3F4254"
							height="24"
							viewBox="-16 0 383 384"
							width="24"
							xmlns="http://www.w3.org/2000/svg"><path
								d="m160.5 352h-128v-320h224v64c0 8.832031 7.167969 16 16 16s16-7.167969 16-16v-80c0-8.832031-7.167969-16-16-16h-256c-8.832031 0-16 7.167969-16 16v352c0 8.832031 7.167969 16 16 16h144c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0" />
							<path
								d="m136.5 64h-64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h64c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0" />
							<path
								d="m136.5 120h-64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h64c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0" />
							<path
								d="m136.5 176h-64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h64c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0" />
							<path
								d="m136.5 232h-64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h64c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0" />
							<path
								d="m200.5 64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h16c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0" />
							<path
								d="m216.5 152c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16h-16c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16zm0 0" />
							<path
								d="m326.667969 197.960938c-11.496094-6.320313-24.710938-7.671876-37.183594-3.847657-6.320313 1.933594-12.0625 5.078125-17 9.183594-4.9375-4.121094-10.671875-7.257813-16.96875-9.183594-12.488281-3.832031-25.703125-2.457031-37.230469 3.871094-23.503906 13.015625-32.5625 43.351563-20.175781 67.679687 9.503906 18.519532 54.886719 58.558594 63.886719 66.398438.191406.167969.40625.28125.601562.433594.34375.273437.695313.519531 1.054688.761718.550781.367188 1.121094.695313 1.695312.988282.359375.1875.710938.363281 1.089844.515625.671875.269531 1.351562.476562 2.046875.664062.3125.078125.617187.191407.9375.246094 1.007813.207031 2.039063.328125 3.070313.328125h.007812.007812c1.03125 0 2.0625-.121094 3.082032-.320312.316406-.0625.613281-.167969.933594-.246094.695312-.175782 1.375-.386719 2.046874-.664063.371094-.152343.730469-.335937 1.089844-.511719.582032-.296874 1.144532-.617187 1.695313-.992187.359375-.242187.710937-.488281 1.054687-.761719.203125-.152344.417969-.273437.601563-.433594 9-7.832031 54.390625-47.871093 63.914062-66.445312 12.359375-24.289062 3.292969-54.625-20.257812-67.664062zm-8.238281 53.09375c-3.785157 7.378906-25.042969 28.625-45.929688 47.539062-20.894531-18.914062-42.136719-40.160156-45.902344-47.496094-4.625-9.097656-1.402344-20.363281 7.140625-25.097656 3.851563-2.113281 8.265625-2.574219 12.417969-1.296875 4.421875 1.351563 8.085938 4.480469 10.335938 8.839844.199218.488281.335937 1.066406.496093 1.671875.0625.25.183594.464844.253907.714844.167968.566406.371093 1.117187.601562 1.664062.191406.445312.390625.871094.617188 1.292969.253906.480469.542968.945312.847656 1.394531.28125.40625.566406.808594.878906 1.183594.34375.414062.703125.808594 1.089844 1.183594.34375.34375.703125.671874 1.078125.984374.410156.335938.839843.648438 1.289062.953126.429688.285156.863281.550781 1.320313.796874.429687.234376.871094.441407 1.328125.640626.550781.234374 1.101562.433593 1.679687.601562.230469.070312.4375.183594.679688.246094.199218.050781.398437.050781.601562.089844.589844.128906 1.183594.207031 1.789063.261718.488281.050782.96875.082032 1.449219.082032.511718 0 1.03125-.039063 1.550781-.089844.578125-.054688 1.144531-.136719 1.703125-.246094.21875-.046875.425781-.039062.640625-.097656.25-.0625.472656-.183594.714843-.253906.550782-.167969 1.085938-.351563 1.613282-.585938.480468-.199219.9375-.414062 1.386718-.664062.4375-.238282.855469-.496094 1.269532-.765626.457031-.304687.898437-.625 1.320312-.976562.367188-.304688.710938-.632812 1.054688-.96875.394531-.382812.761718-.785156 1.105468-1.207031.3125-.378907.59375-.769531.863282-1.167969.3125-.457031.59375-.921875.855468-1.402344.226563-.421875.433594-.847656.617188-1.292968.234375-.546876.425781-1.097657.601562-1.664063.070313-.242187.191407-.464844.253907-.714844.160156-.605469.289062-1.183593.519531-1.703125 2.21875-4.335937 5.882812-7.464844 10.304688-8.816406 4.167968-1.296875 8.578124-.816406 12.367187 1.273438 8.570313 4.78125 11.792969 16.046874 7.195313 25.09375zm0 0" />
						</svg>
						<span class="ml3 near-black fw6">{$_('wishlist.myWishlists')}</span>
					</div>
				</li>
				<li
					class="lh-copy"
					on:click={async () => {
						await goto('/my-account');
					}}>
					<div class="pv3 spacing-ext flex items-center self-center">
						<svg
							fill="#3f4254"
							xmlns="http://www.w3.org/2000/svg"
							height="24"
							viewBox="0 0 24 24"
							width="24"><path d="M0 0h24v24H0V0z" fill="none" />
							<path
								d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
						</svg>
						<span class="ml3 near-black fw6">{$_('nav.myAccount')}</span>
					</div>
				</li>
				<li class="lh-copy" on:click={handleLogout}>
					<div class="pv3 spacing-ext flex items-center self-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="#3f4254"
							width="24px"
							height="24px">
							<path d="M0 0h24v24H0z" fill="none" />
							<path
								d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
						</svg>
						<span class="ml3 near-black fw6">{$_('account.logOut')}</span>
					</div>
				</li>
			</ul>
		{:else}
			<ul
				transition:fade
				class="fixed z-max list ma0 pv3 ph0 bg-white br2 shadow-1 popup"
				style="--top: {top}px; --left: {left}px">
				<li class="lh-copy" on:click={async () => await goto('sign-in')}>
					<div class="pv3 spacing-ext flex items-center self-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							enable-background="new 0 0 24 24"
							viewBox="0 0 24 24"
							fill="#3f4254"
							width="24px"
							height="24px">
							<g>
								<rect fill="none" height="24" width="24" />
							</g>
							<g>
								<path
									d="M11,7L9.6,8.4l2.6,2.6H2v2h10.2l-2.6,2.6L11,17l5-5L11,7z M20,19h-8v2h8c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2h-8v2h8V19z" />
							</g>
						</svg>
						<span class="ml3 fw6">{$_('account.signIn')}</span>
					</div>
				</li>
				<li class="lh-copy" on:click={async () => await goto('sign-up')}>
					<div class="pv3 spacing-ext flex items-center self-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="#3f4254"
							width="24px"
							height="24px">
							<path d="M0 0h24v24H0z" fill="none" />
							<path
								d="M21 3.01H3c-1.1 0-2 .9-2 2V9h2V4.99h18v14.03H3V15H1v4.01c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98v-14c0-1.11-.9-2-2-2zM11 16l4-4-4-4v3H1v2h10v3z" />
						</svg>
						<span class="ml3 near-black fw6">{$_('account.signUp')}</span>
					</div>
				</li>
				<li
					class="lh-copy"
					on:click={async () => {
						await goto('favorites');
					}}>
					<div class="pv3 spacing-ext flex items-center self-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="#3f4254"
							width="24px"
							height="24px">
							<path d="M0 0h24v24H0z" fill="none" />
							<path
								d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
						</svg>
						<span class="ml3 near-black fw6">{$_('nav.favorites')}</span>
					</div>
				</li>
			</ul>
		{/if}
	</Portal>
{/if}

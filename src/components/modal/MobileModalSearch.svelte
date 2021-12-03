<script>
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { goto } from '@sapper/app';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import MobileInputSearch from '../input/MobileInputSearch.svelte';
	import { linkToBack } from '../../stores';
	export let onClose;

	const handleOverlayClick = () => {
		onClose();
	};
	const handleSubmit = async () => {
		linkToBack.set('category');
		await goto('empty');
	};
</script>

<style>
	.search {
		margin-top: 40px;
	}
</style>

<Portal target={document.getElementById('portal')}>
	<DimmerModal type="modal" onClick={handleOverlayClick} />
	<div class="w-100 fixed z-max top-0 search" transition:fade>
		<form on:submit|preventDefault={handleSubmit} novalidate>
			<div class="relative w-100">
				<MobileInputSearch />
				<i class="absolute left-0 top-0 bottom-0 pl4 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="#b5b5c3"
						width="24px"
						height="24px"><path d="M0 0h24v24H0z" fill="none" />
						<path
							d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91
						13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59
						4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99
						5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
				</i>
			</div>
		</form>
	</div>
</Portal>

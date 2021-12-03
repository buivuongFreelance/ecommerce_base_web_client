<script>
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import PcInputKeyValue from '../form/PcInputKeyValue.svelte';
	import { goto } from '@sapper/app';

	export let onClose;
	export let item;
	let isDisable = true;
	const handleDisable = (name, checked) => {
		if (checked) isDisable = false;
		else isDisable = true;
	};
	const handleGoToPostDevice = () => {
		goto('my-devices/post-device/' + item.id);
		onClose();
	};
</script>

<div class="fixed z-max wrapper" transition:fade>
	<div class="agreement w-100 bg-white container flex flex-column pa4">
		<div class="agreement__header flex items-center justify-between">
			<img
				src="https://cdn.zeplin.io/5f01bb9c4156b41352be3d7f/assets/1EBB74C1-B413-46E4-B487-DFE926285D31.png"
				width="50px"
				alt="logo"
			/>
			<div class="pointer flex items-center" on:click={onClose}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 0 24 24"
					fill="#7e8299"
					width="24"
					><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
					/></svg
				>
			</div>
		</div>
		<div class="agreement__body mv4">
			<div>
				1.1 These Terms of Service (the “Terms”) apply to your use of the
				Dingtoi API service (the “Service”) and any and all data, text, images,
				trademarks and logos, software, documents and other materials
				transmitted via the Service (the “Content”), including without
				limitation any application programming interface offered through the
				Service (“API”). THIS AGREEMENT DESCRIBES YOUR RIGHTS AND
				RESPONSIBILITIES; PLEASE READ IT CAREFULLY. IF YOU DO NOT ACCEPT ALL OF
				THE TERMS, YOU SHOULD NOT USE THIS SERVICE. Reference to the “Service”
				in these Terms includes the Content and the API, unless stated
				otherwise. 1.2 Please read these Terms carefully. Dingtoi.com, LLC
				(“Dingtoi,” “we,” or “us”) provides the Service to you subject to the
				Terms. By registering for or using the Service, you agree to these Terms
				together with the Best Buy Developer API Branding Guidelines, the Terms
				and Conditions, Privacy Policy and California Privacy Rights that govern
				use of the www.bestbuy.com website (the “Website”), and, if you are an
				Affiliate of www.bestbuy.com, your applicable Affiliate publisher
				agreement (collectively referred to as the “Governing Agreements”). To
				the extent of any conflict between any of the other Governing Agreements
				and these Terms, these Terms will control with respect to this Service.
			</div>
		</div>
		<div class="agreement__footer">
			<PcInputKeyValue
				key={$_('message.iAccept')}
				bindValue={false}
				onChange={(name, checked) => {
					handleDisable(name, checked);
				}}
			/>
			<div class="flex mt4">
				<button
					on:click={onClose}
					class="h-50-px btn-width br2 ba b--dark-blue dark-blue bg-white fw6
						pointer mr5"
					>{$_('message.decline')}</button
				>
				<button
					on:click={handleGoToPostDevice}
					class="h-50-px btn-width br2 ba b--dark-blue white bg-dark-blue fw6
						pointer"
					class:pointer={isDisable === false}
					class:o-10={isDisable === true}
					disabled={isDisable === true ? true : false}
					>{$_('message.accept')}</button
				>
			</div>
		</div>
	</div>
</div>

<style>
	.wrapper {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		height: calc(100vh - 120px);
		overflow: hidden;
		border-radius: 10px;
		width: calc(100% - 30px);
	}
	.container {
		height: calc(100vh - 120px);
	}
	.btn-width {
		width: 134px;
	}
	.agreement__body {
		flex: 1;
		overflow-y: auto;
	}
</style>

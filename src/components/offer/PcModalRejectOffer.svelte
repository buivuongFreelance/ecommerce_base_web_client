<script>
	import { stores, goto } from '@sapper/app';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { listQuestionSellerReject as apiListQuestionSellerReject } from '../../services/model';
	import { sellerRejectProposal as apiSellerRejectProposal } from '../../services/proposal';
	import ContentLoader from 'svelte-content-loader';
	import config from '../../config';
	import { auth } from '../../stores';

	const { session, page } = stores();
	const { domainModel, domainProposal } = $session;

	export let onClose;
	export let isLoadingReject;
	export let selectQuestion = [];
	export let onSuccess = null;
	export let item;

	let isLoading = false;
	let isServerError = false;
	let list = [];
	let flag = false;

	onMount(async () => {
		await listQuestionSellerReject();
	});
	const listQuestionSellerReject = () => {
		isLoading = true;
		return new Promise((resolve, reject) => {
			apiListQuestionSellerReject(domainModel)
				.then((items) => {
					isLoading = false;
					list = items.list;
					isServerError = false;
					resolve();
				})
				.catch(() => {
					isLoading = false;
					isServerError = true;
					reject();
				});
		});
	};
	const sellerRejectProposal = () => {
		return new Promise((resolve, reject) => {
			isLoadingReject = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiSellerRejectProposal(domainProposal, {
				token,
				id: item.id,
				questions: selectQuestion,
			})
				.then(() => {
					isLoadingReject = false;
					resolve();
				})
				.catch((error) => {
					isOpenModal = false;
					if (error.response) {
						if (error.response.status === 400) {
							if (error.response.data.obj === config.proposal.sellerAccept) {
								isLoadingReject = false;
								swal.fire({
									position: 'top',
									icon: 'warning',
									title: $_('error.deviceAccepted'),
									text: $_('error.descdeviceAccepted'),
									reverseButtons: true,
									customClass: {
										icon: 'icon-warning',
									},
								});
							}
						} else {
							isLoadingReject = false;
							swal.fire({
								position: 'top',
								icon: 'error',
								title: $_('error.serverErrorTitle'),
								text: $_('error.serverErrorMessage'),
								reverseButtons: true,
								customClass: {
									icon: 'icon-error',
								},
							});
						}
					}

					reject();
				});
		});
	};
	const handleChangeQuestion = (event) => {
		if (event.target.value) {
			flag = false;
		} else {
			if (JSON.stringify(event.target.checked).includes('true')) {
				flag = false;
			} else {
				flag = true;
			}
		}
	};
	const handleSend = async () => {
		if (selectQuestion.length == 0) flag = true;
		else {
			flag = false;
			await sellerRejectProposal();
			if (onSuccess) onSuccess();
		}
	};
</script>

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
		width: 512px;
	}
	.container {
		height: calc(100vh - 120px);
	}
	.panel {
		border-top-left-radius: 3px;
		border-top-right-radius: 3px;
	}
	.content {
		max-height: calc(100vh - 180px);
		overflow: auto;
	}
	.btn-width {
		width: 95px;
	}
	.checkbox .box {
		height: 20px;
		width: 20px;
		border: 2px solid #7e8299;
		border-radius: 3px;
		box-sizing: border-box;
	}
	.checkbox .box:after {
		content: '';
		display: block;
		width: 4px;
		height: 10px;
		transform: rotate(45deg);
		border-bottom: 2px solid #2f3a97;
		border-right: 2px solid #2f3a97;
		opacity: 0;
	}
	.checkbox > input:checked + .box {
		border-color: #2f3a97;
	}
	.checkbox > input:checked + .box:after {
		opacity: 1;
	}
	.checkbox > input:checked ~ .label {
		color: #2f3a97;
	}
	.checkbox input {
		display: none !important;
	}
</style>

<div class="fixed z-max wrapper" transition:fade>
	<div class="w-100 bg-white container">
		<div
			class="h-60-px flex items-center justify-between bg-light-gray
				b--pale-grey bb ph4 near-black fw5 f4 panel">
			<div>{$_('proposal.rejectOffer')}</div>
			<div class="pointer flex items-center" on:click={onClose}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 0 24 24"
					fill="#7e8299"
					width="24"><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
			</div>
		</div>
		{#if isServerError}
			<p class="red f4">{$_('error.serverErrorMessage')}</p>
		{:else if isLoading}
			<ContentLoader
				uniqueKey="rejectSeller"
				primaryColor="#e4e6ef"
				secondaryColor="#f8f8f8"
				width={config.containerDesktop - 30}
				height="40">
				<rect x="0" y="0" rx="3" ry="3" width="80%" height="40" />
			</ContentLoader>
		{:else}
			<div class="pv5 content">
				<div
					class="swal2-icon swal2-question icon-question swal2-icon-show"
					style="display: flex;">
					<div class="swal2-icon-content">?</div>
				</div>
				<h3 class="tc mb3 fw6">{$_('proposal.reject')}</h3>
				<div class="tc f4 mb5">{$_('proposal.warningReject')}</div>
				{#if flag}
					<p class="red i mb4 tc">{$_('message.chooseQuestion')}</p>
				{/if}
				<div class="flex justify-center">
					<div>
						{#if list.length > 0}
							{#each list as item}
								<div class="mb3">
									<label class="checkbox flex items-center">
										<input
											on:change={(event) => handleChangeQuestion(event)}
											type="checkbox"
											value={item.id}
											bind:group={selectQuestion} />
										<span class="box flex items-center justify-center" />
										<span class="label fw6 ml3">{item.name}</span>
									</label>
								</div>
							{/each}
						{/if}
					</div>
				</div>
				<div class="flex justify-center mt5">
					<button
						on:click={onClose}
						type="button"
						class="link bg-light-gray br1 ba fw6 ttu near-black b--pale-grey flex items-center justify-center
				h-40-px btn-width pointer tracked">{$_('message.cancel')}</button>
					<button
						on:click={handleSend}
						type="button"
						class="link bg-dark-blue b--dark-blue br1 ba fw6 ttu white
				flex pointer items-center justify-center grow h-40-px
				btn-width tracked ml3">{$_('message.send')}</button>
				</div>
			</div>
		{/if}
	</div>
</div>

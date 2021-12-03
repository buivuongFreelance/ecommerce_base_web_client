<script>
	import { _ } from 'svelte-i18n';
	import PcBasicInfo from '../device/PcBasicInfo.svelte';
	import PcGradeDevice from '../device/PcGradeDevice.svelte';
	import { extractError, extractErrors } from '../../functions';
	import * as yup from 'yup';
	import { fade } from 'svelte/transition';
	import { stores, goto } from '@sapper/app';
	import config from '../../config';

	import {
		fieldCapacity,
		fieldColor,
		fieldRam,
		fieldPhysicalGrading,
		infoImei,
		auth,
	} from '../../stores';
	import { editDevice as apiEditDevice } from '../../services/device';
	import { onDestroy, onMount } from 'svelte';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';

	const { session } = stores();
	const { domainDevice } = $session;
	export let onErrors;

	let values = {
		ram: '',
		color: '',
		capacity: '',
		physicalGrading: '',
	};
	let errors = {};
	let isLoading = false;
	let visible = false;

	const schema = yup.object().shape({
		ram: yup.string($_('error.string')).required($_('error.required')),
		color: yup.string($_('error.string')).required($_('error.required')),
		capacity: yup.string($_('error.string')).required($_('error.required')),
		physicalGrading: yup
			.string($_('error.string'))
			.required($_('error.required')),
	});

	const unsubscribeCapacity = fieldCapacity.subscribe((value) => {
		values.capacity = value;
		if (value && visible) {
			validate('capacity');
		}
	});

	const unsubscribeRam = fieldRam.subscribe((value) => {
		values.ram = value;
		if (value && visible) {
			validate('ram');
		}
	});

	const unsubscribeColor = fieldColor.subscribe((value) => {
		values.color = value;
		if (value && visible) {
			validate('color');
		}
	});
	const unsubscribePhysicalGrading = fieldPhysicalGrading.subscribe((value) => {
		values.physicalGrading = value;
		if (value && visible) {
			validate('physicalGrading');
		}
	});
	onMount(() => {
		visible = true;
	});
	onDestroy(() => {
		unsubscribeCapacity();
		unsubscribeColor();
		unsubscribeRam();
		unsubscribePhysicalGrading();
	});

	const editDevice = () => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiEditDevice(domainDevice, {
				id: $infoImei.id,
				capacityId: $fieldCapacity,
				ramId: $fieldRam,
				colorId: $fieldColor,
				physicalGrading: $fieldPhysicalGrading,
				token,
			})
				.then(() => {
					isLoading = false;
					resolve();
				})
				.catch((error) => {
					isLoading = false;

					const { obj } = error.response.data;
					let text = $_('error.serverErrorMessage');
					if (obj === 'ERR_EXIST') {
						text = $_('device.device') + ' ' + $_('message.exists');
					}
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.serverErrorTitle'),
						text: text,
						reverseButtons: true,
						customClass: {
							icon: 'icon-error',
						},
					});

					reject();
				});
		});
	};
	const validate = async (field) => {
		try {
			await schema.validateAt(field, values);
			errors[field] = '';
		} catch (error) {
			errors[field] = extractError(error, field);
		}
	};
	const handleSubmit = async () => {
		let flag = true;
		try {
			await schema.validate(values, { abortEarly: false });
			if ($infoImei.status !== config.device.created) {
				const result = await swal.fire({
					position: 'top',
					icon: 'question',
					showCancelButton: true,
					cancelButtonText: $_('message.no'),
					confirmButtonText: $_('message.yes'),
					reverseButtons: true,
					customClass: {
						icon: 'icon-question',
					},
					title: $_('message.warning'),
					text: $_('error.editDevice'),
				});
				if (!result.value) {
					flag = false;
				}
			}
			if (flag) {
				await editDevice();
				swal.fire({
					toast: true,
					position: 'top-end',
					icon: 'success',
					title: $_('message.actionSuccess'),
					showConfirmButton: false,
					timerProgressBar: true,
					timer: 1500,
					onOpen: (toast) => {
						toast.addEventListener('mouseenter', swal.stopTimer);
						toast.addEventListener('mouseleave', swal.resumeTimer);
					},
				});
				await goto('my-devices');
			}
		} catch (error) {
			if (error) {
				errors = extractErrors(error);
				onErrors(errors);
			}
		}
	};
</script>

<style>
	.btn-width {
		width: 170px;
	}
</style>

{#if visible}
	<form autocomplete="off" on:submit|preventDefault={handleSubmit} novalidate>
		<PcBasicInfo {errors} />

		<h3 class="tc mv5 ttc" class:red={errors.physicalGrading}>
			{$_('device.physicalGrading')}
		</h3>
		<h5 class="tc mb3 light-silver" class:red={errors.physicalGrading}>
			{$_('device.selectPhGra')}
		</h5>
		{#if errors.physicalGrading}
			<div class="red fw6 mt2 mb2" transition:fade>
				{errors.physicalGrading}
			</div>
		{/if}
		<div id="physicalGrading">
			<PcGradeDevice />
		</div>

		<!-- <div class="flex items-center justify-center">
		<span class="dim tc f6 blue fw6 mv5 mr1 underline">
			{$_('device.moreInfo')}</span>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="#3699ff"
			width="24px"
			height="24px">
			<path d="M0 0h24v24H0V0z" fill="none" />
			<path d="M7 10l5 5 5-5H7z" />
		</svg>
	</div> -->
		<div class="w-100 tc mt5 flex justify-between">
			<button
				on:click={() => (window.location.href = 'my-devices')}
				class="br2 bg-light-gray b--light-gray ba grow ttu h-60-px fw6 btn-width
					tracked near-black">
				{$_('message.cancel')}
			</button>
			{#if isLoading}
				<button
					type="button"
					class="br2 bg-dark-blue b--dark-blue ba grow ttu white h-60-px fw6
						btn-width tracked">
					<div class="flex w-100 items-center justify-center">
						<LoadingDefault />
					</div>
				</button>
			{:else}
				<button
					class="br2 bg-dark-blue b--dark-blue ba grow ttu white h-60-px fw6
						btn-width tracked">
					{$_('message.save')}
				</button>
			{/if}
		</div>
	</form>
{/if}

<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import { fade } from 'svelte/transition';
	import MobileBasicInfo from '../device/MobileBasicInfo.svelte';
	import MobileGradeDevice from '../device/MobileGradeDevice.svelte';
	import { extractError, extractErrors } from '../../functions';
	import * as yup from 'yup';
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
	import config from '../../config';

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

{#if visible}
	<form autocomplete="off" on:submit|preventDefault={handleSubmit} novalidate>
		<MobileBasicInfo {errors} />

		<h4 class="tc mt2rem ttc" class:red={errors.physicalGrading}>
			{$_('device.physicalGrading')}
		</h4>
		{#if errors.physicalGrading}
			<div class="red fw6 mv1rem tc" transition:fade>
				{errors.physicalGrading}
			</div>
		{/if}
		<div id="physicalGrading" class="mt1rem">
			<MobileGradeDevice />
		</div>
		{#if isLoading}
			<button
				type="button"
				class="mt1rem br2 bg-dark-blue b--dark-blue ba grow ttu white h-50-px fw6 w-100
					tracked mv5"
			>
				<div class="flex w-100 items-center justify-center">
					<LoadingDefault />
				</div>
			</button>
		{:else}
			<button
				type="submit"
				class="btn--submit mt1rem br2 bg-dark-blue b--dark-blue ba grow ttu white h-50-px fw6 w-100
					tracked"
			>
				{$_('message.save')}
			</button>
		{/if}
	</form>
{/if}

<style>
	.btn--submit {
		position: sticky;
		bottom: 1rem;
	}
</style>

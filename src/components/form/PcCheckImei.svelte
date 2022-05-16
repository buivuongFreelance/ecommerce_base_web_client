<script>
	import { _ } from 'svelte-i18n';
	import * as yup from 'yup';
	import { extractError, extractErrors } from '../../functions';
	import { fade } from 'svelte/transition';
	import nodeImei from 'imei';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import { stores } from '@sapper/app';
	import { checkImei as apiCheckImei } from '../../services/device';
	import { auth, infoImei } from '../../stores';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import { onDestroy } from 'svelte';
	import config from '../../config.js';

	const { session } = stores();
	const { domainDevice } = $session;

	export let step = 1;
	export let onSuccess;
	export let onChangeImei;

	let isLoadingImei = false;
	let errors = {};
	let inputEle;
	let values = {
		imei: '',
	};
	$: {
		if (step === 1) {
			if (inputEle) {
				inputEle.focus();
			}
		}
	}
	const validate = async () => {
		try {
			await schema.validateAt('imei', values);
			errors['imei'] = '';
		} catch (error) {
			errors['imei'] = extractError(error, 'imei');
		}
	};

	const schema = yup.object().shape({
		imei: yup
			.string($_('error.string'))
			.required($_('error.required'))
			.nullable(),
		// .min(15, $_('error.equalString', { values: { count: 15 } }))
		// .max(15, $_('error.equalString', { values: { count: 15 } })),
		// .test('checkImei', $_('error.imeiFailed'), (value) => {
		// 	if (value) return nodeImei.isValid(value);
		// 	else return true;
		// }),
	});
	onDestroy(() => {
		infoImei.set('');
	});
	const checkImei = () => {
		isLoadingImei = true;
		let token = '';
		if ($auth) token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiCheckImei(domainDevice, { imei: values.imei, token })
				.then((info) => {
					infoImei.set(info);
					isLoadingImei = false;
					resolve();
				})
				.catch((error) => {
					isLoadingImei = false;

					const { obj } = error.response.data;
					if (obj === 'imei not exist') {
						swal.fire({
							position: 'top',
							icon: 'error',
							title: $_('error.serverErrorTitle'),
							text: $_('error.imeiNotExist'),
							reverseButtons: true,
							customClass: {
								icon: 'icon-error',
							},
						});
					} else {
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

					reject();
				});
		});
	};
	const handleSubmit = async () => {
		try {
			await schema.validate(values, { abortEarly: false });
			infoImei.set({
				model: values.imei,
			});
			// await checkImei();
			onSuccess();
		} catch (error) {
			if (error) {
				errors = extractErrors(error);
			}
		}
	};
</script>

{#if step === 1}
	<form on:submit|preventDefault={handleSubmit} novalidate>
		<div class="w-100 flex flex-column items-center">
			<input
				bind:this={inputEle}
				autocomplete="off"
				class="input-reset bg-light-gray ba br2 pv3 ph4 h-60-px input-imei bw2
					b--light-gray f4 fw5 w-100 tc"
				name="imei"
				class:b--red={errors.imei}
				bind:value={values.imei}
				on:input={validate}
				on:blur={validate}
				placeholder={$_('device.imeiPlaceholder')}
			/>
			{#if errors.imei}
				<div class="red fw6 mt2" transition:fade>{errors.imei}</div>
			{/if}
			{#if isLoadingImei}
				<button
					type="submit"
					class="br2 bg-dark-blue b--dark-blue ba grow ttu white h-60-px fw6 w4
						tracked mt5 pointer mb5"
				>
					<div class="flex w-100 items-center justify-center">
						<LoadingDefault />
					</div>
				</button>
				<slot name="loader" />
			{:else}
				<button
					type="submit"
					class="br2 bg-dark-blue b--dark-blue ba grow ttu white h-60-px fw6 w4
						tracked mt5 pointer"
				>
					{$_('device.getDeviceInformation')}
				</button>
			{/if}
		</div>
	</form>
{:else}
	<input
		autocomplete="off"
		class="b--dashed input-reset bg-light-gray ba br2 pv3 ph4 h-60-px input-imei
			bw2 b--light-gray fw5 w-100 tc"
		name="imei"
		readonly
		bind:value={values.imei}
		placeholder={$_('device.imeiPlaceholder')}
	/>
	<div class="flex justify-center">
		<button
			type="button"
			class="br2 bg-dark-blue b--dark-blue ba grow ttu white h-60-px fw6 w4
				tracked mt5"
			on:click={onChangeImei}
		>
			{$_('imei.changeImei')}
		</button>
	</div>
{/if}

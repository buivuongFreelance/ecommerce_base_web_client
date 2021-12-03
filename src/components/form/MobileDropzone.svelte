<script>
	import { _ } from 'svelte-i18n';
	import ContentLoader from 'svelte-content-loader';
	import { onMount } from 'svelte';
	import 'dropzone/dist/dropzone.css';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import { stores } from '@sapper/app';
	import {
		addDeviceImage as apiAddDeviceImage,
		deleteImage as apiDeleteImage,
		listDeviceImage as apiListDeviceImage,
		deleteDeviceImage as apiDeleteDeviceImage,
	} from '../../services/device';
	import { auth } from '../../stores';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import config from '../../config.js';

	const { session } = stores();
	const { domainUpload, domainDevice } = $session;

	export let id;

	let Dropzone;

	let rootEle;
	let templateEle;
	let myDropzone;
	let isLoadingInit = false;
	let isLoadingDelete = false;
	let isServerError = false;
	let listImages = [];

	onMount(async () => {
		const module = await import('dropzone');
		Dropzone = module.default;
		Dropzone.autoDiscover = false;

		listImages = await listDeviceImage();

		setTimeout(() => {
			initDropzone();
			initPreImages();
		}, 500);
	});

	const initPreImages = () => {
		myDropzone.options.maxFiles =
			myDropzone.options.maxFiles - listImages.length;
	};

	const initDropzone = () => {
		myDropzone = new Dropzone(rootEle, {
			url: domainUpload + 'upload',
			paramName: 'image',
			method: 'post',
			maxFiles: 5,
			resizeQuality: 0.9,
			maxFilesize: 10,
			autoProcessQueue: true,
			thumbnailMethod: 'contain',
			thumbnailWidth: 120,
			thumbnailHeight: 160,
			resizeMethod: 'contain',
			parallelUploads: 1,
			addRemoveLinks: false,
			acceptedFiles: 'image/jpeg,image/png',
			previewTemplate: templateEle.innerHTML,
			error: (file) => {
				myDropzone.removeFile(file);
			},
			success: (file, obj) => {
				const token = $auth.accessToken;
				isLoadingDelete = true;

				apiAddDeviceImage(domainDevice, { token, deviceId: id, url: obj.url })
					.then(() => {
						myDropzone.removeFile(file);
						resetAll();
					})
					.catch(() => {
						const name = obj.url.substring(obj.url.lastIndexOf('/') + 1);
						apiDeleteImage(domainUpload, { url: name })
							.then(() => {
								myDropzone.removeFile(file);
								resetAll();
							})
							.catch(() => {
								myDropzone.removeFile(file);
								resetAll();
							});
					});
			},
		});
	};

	const handleDelete = (item) => {
		isLoadingDelete = true;
		swal
			.fire({
				position: 'top',
				icon: 'question',
				showCancelButton: true,
				reverseButtons: true,
				cancelButtonText: $_('message.no'),
				confirmButtonText: $_('message.yes'),
				customClass: {
					icon: 'icon-question',
				},
				title: $_('message.warning'),
				text: $_('image.askDelete'),
			})
			.then((result) => {
				if (result.value) {
					const token = $auth.accessToken;
					apiDeleteDeviceImage(domainDevice, { token, deviceId: item.id })
						.then(() => {
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
							const name = item.url.substring(item.url.lastIndexOf('/') + 1);
							apiDeleteImage(domainUpload, { url: name })
								.then(() => {
									resetAll();
								})
								.catch(() => {
									resetAll();
								});
						})
						.catch((error) => {
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
							resetAll();
						});
				} else {
					resetAll();
				}
			});
	};

	const resetAll = async () => {
		isLoadingDelete = false;
		listImages = await listDeviceImage();
		initDropzone();
		initPreImages();
	};

	const listDeviceImage = () => {
		isLoadingInit = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiListDeviceImage(domainDevice, {
				token,
				deviceId: id,
			})
				.then((items) => {
					isLoadingInit = false;
					isServerError = false;
					resolve(items);
				})
				.catch(() => {
					isLoadingInit = false;
					isServerError = true;
					reject();
				});
		});
	};
</script>

<div class="custom">
	{#if isServerError}
		<p class="red f4">{$_('error.serverErrorMessage')}</p>
	{:else if isLoadingInit}
		<ContentLoader
			uniqueKey="dropzone"
			primaryColor="#e4e6ef"
			secondaryColor="#f8f8f8"
			width={config.containerDesktop - 30}
			height="200"
		>
			<rect x="0" y="0" rx="3" ry="3" width="100%" height="200" />
		</ContentLoader>
	{:else}
		<div bind:this={rootEle} class="dropzone">
			<div class="dz-message" data-dz-message>
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="170"
						height="170"
						viewBox="0 0 170 170"
					>
						<path fill="none" d="M0 0h170v170H0z" />
						<path
							fill="#b5b5c3"
							d="M137.063 46.783A53.072 53.072 0 0 0 37.9 32.617a42.482 42.482 0 0 0 4.6 84.717h92.083a35.315 35.315 0 0 0 2.479-70.55zm-2.479 56.383H42.5a28.312 28.312 0 0 1-3.117-56.454l7.579-.779L50.5 39.2a38.867 38.867 0 0 1 72.675 10.342l2.125 10.629 10.838.779a21.133 21.133 0 0 1-1.558 42.217zM56.667 67.75h18.062V89h20.542V67.75h18.062L85 39.417z"
							transform="translate(0 24.333)"
						/>
					</svg>
				</div>
				<div class="f4 fw6">{$_('image.dragDrop')}</div>
				<div class="mt3 steel-two ttu">{$_('message.or')}</div>
				<div class="mt3 flex justify-center">
					<div
						class="h-40-px br2 bg-light-gray ba bw2 b--light-gray flex
							items-center justify-center fw6 choose-files"
					>
						{$_('image.chooseFiles')}
					</div>
				</div>
				<div class="mt3 fw6 steel-two">
					{$_('image.maximumMb', { values: { number: 10 } })}
				</div>
			</div>
		</div>
		<div class="mt5 flex flex-wrap justify-center items-center">
			{#if isLoadingDelete}
				<div class="box br2 flex items-center justify-center mr3 relative">
					<LoadingDefault color="#f3f6f9" size={50} />
				</div>
			{:else}
				{#each listImages as item}
					<div
						class="box br2 flex items-center justify-center mr3 mb4 relative"
					>
						<img src={item.url} alt={item.id} class="image" />
						{#if listImages.length > 1}
							<div
								class="close bg-gray flex items-center justify-center"
								on:click={() => handleDelete(item)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="15px"
									viewBox="0 0 24 24"
									fill="#ffffff"
									width="24px"
									><path d="M0 0h24v24H0V0z" fill="none" />
									<path
										d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
									/></svg
								>
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>
<div bind:this={templateEle} class="dn">
	<div class="dz-preview dz-image-preview">
		<div class="dz-image image-wrapper">
			<img class="image" data-dz-thumbnail alt="noname" />
		</div>
		<div class="dz-progress">
			<span class="dz-upload" data-dz-uploadprogress />
		</div>
		<div class="dz-error-message"><span data-dz-errormessage /></div>
		<div class="dz-success-mark">
			<svg
				width="54px"
				height="54px"
				viewBox="0 0 54 54"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
			>
				<title>Check</title>
				<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
					<path
						d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z"
						stroke-opacity="0.198794158"
						stroke="#747474"
						fill-opacity="0.816519475"
						fill="#FFFFFF"
					/>
				</g>
			</svg>
		</div>
		<div class="dz-error-mark">
			<svg
				width="54px"
				height="54px"
				viewBox="0 0 54 54"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
			>
				<title>Error</title>
				<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
					<g
						stroke="#747474"
						stroke-opacity="0.198794158"
						fill="#FFFFFF"
						fill-opacity="0.816519475"
					>
						<path
							d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z"
						/>
					</g>
				</g>
			</svg>
		</div>
	</div>
</div>

<style>
	.custom :global(.dropzone.dz-started .dz-message) {
		display: block !important;
	}
	.dz-message {
		margin-top: 0 !important;
	}
	.custom :global(.dropzone .dz-preview .dz-image) {
		z-index: 1;
	}
	.custom :global(.dropzone .dz-preview .dz-details) {
		z-index: 1;
	}
	.custom :global(.dropzone .dz-preview .dz-progress) {
		z-index: 1;
	}
	.custom :global(.dropzone) {
		border: 2px dashed #e0e6ef;
		border-radius: 10px;
		padding: 0;
	}
	.choose-files {
		width: 162px;
	}
	.box {
		width: 30%;
		height: 130px;
		background-color: #f3f6f9;
		border: 1px solid #e0e6ef;
	}
	.image {
		width: 85%;
		height: 110px;
		object-fit: cover;
	}
	.image-wrapper {
		width: 120px !important;
		height: 160px !important;
		border-radius: 10px !important;
	}
	.close {
		position: absolute;
		top: -10px;
		right: -10px;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		cursor: pointer;
	}
</style>

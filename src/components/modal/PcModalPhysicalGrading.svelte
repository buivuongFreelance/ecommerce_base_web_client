<script>
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import IconClose from '../icon/IconClose.svelte';

	export let onClose;
</script>

<div class="fixed z-max wrapper" transition:fade>
	<div class="modal container">
		<div class="modal__header ph4 bg-light-gray">
			<div class="f4 fw6 ttc">{$_('device.physicalGrading')}</div>
			<div class="pointer flex items-center" on:click={onClose}>
				<IconClose />
			</div>
		</div>
		<div class="modal__body bg-white">
			<table class="table-default table-striped">
				<tr>
					<th>
						{$_('device.grade')}
						<span class="f3">A</span>
					</th>
					<td class="i">{$_('label.gradeADesc')}</td>
				</tr>
				<tr>
					<th>
						{$_('device.grade')}
						<span class="f3">B</span>
					</th>
					<td class="i">{$_('label.gradeBDesc')}</td>
				</tr>
				<tr>
					<th>
						{$_('device.grade')}
						<span class="f3">C</span>
					</th>
					<td class="i">{$_('label.gradeCDesc')}</td>
				</tr>
				<tr>
					<th>
						{$_('device.grade')}
						<span class="f3">D</span>
					</th>
					<td class="i">{$_('label.gradeDDesc')}</td>
				</tr>
			</table>
		</div>
	</div>
</div>

<style>
	.wrapper {
		top: 0;
		left: 0;
		right: 0;
		margin: auto;
		overflow: hidden;
		width: min(90%, 500px);
		padding-top: 60px;
	}

	.modal__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 60px;
		height: 60px;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}

	.modal__body {
		flex-basis: 100%;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}
</style>

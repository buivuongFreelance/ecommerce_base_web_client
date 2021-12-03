<style>
	.page-loader {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: #fff;
		display: block;
		z-index: 99999999;
	}

	.loader span {
		font-family: 'Montserrat', Helvetica, sans-serif;
		position: absolute;
		font-weight: normal;
		top: 52%;
		font-size: 45px;
		letter-spacing: 15px;
		margin-left: -140px;
		left: 50%;
		margin-top: 20px;
		color: #212121;
	}

	/*Preloader 1*/

	.loader-style-1 {
		width: 80px;
		height: 80px;
		line-height: 80px;
		text-align: center;
		font-size: 30px;
		-webkit-transform-style: preserve-3d;
		transform-style: preserve-3d;
		-webkit-transition: -webkit-transform 0.5s 0.1s;
		transition: transform 0.5s 0.1s;
		perspective: 9999px;
		color: #3e3e3e;
		margin: -40px 0 0 -40px;
		margin: 0 auto;
		position: absolute;
		left: 50%;
		margin-left: -37px;
		top: 65px;
		opacity: 1;
	}

	.loader-style-1.panelLoad {
		z-index: 11;
		top: 45%;
		margin-top: -60px;
		-webkit-animation: panel 2.2s infinite forwards;
		animation: panel 2.2s infinite forwards;
	}

	.loader-style-1.panelLoad .cube-face {
		color: black;
		box-shadow: inset 0 0 0 1px #222, 0 0 1px 1px #222;
	}

	.loader-style-1 .cube-face {
		width: inherit;
		height: inherit;
		position: absolute;
		background: white;
		box-shadow: inset 0 0 0 1px #3e3e3e, 0 0 1px 1px #3e3e3e;
		opacity: 1;
		font-family: Arial, Helvetica, sans-serif;
	}

	.loader-style-1 .cube-face-front {
		transform: translate3d(0, 0, 40px);
		-webkit-transform: translate3d(0, 0, 40px);
		font-size: 30px;
	}

	.loader-style-1 .cube-face-back {
		-webkit-transform: rotateY(180deg) translate3d(0, 0, 40px);
		transform: rotateY(180deg) translate3d(0, 0, 40px);
	}

	.loader-style-1 .cube-face-left {
		-webkit-transform: rotateY(-90deg) translate3d(0, 0, 40px);
		transform: rotateY(-90deg) translate3d(0, 0, 40px);
	}

	.loader-style-1 .cube-face-right {
		-webkit-transform: rotateY(90deg) translate3d(0, 0, 40px);
		transform: rotateY(90deg) translate3d(0, 0, 40px);
	}

	.loader-style-1 .cube-face-top {
		-webkit-transform: rotateX(90deg) translate3d(0, 0, 40px);
		transform: rotateX(90deg) translate3d(0, 0, 40px);
	}

	.loader-style-1 .cube-face-bottom {
		-webkit-transform: rotateX(-90deg) translate3d(0, 0, 40px);
		transform: rotateX(-90deg) translate3d(0, 0, 40px);
	}

	@-webkit-keyframes panel {
		0% {
			-webkit-transform: rotateY(0deg) rotateZ(0deg);
		}
		20% {
			-webkit-transform: rotateY(90deg) rotateZ(0deg);
		}
		40% {
			-webkit-transform: rotateX(45deg) rotateZ(45deg);
		}
		60% {
			-webkit-transform: rotateX(90deg) rotateY(180deg) rotateX(90deg);
		}
		80% {
			-webkit-transform: rotateX(310deg) rotateZ(230deg);
		}
		100% {
			-webkit-transform: rotateX(360deg) rotateZ(360deg);
		}
	}

	@keyframes panel {
		0% {
			-webkit-transform: rotateY(0deg) rotateZ(0deg);
			transform: rotateY(0deg) rotateZ(0deg);
		}
		20% {
			-webkit-transform: rotateY(90deg) rotateZ(0deg);
			transform: rotateY(90deg) rotateZ(0deg);
		}
		40% {
			-webkit-transform: rotateX(45deg) rotateZ(45deg);
			transform: rotateX(45deg) rotateZ(45deg);
		}
		60% {
			-webkit-transform: rotateX(90deg) rotateY(180deg) rotateX(90deg);
			transform: rotateX(90deg) rotateY(180deg) rotateX(90deg);
		}
		80% {
			-webkit-transform: rotateX(310deg) rotateZ(230deg);
			transform: rotateX(310deg) rotateZ(230deg);
		}
		100% {
			-webkit-transform: rotateX(360deg) rotateZ(360deg);
			transform: rotateX(360deg) rotateZ(360deg);
		}
	}
</style>

<div class="page-loader">
	<div class="loader">
		<div class="loader-style-1 panelLoad">
			<div class="cube-face cube-face-front">D</div>
			<div class="cube-face cube-face-back">I</div>
			<div class="cube-face cube-face-left">N</div>
			<div class="cube-face cube-face-right">G</div>
			<div class="cube-face cube-face-bottom">T</div>
			<div class="cube-face cube-face-top">O</div>
		</div>
		<span class="cube-face">DINGTOI</span>
	</div>
</div>

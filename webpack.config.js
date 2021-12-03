const webpack = require('webpack');
const WebpackModules = require('webpack-modules');
const path = require('path');
const config = require('sapper/config/webpack.js');
const pkg = require('./package.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const alias = { svelte: path.resolve('node_modules', 'svelte') };
const extensions = ['.mjs', '.js', '.json', '.svelte', '.html'];
const mainFields = ['svelte', 'module', 'browser', 'main'];

module.exports = {
	client: {
		entry: config.client.entry(),
		output: config.client.output(),
		resolve: { alias, extensions, mainFields },
		module: {
			rules: [
				{
					test: /\.(svelte|html)$/,
					use: {
						loader: 'svelte-loader',
						options: {
							dev,
							hydratable: true,
							hotReload: false,
						},
					},
				},
				{
					test: /\.css$/i,
					use: [MiniCssExtractPlugin.loader, 'css-loader'],
				},
				{
					test: /\.svg$/,
					use: ['svg-loader'],
				},
				{
					test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
					use: ['file-loader'],
				},
				{
					test: /\.(gif)$/,
					use: {
						loader: 'file-loader',
						options: {
							name: "[name].[ext]",
            	outputPath: "img",
							esModule: false
						}
					},
				},
				{
					test: /\.(png|woff|woff2|eot|ttf|svg)$/,
					use: ['url-loader?limit=100000'],
				},
			],
		},
		mode,
		plugins: [
			// pending https://github.com/sveltejs/svelte/issues/2377
			// dev && new webpack.HotModuleReplacementPlugin(),
			new MiniCssExtractPlugin(),
			new webpack.DefinePlugin({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode),
			}),
		].filter(Boolean),
		devtool: dev && 'inline-source-map',
	},

	server: {
		entry: config.server.entry(),
		output: config.server.output(),
		target: 'node',
		resolve: { alias, extensions, mainFields },
		externals: Object.keys(pkg.dependencies).concat('encoding'),
		module: {
			rules: [
				{
					test: /\.(svelte|html)$/,
					use: {
						loader: 'svelte-loader',
						options: {
							css: false,
							generate: 'ssr',
							hydratable: true,
							dev,
						},
					},
				},
				{
					test: /\.css$/i,
					use: [MiniCssExtractPlugin.loader, 'css-loader'],
				},
				{
					test: /\.svg$/,
					use: ['svg-loader'],
				},
				{
					test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
					use: ['file-loader'],
				},
				{
					test: /\.(png|woff|woff2|eot|ttf|svg)$/,
					use: ['url-loader?limit=100000'],
				},
			],
		},
		plugins: [new WebpackModules(), new MiniCssExtractPlugin()],
		mode: process.env.NODE_ENV,
		performance: {
			hints: false, // it doesn't matter if server.js is large
		},
	},

	serviceworker: {
		entry: config.serviceworker.entry(),
		output: config.serviceworker.output(),
		mode: process.env.NODE_ENV,
	},

	externals: {
		// only define the dependencies you are NOT using as externals!
		canvg: "canvg",
		html2canvas: "html2canvas",
		dompurify: "dompurify"
	  }
};

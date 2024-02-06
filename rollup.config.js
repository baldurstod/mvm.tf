import nodeResolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';
import styles from 'rollup-plugin-styles';
import json from '@rollup/plugin-json';

const isProduction = process.env.BUILD === 'production';

export default (async () => ({
	input: './src/client/js/application.js',
	output: {
		file: './build/client/js/application.js',
		format: 'esm'
	},
	plugins: [
		styles({
			url: false,
			mode: [
				'inject',
				(varname) => `import { styleInject } from 'harmony-ui';styleInject(${varname});`
			],
		}),
		json({
			compact: true,
		}),
		//image(),
		nodeResolve({
		}),
		isProduction ? terser() : null,
		copy({
			targets: [
				{src: 'src/client/index.html', dest: 'build/client/'},
			]
		}),
	],
}))();

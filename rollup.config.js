import svelte from 'rollup-plugin-svelte';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import svg from 'rollup-plugin-svg';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH

export default {
    input: 'playground/main.js',
    output: {
        file: `playground/bundle.js`,
        format: 'iife',
        name: 'app',
    },
    plugins: [
        svelte({
            include: ['src/**/*.svelte', 'playground/**/*.svelte', 'node_modules/**/src/*.svelte'],
            compilerOptions: {
                dev: !production
            }
        }),
        nodeResolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),
        svg(),
        postcss({
            plugins: []
        }),
        !production && serve('playground'),
        !production && livereload('playground'),
        production && terser()
    ],
    watch: {
		clearScreen: false
	}
}
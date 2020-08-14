const { dest, parallel, series, src, watch } = require('gulp');
const browserSync = require('browser-sync');
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');
const purgecss = require('gulp-purgecss');
const rename = require('gulp-rename');
const run = require('gulp-run');
const sass = require('gulp-sass');
const server = browserSync.create();
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const paths = {
	css: {
		src: ['scss/**/*.scss', '_site/**/*.html'],
	},
	jekyll: {
		src: ['**/*.html', 'css/*.css', 'js/*.js', '!_site/**/*.*'],
	},
	js: {
		src: [
			'node_modules/jquery/dist/jquery.slim.js',
			// 'node_modules/popper.js/dist/umd/popper.js',
			'node_modules/bootstrap/js/dist/util.js',
			// 'node_modules/bootstrap/js/dist/alert.js',
			// 'node_modules/bootstrap/js/dist/button.js',
			// 'node_modules/bootstrap/js/dist/carousel.js',
			'node_modules/bootstrap/js/dist/collapse.js',
			// 'node_modules/bootstrap/js/dist/dropdown.js',
			// 'node_modules/bootstrap/js/dist/modal.js',
			// 'node_modules/bootstrap/js/dist/tooltip.js',
			// 'node_modules/bootstrap/js/dist/popover.js',
			// 'node_modules/bootstrap/js/dist/scrollspy.js',
			// 'node_modules/bootstrap/js/dist/tab.js',
			// 'node_modules/bootstrap/js/dist/toast.js',
			'javascripts/*.js',
		],
	},
	purge: {
		src: ['_site/**/*.html'],
	},
};

const clean = () => del(['_site/**/*']);

function css() {
	return (
		src(['scss/*.scss'])
			.pipe(sourcemaps.init())
			.pipe(sass())
			// .pipe(sass().on('error', sass.logError))
			.pipe(sourcemaps.write())
			.pipe(purgecss({ content: paths.purge.src }))
			.pipe(dest('css/'))
			.pipe(cleanCss())
			.pipe(purgecss({ content: paths.purge.src }))
			.pipe(rename({ suffix: '.min' }))
			.pipe(dest('css/'))
	);
}

function jekyllFull() {
	return src('.')
		.pipe(run('bundle exec jekyll build'))
		.on('error', sass.logError);
}

function jekyll() {
	return src('.')
		.pipe(run('bundle exec jekyll build --incremental'))
		.on('error', sass.logError);
}

function js() {
	return src(paths.js.src)
		.pipe(sourcemaps.init())
		.pipe(concat('site.js'))
		.pipe(uglify({ compress: true }))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('js/'));
}

function reload(done) {
	server.reload();
	done();
}

function serve(done) {
	server.init({
		server: '_site',
		ghostMode: false, // do not mirror clicks, reloads, etc. (performance)
		logFileChanges: true,
		logLevel: 'debug',
		open: false, // do not open the browser
	});
	done();
}

const watchCss = () => watch(paths.css.src + paths.purge.src, { ignoreInitial: false }, series(css));
const watchJs = () => watch(paths.js.src, { ignoreInitial: false }, series(js));
const watchJekyll = () => watch(paths.jekyll.src, series(jekyll, reload));
const dev = series(clean, jekyllFull, css, js, serve, parallel(watchCss, watchJs, watchJekyll));

exports.css = css;
exports.jekyll = series(clean, jekyllFull);
exports.js = js;
exports.default = dev;

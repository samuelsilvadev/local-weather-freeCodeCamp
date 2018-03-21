'use strict';

const runSequence = require('run-sequence');
const gulp = require('gulp');
const sass = require('gulp-sass');
const imageMin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const pump = require('pump');
const clean = require('gulp-clean');
const autoprefixer = require('gulp-autoprefixer');

const _inputFilesScss = './src/sass/**/*.scss';
const _outputFilesCss = './dist/css/';
const _outputFilesFonts = './dist/fonts';

const _inputFilesJs = './src/js/**/*.js';
const _outputFilesJs = './dist/js/';

const _inputImages = './src/imgs/*';
const _outputImages = './dist/imgs/';

gulp.task('sass', () => {
	return gulp
		.src(_inputFilesScss)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(_outputFilesCss))
		.pipe(browserSync.stream());
});

gulp.task('prefixe', () => {
	gulp.src(`${_outputFilesCss}/**/*.css`)
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest(_outputFilesCss));
});

gulp.task('imagemin', () => {
	gulp.src(_inputImages)
		.pipe(imageMin())
		.pipe(gulp.dest(_outputImages))
});

gulp.task('serve', ['sass', 'copy-fonts', 'browserify', 'imagemin'], () => {
	browserSync.init({
		server: {
			baseDir: './'
		}
	});

	gulp.watch(_inputFilesScss, ['sass']);
	gulp.watch(_inputFilesJs, ['browserify']);
	gulp.watch('*.html').on('change', browserSync.reload);
});

gulp.task('browserify', () => {
	return browserify('./src/js/app.js')
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(_outputFilesJs));
});

gulp.task('babel', () =>
	gulp.src(`${_outputFilesJs}/*.js`)
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(gulp.dest(_outputFilesJs))
);

gulp.task('compress', (cb) => {
	pump([
		gulp.src(`${_outputFilesJs}/*.js`),
		uglify(),
		gulp.dest(_outputFilesJs)
	],
	cb
	);
});

gulp.task('clean', () => {
	return gulp.src(`./dist/*`, { read: false })
		.pipe(clean());
});

gulp.task('build:prod', () => {
	runSequence('clean', 'browserify', 'babel', 'compress', 'imagemin', 'copy-fonts', () => { });
});

gulp.task('build:dev', () => {
	runSequence('clean', 'browserify', 'imagemin', 'copy-fonts', () => { });
});

gulp.task('copy-fonts', () => {
	gulp.src('node_modules/font-awesome/fonts/**')
		.pipe(gulp.dest(_outputFilesFonts));

	gulp.src('node_modules/font-awesome/css/**')
		.pipe(gulp.dest(_outputFilesCss));
});

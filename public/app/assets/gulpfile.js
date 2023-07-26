const gulp = require( 'gulp' );
const sass = require( 'gulp-sass' )( require( 'sass' ) );
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const browserSync = require( 'browser-sync' ).create();
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const { parallel } = require('gulp');
const { series } = require('gulp');

/**
 * Compile SCSS
 */
function compileSCSS() {
	return gulp.src( './style.scss')
		.pipe( sourcemaps.init() )
		.pipe( sass() )
		.pipe( concat('./style.css') )
		.pipe( sourcemaps.write('./') )
		.pipe( gulp.dest('./') )
		.pipe( browserSync.stream() );
}

function compressImages() {
	return gulp.src(['./**/*.{jpg,png,jpeg,gif,svg}', '!**/node_modules{,/**}'])
		.pipe( imagemin(
			[
				imagemin.gifsicle(),
				imagemin.mozjpeg(),
				imagemin.optipng(),
				imagemin.svgo({
					plugins: [
						{removeViewBox: true},
						{cleanupIDs: false}
					]
				})
			]
		) )
		.pipe(gulp.dest( './dist' ));
}

function minifyHTML() {
	return gulp.src('./*.html')
		.pipe(htmlmin({
			"collapseWhitespace": true,
			"removeComments": true,
			"removeOptionalTags": true,
			"removeRedundantAttributes": true,
			"removeScriptTypeAttributes": true,
			"minifyCss": true,
			"minifyJs": true
		}))
		.pipe(gulp.dest('./dist'));
}

function minifyJS() {
	return gulp.src('./js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'));
}

// function cssImports() {
//     return gulp.src( './sass/**/*.scss' )
//         .pipe( sass() )
//         .pipe( gulp.dest( './css/imports/' ) );
// }

function minifyCSS() {
    return gulp.src(['./**/*.css', '!**/node_modules{,/**}'])
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist'));
}

function watch() {
	browserSync.init({
		server: {
			baseDir: './'
		}
	});

	gulp.watch( './**/*.scss', compileSCSS );
	gulp.watch( './*.html' ).on( 'change', browserSync.reload );
	gulp.watch( './js/**/*.js' ).on( 'change', browserSync.reload );
}

exports.scsscompile = compileSCSS;
exports.imageminify = compressImages;
exports.htmlminify = minifyHTML;
// exports.cssimports = cssImports;
exports.cssminify = minifyCSS;
exports.jsminify = minifyJS;
exports.minify = parallel(minifyCSS, minifyJS);
exports.watch = watch;

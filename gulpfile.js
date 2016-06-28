var gulp 		 = require('gulp'),
	sass 		 = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	concat 		 = require('gulp-concat'),
	uglifyjs	 = require('gulp-uglifyjs'),
	cssnano		 = require('gulp-cssnano'),
	rename		 = require('gulp-rename'),
	del			 = require('del'),
	imagemin	 = require('gulp-imagemin'),
	pngquant	 = require('imagemin-pngquant'),
	cache		 = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	plumber 	 = require('gulp-plumber');

gulp.task('sass', function() {
	return gulp.src('app/scss/**/*.scss') //'app/scss/**/*.scss' ... 'app/scss/**/*.+(scss|sass)'
	.pipe(plumber())
	.pipe(sass())
	.pipe(cssnano())
	.pipe(autoprefixer(['last 5 versions', '> 1%', 'ie 10'], {cascade: true}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/flexslider/jquery.flexslider-min.js',
		'app/libs/cslide/jquery.cslide.js',
		'app/libs/select2/dist/js/select2.min.js',
		'app/libs/googlemaps/googlemaps.js'
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglifyjs())
	.pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['sass'], function() {
	return gulp.src('app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
			// baseDir: 'dist'
		},
		notify: false
	});
});

gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('clear', function() {
	return cache.clearAll();
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {
	var buildCSS = gulp.src([
		'app/css/main.css', 
		'app/css/libs.min.css'
		]).pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src('app/js/**/*')
		.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('app/*.html')
		.pipe(gulp.dest('dist'));

	var buildJson = gulp.src('app/*.json')
		.pipe(gulp.dest('dist'));

	var buildShowGifForIndex = gulp.src('app/show-gif-for-index/*.+(png|gif)')
		.pipe(gulp.dest('dist/show-gif-for-index'));
});

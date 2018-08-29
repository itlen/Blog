var gulp = require('gulp'),
    bs = require('browser-sync'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    htmlmin = require('gulp-htmlmin'),
	htmlreplace = require('gulp-html-replace'),
	minify = require('gulp-minify'),
	postcss = require('gulp-postcss'),
	stylelint = require('stylelint'),
	config = require('stylelint-config-standard'),
	cssnext = require('postcss-cssnext');
	reporter = require('postcss-browser-reporter'),
	stylefmt = require('gulp-stylefmt')
	clean = require('gulp-clean');


gulp.task('clean', function () {  
    gulp.src('project/src/fix')
        .pipe(clean());
});

gulp.task('clean:build', function () {

	const src = 'project/build/assets,project/build/css,project/build/data,project/build/js,project/build/browserconfig.xml,project/build/index.html,project/build/manifest.json,project/build/sw.js,project/build/.travis.yml';

    gulp.src(src).pipe(clean());

});

gulp.task('lint', function(){
	
	var processors = [
		stylelint({
			failAfterError: false,
			config
		}),
		reporter({
			selector: 'body:before',
			styles: {
				'background-color': 'crimson',
				'background': 'crimson',
      			'max-height': '70vh',
      			'overflow-y': 'scroll',
      			'font-size': '1.4rem',
      			'display': 'none'
      		}
    	})
	];

	gulp.src('project/src/css/*.css')
		// .pipe(stylefmt())
		.pipe(postcss(processors))
		.pipe(gulp.dest('project/src/fix'))
		.pipe(bs.reload({stream:true}));

});

gulp.task('moveAssets', function(){ 
	let filesToMove = [
		'project/src/sw.js',
		'project/src/manifest.json',
		'project/src/browserconfig.xml',
		'project/src/.travis.yml'
	]

    gulp.src('project/src/assets/**/*') 
    .pipe(gulp.dest('project/build/assets')); 

    gulp.src('project/src/data/**/*') 
    .pipe(gulp.dest('project/build/data')); 

    gulp.src(filesToMove)
    .pipe(gulp.dest('project/build')); 

}); 


gulp.task('html', function () {
	gulp.src('project/src/index.html')
        .pipe(rigger())
		.pipe(htmlreplace({
			'css': 'css/build.style.css',
			'js': 'js/main.js',
			'pre': '<link href="css/build.style.css" rel="preload" as="style"><link href="js/build.js" rel="preload" as="script">'
		}))
		// .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('project/build'))
        .pipe(bs.reload({stream:true}));
});

gulp.task('js', function () {
	gulp.src('project/src/js/class.app.js')
	    // .pipe(concat('build.class.app.js'))
	    // .pipe(babel({ presets: ['env'] }))
	    // .pipe(minify())
	    // .pipe(gulp.dest('project/build/js'))
        .pipe(bs.reload({stream:true}));
});



gulp.task('css', function(){
	// const processors = [cssnext, precss];
	const processors = [];
	gulp.src([
			'project/src/css/normalize.css',
			'project/src/css/layout.css',
			'project/src/css/typograph.css',
			'project/src/css/style.css',
			'project/src/css/mobile.css',
			'project/src/css/posts.css'])
		// .pipe(postcss(processors))
		.pipe(concat('build.style.css'))
    	.pipe(autoprefixer({ browsers: ['> 0% in RU'] }))
		.pipe(cssnano())
    	.pipe(gulp.dest('project/build/css'))
    	.pipe(bs.reload({stream:true}));
});

gulp.task('browser-sync', function(){
	bs({
		server: {
			baseDir: 'project/src'
		},
		notify: false
	});
});

gulp.task('watch', ['browser-sync','html','css','js'], function(){
	gulp.watch('project/src/css/*.css',['clean','lint'], function(){}),
	gulp.watch('project/src/*.html', bs.reload({stream:true})),
	gulp.watch('project/src/js/**/*.js', bs.reload({stream:true}));
});

gulp.task('default',['watch'], function(){});

gulp.task('build', ['clean:build','html','js','css','moveAssets'], function(){
	
	console.clear();

	console.log('*******************');
	console.log('gulp build complete');
	console.log('*******************');

	const webpack  = require('webpack');
	const webpackConfig = require('./webpack.config.js');

	webpack(webpackConfig, function(){
		console.log('**********************');
		console.log('webpack build complete');
		console.log('**********************');
	});

	

});

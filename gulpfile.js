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
	babel = require("gulp-babel"),
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
    gulp.src('project/itlen.github.io/assets,project/itlen.github.io/css,project/itlen.github.io/data,project/itlen.github.io/examples,project/itlen.github.io/js,project/itlen.github.io/browserconfig.xml,project/itlen.github.io/index.html,project/itlen.github.io/manifest.json,project/itlen.github.io/sw.js,project/itlen.github.io/.travis.yml')
  	   .pipe(clean());
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
    .pipe(gulp.dest('project/itlen.github.io/assets')); 

    gulp.src('project/src/data/**/*') 
    .pipe(gulp.dest('project/itlen.github.io/data')); 

    gulp.src('project/src/examples/**/*') 
    .pipe(gulp.dest('project/itlen.github.io/examples')); 

    gulp.src(filesToMove)
    .pipe(gulp.dest('project/itlen.github.io')); 

}); 


gulp.task('html', function () {
	gulp.src('project/src/index.html')
        .pipe(rigger())
		.pipe(htmlreplace({
			'css': 'css/build.style.css',
			'js': 'js/build.class.app-min.js',
			'pre': '<link href="css/build.style.css" rel="preload" as="style"><link href="js/build.class.app-min.js" rel="preload" as="script">'
		}))
		.pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('project/itlen.github.io'))
        .pipe(bs.reload({stream:true}));
});

gulp.task('js', function () {
	gulp.src('project/src/js/class.app.js')
	    .pipe(concat('build.class.app.js'))
	    .pipe(babel({ presets: ['env'] }))
	    .pipe(minify())
	    .pipe(gulp.dest('project/itlen.github.io/js'))
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
    	.pipe(gulp.dest('project/itlen.github.io/css'))
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
	console.dir('build is complete');
});

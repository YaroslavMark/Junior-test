var gulp        = require('gulp'),

    sass        = require('gulp-sass'),
    concatCss   = require('gulp-concat-css'),
    jade        = require('gulp-jade'),
    watch       = require('gulp-watch'),
    debug       = require('gulp-debug'),
    plumber     = require('gulp-plumber'),
    livereload  = require('gulp-livereload'),
    tinylr      = require('tiny-lr'),
    cleanCSS    = require('gulp-clean-css'),
    fontAwesome = require('node-font-awesome');

    server      = tinylr();
    path        = require('path');

var paths = {
    source: './src',
    destination: './dist',
    root: '.'
};



gulp.task('sass',function(){
    gulp.src(paths.source+'/sass/**/*.scss')
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(debug(
            {
                title: 'sass compiled :'
            }
        ))
        .pipe(gulp.dest(paths.source+'/css'))
        .pipe(livereload( server ));
});

gulp.task('concatCSS', function(){
   gulp.src(paths.source+'/css/**/*.css')
       .pipe(concatCss("style.css"))
       .pipe(debug(
           {
               title: 'concat css done :'
           }
       ))
       .pipe(gulp.dest(paths.destination+'/css'))
       .pipe( livereload( server ));
});

gulp.task('jade', function() {
    gulp.src(paths.source+'/jade/index.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(debug(
            {
                title: 'jaded :'
            }
        ))
        .pipe(gulp.dest(paths.root))
        .pipe( livereload( server ));
});

gulp.task('minify-css', function() {
    gulp.src(paths.destination+'/css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(cleanCSS({debug:true},function(details){
                debug({
                    title: details.name+': '+details.stats.originalSize,
                    title: details.name+': '+details.stats.minifiedSize
                })
            }
        ))
        .pipe(gulp.dest(paths.destination+'/css'));
});


gulp.task('copy-glyphicon', function() {
    gulp.src('./node_modules/bootstrap-less/fonts/*.*')
        .pipe(gulp.dest(paths.destination+'/fonts'));
});

gulp.task('get-fonts',function(){
    gulp.src(fontAwesome.fonts)
        .pipe(gulp.dest(paths.destination+'/fonts'))
});

gulp.task('copy-font-awesome.min.css',function(){
    gulp.src(fontAwesome.css)
        .pipe(gulp.dest(paths.destination+'/css'));
});

gulp.task('give-fontAwesome', ['get-fonts','copy-font-awesome.min.css']);

gulp.task('watch', function () {
    server.listen(35729, function (err) {
        if (err) {
            return console.log(err);
        }

        gulp.watch(paths.source+'/**/*.scss', ['sass']);

        gulp.watch(paths.source+'/**/*.jade',['jade']);

        gulp.watch(paths.source+'/**/*.css',['concatCSS']);

    });
});

gulp.task('moveSripts',function(){
    gulp.src(paths.source+'/**/script.js',{base: paths.source})
        .pipe(debug(
            {
                title: 'js moved :'
            }
        ))
        .pipe(gulp.dest(paths.destination))
});

gulp.task('default', ['jade','sass','concatCSS','moveSripts','watch']);
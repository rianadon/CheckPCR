var gulp = require('gulp');
var sass;
var libSass = false;
try {
	sass = require('gulp-sass');
	libSass = true;
} catch(e) {
	sass = require('gulp-ruby-sass'); //alternate
}
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');

gulp.task('coffee', function() {
	gulp.src('client.litcoffee')
		.pipe(coffee({bare: true}).on('error', function(err) {gutil.log(err.toString());}))
		.pipe(gulp.dest('./'));
});
gulp.task('sass', function () {
	if(libSass) {
		gulp.src('style.sass')
			.pipe(sass().on('error', sass.logError))
			.pipe(gulp.dest('./'));
	} else {
		sass('style.sass')
			.on('error', sass.logError)
			.pipe(gulp.dest('./'));
	}
});

gulp.task('sass:watch', function () {
	gulp.watch('*.sass', ['sass']);
});
gulp.task('coffee:watch', function() {
	gulp.watch('client.litcoffee', ['coffee']);
});

gulp.task('watch', ['sass:watch', 'coffee:watch']);
gulp.task('default', ['sass', 'coffee']);

var gulp = require('gulp');
var sass;
var libSass = false;
try {
	sass = require('gulp-sass');
	libSass = true;
} catch(e) {
	sass = require('gulp-ruby-sass'); //alternate
}
// var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;

function exec(command, args, log, cb) {
	var child = spawn(command, args, {cwd: process.cwd()});

	child.stdout.setEncoding('utf8');

	child.stdout.on('data', function (data) {
		if(log!==false) gutil.log(data);
	});

	child.stderr.setEncoding('utf8');
	child.stderr.on('data', function (data) {
		gutil.log(gutil.colors.red(data));
		gutil.beep();
	});

	child.on('close', function(code) {
		gutil.log(command+" "+args.join(" ")+" done with exit code", code);
		if(cb) cb();
	});
}

gulp.task('coffee', function() {
	gulp.src(['client.litcoffee', 'welcome.litcoffee'])
		.pipe(coffee({bare: true}).on('error', function(err) {gutil.log(err.toString());}))
		.pipe(gulp.dest('./'));
});
gulp.task('sass', function () {
	if(libSass) {
		gulp.src(['style.sass', 'welcome.sass'], { cwd: 'src'})
			.pipe(sass().on('error', sass.logError))
			.pipe(gulp.dest('./'));
	} else {
		sass('src/style.sass')
			.on('error', sass.logError)
			.pipe(gulp.dest('./build/'));
		sass('src/welcome.sass')
			.on('error', sass.logError)
			.pipe(gulp.dest('./build/'));
	}
});
gulp.task('icon', function () {
	var sizes = [72, 96, 128, 120, 144, 152, 192];
	var smallsizes = [16, 32, 36, 64]
	var favsizes = [16, 32, 64];
	done = 0;
	function callback() {
		done++;
		if(done == sizes.length+smallsizes.length) {
			names = [];
			for(var f=0; f<favsizes.length; f++) {
				names.push("icon_"+favsizes[f]+".png");
			}
			names.push("favicon.ico");
			exec("convert", names, false);
		}
	}
	for(var s=0; s<smallsizes.length; s++) {
		exec("inkscape", ["-z", "-e", "icon/icon_"+smallsizes[s]+".png", "-w", smallsizes[s], "-h", smallsizes[s], "icon_raw/icon_small.svg", ], false, callback);
	}
	for(s=0; s<sizes.length; s++) {
		exec("inkscape", ["-z", "-e", "icon/icon_"+sizes[s]+".png", "-w", sizes[s], "-h", sizes[s], "icon_raw/icon.svg", ], false, callback);
	}
});

gulp.task('sass:watch', function () {
	gulp.watch('*.sass', ['sass']);
});
gulp.task('coffee:watch', function() {
	gulp.watch('*.litcoffee', ['coffee']);
});
gulp.task('icon:watch', function() {
	gulp.watch('icon_raw/icon.svg', ['icon']);
});

gulp.task('watch', ['sass:watch', 'coffee:watch', 'icon:watch']);
gulp.task('default', ['sass', 'coffee', 'icon']);

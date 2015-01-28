var gulp = require('gulp');
var config = require('./buildConfig.json');
var ts = require('gulp-typescript');


var complileTs = function (source, dest) {
    console.log("Source: "+source);
    console.log("Dest: "+dest);
    var tsResult = gulp.src(source).pipe(ts({
                                declarationFiles: true,
                                noExternalResolve: true
                             }));
    tsResult.js.pipe(gulp.dest(dest));
}


gulp.task('copy-index-html', function() {
    gulp.src('./index.html')
    // Perform minification tasks, etc here
    .pipe(gulp.dest('./package'));
});

gulp.task('copy-images', function() {
    gulp.src(config.images.src,{ base: './' })
    // Perform minification tasks, etc here
    .pipe(gulp.dest(config.images.dest));
});

gulp.task('copy-fonts', function() {
    gulp.src(config.fonts.src,{ base: './' })
    // Perform minification tasks, etc here
    .pipe(gulp.dest(config.images.dest));
});

gulp.task('copy-bower-components', function() {
    gulp.src(config.bower_components.src,{ base: './' })
    // Perform minification tasks, etc here
    .pipe(gulp.dest(config.bower_components.dest));
});


gulp.task('build ts', function() {
          complileTs(config.ts.src, config.ts.dest);
    }
);

gulp.task('default', ["build ts", "copy-index-html", "copy-images", "copy-fonts","copy-bower-components"]
);
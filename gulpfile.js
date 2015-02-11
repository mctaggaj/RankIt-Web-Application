var gulp = require('gulp');
var config = require('./buildConfig.json');
var concat = require('gulp-concat');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var ngHtml2Js = require("gulp-ng-html2js");
var watch = require('gulp-watch');
var less = require('gulp-less');


var complileTs = function (source, dest) {
    var tsResult = gulp.src(source)
        .pipe(sourcemaps.init())
        .pipe(ts({
            sortOutput: true
        }));
    return tsResult.js
        .pipe(concat("app.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest));
}


gulp.task('copy-index-html', function() {
    gulp.src('./index.html')
        .pipe(gulp.dest('./package'));
});

gulp.task('html2js', function () {
    gulp.src(config.partials.src)
        .pipe(ngHtml2Js({
            moduleName: "app-partials",
            prefix: "/src/"
        }))
        .pipe(concat("partials.js"))
        .pipe(gulp.dest("package/src"));
})

gulp.task('copy-styles', function() {
    gulp.src(config.styles.src,{ base: './' })
        .pipe(less())
        .pipe(gulp.dest(config.styles.dest));
});

gulp.task('copy-images', function() {
    gulp.src(config.images.src,{ base: './' })
        .pipe(gulp.dest(config.images.dest));
});

gulp.task('copy-fonts', function() {
    gulp.src(config.fonts.src,{ base: './' })
        .pipe(gulp.dest(config.images.dest));
});

gulp.task('copy-bower-components', function() {
    gulp.src(config.bower_components.src,{ base: './' })
        .pipe(gulp.dest(config.bower_components.dest));
});


gulp.task('build-ts', function() {
        complileTs(config.ts.src, config.ts.dest);
    }
);

gulp.task('watch', function () {
    gulp.watch(config.ts.src, ['build-ts']);
    gulp.watch(config.styles.src, ['copy-styles']);
    gulp.watch('./index.html', ['copy-index-html']);
    gulp.watch(config.partials.src, ['html2js']);
});

gulp.task("build", ["build-ts", "copy-index-html", "html2js", "copy-images", "copy-fonts","copy-bower-components", "copy-styles"]);

gulp.task('default', ["build", "watch"]);
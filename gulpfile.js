var gulp = require('gulp');
var config = require('./buildConfig.json');
var concat = require('gulp-concat');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var ngHtml2Js = require("gulp-ng-html2js");
var watch = require('gulp-watch');
var less = require('gulp-less');
var runSequence = require('run-sequence');



gulp.task('copy-index-html', function() {
    return gulp.src('./index.html')
        .pipe(gulp.dest('./package'));
});

gulp.task('html2js', function () {
    return gulp.src(config.partials.src)
        .pipe(ngHtml2Js({
            moduleName: "app-partials",
            prefix: "/src/"
        }))
        .pipe(concat("partials.js"))
        .pipe(gulp.dest("package/src"));
})

gulp.task('copy-styles', function() {
    return gulp.src(config.styles.src,{ base: './' })
        .pipe(less())
        .pipe(gulp.dest(config.styles.dest));
});

gulp.task('copy-images', function() {
    return gulp.src(config.images.src,{ base: './' })
        .pipe(gulp.dest(config.images.dest));
});

gulp.task('copy-fonts', function() {
    return gulp.src(config.fonts.src,{ base: './' })
        .pipe(gulp.dest(config.images.dest));
});

gulp.task('copy-bower-components', function() {
    return gulp.src(config.bower_components.src,{ base: './' })
        .pipe(gulp.dest(config.bower_components.dest));
});


gulp.task('build-ts', function() {
        return gulp.src(config.ts.src)
            .pipe(sourcemaps.init())
            .pipe(ts({
                sortOutput: true
            })).js
            .pipe(concat("app.js"))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(config.ts.dest));
    }
);

gulp.task('watch', function () {
    gulp.watch(config.ts.src, ["deploy"]);
    gulp.watch(config.styles.src, ["deploy"]);
    gulp.watch('./index.html', ["deploy"]);
    gulp.watch(config.partials.src, ["deploy"]);
});

gulp.task("deploy", function () {
    return runSequence("build","deploy-copy");
})

gulp.task("deploy-copy", function () {
    setTimeout(function () {
        console.log("Deploying");
        gulp.src("./package/**/*")
            .pipe(gulp.dest("../restful-api/package/"))
        console.log("Deployed");
    },2000);

})

gulp.task("build", function () {
    return runSequence(["build-ts", "copy-index-html", "html2js", "copy-images", "copy-fonts","copy-bower-components", "copy-styles"]);
});

gulp.task('default', ["deploy", "watch"]);
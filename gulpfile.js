const  gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const jQuery = require('jQuery');


/*---------Server ______*/
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000, /*указываю порт который будет запускать*/
            baseDir: "build" /*куда будет смотреть наш сервер */
        }
    });

    /*Обновление сервера при изменении любых файлов*/
    gulp.watch ('build/**/*').on('change', browserSync.reload); /*указываю путь за какими файлами  мне смотреть и перезапускать сервер */
});

/*______________Pug compile_________*/

gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/template/index.pug')
        .pipe(pug({
            pretty:true
        }))
        .pipe(gulp.dest('build'))
});

/*______________Styles compile_________*/
gulp.task('styles:compile', function () {
    return gulp.src('source/styles/main.scss')
        .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('build/css'));
});


/*_____________js________*/
gulp.task('js', function () {
    return gulp.src([
        'source/js/form.js',
        'source/js/navigation.js',
        'source/js/main.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'));

});

/*______________Sprite_________*/
gulp.task('sprite', function (cb) {
    const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath:'../images/sprite.png',
        cssName: 'sprite.scss'
    }));
    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
});

/*______________Delete________*/
gulp.task('clean', function del(cb) {
    return rimraf('build', cb);
});

/*______________Copy fonts________*/
gulp.task('copy:fonts', function () {
    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
});

/*______________Copy images________*/
gulp.task('copy:images', function () {
    return gulp.src('./source/images/**/*.*')
        .pipe(gulp.dest('build/images'));
});

/*______________Copy________*/
gulp.task('copy', gulp.parallel('copy:fonts','copy:images'));

/*______________Watchers________*/
gulp.task('watch', function () {
    gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
    gulp.watch('source/js/**/*.js', gulp.series('js'));
});

/*______________Default________*/
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile','styles:compile','js','sprite','copy'),
    gulp.parallel('watch','server')
));



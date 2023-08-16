//JS
import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';

//PUG
import pug from 'gulp-pug';

//HTML
import htmlmin from 'gulp-htmlmin';

//SASS
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';


const sass = gulpSass(dartSass);

//CSS
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import autoPrefixer from 'gulp-autoprefixer';

//common
import terser from 'gulp-terser';
import clean from 'gulp-purgecss';
import cacheBust from 'gulp-cache-bust';
import plumber from 'gulp-plumber';

//Optimizador imagenes
import imagemin from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import gifsicle from 'imagemin-gifsicle';
import optipng from 'imagemin-optipng';


//Variables/constantes
const cssPlugin = [
    cssnano(),
    autoPrefixer()
]

const production = false;

gulp.task('views', () => {
    return gulp.src('./src/views/pages/*.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: production ? false : true
        }))
        .pipe(cacheBust({
            type: 'timestamp'
        }))
        .pipe(gulp.dest('./public'))
})

//PRODUCTION
gulp.task('html-min', () => {
    return gulp.src('./src/*.html')
        .pipe(plumber())
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./public'))
})

gulp.task('sass', () => {
    return gulp.src('./src/scss/styles.scss')
        .pipe(plumber())
        .pipe(autoPrefixer())
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        //.pipe(postcss(cssPlugin))
        .pipe(gulp.dest('./public/css'))
})

gulp.task('styles', () => {
    return gulp.src('./src/css/*.css')
        .pipe(plumber())
        .pipe(concat('styles-min.css'))
        .pipe(postcss(cssPlugin))
        .pipe(gulp.dest('./public/css'))
})

gulp.task('clean', () => {
    return gulp.src('./public/css/styles.scss')
        .pipe(clean({
            content: ['./public/*.html']
        }))
        .pipe(postcss(cssPlugin))
        .pipe(gulp.dest('./public/css'))
})

gulp.task('babel', () => {
    return gulp
        .src('./src/js/*.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(terser())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('./public/js'))
})

//MINIMIZAR IMG
gulp.task('imgmin', () => {
    return gulp
        .src('./src/img/*')
        .pipe(imagemin([
            gifsicle({interlaced: true}),
            mozjpeg({quality: 30, progressive: true}),
            optipng({optimizationLevel: 1})
        ]))
        .pipe(gulp.dest('./public/img'))
})


gulp.task('default', () => {
    gulp.watch('./src*.html', gulp.series('html-min'))
    gulp.watch('./src/views/**/*.pug', gulp.series('views'))
    gulp.watch('./src/scss/**/*.scss', gulp.series('sass'))
    gulp.watch('./src/js/*.js', gulp.series('babel'))
})

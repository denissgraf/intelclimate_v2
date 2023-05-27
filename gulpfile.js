let preprocessor = 'scss'; // Выбор препроцессора в проекте - sass или less


const { src, dest, parallel, series, watch } = require('gulp');

const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const scss = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const imagecomp = require('compress-images');
const clean = require('gulp-clean');
const fileinclude = require('gulp-file-include');

function browsersync() {
  browserSync.init({
    server: {baseDir: 'app'},
    notify: false,
    online: false
  })
}

function scripts() {
  return src([ // Берем файлы из источников
    'node_modules/jquery/dist/jquery.min.js', // Пример подключения библиотеки
    'app/js/app.js', // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
  ])
    .pipe(concat('app.min.js')) // Конкатенируем в один файл
    .pipe(uglify()) // Сжимаем JavaScript
    .pipe(dest('app/js/')) // Выгружаем готовый файл в папку назначения
    .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function styles() {
  return src('app/' + preprocessor + '/app.' + preprocessor + '') // Выбираем источник: "app/sass/main.sass" или
  // "app/less/main.less"
    .pipe(eval(preprocessor)()) // Преобразуем значение переменной "preprocessor" в функцию
    .pipe(concat('app.min.css')) // Конкатенируем в файл app.min.js
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
    .pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } )) // Минифицируем стили
    .pipe(dest('app/css/')) // Выгрузим результат в папку "app/css/"
    .pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}


function startwatch() {

  watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
  watch('app/**/' + preprocessor + '/**/*', styles);
  watch(['app/html/*.html', 'app/parts/**/*.html'], joinHtml).on('change', browserSync.reload);
  watch(['app/img/**/*', '!app/images/*'], images);
}


function cleanimg() {
  return src('app/img/dest/', {allowEmpty: true}).pipe(clean()) // Удаляем папку "app/images/dest/"
}

async function images() {
  imagecomp(
    "app/img/**/*", // Берём все изображения из папки источника
    "app/images/", // Выгружаем оптимизированные изображения в папку назначения
    { compress_force: false, statistic: true, autoupdate: true }, false, // Настраиваем основные параметры
    { jpg: { engine: "mozjpeg", command: ["-quality", "75"] } }, // Сжимаем и оптимизируем изображеня
    { png: { engine: "pngquant", command: ["--quality=75-100", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
    function (err, completed) { // Обновляем страницу по завершению
      if (completed === true) {
        browserSync.reload()
      }
    }
  )
}

function joinHtml() {
  return  src([
    'app/html/*.html',
  ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest('app/'))
    .pipe(browserSync.stream())
}



exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.cleanimg = cleanimg;
exports.joinHtml = joinHtml;


exports.default = parallel(styles, scripts, joinHtml, browsersync, startwatch);
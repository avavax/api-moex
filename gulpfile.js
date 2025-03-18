"use strict";

const gulp = require("gulp");
const webpack = require("webpack-stream");
const browserSync = require("browser-sync");

const dist = "./dist/";
const src = "./src/";

// Конфигурация Webpack для разработки
const webpackDevConfig = {
  mode: "development",
  output: {
    filename: "script.js"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", {
                debug: true,
                corejs: "3.33.0",
                useBuiltIns: "usage",
                targets: "> 2%, not dead"
              }]
            ]
          }
        }
      }
    ]
  }
};

// Конфигурация Webpack для продакшена
const webpackProdConfig = {
  ...webpackDevConfig,
  mode: "production",
  devtool: undefined,
  optimization: {
    minimize: true
  }
};

// Копирование HTML
function copyHtml() {
  return gulp.src(`${src}index.html`)
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream());
}

// Сборка JavaScript
function buildJs() {
  return gulp.src(`${src}js/main.js`)
    .pipe(webpack(webpackDevConfig))
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream());
}

// Копирование ассетов
function copyAssets() {
  return gulp.src(`${src}assets/**/*.*`)
    .pipe(gulp.dest(`${dist}/assets`))
    .pipe(browserSync.stream());
}

// Задача для продакшен-сборки JS
function buildProdJs() {
  return gulp.src(`${src}js/main.js`)
    .pipe(webpack(webpackProdConfig))
    .pipe(gulp.dest(dist));
}

// Сервер и наблюдение
function serve() {
  browserSync.init({
    server: dist,
    port: 4000,
    notify: true
  });

  gulp.watch(`${src}index.html`, copyHtml);
  gulp.watch(`${src}assets/**/*.*`, copyAssets);
  gulp.watch(`${src}js/**/*.js`, buildJs);
}

// Основные задачи
const build = gulp.parallel(copyHtml, copyAssets, buildJs);
const buildProd = gulp.parallel(copyHtml, copyAssets, buildProdJs);

// Экспорт задач
exports.html = copyHtml;
exports.assets = copyAssets;
exports.js = buildJs;
exports.prodJs = buildProdJs;
exports.build = build;
exports.buildProd = buildProd;
exports.watch = serve;
exports.default = gulp.series(build, serve);


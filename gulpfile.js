var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var insert = require('gulp-insert'); 
var replace = require('gulp-replace');
var deleteLines = require('gulp-delete-lines');
var ts = require('gulp-typescript');

gulp.task('compile',function(){
    gulp.src(['./src/*.ts','./src/**/*.ts','./src/*.tsx','./src/**/*.tsx'])
        .pipe(concat('./browser.ts'))
        .pipe(deleteLines({
        'filters': [
            /import[\s]+.*?$/i
        ]
        }))
        .pipe(insert.prepend('export namespace StrikeJS {\n'))
        .pipe(insert.prepend("import * as React from 'react';\n"))
        .pipe(insert.prepend("import * as ReactDOM from 'react-dom';\n"))
        .pipe(insert.prepend("import * as Immutable from 'immutable';\n"))
        .pipe(insert.append('\}'))
        .pipe(gulp.dest('./final'));
});

gulp.task('compile-browser',function(){
    gulp.src(['./src/*.ts','./src/**/*.ts','./src/*.tsx','./src/**/*.tsx'])
        .pipe(concat('./browser.ts'))
        .pipe(deleteLines({
        'filters': [
            /import[\s]+.*?$/i
        ]
        }))
        .pipe(replace(/React\./g,'__React.'))
        .pipe(replace(/ReactDOM\./g,'__React.__DOM.'))
        .pipe(insert.prepend('namespace StrikeJS {\n'))
        .pipe(insert.prepend('/// <reference path="../typings/react/react.d.ts" />\n'))
        .pipe(insert.prepend('/// <reference path="../typings/react/react-dom.d.ts" />\n'))
        .pipe(insert.prepend('/// <reference path="../typings/immutable/immutable.d.ts" />\n'))
        .pipe(insert.append('\n}'))
        .pipe(gulp.dest('./final'));
});

gulp.task('transpile-browser',['compile-browser'],function(){
    gulp.src(['./final/browser.ts'])
        .pipe(ts({
            target:"es5",
            sourceMap:true,
            outFile:"browser.js"
        }))
        .pipe(gulp.dest('./final'));
})
var gulp = require('gulp'), 
    rename = require('gulp-rename'),
    webpack = require('gulp-webpack'),
    cp = require('child_process'); 

gulp.task('js',function(){
    let config = require('./webpack.config'); 
    config.output.filename = './dist/strike.js'; 
    gulp.src('./src/StrikeJs.ts')
        .pipe(webpack(config))
        .pipe(gulp.dest('./'));
    
    cp.execSync('webpack --optimize-minimize'); 
        
});
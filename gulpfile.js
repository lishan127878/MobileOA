/*
 * 说明：gulp配置文件
 * 创建人：zwz
 * 创建时间：2017/4/20 15:29
 * 修改人：zwz
 * 修改时间：2017/4/20 15:29
 */

var gulp=require('gulp'),
	Less=require('gulp-less'),
	cleanCSS=require('gulp-clean-css'),
	concat=require('gulp-concat'),
	uglify = require('gulp-uglify');

var assets={
	less:['src/less/app.less','src/less/mixin/*.less','src/less/page/*.less'],
	config:'./src/js/config/*.js',
	page:'./src/js/page/*.js',
	util:'./src/js/util/*.js',
	css:'src/less/page/*.less'
};

function less(){
	gulp.src(assets.css)
		.pipe(Less())
		.pipe(cleanCSS())
		.pipe(gulp.dest('assets/css/page'));
}

function config(){
	gulp.src(assets.config)
		.pipe(concat('config.js'))
		.pipe(uglify())
		.pipe(gulp.dest('assets/js'));	
}

function util(){
	gulp.src(assets.util)
		.pipe(concat('util.js'))
		.pipe(uglify())
		.pipe(gulp.dest('assets/js'));
}

function page(){
	gulp.src(assets.page)
		.pipe(uglify())
		.pipe(gulp.dest('assets/js/page'));	
}

//编译less
gulp.task('less',less);

//压缩合并config
gulp.task('config',config);

//压缩合并util
gulp.task('util',util);

//压缩page js
gulp.task('page',page);

//监听文件变化
gulp.task('watch',function(){
	less();
	config();
	util();
	page();
	//监听config文件修改
	var configWatcher=gulp.watch(assets.config,['config']);
	configWatcher.on('change',function(event){
		 console.log('Config:File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
	//监听util文件修改
	var utilWatcher=gulp.watch(assets.util,['util']);
	utilWatcher.on('change',function(event){
		 console.log('Util:File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
	//监听page文件修改
	var pageWatcher=gulp.watch(assets.page,['page']);
	pageWatcher.on('change',function(event){
		 console.log('Page:File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
	//监听less文件修改
	var lessWatcher=gulp.watch(assets.less,['less']);
	lessWatcher.on('change',function(event){
		 console.log('Less:File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});

//默认任务
gulp.task('default',['less','config','util','page']);





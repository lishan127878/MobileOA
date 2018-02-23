/*
 * 说明：webview工具类
 * 创建人：zwz
 * 创建时间：2017/5/4 21:50
 * 修改人：zwz
 * 修改时间：2017/5/4 21:50
 */
(function(c) {

	c.webviewUtil = {
		
		/*
		 * 切换webview显示
		 * id webview id
		 * animation 切换动画 默认右划 
		 * time 动画时间
		 */
		show: function(id, animation, time, showedCB, extras) {
			var view = plus.webview.getWebviewById(id);
			animation = animation || 'slide-in-right';
			time = time || '350';
			extras = extras || {};
			if(view) {
				var children = view.children();
				view.show(animation, time, showedCB, extras);
				if(children.length && children.length > 0) { //显示第一个子页面
					children[0].show();
				}
			} else { //不存在则创建页面
				var options = c.VIEW_CONFIG[id];
				options.show = {
					aniShow: animation,
					duration: time
				};
				options.waiting = {
					autoShow: false
				};
				options.extras = extras;
				mui.openWindow(options);
			}

		},

		//隐藏webview
		hide: function(id, callBack) {
			var view = plus.webview.getWebviewById(id);
			view && view.hide();
			callBack && callBack();
		},

		/*
		 * 创建webview
		 * views webview参数 可以是一个页面 也可以是多个页面
		 * parent 父页面
		 */
		create: function(views, parent) {
			parent = parent ? plus.webview.getWebviewById(parent) : undefined;
			if(!views.length) { //单个页面
				var view = plus.webview.create(views.url, views.id, views.styles ? views.styles : {});
				if(parent) parent.append(view);
			} else { //多个页面
				for(var i in views) {
					var view = plus.webview.create(views[i].url, views[i].id, views[i].styles ? views[i].styles : {});
//					(function(view){
//						view.addEventListener('loaded',function(){
//							console.log(view.id+' loaded');
//						});
//					})(view);
					if(parent) parent.append(view);
//					view.hide();
				}
			}
		}
	};
}(window));
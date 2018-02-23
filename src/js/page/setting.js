var settingIndex = (function(c, $) {
	//我的设置的点击事件
	function bindEventHandler() {
		//关闭整个app
		document.getElementById('quits').addEventListener('tap', function() {
			//plus.storage.removeItem('userInfo');
			plus.runtime.restart();
		});
		//找开修改登录密码页的监听事件
		document.getElementById('login-pwd').addEventListener('tap', function() {
			webviewUtil.show('setLogin');
		});
		//打开修改手势密码页的监听事件
		document.getElementById('gesture-pwd').addEventListener('tap', function() {
			webviewUtil.show('setGesture');
		});
		document.getElementById('about-info').addEventListener('tap', function() {
			webviewUtil.show('about');
		});

	}
	return {
		init: function() {
			bindEventHandler();

		}
	};

}(window, mui))
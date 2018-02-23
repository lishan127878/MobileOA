var mainList= (function(c, $) {
	//应用页面中部图标点击事件
	function bindEventHandler() {
//	    mui('#pageTo').on('tap','.taps', function() {
//			webviewUtil.show(this.dataset.href, 'none');
//		});
		mui('#list_tab').on('tap','.tab_li', function() {
			webviewUtil.show(this.dataset.href);
		});
	}

	return {
		init: function() {	
			bindEventHandler();

		}
	};
	
}(window, mui))
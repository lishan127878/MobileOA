var vacation = (function(c, $) {
	//待办事项页的点击事件
	function bindEventHandler() {
		mui('#list').on('tap', '.item', function() {
			webviewUtil.show(this.dataset.href, 'none');
		});

	}

	return {
		init: function() {
			bindEventHandler();

		}
	};

}(window, mui))
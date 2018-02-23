var apply = (function(c, $) {
	//待办事项页的点击事件
	function bindEventHandler() {
		mui('#apply-list').on('tap', '.mui-table-view', function() {
			webviewUtil.show(this.dataset.href, 'none');
		});

		mui('#list_tab').on('tap', '.show-content', function() {
			webviewUtil.show(this.dataset.href, 'none');
		});
	}

	return {
		init: function() {
			bindEventHandler();

		}
	};

}(window, mui))
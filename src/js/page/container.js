//把底部导航栏的页面加载进来
var subpages = [window.VIEW_CONFIG.appIndex, window.VIEW_CONFIG.mineIndex, window.VIEW_CONFIG.rosterIndex];
var subpage_style = {
	top: 0,
	bottom: 50
};
var aniShow = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	for(var i = 0; i < 3; i++) {
		var temp = {};
		var sub = plus.webview.create(subpages[i].url, subpages[i].id, subpage_style);
		if(i > 0) {
			sub.hide();
		} else {
			temp[subpages[i]] = "true";
			mui.extend(aniShow, temp);
		}
		self.append(sub);
	}
	var activeTab = subpages[0];
	//选项卡点击事件
	mui('.mui-bar-tab').on('tap', '.mui-tab-item', function(e) {
		var targetTab = this.dataset.href;
		//console.log('======='+targetTab);
		if(targetTab == activeTab) {
			return;
		}
		//显示目标选项卡
		//若为iOS平台或非首次显示，则直接显示
		if(mui.os.ios || aniShow[targetTab]) {
			plus.webview.show(targetTab);
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetTab] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetTab, "fade-in", 300);
		}
		//隐藏当前;
		plus.webview.hide(activeTab);
		//更改当前活跃的选项卡
		activeTab = targetTab;
	});
});
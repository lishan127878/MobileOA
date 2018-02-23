/*
 * 说明：登录页面逻辑
 * 创建人：zwz
 * 创建时间：2017/8/23 13:40
 * 修改人：zwz
 * 修改时间：2017/8/23 13:40
 */

var noticeList = (function(c, $) {
	//公告列表的点击事件
	var nextUrl = "";
	var userInfo;
	var token;
	var vm = new Vue({
		el: '#list-tap',
		data: {
			listData: [],
			picHost: IMAGE_GET_CONFIG
		},
		methods: {},
		filters: {
			moment: function(data) {
				var d = new Date(data);
				return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
			}
		}
	});

	function bindEventHandler() {
		mui('#ul-list').on('tap', '.mui-navigate-right', function() {
			var id = this.dataset.itemid;
			//console.log("id=========="+id);
			webviewUtil.show('noticeDetail', null, null, null, {
				token: token,
				pageid: id
			});
		})
	}

	//获取列表数据
	function getAnnoucementList(token, isRefresh) {
		if(isRefresh) { //下拉刷新
			//console.log(1111);
			c.dataUtil.getAnnoucementList(token, c.API_CONFIG.getAnnoucementList, function(data) {
				//console.log('【公告数据列表】' + JSON.stringify(data));
				mui('#ul-list').pullRefresh().endPulldown(); //结束下拉刷新
				if(data.SystemCode == 1) {
					vm.listData = data.noticeMobileList;
					mui('#ul-list').pullRefresh().refresh(true); //重置上拉加载
					nextUrl = data.nextUrl;
					if(nextUrl == '') { //无下一页数据
						mui('#ul-list').pullRefresh().disablePullupToRefresh(); //禁用上拉
					} else {
						mui('#ul-list').pullRefresh().enablePullupToRefresh(); //启用上拉
						mui('#ul-list').pullRefresh().refresh(true); //重置上拉
					}
				} else {
					mui.toast(ERROR_CONFIG[data.SystemCode]);
					return;
				}
			});
		} else { //上拉加载
			if(nextUrl == "") {
				mui('#ul-list').pullRefresh().disablePullupToRefresh(); //禁用上拉
				return;
			}
			console.log(nextUrl);
			console.log('token====' + token);

			c.dataUtil.getAnnoucementList(token, c.HOST_CONFIG + nextUrl, function(data) {
				//console.log('【公告下一页】==='+JSON.stringify(data));
				if(data.SystemCode == 1) {
					temp = data.noticeMobileList;
					vm.listData = c.formattingDataUtil.getCombineObj(vm.listData, temp);
					nextUrl = data.nextUrl;
					if(nextUrl == "") {
						mui('#ul-list').pullRefresh().endPullupToRefresh(true);
					} else {
						mui('#ul-list').pullRefresh().endPullupToRefresh(false);
					}
				} else {
					mui.toast(ERROR_CONFIG[data.SystemCode]);
					mui('#ul-list').pullRefresh().disablePullupToRefresh();
				}
			});
		}

	}

	return {
		init: function() {
			bindEventHandler();
			userInfo = JSON.parse(plus.storage.getItem('userInfo'));
			//console.log(JSON.stringify(userInfo));
			token = userInfo.token;

		},
		getAnnoucementList: getAnnoucementList
	}
})(window, mui);

var AnnoucementDetail = (function(c, $) {
	var token;
	var noticeId;
	var vm = new Vue({
		el: '#show-content',
		data: {
			listData: [],
			picHost: IMAGE_GET_CONFIG
		},
		methods: {},
		filters: {
			moment: function(data) {
				var d = new Date(data);
				return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
			}
		}
	});
	return {
		init: function() {
			token = plus.webview.currentWebview().token;
			noticeId = plus.webview.currentWebview().pageid;
			//console.log("页面的Id===="+noticeId);
			dataUtil.getAnnoucementDetail(token, noticeId, function(data) {
				//console.log('【公告详情数据】' + JSON.stringify(data));
				if(data.SystemCode == 1) {
					vm.listData = data;
				}

			});
		}
	};
}(window, mui));
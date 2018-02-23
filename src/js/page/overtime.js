//跳转新增页面
var overtimeAdd = (function(c, $) {
	//请假列表中的新增按钮的点击事件
	function bindEventHandler() {
		//关闭整个app
		document.getElementById('addOvertime').addEventListener('tap', function() {
			webviewUtil.show('overtimeFill');
		});
	}
	return {
		init: function() {
			bindEventHandler();
		}
	};

}(window, mui));

//新增休假的页面方法
var overtimeFill = (function(c, $) {
	//新增页面的填写事件
	function bindEventHandler() {
		var userPicker = new mui.PopPicker();
		var leaveType = [{
				value: 1,
				text: '0.5'
			},
			{
				value: 2,
				text: '1'
			},

		];
		//设置数据leaveType
		userPicker.setData(leaveType);
		//请假种类的点击选择事件
		document.getElementById('long').addEventListener('tap', function() {
			userPicker.show(function(SelectedItem) {
				document.getElementById('type').value = SelectedItem[0].text;
				document.getElementById('value').innerText = SelectedItem[0].value;
			});
		}, false);
		//请假开始时间的点击选择事件
		document.getElementById('leavestart').addEventListener('tap', function() {
			//获取选择框里已有的事件字符串
			var time = document.getElementById('start').value;
			if(time != "") {
				//改变时间字符串格式为：2017-11-10 14:15
				value = time.replace(/\//g, "-");
			} else {
				//获取当前时间
				value = moment().utc().zone(-8).format("YYYY-MM-DD HH:mm");
			}
			//时间选择器初始化参数，value格式为YYYY-MM-DD HH:mm
			var options = {
				value: value
			}
			var picker = new mui.DtPicker(options);
			picker.show(function(rs) {
				//time是已经选择的时间
				var time = rs.y.text + "/" + rs.m.text + "/" + rs.d.text + " " + rs.h.text + ":" + rs.i.text;
				//将选择的时间设置上去
				document.getElementById('start').value = time;
				//隐藏时间选择器
				picker.dispose();

			});
		}, false);
		//刷新
		function reflushList() {
			plus.nativeUI.closeWaiting();
			var list = plus.webview.getWebviewById("overtime");
			$.fire(list, 'reflush');
			$.back();
		}
		//加班申请提交按钮的监听事件
		document.getElementById('commit').addEventListener('tap', function() {
			var reason = document.getElementById('explain').value.trim();
			var workStartTime = document.getElementById('start').value;
			workStartTime = workStartTime.replace(/\//g, "-");
			var workTime = document.getElementById('type').value;
			var username = document.getElementById('username').innerText;
			var applyStatus = 1;
			//console.log("加班的说明" + reason);
			//console.log("加班的开始时间" + workStartTime);
			//console.log("加班的天数" + workTime);
			//console.log("加班的人"+ username);
			var userInfo = JSON.parse(plus.storage.getItem('userInfo'));
			var token = userInfo.token;
			if(reason == "" || workStartTime == "" || workTime == "") {
				mui.toast("请完整填写加班数据");
				return;
			}
			//console.log('token==========' + token);
			var btnArray = ['是', '否'];
			mui.confirm('是否确认提交？', "提示", btnArray, function(e) {
				if(e.index == 0) {
					plus.nativeUI.showWaiting("提交中...");
					c.dataUtil.addOvertime(token, workStartTime, workTime, reason, applyStatus, function(data) {
						//console.log("===新增加班数据===" + JSON.stringify(data));
						if(data.SystemCode === 1) {
							mui.toast("提交成功");
							plus.nativeUI.closeWaiting();
							reflushList();
						} else {
							mui.toast(ERROR_CONFIG[data.SystemCode]);
							return;
						}
					}, function() {
						plus.nativeUI.closeWaiting();
						mui.toast('提交失败');
					})

				} else if(e.index == 1) {
					return;
				}
			});

		})

	}
	return {
		init: function() {
			bindEventHandler();
			var userData = JSON.parse(plus.storage.getItem('userData'));
			//console.log('用户信息测试'+userData);
			document.getElementById('username').innerHTML = userData.realName;
			//console.log(typeof userData);
		}
	};

}(window, mui));
//列表页
var overtimeDetail = (function(c, $) {
	//公告列表的vue数据加载
	var nextUrl = "";
	var userInfo;
	var token;
	var vm = new Vue({
		el: '#list_tab',
		data: {
			listData: [],
			picHost: IMAGE_GET_CONFIG
		},
		methods: {},
		filters: {
			moment: function(data) {
				var d = new Date(data);
				return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
			},
			moments: function(data) {
				var d = new Date(data);
				function addZero(res) {
					return res < 10 ? '0' + res : res;
				}
				return d.getFullYear() + '-' + addZero((d.getMonth() + 1)) + '-' + addZero(d.getDate()) + ' ' + addZero(d.getHours()) + ':' + addZero(d.getMinutes()) + ':' + addZero(d.getSeconds());
			}
		}
	});

	function bindEventHandler() {
		mui('#list_tab').on('tap', '.show-content', function() {
			var id = this.dataset.itemid;
			webviewUtil.show('overtimeDetail', null, null, null, {
				token: token,
				pageid: id
			});

		});

	}

	function getOvertimeList(token, isRefresh) {
		if(isRefresh) { //下拉刷新
			//console.log(1111);
			c.dataUtil.getOvertimeList(token, c.API_CONFIG.getOvertimeList, function(data) {
				console.log('【加班数据列表】' + JSON.stringify(data));
				mui('#ul-list').pullRefresh().endPulldown(); //结束下拉刷新
				if(data.SystemCode == 1) {
					vm.listData = data.workMobileList;
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
			//console.log(nextUrl);
			//console.log('token====' + token);
			c.dataUtil.getOvertimeList(token, c.HOST_CONFIG + nextUrl, function(data) {
				//console.log('【加班数据下一页】==='+JSON.stringify(data));
				if(data.SystemCode == 1) {
					temp = data.workMobileList;
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
		getOvertimeList: getOvertimeList
	};

}(window, mui));

//展示加班详情页
var showOvertimeDetail = (function(c, $) {
	var token;
	var OvertimeId;
	var vm = new Vue({//详情的数据加载
		el: '#show-content',
		data: {
			listData: [],
		},
		methods: {},
		filters: {
			moment: function(data) {
				var d = new Date(data);
				return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
			}
		}

	});

	var vmm = new Vue({//审批的数据加载
		el: '#approval',
		data: {
			approvalData: [],
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
			OvertimeId = plus.webview.currentWebview().pageid;
			console.log("页面的Id====" + OvertimeId);
			dataUtil.getOvertimeDetail(token, OvertimeId, function(data) {
				//console.log('【显示加班详情数据】' + JSON.stringify(data));
				if(data.SystemCode == 1) {
					vm.listData = data;
				}

			});

			dataUtil.getApprovalInfo(token, OvertimeId, function(data) {
				//console.log('【显示审批详情数据】' + JSON.stringify(data));
				if(data.applyStatus == 3 || data.applyStatus == 2) {
					mui(".refuse")[0].style.display = "block";
					vmm.approvalData = data;
					//console.log("我是理由" + data.reviewIdea);
					if(data.reviewIdea == "") {
						document.getElementById("idea-container").style.display = "none";
					}
				}

			});
		}
	};
}(window, mui));
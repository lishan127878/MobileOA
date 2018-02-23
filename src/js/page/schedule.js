/*
 * 说明：待办事项页面逻辑
 * 创建人：ls
 * 创建时间：2017/11/8 18:40
 * 修改人：ls
 * 修改时间：2017/11/9 13:40
 */
var nextUrl, userInfo, token;
//待办事项列表对象
var apply = (function(c, $) {

	var vm = new Vue({
		el: '#ul-list',
		data: {
			listData: [],//列表数据
			picHost: IMAGE_GET_CONFIG
		}
	});

	//待办事项页的点击事件
	function bindEventHandler() {

		$('#ul-list').on('tap', '.show-content', function() {
			var flowCode = this.dataset.flow; //类型识别号
			var target = this.dataset.href; //打开的页面标识
			if(target == "FLOW_PURCHASE") {
				target = "purchase";
			} else if(target == "WORK_LIMIT_APPLY") {
				target = "work";
			} else if(target == "FLOW_EXPENSE") {
				target = "expense";
			} else if(target == "FLOW_VACATION") {
				target = "holiday";
			}
			var id = this.dataset.id;
			webviewUtil.show(target, null, null, null, {
				token: token,
				aid: id,
				flowCode: flowCode
			});

		});
	}
	//获取待办列表数据
	function getApproveList(token, isRefresh) {
		if(isRefresh) { //下拉刷新
			c.dataUtil.getListInfo(token, c.API_CONFIG.getApprovelList, function(data) {
				console.log('【待办事项默认数据列表】' + JSON.stringify(data));
				$('#ul-list').pullRefresh().endPulldown(); //结束下拉刷新
				if(data.SystemCode == 1) {
					vm.listData = data.varList;
					if(vm.listData.length == 0) {
						$.toast("暂无记录!");
					}
					$('#ul-list').pullRefresh().refresh(true); //重置上拉加载
					nextUrl = data.nextUrl;
					if(nextUrl == '') { //无下一页数据
						$('#ul-list').pullRefresh().disablePullupToRefresh(); //禁用上拉
					} else {
						$('#ul-list').pullRefresh().enablePullupToRefresh(); //启用上拉
						$('#ul-list').pullRefresh().refresh(true); //重置上拉
					}
				} else {
					$.toast(ERROR_CONFIG[data.SystemCode]);
					return;
				}
			}, function() {

				$.toast("服务器异常，请稍后重试！");

			});
		} else { //上拉加载
			if(nextUrl == "") {
				$('#ul-list').pullRefresh().disablePullupToRefresh(); //禁用上拉
				return;
			}
			c.dataUtil.getListInfo(token, c.HOST_CONFIG + nextUrl, function(data) {
				if(data.SystemCode == 1) {
					temp = data.varList;
					vm.listData = c.formattingDataUtil.getCombineObj(vm.listData, temp);
					nextUrl = data.nextUrl;
					console.log("【待办事项加载数据列表】" + JSON.stringify(vm.listData));
					if(nextUrl == "") {
						$('#ul-list').pullRefresh().endPullupToRefresh(true);
					} else {
						$('#ul-list').pullRefresh().endPullupToRefresh(false);
					}
				} else {
					$.toast(ERROR_CONFIG[data.SystemCode]);
					$('#ul-list').pullRefresh().disablePullupToRefresh();
				}
			});
		}

	}
	return {
		init: function() {
			bindEventHandler();
			token = c.formattingDataUtil.getLoactionTokenInfo();
		},
		getApproveList: getApproveList

	};

}(window, mui));
//待办事项详情对象
var applyDtail = (function(c, $) {
	var vm = new Vue({
		el: '#approve-detail',
		data: {
			detailData: "",//待办详情数据
			otherData: [],//采购物品信息
			historyData: [],//审批记录
			disposeOpinion: "",//操作
			flowCode: "",//待办事项类型
			aid: "",
			detailOuterData: [],//费用报销出差
			detailInsideData: []//费用报销市内
		},
		filters: {
			moment: function(data) {
				var d = new Date(data);
				return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + " " + c.formattingDataUtil.formatTime(d.getHours()) + ":" + c.formattingDataUtil.formatTime(d.getMinutes()) + ":" + c.formattingDataUtil.formatTime(d.getSeconds());
			}
		}
	});

	//待办事项详情数据
	function showApproveDatail(token, id, flowCode) {
		c.dataUtil.getApproveDetail(token, id, flowCode, function(data) {
			console.log("【待办事项详情】:" + JSON.stringify(data));
			if(data.SystemCode == 1) {
				var x = 0,
					y = 0;
				if(purchase = data.FLOW_PURCHASE) {
					vm.detailData = purchase;
					vm.otherData = data.FLOW_PURCHASE_DETAILED;
				} else if(purchase = data.WORK_LIMIT_APPLY) {
					vm.detailData = purchase;
				} else if(purchase = data.FLOW_EXPENSE) {
					vm.detailData = purchase;
					if(data.FLOW_EXPENSE_DETAIL != "" && data.FLOW_EXPENSE_DETAIL != null) {
						vm.detailInsideData = data.FLOW_EXPENSE_DETAIL;
						x = 1;
					}
					if(data.FLOW_EXPENSE_TRAVEL != "" && data.FLOW_EXPENSE_TRAVEL != null) {
						vm.detailOuterData = data.FLOW_EXPENSE_TRAVEL;
						y = 1;
					}
					act = c.formattingDataUtil.isIO(x, y);
					var list = plus.webview.getWebviewById("expense");
					$.fire(list, 'calCost', {
						act: act
					});
				}else if(purchase = data.FLOW_VACATION){
					vm.detailData = purchase;
				}
				vm.historyData = data.INSTANCE;
			} else {
				$.toast(ERROR_CONFIG[data.SystemCode]);
			}

		}, function() {
			$.toast("服务器异常，请稍后重试！");
		});

	}
	//待办事项审核
	function bindEventHandler() {
		$("#btn-group").on('tap', 'button', function() {
			//关闭软键盘
			document.activeElement.blur();
			var auditStatus, opName, taskName, obj, businessId, businessTable, OPERATION_STATE_PASS,exmRslt;
			if(this.dataset.status == "1") {
				opName = "同意";
				OPERATION_STATE = "pass";
			} else {
				opName = "不同意";
				OPERATION_STATE = "reject"
			}
			taskName = document.getElementById("taskName").innerHTML;
			businessTable = document.getElementsByClassName("businessTable");
			auditStatus = document.getElementById("auditStatus").innerHTML;
			switch(taskName) {
				case "采购信息":
					if(auditStatus == "2" && opName == "同意") {
						auditStatus = 3;
					} else if(auditStatus == "2" && opName == "不同意") {
						auditStatus = 4;
					} else {
						auditStatus = 5;
					}
					param = JSON.stringify({
						id: this.dataset.pid,
						auditStatus: auditStatus
					});
					break;
				case "加班信息":
					if(auditStatus == "1" && opName == "同意") {
						auditStatus = 2;
					} else if(auditStatus == "1" && opName == "不同意") {
						auditStatus = 3;
					}
					param = JSON.stringify({
						id: this.dataset.pid,
						applyStatus: auditStatus
					});
				case "费用报销信息":
					if(auditStatus == "0" && opName == "同意") {
						exmRslt = 1;
					} else if(auditStatus == "0" && opName == "不同意") {
						exmRslt = 2;
					}
					param = JSON.stringify({
						id: this.dataset.pid,
						exmRslt: exmRslt
					});
					break;
					case "休假信息":
					if(auditStatus == "2" && opName == "同意") {
						exmRslt = 1;
					} else if(auditStatus == "0" && opName == "不同意") {
						exmRslt = 2;
					}
					param = JSON.stringify({
						id: this.dataset.pid,
						exmRslt: exmRslt
					});
					break;
			}
            
			instance = JSON.stringify({
				id: vm.aid,
				flowCode: vm.flowCode,
				disposeOpinion: vm.disposeOpinion,
				businessId: this.dataset.pid,
				businessTable: businessTable[0].innerHTML
			})

			obj = {
				param: param,
				instance: instance,
				operation: OPERATION_STATE
			};
			var btnArray = ['否', '是'];
			$.confirm('确认' + opName + "?", taskName, btnArray, function(e) {
				if(e.index == 1) {
					plus.nativeUI.showWaiting("审核中...");
					c.dataUtil.getApproveResult(token, obj, function(data) {
						console.log("【待办审核】:" + JSON.stringify(data));
						if(data.SystemCode == 1) {
							plus.nativeUI.closeWaiting();
							$.toast("审核成功!");
							var list = plus.webview.getWebviewById("schedule");
							$.fire(list, 'reflush');
							$.back();
						} else {
							plus.nativeUI.closeWaiting();
							$.toast(ERROR_CONFIG[data.SystemCode]);
							return;
						}

					}, function() {
						$.toast("服务器异常，请稍后重试！");

					});
				}else{
					return;
				}

			})

		});
	}
	return {
		init: function() {
			bindEventHandler();
			token = c.formattingDataUtil.getLoactionTokenInfo();
		},
		showApproveDatail: showApproveDatail,
		vm: vm
	};

}(window, mui));
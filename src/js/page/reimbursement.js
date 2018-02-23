/*
 * 说明：费用报销页面逻辑
 * 创建人：ls
 * 创建时间：2017/11/13 18:40
 * 修改人：ls
 * 修改时间：2017/11/14 13:40
 */
var nextUrl, userInfo, token;
//费用报销申请对象
//var reimbursementApply = (function(c, $) {
//	var vm = new Vue({
//		el: '#applyInfor',
//		data: {
//			departmentName: "",
//			realName: "",
//			dutyName: ""
//		}
//	});
//	//日期处理
//	var btns = $('.btn');
//	btns.each(function(i, btn) {
//		btn.addEventListener('tap', function() {
//			var _self = this;
//
//			if(_self.picker) {
//				_self.picker.show(function(rs) {
//					_self.value = rs.text;
//					_self.picker.dispose();
//					_self.picker = null;
//				});
//			} else {
//				var optionsJson = this.getAttribute('data-options') || '{}';
//				var options = JSON.parse(optionsJson);
//				var id = this.getAttribute('id');
//				_self.picker = new $.DtPicker(options);
//				_self.picker.show(function(rs) {
//
//					_self.value = rs.text;
//
//					_self.picker.dispose();
//					_self.picker = null;
//				});
//			}
//
//		}, false);
//	});
//	//费用报销申请点击事件
//	function bindEventHandler() {
//		var userPicker = new mui.PopPicker();
//		var applyData = [{
//				value: 1,
//				text: '北京金融展'
//			},
//			{
//				value: 2,
//				text: '传媒项目'
//			}
//		];
//		//设置数据applyData
//		userPicker.setData(applyData);
//		showSelectData("select-item", userPicker); //项目名称
//		showSelectData("select-traffic", userPicker); //选择交通
//		showSelectData("select-place", userPicker); //选择出差目的地
//		showSelectData("select-item-second", userPicker); //项目名称
//		showSelectData("select-type", userPicker); //选择报销类型
//
//	};
//
//	//显示默认数据
//	function showSelectData(id, userPicker) {
//		document.getElementById(id).addEventListener('tap', function() {
//			userPicker.show(function(SelectedItem) {
//				if(id == "select-item") {
//					document.getElementById('select-item-option').value = SelectedItem[0].text;
//					//document.getElementById('value').innerText = SelectedItem[0].value;
//				} else if(id == "select-traffic") {
//					document.getElementById('select-traffic-option').value = SelectedItem[0].text;
//				} else if(id == "select-place") {
//					document.getElementById('select-place-option').value = SelectedItem[0].text;
//				} else if(id == "select-item-second") {
//					document.getElementById('select-item-second-option').value = SelectedItem[0].text;
//				} else {
//					document.getElementById('select-type-option').value = SelectedItem[0].text;
//				}
//
//			});
//
//		});
//	};
//	//提交申请
//	function applyReimbursementData(token) {
//
//		var itemOne, itemTwo, checkResOne, checkResTwo;
//		itemOne = document.getElementById("select-item-option").value;
//		itemTwo = document.getElementById("select-item-second-option").value;
//		if(itemOne == "" && itemTwo == "") {
//			$.alert("请选择一个报销项目");
//		} else if(itemOne != "" && itemTwo == "") {
//			checkInputData(".outer-money .checkData");
//		} else if(itemOne == "" && itemTwo != "") {
//			checkInputData(".inner-money .checkData");
//		} else {
//			checkInputData(".checkData");
//		}
//
//		//校验通过，继续执行业务逻辑
//		var username = $("#username").text().trim();
//		var department = $("#department").text().trim();
//
//	}
//	//验证数据
//	function checkInputData(classse) {
//		$(classse).each(function() {
//			//若当前input为空，则alert提醒
//			if(!this.value || this.value == "") {
//				var label = this.previousElementSibling;
//				$.alert(label.innerText.replace(/\*/, "") + "不允许为空");
//				return false;
//			}
//		});
//	}
//
//	return {
//		init: function() {
//			bindEventHandler();
//			token = c.formattingDataUtil.getLoactionTokenInfo();
//			var userData = c.formattingDataUtil.getLoactionUserInfo();
//			vm.departmentName = userData.departmentName;
//			vm.realName = userData.realName;
//			vm.dutyName = userData.dutyName;
//			//提价申请
//			document.getElementById("commit").addEventListener('tap', function() {
//				//关闭软键盘
//				document.activeElement.blur();
//				applyReimbursementData(token);
//			});
//		}
//	};
//
//}(window, mui));
//费用报销列表对象
var reimbursement = (function(c, $) {
	var rstListRenderingObj = new Vue({
		el: "#ul-list",
		data: {
			listInfo: []
		},
		filters: {
			moment: function(data) {
				var d = new Date(data);
				return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + " " + c.formattingDataUtil.formatTime(d.getHours()) + ":" + c.formattingDataUtil.formatTime(d.getMinutes()) + ":" + c.formattingDataUtil.formatTime(d.getSeconds());
			}
		}
	});
	//费用报销详情页的点击事件
	function bindEventHandler() {
		$('#ul-list').on('tap', '.show-content', function() {
			var target = this.dataset.href;
			var id = this.dataset.id;
			c.webviewUtil.show(target, null, null, null, {
				token: token,
				rid: id
			});
		});
	}
	//费用报销列表数据
	function getReimbursementList(token, isRefresh) {
		if(isRefresh) { //下拉刷新
			c.dataUtil.getListInfo(token, c.API_CONFIG.getReimbursementList, function(data) {
				console.log('【费用报销数据列表】' + JSON.stringify(data));
				$('#ul-list').pullRefresh().endPulldown(); //结束下拉刷新
				if(data.SystemCode == 1) {
					rstListRenderingObj.listInfo = data.varList;
					if(rstListRenderingObj.listInfo.length == 0) {
						$.toast("暂无记录!");
					}
					console.log('======' + JSON.stringify(rstListRenderingObj.listInfo));
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
					rstListRenderingObj.listInfo = c.formattingDataUtil.getCombineObj(rstListRenderingObj.listInfo, temp);
					nextUrl = data.nextUrl;
					if(nextUrl == "") {
						$('#ul-list').pullRefresh().endPullupToRefresh(true);
					} else {
						$('#ul-list').pullRefresh().endPullupToRefresh(false);
					}
				} else {
					$.toast(ERROR_CONFIG[data.SystemCode]);
					$('#ul-list').pullRefresh().disablePullupToRefresh();
				}
			},function(){
				$.toast("服务器异常，请稍后重试！");
			});
		}

	}
	return {
		init: function() {
			token = c.formattingDataUtil.getLoactionTokenInfo();
			bindEventHandler();
		},
		getReimbursementList: getReimbursementList

	};

}(window, mui));

//费用报销详情对象
var reimbursementDetail = (function(c, $) {
	var act;
	var rstDetailRenderingObj = new Vue({
		el: '#rstDetailRenderingObj',
		data: {
			detailInsideData: [],
			detailOuterData: [],
			departmentName: "",
			realName: "",
			historyData: null,
			remark: ""
		},
		filters: {
			moment: function(data) {
				var d = new Date(data);
				return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + " " + c.formattingDataUtil.formatTime(d.getHours()) + ":" + c.formattingDataUtil.formatTime(d.getMinutes()) + ":" + c.formattingDataUtil.formatTime(d.getSeconds());
			}
		}
	});
	//费用报销详情
	function getReimbursementDtail(token, id) {
		c.dataUtil.getDetailInfo(token, id,c.API_CONFIG.getReimbursementDetail, function(data) {
			console.log("费用报销详情:" + JSON.stringify(data));
			if(data.SystemCode == 1) {
				var x = 0,
					y = 0;
				if(data.FLOW_EXPENSE_DETAIL != "" && data.FLOW_EXPENSE_DETAIL != null) {
					rstDetailRenderingObj.detailInsideData = data.FLOW_EXPENSE_DETAIL;
					x = 1;
				}
				if(data.FLOW_EXPENSE_TRAVEL != "" && data.FLOW_EXPENSE_TRAVEL != null) {
					rstDetailRenderingObj.detailOuterData = data.FLOW_EXPENSE_TRAVEL;
					y = 1;
				}
				rstDetailRenderingObj.remark = data.FLOW_EXPENSE;
				act = c.formattingDataUtil.isIO(x, y);//判断出差还是市内
				rstDetailRenderingObj.historyData = data.INSTANCE;
				var list = plus.webview.getWebviewById("reimbursementDetail");
				$.fire(list, 'calCost', {
					act: act
				});

			} else {
				$.toast(ERROR_CONFIG[data.SystemCode]);
			}

		}, function() {

			$.toast("服务器异常，请稍后重试！");

		})
	};
	return {
		init: function() {
			token = c.formattingDataUtil.getLoactionTokenInfo();
			c.formattingDataUtil.dealDefaultUserInfo(rstDetailRenderingObj);//申请人信息
		},
		getReimbursementDtail: getReimbursementDtail
	};

}(window, mui));
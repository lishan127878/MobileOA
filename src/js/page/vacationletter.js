/*
 * 说明：休假申请页面逻辑
 * 创建人：ls
 * 创建时间：2017/11/27 14:40
 * 修改人：ls
 * 修改时间：2017/11/27 16:40
 */
//休假申请对象
var nextUrl = "", userInfo, token, appStfId, applyInfo;
var VacatAdd = (function (c, $) {
	var vacationApplyObj = new Vue({
		el: '#vacationApplyObj',
		data: {
			departmentName: "",
			realName: ""
		}
	});
	//请假列表中的新增的点击事件
	function bindEventHandler() {
		var userPicker = new $.PopPicker();
		var leaveType = [{
			value: 1,
			text: '调休'
		},
		{
			value: 2,
			text: '事假'
		},
		{
			value: 3,
			text: '病假'
		},
		{
			value: 4,
			text: '年休假'
		},
		{
			value: 5,
			text: '丧假'
		},
		{
			value: 6,
			text: '婚假'
		},
		{
			value: 7,
			text: '产假'
		},
		{
			value: 8,
			text: '陪产假'
		},
		{
			value: 9,
			text: '工伤假'
		}
		];
		//设置数据leaveType
		userPicker.setData(leaveType);
		var timePicker = new $.PopPicker();
		var dt = ["09:00", "12:00", "13:00", "18:00"];
		timePicker.setData(dt);

		function toDecimal(x) {
			var f = parseFloat(x);
			if (isNaN(f)) {
				return;
			}
			f = Math.round(x * 100) / 100;
			return f;
		}

		//计算时间
		function getHoildayDay() {
			var t = 0;
			var startDate = document.getElementById('start').value;
			var startTime = document.getElementById('st').value;
			var endDate = document.getElementById('end').value;
			var endTime = document.getElementById('et').value;
			var vacationType = document.getElementById('value').innerHTML;
			if (startDate != "" && startTime != "" && endDate != "" && endTime != "" && vacationType != "") {
				var startT = new Date(startDate + " " + startTime);
				var endT = new Date(endDate + " " + endTime);
				var dates = endT.getTime() - startT.getTime();
				if (dates <= 0) {
					$.toast("请选择正确的开始与结束时间");
					document.getElementById('leavedays').value = "0";
					return;
				}
				var res = dates / 1000 / 60 / 60 / 24;
				var TT = toDecimal(res).toString().split('.')[1];
				console.log(TT);
				if (startDate == endDate) {
					switch (Number(TT)) {
						case 38:
							t = 1;
							break;
						case 4:
							t = 0;
							break;
						default:
							t = 0.5;
					}

				}else{
					if(res%1==0){
                      t=res;
					}else{
						switch (Number(TT)) {
							case 38:
							case 96:
								t = 1;
								break;
							case 4:
							case 63:
								t = 0;
								break;
							default:
								t = 0.5;
						}
						t=parseInt(res)+t;
					}
				}
				document.getElementById('leavedays').value = t;
			}
		}
		//请假种类的点击选择事件
		document.getElementById('leavetype').addEventListener('tap', function () {
			userPicker.show(function (SelectedItem) {
				document.getElementById('type').value = SelectedItem[0].text;
				document.getElementById('value').innerText = SelectedItem[0].value;
				var vacationType = SelectedItem[0].value;
				var obj = document.getElementById("showDays");
				if (vacationType == 1) {
					c.dataUtil.getAvailableDays(token, vacationType, appStfId, function (data) {
						if (data.SystemCode == 1) {
							obj.innerHTML = "当前可调休假:" + data.AvailableDays + "天";
						} else {
							return;
						}
					});

				} else {
					obj.innerHTML = "";
				}

			});
		}, false);
		//开始和结束时间选择
		function selectTimer(idOne, idTwo) {
			document.getElementById(idOne).addEventListener('tap', function () {
				timePicker.show(function (SelectedItem) {
					document.getElementById(idTwo).value = SelectedItem;
					getHoildayDay();
				});

			}, false);
		}
		selectTimer("startTime", "st");
		selectTimer("endTime", "et");
		//开始和结束日期选择
		function selectDate(idOne, idTwo) {
			document.getElementById(idOne).addEventListener('tap', function () {
				//获取选择框里已有的事件字符串
				var time = document.getElementById(idTwo).value;
				if (time != "") {
					//改变时间字符串格式为：2017-11-10 14:15
					value = time.replace(/\//g, "-");
				} else {
					//获取当前时间
					value = moment().utc().zone(-8).format("YYYY-MM-DD HH:mm");
				}
				//时间选择器初始化参数，value格式为YYYY-MM-DD HH:mm
				var options = {
					type: 'date',
					value: value
				}
				var picker = new $.DtPicker(options);
				picker.show(function (rs) {
					//time是已经选择的时间
					var time = rs.y.text + "-" + rs.m.text + "-" + rs.d.text;
					//将选择的时间设置上去
					document.getElementById(idTwo).value = time;
					//隐藏时间选择器
					picker.dispose();
					getHoildayDay();
				});
			}, false);
		}
		selectDate("leavestart", "start");
		selectDate("leaveend", "end");

		//刷新
		function reflushList() {
			plus.nativeUI.closeWaiting();
			var list = plus.webview.getWebviewById("vacationLetter");
			$.fire(list, 'reflush');
			$.back();
		}
		//保存或者提交
		function saveOrCommit() {
			document.activeElement.blur();
			var id = document.getElementById('vocationId').innerHTML;//申请id
			var applicantName = document.getElementById('username').innerHTML;//申请人
			var createDepartment = document.getElementById('departmentId').innerHTML;//部门id
			var vacationType = document.getElementById('value').innerHTML;//休假类型
			var beginDate = document.getElementById('start').value;//休假开始日期
			var beginTime = document.getElementById('st').value;//休假开始时间
			var endDate = document.getElementById('end').value;//休假结束日期
			var endTime = document.getElementById('et').value;//休假结束时间
			var trueProjectDays = document.getElementById('leavedays').value;//休假天数
			var remarks = document.getElementById('explain').value.trim();//休假原因
			if (applicantName == "" || createDepartment == "" || remarks == "" || vacationType == "" || beginDate == "" || beginTime == "" || endDate == "" || endTime == "" || trueProjectDays == "") {
				$.toast("请完整填写休假数据");
				return true;
			}
			if (trueProjectDays == "0") {
				$.toast("请选择正确的开始与结束时间");
				return true;
			}
			applyInfo = {
				id: id,
				appStfId: appStfId,
				applicantName: applicantName,
				createDepartment: createDepartment,
				beginDate: beginDate,
				beginTime: beginTime,
				endDate: endDate,
				endTime: endTime,
				remarks: remarks,
				vacationType: vacationType,
				trueProjectDays: trueProjectDays
			};
		}
		//加班申请保存按钮的监听事件
		document.getElementById('save').addEventListener('tap', function () {
			var res=saveOrCommit();
			if(res){
				return;
			}
			plus.nativeUI.showWaiting("保存中...");
			c.dataUtil.addVacationletter(token, JSON.stringify(applyInfo), c.API_CONFIG.addVacationletter, function (data) {
				if (data.SystemCode === 1) {
					plus.nativeUI.closeWaiting();
					$.toast("保存成功");
					reflushList();
				} else {
					$.toast(ERROR_CONFIG[data.SystemCode]);
					return;
				}
			}, function () {
				plus.nativeUI.closeWaiting();
				$.toast('保存失败');
			})



		});
		//加班申请提交按钮的监听事件commit
		document.getElementById('commit').addEventListener('tap', function () {
			var res=saveOrCommit();
			if(res){
				return;
			}
			plus.nativeUI.showWaiting("提交中...");
			c.dataUtil.addVacationletter(token, JSON.stringify(applyInfo), c.API_CONFIG.submitVacationletter, function (data) {
				console.log(JSON.stringify(data));
				if (data.SystemCode === 1) {
					plus.nativeUI.closeWaiting();
					$.toast("提交成功");
					reflushList();
				} else {
					$.toast(ERROR_CONFIG[data.SystemCode]);
					return;
				}

			}, function () {
				plus.nativeUI.closeWaiting();
				$.toast('提交失败');
			});
			//加班申请提交按钮的监听事件

		});
	}
	return {
		init: function () {
			bindEventHandler();
			var userInfo = JSON.parse(plus.storage.getItem('userInfo'));
			token = userInfo.token;
			appStfId = userInfo.userId;
			document.getElementById('departmentId').innerHTML = userInfo.orgId;
			c.formattingDataUtil.dealDefaultUserInfo(vacationApplyObj);//申请人信息
		}
	};

}(window, mui));
//休假申请列表对象
var vacationList = (function (c, $) {
	var vacationListObj = new Vue({
		el: '#list_tab',
		data: {
			listData: []
		},
		filters: {
			moment: function (data) {
				var d = new Date(data);
				return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + " " + c.formattingDataUtil.formatTime(d.getHours()) + ":" + c.formattingDataUtil.formatTime(d.getMinutes()) + ":" + c.formattingDataUtil.formatTime(d.getSeconds());
			}
		}
	});
	//休假申请详情页的点击事件
	function bindEventHandler() {
		$('#list_tab').on('tap', '.show-content', function () {
			var target = this.dataset.href;
			var id = this.dataset.id;
			c.webviewUtil.show(target, null, null, null, {
				token: token,
				hid: id
			});
		});
	}
	//休假申请列表数据
	function getVacationletterList(token, isRefresh) {
		if (isRefresh) { //下拉刷新
			c.dataUtil.getListInfo(token, c.API_CONFIG.getVacationletterList, function (data) {
				console.log('【休假申请数据列表】' + JSON.stringify(data));
				$('#ul-list').pullRefresh().endPulldown(); //结束下拉刷新
				if (data.SystemCode == 1) {
					vacationListObj.listData = data.varList;
					if (vacationListObj.listData.length == 0) {
						$.toast("暂无记录！");
						return;
					}
					$('#ul-list').pullRefresh().refresh(true); //重置上拉加载
					nextUrl = data.nextUrl;
					if (nextUrl == '') { //无下一页数据
						$('#ul-list').pullRefresh().disablePullupToRefresh(); //禁用上拉
					} else {
						$('#ul-list').pullRefresh().enablePullupToRefresh(); //启用上拉
						$('#ul-list').pullRefresh().refresh(true); //重置上拉
					}
				} else {
					$.toast(ERROR_CONFIG[data.SystemCode]);
					return;
				}
			}, function () {
				$.toast("服务器异常，请稍后重试！");
			});
		} else { //上拉加载
			if (nextUrl == "") {
				$('#ul-list').pullRefresh().disablePullupToRefresh(); //禁用上拉
				return;
			}
			var temp = [];
			c.dataUtil.getListInfo(token, c.HOST_CONFIG + nextUrl, function (data) {
				console.log('【休假数据下一页】===' + JSON.stringify(data));
				if (data.SystemCode == 1) {
					if (temp == []) {
						$.toast("请重新上拉加载更多！");
						return;
					}
					temp = data.varList;
					vacationListObj.listData = c.formattingDataUtil.getCombineObj(vacationListObj.listData, temp);
					nextUrl = data.nextUrl;
					if (nextUrl == "") {
						$('#ul-list').pullRefresh().endPullupToRefresh(true);
					} else {
						$('#ul-list').pullRefresh().endPullupToRefresh(false);
					}
				} else {
					$.toast(ERROR_CONFIG[data.SystemCode]);
					$('#ul-list').pullRefresh().disablePullupToRefresh();
				}
			}, function () {
				$.toast("服务器异常，请稍后重试！");
			});
		}

	}

	return {
		init: function () {
			bindEventHandler();
			token = c.formattingDataUtil.getLoactionTokenInfo();
		},
		getVacationletterList: getVacationletterList
	};

}(window, mui));
//休假申请详情对象
var vacationDetail = (function (c, $) {
	var vacationDetailObj = new Vue({
		el: '#vacationDetailObj',
		data: {
			detailData: [],
			departmentName: "",
			realName: "",
			historyData: null
		},
		filters: {
			subs: function (data) {
				return data.substr(0, 16);
			},
			moment: function (data) {
				var d = new Date(data);
				return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + " " + c.formattingDataUtil.formatTime(d.getHours()) + ":" + c.formattingDataUtil.formatTime(d.getMinutes()) + ":" + c.formattingDataUtil.formatTime(d.getSeconds());
			}
		}
	});
	function getVacationletterDetail(token, id) {
		c.dataUtil.getDetailInfo(token, id, c.API_CONFIG.getVacationletterDetail, function (data) {
			console.log("休假详情:" + JSON.stringify(data));
			if (data.SystemCode == 1) {
				vacationDetailObj.detailData = data.FLOW_VACATION;
				vacationDetailObj.historyData = data.INSTANCE;
			} else {
				$.toast(ERROR_CONFIG[data.SystemCode]);
			}

		}, function () {
			$.toast("服务器异常，请稍后重试！");

		})

	}
	return {
		init: function () {
			token = c.formattingDataUtil.getLoactionTokenInfo();
			c.formattingDataUtil.dealDefaultUserInfo(vacationDetailObj);//申请人信息
		},
		getVacationletterDetail: getVacationletterDetail

	}

}(window, mui));
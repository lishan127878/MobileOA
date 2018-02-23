/*
 * 说明：dom工具类
 * 创建人：zwz
 * 创建时间：2017/5/4 21:50
 * 修改人：ls
 * 修改时间：2017/11/17 21:50
 */
(function (c) {
	//时间格式化
	function formatTime(s) {
		return s < 10 ? '0' + s : s;
	}
	//json对象合并
	function getCombineObj(jsonbject1, jsonbject2) {
		var resultJsonObject = {};
		for (var attr in jsonbject1) {
			resultJsonObject[attr] = jsonbject1[attr];
		}
		for (var attr in jsonbject2) {
			resultJsonObject[jsonbject1.length + attr] = jsonbject2[attr];
		}
		return resultJsonObject;
	};
	//获取列表数据
	function getListData(obj, isRefresh) {
		token = getLoactionTokenInfo();
		switch (obj) {
			case "apply":
				apply.getApproveList(token, isRefresh);
				break;
			case "reimbursement":
				reimbursement.getReimbursementList(token, isRefresh);
				break;
			case "vacationList":
				vacationList.getVacationletterList(token, isRefresh);
				break;

		}

	}
	//获取token数据
	function getLoactionTokenInfo() {
		var userInfo = JSON.parse(plus.storage.getItem('userInfo'));
		return userInfo.token;
	}
	//获取用户数据
	function getLoactionUserInfo() {
		return JSON.parse(plus.storage.getItem('userData'));
	}
	//待办事项数据传递
	function transmitTodo() {
		applyDtail.init();
		var self = plus.webview.currentWebview(); //获取当前窗口的WebviewObject对象 
		applyDtail.vm.flowCode = self.flowCode;
		applyDtail.vm.aid = self.aid;
		applyDtail.showApproveDatail(self.token, self.aid, self.flowCode);
	}
	//列表下拉上拉刷新
	function pullRefreshList(obj) {
		mui.init({
			pullRefresh: {
				container: '#ul-list',
				down: {
					style: 'circle',
					offset: '-8px',
					auto: true,
					callback: function () {
						getListData(obj, true);

					}
				},
				up: {
					contentrefresh: "正在加载...",
					contentnomore: '没有更多数据了',
					callback: function () {

						getListData(obj, false);

					}
				}

			}
		});

	}
	//判断市内还是出差
	function isIO(x, y) {
		var act = null;
		if (x == 0 && y == 0) {
			act = {
				inside: "",
				outer: ""
			};
		} else if (x == 0 && y == 1) {
			act = {
				inside: "",
				outer: "outer"
			};
		} else if (x == 1 && y == 0) {
			act = {
				inside: "inside",
				outer: ""
			};
		} else {
			act = {
				inside: "inside",
				outer: "outer"
			};

		}
		return act;
	}
	//计算费用报销出差费用
	function getCost(cs) {
		var outerCost = 0;
		cs.each(function (i, c) {
			t = parseFloat(c.innerHTML);
			outerCost = outerCost + t
		});
		return outerCost;
	}
	//计算费用报销总费用
	function getTotalExpense() {
		document.addEventListener("calCost", function (event) {
			var total, insideCost = 0,
				outerCost = 0;
			if (event.detail.act.inside == "inside") {
				var cs = mui(".icost");
				cs.each(function (i, c) {
					t = parseFloat(c.innerHTML);
					insideCost = insideCost + t
				});
				document.getElementById("insideCost").innerHTML = "合计：" + insideCost;
			}
			if (event.detail.act.outer == "outer") {
				ticketAmount = getCost(mui(".ticketAmount"));
				totalAmount = getCost(mui(".totalAmount"));
				homeamount = getCost(mui(".homeamount"));
				otheramount = getCost(mui(".otheramount"));
				outerCost = ticketAmount + totalAmount + homeamount + otheramount;
				document.getElementById("outerCost").innerHTML = "合计：" + outerCost;
			}

			total = insideCost + outerCost;
			document.getElementById("totalCost").innerHTML = total;
		});

	}
	//刷新列表
	function refreshList(id) {
		c.addEventListener('reflush', function () {
			var flushObj = plus.webview.getWebviewById(id);
			flushObj.reload(true);
		});
	}
	//子页面对象
	function subObj(id) {
		return {
			//将要加载及刷新的页面装载进来
			subpages: [{
				url: id,
				id: id,
				styles: {
					top: '45px',
					bottom: '0px',
				}
			}]
		}
	}
	//处理用户默认信息
	function dealDefaultUserInfo(obj) {
		var userData = getLoactionUserInfo();
		if(userData.departmentName!=undefined){
			obj.departmentName = userData.departmentName;
		}
		if(userData.realName!=undefined){
			obj.realName = userData.realName;
		}
		
		
	}
	//获取当前时间
	function getNowFormatDate() {
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
				+ " " + date.getHours() + seperator2 + date.getMinutes()
				+ seperator2 + date.getSeconds();
		return currentdate;
	}
	c.formattingDataUtil = {
		formatTime: formatTime,
		getCombineObj: getCombineObj,
		getLoactionTokenInfo: getLoactionTokenInfo,
		getLoactionUserInfo: getLoactionUserInfo,
		transmitTodo: transmitTodo,
		pullRefreshList: pullRefreshList,
		getTotalExpense: getTotalExpense,
		isIO: isIO,
		refreshList: refreshList,
		subObj: subObj,
		dealDefaultUserInfo:dealDefaultUserInfo,
		getNowFormatDate:getNowFormatDate
	};
}(window));
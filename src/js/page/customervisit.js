var visitAdd = (function(c, $) { //客户拜访日计划列表页
	var pid = "";
	var wid = "";
	var vm = new Vue({
		el: '#visitInfo',
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

	function getPlanList(token, isRefresh) {
		if(isRefresh) { //下拉刷新
			//console.log(1111);
			c.dataUtil.getPlanList(token, c.API_CONFIG.getPlanList, function(data) {
				//console.log('【加班数据列表】' + JSON.stringify(data));
				mui('#ul-list').pullRefresh().endPulldown(); //结束下拉刷新
				if(data.data.SystemCode == 10001) {
					//console.log("8888");
					document.getElementById("workList").innerHTML = '';
					//mui.toast("你没有拜访计划");
					document.getElementById('quit').style.display = "none";
				}
				if(data.data.SystemCode == 1) {
					var inputs = document.getElementById("workList").getElementsByTagName("input");
					for(var m = 0; m < inputs.length; m++) {
						inputs[m].checked = false;
					}
					vm.listData = data.data.planList;
					document.getElementById('quit').style.display = "block";
					mui('#ul-list').pullRefresh().refresh(true); //重置上拉加载
					nextUrl = data.data.nextUrl;
					if(nextUrl == '') { //无下一页数据
						mui('#ul-list').pullRefresh().disablePullupToRefresh(); //禁用上拉
					} else {
						mui('#ul-list').pullRefresh().enablePullupToRefresh(); //启用上拉
						mui('#ul-list').pullRefresh().refresh(true); //重置上拉
					}
				} else {
					mui.toast(ERROR_CONFIG[data.data.SystemCode]);
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
			c.dataUtil.getPlanList(token, c.HOST_CONFIG + nextUrl, function(data) {
				//console.log('【加班数据下一页】===' + JSON.stringify(data));
				if(data.data.SystemCode == 10001) {
					//console.log("8888");
					document.getElementById("workList").innerHTML = '';
					//mui.toast("你没有拜访计划");
					document.getElementById('quit').style.display = "none";
				}
				if(data.data.SystemCode == 1) {
					document.getElementById('quit').style.display = "block";
					var inputs = document.getElementById("workList").getElementsByTagName("input");
					for(var m = 0; m < inputs.length; m++) {
						inputs[m].checked = false;
					}
					temp = data.data.planList;;
					vm.listData = c.formattingDataUtil.getCombineObj(vm.listData, temp);
					nextUrl = data.data.nextUrl;

					if(nextUrl == "") {
						mui('#ul-list').pullRefresh().endPullupToRefresh(true);
					} else {
						mui('#ul-list').pullRefresh().endPullupToRefresh(false);
					}
				} else {
					mui.toast(ERROR_CONFIG[data.data.SystemCode]);
					mui('#ul-list').pullRefresh().disablePullupToRefresh();
				}
			});
		}

	}

	//计划列表中的事件集合
	function bindEventHandler() {
		mui('#ul-list').on('tap', '#followSpan', function() {
			var id = this.dataset.itemid;
			//console.log("显示计划ID" + id);
			webviewUtil.show('visitFollow', null, null, null, {
				token: token,
				pageid: id
			});
		});
		//计划提交按钮的监听事件
		document.getElementById('commitBtn').addEventListener('tap', function() {
			var stus = document.getElementById("workList").getElementsByTagName("input");
			var count = 0;
			for(var m = 0; m < stus.length; m++) {
				if(stus[m].checked) {
					count++;
				}
			}
			if(count == 0) { //提交时一定至少点一条
				mui.toast("请选择提交的计划");
				return;
			}
			var ids = [];
			var inputs = document.getElementById("workList").getElementsByTagName("input");
			var userInfo = JSON.parse(plus.storage.getItem('userInfo'));
			var token = userInfo.token;
			for(var i = 0; i < inputs.length; i++) {
				if(inputs[i].checked == true) {
					var planId = inputs[i].dataset.itemid;
					ids.push(planId);
				}

			}
			ids = ids.join(",");

			var Ids = {
				ids: ids
			}
			c.dataUtil.visitPlanSubmit(token, Ids, function(data) {
				console.log('【提交数据是否成功接口】' + JSON.stringify(data));
				if(data.success == true) {
					for(var n = 0; n < inputs.length; n++) {
						inputs[n].checked = false;
					}
					mui.toast("提交成功");
					getPlanList(token, true);

				}

			})

		}, false);
		//变更按钮的监听事件
		document.getElementById("followBtn").addEventListener('tap', function() {
			var stus = document.getElementById("workList").getElementsByTagName("input");
			var count = 0;
			for(var m = 0; m < stus.length; m++) {
				if(stus[m].checked) {
					pid = stus[m].dataset.itemid;
					wid = stus[m].dataset.itemweekid;
					count++;
				}

			}
			//判断变更的条数不可以没有和大于二条
			if(count >= 2 || count == 0) {
				mui.toast("选择一个更改的计划");
				return;
			}
			//console.log("每周计划的" + wid);
			//console.log("每个计划的" + pid );
			webviewUtil.show('visitChange', null, null, null, {
				token: token,
				pid: pid,
				wid: wid
			});
		})
		//变更完刷新页面
		window.addEventListener("changeSuccessRefresh", function(e) {
			document.getElementById("workList").innerHTML == null;
			userInfo = JSON.parse(plus.storage.getItem('userInfo'));
			token = userInfo.token;
			getPlanList(token, true);

		})

	}

	return {
		init: function() {
			bindEventHandler();
			userInfo = JSON.parse(plus.storage.getItem('userInfo'));
			token = userInfo.token;

		},
		getPlanList: getPlanList

	};

}(window, mui));

var visitFollow = (function(c, $) { //计划详情页与跟进列表展示
	var token;
	var vm = new Vue({
		el: '#container',
		data: {
			listData: [],
			followData: [],

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
		//详情页的下放打开跟进填写页面的按钮
		document.getElementById('commit').addEventListener('tap', function() {
			//			var id= mui(".showplanId")[0].innerHTML;
			var id = mui(".show-pid")[0].innerHTML;
			//console.log("我要传到跟进填写页面的计划ID" + id);
			webviewUtil.show('visitFollowFill', null, null, null, {
				token: token,
				pageid: id
			});

		});
		//跟进填写完之后重新刷新页面
		window.addEventListener("followSuccessRefresh", function(e) {
			document.getElementById("checkInfo").innerHTML == null;
			dataUtil.getPlanDetail(token, planId, function(data) {
				//console.log('【刷新跟进成功的数据】' + JSON.stringify(data));
				if(data.data.SystemCode == 1) {
					vm.listData = data.data.followUpMobile;
					if(data.data.followUpMobile.followUpMobileList) {
						mui(".info")[0].style.display = "block";
						vm.followData = data.data.followUpMobile.followUpMobileList;
					}

				}
			});

		})
	}
	return {
		init: function() {
			bindEventHandler();
			token = plus.webview.currentWebview().token;
			planId = plus.webview.currentWebview().pageid;
			//console.log("页面的Id===="+noticeId);
			dataUtil.getPlanDetail(token, planId, function(data) {
				console.log('【客户拜访详情数据】' + JSON.stringify(data));
				if(data.data.SystemCode == 1) {
					vm.listData = data.data.followUpMobile;
					if(data.data.followUpMobile.followUpMobileList) {
						mui(".info")[0].style.display = "block";
						vm.followData = data.data.followUpMobile.followUpMobileList;
					}

				}
			});
		},

	};

}(window, mui));

var visitFill = (function(c, $) { //跟进填写
	//绑定事件
	function bindEventHandler() {
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
				var time = rs.y.text + "/" + rs.m.text + "/" + rs.d.text;
				//将选择的时间设置上去
				document.getElementById('start').value = time;
				//隐藏时间选择器
				picker.dispose();

			});
		}, false);
		//获得所在位置的按钮点击
		document.getElementById("positionBtn").addEventListener('tap', function() {
			plus.geolocation.getCurrentPosition(function(p) {
				var userInfo = JSON.parse(plus.storage.getItem('userInfo'));
				var token = userInfo.token;
				longitude = p.coords.longitude;
				latitude = p.coords.latitude;
				c.dataUtil.getVisitPosition(token, longitude, latitude, function(data) {
					console.log("得到位置信息===" + JSON.stringify(data))
					if(data.success == true) {
						document.getElementById("positionInfo").value = data.data;
					} else {
						plus.nativeUI.closeWaiting();
						mui.toast("获取位置出错");
						return;
					}
				})
				//mui.alert('Geolocation\nLatitude:' + p.coords.latitude + '\nLongitude:' + p.coords.longitude);
			}, function(e) {
				mui.alert('获取位置错误信息' + e.message);
			});
		})
		//提交按钮的监听事件

		/* 拍照 */
		document.getElementById('usecamera').addEventListener('tap', function() {
			getImage(); /*拍照*/
		});
		//选择图片
		document.getElementById('usegallery').addEventListener('tap', function() {
			galleryImg(); /*打开相册*/
		});

		//拍照 
		function getImage() {
			var cmr = plus.camera.getCamera();
			cmr.captureImage(function(e) {
				plus.io.resolveLocalFileSystemURL(e, function(entry) {
					var path = entry.toLocalURL();
					zipImg(path); /*压缩图片*/
				});
			});
		}

		//本地相册选择 
		function galleryImg() {
			plus.gallery.pick(function(e) {
				zipImg(e); /*压缩图片*/
			}, function(e) {}, {
				filter: "image"
			});
		}

		//压缩图片
		function zipImg(path) {
			plus.zip.compressImage({
				src: path,
				dst: "_downloads/camera/" + path.substring(path.lastIndexOf('/')),
				overwrite: true,
				quality: 20
			}, function(event) {
				picPath = event.target;
				console.log('【===压缩后图片本地地址===】' + picPath);

				document.getElementById('picShow').innerHTML = '<img id="iconRemove" class="icon-remove" src="../../assets/images/visit/cancel.png" /><img class="circle-photo-item" src="' +
					event.target + '" />';
				//删除图片
				document.getElementById('iconRemove').addEventListener('tap', function() {
					picPath = '';
					document.getElementById('picShow').innerHTML = '';
				});
			}, function() {
				plus.nativeUI.toast('图片压缩失败');
			});
		}
		//更进提交数据按钮监听
		document.getElementById('commitfollow').addEventListener('tap', function() {
			var planId = plus.webview.currentWebview().pageid
			var followupContent = document.getElementById('explain').value.trim();
			var followupVisitTime = document.getElementById('start').value;
			followupVisitTime = followupVisitTime.replace(/\//g, "-");
			var locationId = document.getElementById('positionInfo').value;
			var userInfo = JSON.parse(plus.storage.getItem('userInfo'));
			var token = userInfo.token;
			if(followupContent == "" || followupVisitTime == "" || locationId == "") {
				mui.toast("请完整填写数据");
				return;
			}
			c.methodUtil.uploadImage(picPath, function(res) {
				photoId = res.pk;
				console.log("客户拜访的图片上传的id" + photoId);
			})

			//console.log('token==========' + token);
			var btnArray = ['是', '否'];
			mui.confirm('是否确认提交？', "提示", btnArray, function(e) {
				if(e.index == 0) {
					plus.nativeUI.showWaiting("提交中...");
					c.dataUtil.visitPlanFollowSubmit(token, planId, followupVisitTime, followupContent, photoId, locationId, longitude, latitude, function(data) {
						console.log("===新增加班数据===" + JSON.stringify(data));
						if(data.success === true) {
							mui.toast("提交成功");
							plus.nativeUI.closeWaiting();
							var self = plus.webview.currentWebview();
							var opener = self.opener();
							mui.fire(opener, "followSuccessRefresh");
							mui.back();
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
			var token = plus.webview.currentWebview().token;
			var planId = plus.webview.currentWebview().pageid;
			bindEventHandler();
		}
	}
})(window, mui);

//客户拜访变更
var visitChange = (function(c, $) {
	var customerNum = "";
	var customerStaff = "";
	var token = "";
	//绑定事件
	function bindEventHandler() {
		//开结时间的选择器
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
				var time = rs.y.text + "-" + rs.m.text + "-" + rs.d.text + " " + rs.h.text + ":" + rs.i.text;
				//将选择的时间设置上去
				document.getElementById('start').value = time;
				//隐藏时间选择器
				picker.dispose();

			});
		}, false);
		//结束时间的点击选择事件
		document.getElementById('leaveend').addEventListener('tap', function() {
			//获取选择框里已有的事件字符串
			var time = document.getElementById('end').value;
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
				var time = rs.y.text + "-" + rs.m.text + "-" + rs.d.text + " " + rs.h.text + ":" + rs.i.text;
				//将选择的时间设置上去
				document.getElementById('end').value = time;
				//隐藏时间选择器
				picker.dispose();

			});
		}, false);
		//获取被访组织
		document.getElementById("mechanism").addEventListener("tap", function() {
			document.getElementById('personnelInput').value = "";
			//console.log("1111");
			var userInfo = JSON.parse(plus.storage.getItem('userInfo'));
			token = userInfo.token;
			var userPicker = new mui.PopPicker();
			var customerData = [];
			c.dataUtil.getVisitCustomerList(token, function(data) {
				console.log("===机构数据加载===" + JSON.stringify(data.data.customerList));
				if(data.data.SystemCode === 1) {
					for(var i = 0; i < data.data.customerList.length; i++) {
						customerData.push({
							value: data.data.customerList[i].customerNum,
							text: data.data.customerList[i].customerName
						})
					}
					//console.log("hehehe"+customerData.length);
					userPicker.setData(customerData);
				}
			}, function() {
				plus.nativeUI.closeWaiting();
				mui.toast('加载失败');
			})
			userPicker.show(function(SelectedItem) {
				document.getElementById('mechanismInput').value = SelectedItem[0].text;
				customerNum = SelectedItem[0].value;
				//console.log("组织的key值" + customerNum);
			});
		})
		//被访人数据加载
		document.getElementById("personnel").addEventListener('tap', function() {
			if(document.getElementById('mechanismInput').value == "") {
				mui.toast("请先选择被访组织");
				return;
			}
			var userPicker = new mui.PopPicker();
			var personnelData = [];
			c.dataUtil.getVisitCustomerPersonList(token, customerNum, function(data) {
				//console.log("===被访数据加载===" + JSON.stringify(data.data.customerPersonList));
				if(data.data.SystemCode === 1) {
					for(var i = 0; i < data.data.customerPersonList.length; i++) {
						personnelData.push({
							value: data.data.customerPersonList[i].customerPersonId,
							text: data.data.customerPersonList[i].customerPersonName
						})
					}
					userPicker.setData(personnelData);
				}
			}, function() {
				plus.nativeUI.closeWaiting();
				mui.toast('加载失败');
			})
			userPicker.show(function(SelectedItem) {
				document.getElementById('personnelInput').value = SelectedItem[0].text;
				customerStaff = SelectedItem[0].value;
				//console.log("人Id" + customerStaff);
			});

		})
		//变更最后提交按钮监听
		document.getElementById("commit").addEventListener('tap', function() {
			var planId = plus.webview.currentWebview().pid;
			var weekPlanId = plus.webview.currentWebview().wid;
			var planContent = document.getElementById('explain').value.trim();
			var startDate = document.getElementById('start').value;
			var endDate = document.getElementById('end').value;
			if(customerNum == "" || customerStaff == "" || startDate == "" || endDate == "" || planContent == "") {
				mui.toast("请完整填写您要变更的内容");
				return;
			}
			var btnArray = ['是', '否'];
			mui.confirm('是否确认提交？', "提示", btnArray, function(e) {
				if(e.index == 0) {
					plus.nativeUI.showWaiting("提交中...");
					c.dataUtil.visitPlanChange(token, planId, customerNum, customerStaff, startDate, endDate, planContent, weekPlanId, function(data) {
						console.log("===计划变更数据111===" + JSON.stringify(data));
						if(data.success === true) {
							mui.toast("变更成功");
							plus.nativeUI.closeWaiting();
							var self = plus.webview.currentWebview();
							var opener = self.opener();
							mui.fire(opener, "changeSuccessRefresh");
							mui.back();
						} else {
							mui.toast(ERROR_CONFIG[data.SystemCode]);
							return;
						}
					}, function() {
						plus.nativeUI.closeWaiting();
						mui.toast('变更失败');
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

		}
	}
})(window, mui);
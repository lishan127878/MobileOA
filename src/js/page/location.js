var getLocation = (function(c, $) {
	var vm = new Vue({
		el: '#checkInfo',
		data: {
			listData: [],
		},
		methods: {},
		filters: {
			moment: function(data) {
				var d = new Date(data);

				function addZero(res) {
					return res < 10 ? '0' + res : res;
				}
				return d.getFullYear() + '-' + addZero((d.getMonth() + 1)) + '-' + addZero(d.getDate()) + ' ' + addZero(d.getHours()) + ':' + addZero(d.getMinutes()) + ':' + addZero(d.getSeconds());
			}
		}
	});
	//猎取位置的点击事件
	function bindEventHandler() {

		plus.geolocation.getCurrentPosition(function(p) {
			//创建Map实例
			var Longitude = p.coords.longitude;
			var Latitude = p.coords.latitude;
			var map = new BMap.Map("container");
			var point = new BMap.Point(Longitude, Latitude);
			map.centerAndZoom(point, 15);
			//添加鼠标滚动缩放
			map.enableScrollWheelZoom();
			//添加缩略图控件
			//			map.addControl(new BMap.OverviewMapControl({
			//				isOpen: false,
			//				anchor: BMAP_ANCHOR_BOTTOM_RIGHT
			//			}));
			//添加缩放平移控件
			//map.addControl(new BMap.NavigationControl());
			//添加比例尺控件
			//map.addControl(new BMap.ScaleControl());
			//设置标注的图标
			var icon = new BMap.Icon("../../assets/images/attendance/position.png", new BMap.Size(70, 70));
			//设置标注的经纬度
			var marker = new BMap.Marker(new BMap.Point(Longitude, Latitude), {
				icon: icon
			});
			//把标注添加到地图上
			map.addOverlay(marker);

		}, function(e) {
			//mui.alert('获取位置错误信息' + e.message);
		});

		document.getElementById('getLocation').addEventListener('tap', handleCheckIn);
	}

	function handleCheckIn() {
		plus.geolocation.getCurrentPosition(function(p) {
			var userInfo = JSON.parse(plus.storage.getItem('userInfo'));
			var token = userInfo.token;
			var longitude = p.coords.longitude;
			var laititude = p.coords.latitude;
			//console.log("我的经度是===" + longitude);
			//console.log("我的纬度是===" + laititude);
			c.dataUtil.getLocation(token, longitude, laititude, function(data) {

				if(data.SystemCode == 1) {
					mui.toast("打卡成功");
					document.getElementById('getLocation').removeEventListener("tap", handleCheckIn);
					document.getElementById('getLocation').innerHTML = "已打卡";
					document.getElementById('getLocation').style.background = "#ccc";
					c.dataUtil.getLocationInfo(token, function(data) {
						if(data.SystemCode == 1) {
							//console.log("打卡信息显示===" + JSON.stringify(data.clockList));
							mui(".info")[0].style.display = "block";
							vm.listData = data.clockList;
							//console.log(vm.listData);
						}
					})

				} else {
					mui.toast("打卡失败");
				}
			})
			//mui.alert('Geolocation\nLatitude:' + p.coords.latitude + '\nLongitude:' + p.coords.longitude);
		}, function(e) {
			mui.alert('获取位置错误信息' + e.message);
		});
	}

	return {
		init: function() {
			if(window.screen.height > 700 && window.screen.height < 740) {
				document.getElementById('container').style.height = "300px";
				document.getElementById('mask').style.height = "300px";
			}
			bindEventHandler();
			var userInfo = JSON.parse(plus.storage.getItem('userInfo'));
			var token = userInfo.token;
			dataUtil.getLocationInfo(token, function(data) {
				if(data.SystemCode == 1) {
					//console.log("打卡信息显示===" + JSON.stringify(data.clockList));
					if(data.clockList == "") {
						//document.getElementById('checkShow').display="none";

						//mui.alert("今天您还没有打卡");
						mui.toast("今天您还没有打卡");
					} else {
						mui(".info")[0].style.display = "block";
						vm.listData = data.clockList;
					}
					//console.log(vm.listData);
				}
			})

		}
	};

}(window, mui))
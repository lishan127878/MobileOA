/*
 * 说明：登录页面逻辑
 * 创建人：zwz
 * 创建时间：2017/8/23 13:40
 * 修改人：zwz
 * 修改时间：2017/8/23 13:40
 */

var myApply = (function(c, $) {
//	var vm = new Vue({
//		el: '#user-info',
//		data: {
//			userInfoData: [],
//
//		},
//	});
	//'我的'页面的点击事件
	function bindEventHandler() {
		mui('#mine_tap').on('tap', '.tab_li', function() {
			webviewUtil.show(this.dataset.href);
		});
		window.addEventListener('login',function(e){
			userData=e.detail.userData;
			//console.log("userinfo==="+JSON.stringify(userInfo));
			//console.log("name"+e.detail.userData.realName);
			//console.log("name1"+e.detail.userData.departmentName);
			console.log("name2"+e.detail.userData.dutyName);
			document.getElementById('departmentName').innerHTML=userData.departmentName;
			document.getElementById('realName').innerHTML=userData.realName;
			if(userData.dutyName==undefined){
				//console.log(1111);
				document.getElementById('dutyName').style.display="none";
			}else{
				document.getElementById('dutyName').innerHTML=userData.dutyName;
				//console.log(222);
			}
			
			if(userData.departmentName==undefined){
				//console.log(1111);
				document.getElementById('departmentName').style.display="none";
			}else{
				document.getElementById('departmentName').innerHTML=userData.departmentName;
				//console.log(222);
			}
			
		});
	}
	return {
		init: function() {
//			var userData = JSON.parse(plus.storage.getItem('userData'));
			//console.log('用户信息测试'+userData);
			//console.log(typeof userData);
//			vm.userInfoData = userData;
			bindEventHandler();
		}
	};
}(window, mui))
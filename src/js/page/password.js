var ModifyPwd = (function (context, $) {
	var encrypt = new JSEncrypt(), //初始化字符串加密对象
	    userInfo='',
		Token = '';
	encrypt.setPublicKey(context.GOBAL_CONFIG.publicKey); //设置公钥
	
	/* 事件绑定 */
	function bindEventHandler () {
		//下一步 按钮点击事件
		document.getElementById('rNext').addEventListener('click', function (e) {
			var oldPwd = document.getElementById('oldPwd').value.trim(), //旧密码
				userName = JSON.parse(plus.storage.getItem('userInfo')).userName;
				
			//密码输入验证
			if (oldPwd === '') {
				$.alert('请填写原密码！', '提示');
				return;
			}
			var reg = /^[a-zA-Z0-9]+$/;
			if (!reg.test(oldPwd)) {
				$.alert('原密码错误，请重新输入！', '提示');
				return;
			}
			if (oldPwd.length < 6) {
				$.alert('原密码错误，请重新输入！', '提示');
				return;
			}
			if (oldPwd.length > 18) {
				$.alert('原密码错误，请重新输入！', '提示');
				return;
			}
			//验证原密码正确性
			plus.nativeUI.showWaiting('验证中...');
			oldPwd = encrypt.encrypt(oldPwd);//加密旧密码
			//Ajax请求
			context.dataUtil.login({userName: userName, password:oldPwd, gPassWord: ''},
				function (res) {
					console.log('修改密码页面的数据'+JSON.stringify(res));
					if(res.SystemCode === 1){ //原密码验证成功
						var itemList = document.getElementsByClassName('item-block');
						itemList[0].style.display = 'none';
						itemList[1].style.display = 'block';
						itemList[2].style.display = 'block';
						document.getElementById('rNext').style.display = 'none';
						document.getElementById('rOk').style.display = 'block';
						userInfo=res.data;
						plus.storage.setItem('userInfo',JSON.stringify(userInfo));
						plus.nativeUI.closeWaiting();
					} else {
						plus.nativeUI.closeWaiting();
						$.alert('原密码错误，请重新输入！', '提示');
						return;
					}
				},function () {
					plus.nativeUI.closeWaiting();
					mui.toast('服务器异常，请稍后重试！');
					Loading = false;
			});
		});
		
		//确定 按钮点击事件
		//用tap点击会莫名的触发二次
		document.getElementById('rOk').addEventListener('click', function (e) {
			var newPwd = document.getElementById('newPwd').value.trim(), //新密码
				reNewPwd = document.getElementById('reNewPwd').value.trim(), //重复的新密码
				userName = JSON.parse(plus.storage.getItem('userInfo')).userName,
				Token=JSON.parse(plus.storage.getItem('userInfo')).token,
				oldPwd = document.getElementById('oldPwd').value.trim(); //旧密码
			//密码输入验证
			if (newPwd === '' || reNewPwd === '') {
				$.alert('请填写完整！', '提示');
				return;
			}
			if (newPwd !== reNewPwd) {
				$.alert('确认密码不一致，请重新输入！', '提示');
				return;
			}
			var reg = /^[a-zA-Z0-9]+$/;
			if (!reg.test(newPwd) || !reg.test(reNewPwd)) {
				$.alert('输入的密码包含特殊字符，请重新输入！', '提示');
				return;
			}
			if (newPwd.length < 6 || reNewPwd.length < 6) {
				$.alert('密码不能小于6位，请重新输入！', '提示');
				return;
			}
			if (newPwd.length > 18 || reNewPwd.length > 18) {
				$.alert('密码不能大于18位，请重新输入！', '提示');
				return;
			}
			oldPwd = encrypt.encrypt(oldPwd);//加密旧密码
			newPwd = encrypt.encrypt(newPwd);//加密新密码
            plus.nativeUI.showWaiting('请稍等···');
			//Ajax请求修改密码
			context.dataUtil.modifyPassword({userName: userName, passWord:oldPwd, newPassWord:newPwd, newGPassWord:''}, Token,
				function (res) { //success
					console.log(JSON.stringify(res))
					plus.nativeUI.closeWaiting();
					if(res.SystemCode === 1){ //修改密码成功
						$.alert('密码修改成功！', '提示');
						plus.webview.close(plus.webview.currentWebview().id);
					} else if (res.SystemCode === 0) {
						$.toast('请求服务器出错，请稍后重试');
					} else {
						$.toast(context.ERROR_CONFIG[res.SystemCode]);
						return;
					}
				}, function () { //error
					plus.nativeUI.closeWaiting();
					$.toast('服务器异常，请稍后重试！');
			});
		});
	}
	
	return {
		init: function () {
			userInfo = JSON.parse(plus.storage.getItem('userInfo'));
			bindEventHandler();
			userInfo = plus.webview.currentWebview();
		}
	}
})(window, mui);

var ModifyGesture = (function (context, $) {
	var encrypt = new JSEncrypt(); //初始化字符串加密对象
		encrypt.setPublicKey(context.GOBAL_CONFIG.publicKey);//设置公钥
	var GestureTag = false, //手势验证or修改标记；true:修改手势，false:验证旧手势
		userInfo = '';
	/* 事件绑定 */
	function bindEventHandler () {
		/* 手势密码事件处理 */
		var holder = document.querySelector('#holder'),
			alert = document.querySelector('#alert'),
			record = [];
		holder.addEventListener('done', function(event) {
			var rs = event.detail;
			if (!GestureTag) { //旧手势验证
				var gPassword = rs.points.join(''), //手势密码数据
					userInfo = JSON.parse(plus.storage.getItem('userInfo')), //缓存中的用户信息
					username = userInfo.userName; //用户名
				console.log(gPassword);
				plus.nativeUI.showWaiting('验证中...');
				//加密手势密码
				gPassword = encrypt.encrypt(gPassword);
				console.log('手势登录： ' + gPassword);
				console.log('用户名： ' + username);
				//ajax——手势密码验证
				context.dataUtil.login({userName: username, password:'', gPassword: gPassword}, function (res) { //success
						plus.nativeUI.closeWaiting();
						record = [];
						rs.sender.clear();
						console.log('手势密码验证'+JSON.stringify(res));
						if(res.SystemCode === 1){ //登录账号密码验证成功
							GestureTag = true;
							userInfo=res.data;
							plus.storage.setItem('userInfo',JSON.stringify(userInfo));
							alert.innerText = '请绘制新手势密码';
						} else if (res.SystemCode === 0) {
							$.toast('请求服务器出错，请稍后重试');
							record = [];
							rs.sender.clear();
						} else {
							$.toast("手势" + context.ERROR_CONFIG[res.SystemCode]);
							return;
						}
					},function () { //error
						plus.nativeUI.closeWaiting();
						$.toast('服务器异常，请稍后重试！');
						record = [];
						rs.sender.clear();
				});
			} else { //修改手势密码
				if (rs.points.length < 4) {
					$.toast('手势太简单，请重绘！');
					if (record.length == 1) { //第二次
						rs.sender.clear();
						return;
					} else { //第一次
						record = [];
						rs.sender.clear();
						return;
					}
				}
				console.log(rs.points.join(''));
				record.push(rs.points.join(''));
				if (record.length >= 2) {
					if (record[0] == record[1]) {
						plus.nativeUI.showWaiting('手势修改中...');
						var userInfo = JSON.parse(plus.storage.getItem('userInfo'));
						console.log('userInfo2： ' + JSON.stringify(userInfo));
						var userName = userInfo.userName,//缓存中的用户名
						    token=userInfo.token,
							gPassword = encrypt.encrypt(record[1]);//加密手势密码
							console.log('用户名： ' + userName);
							console.log('token： ' + token);
						console.log('手势修改： ' + gPassword);
						//Ajax请求修改手势密码
						context.dataUtil.modifyPassword({userName: userName, passWord:'', newPassWord: '', newGPassWord: gPassword}, token,
							function (res) { //success
								console.log(JSON.stringify(res));
								plus.nativeUI.closeWaiting();
								if(res.SystemCode === 1){ //手势设置成功
									$.alert('手势修改成功！', '提示');
									plus.webview.close(plus.webview.currentWebview().id);
								} else if (res.SystemCode === 0) {
									$.toast('请求服务器出错，请稍后重试');
								} else {
									mui.toast(context.ERROR_CONFIG[res.SystemCode]);
									alert.innerText = '请重新设置';
								}
							}, function () { //error
								plus.nativeUI.closeWaiting();
								alert.innerText = '服务器异常！请重新设置';
								mui.toast('服务器异常，请稍后重试！');
						});
					} else {
						$.toast('两次手势设定不一致');
						alert.innerText = '请绘制新手势密码';
					}
					rs.sender.clear();
					record = [];
				} else {
					alert.innerText = '请确认手势设定';
					rs.sender.clear();
				}
			}
		});
		/* /手势密码事件处理 */
	}
	
	return {
		init: function () {
			document.querySelector('#alert').innerText = '请绘制原手势密码'
			bindEventHandler();
			userInfo = plus.webview.currentWebview();
		}
	}
})(window, mui);

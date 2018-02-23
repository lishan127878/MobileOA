/*
 * 登录页面逻辑
 */

//账号密码登录
var PwdLogin = (function (c, $) {
	var isShowPwd = 0,
		isLoadingNow = 0,
		userInfo = null,
		encrypt = new JSEncrypt(); //初始化字符串加密对象
	encrypt.setPublicKey(c.GOBAL_CONFIG.publicKey); //设置公钥
	
	var isSetGPwd;
	document.getElementById('loginBtn').addEventListener('tap', function () {
		var userInfo = JSON.parse(plus.storage.getItem('userInfo'));
		if (userInfo) { //有缓存用户信息
			if (userInfo.hasgPassWord == 1) { //有手势密码，进入手势登录
				
				document.getElementById('pageOne').style.display='none';
			    document.getElementById('pageThree').style.display='block';
			    isSetGPwd=0;
				initPages(isSetGPwd);
				
			} else { //反之进入手势设置
				
				document.getElementById('pageOne').style.display='none';
			    document.getElementById('pageThree').style.display='block';
				isSetGPwd=1;
				initPages(isSetGPwd);
			}
		} else {
			document.getElementById('pageOne').style.display='none';
			document.getElementById('pageTwo').style.display='block';
		}
	});
	
	//绑定事件
	function bindEventHandler () {
		
		//登录按钮点击
		document.getElementById('submit').addEventListener('tap', function() {
			//关闭软键盘
			document.activeElement.blur();
			var inputData = getInputData(); //验证并获取参数
			if (!inputData) return;
			//加密密码
			inputData.password = encrypt.encrypt(inputData.password);
			
			plus.nativeUI.showWaiting('登录中...');
			
			//ajax——账号密码登录请求
			c.dataUtil.login(inputData, function (res) {
				
				console.log('【==用户账号登录==】' + JSON.stringify(res));
				if(res.SystemCode === 1){
					userInfo = res.data;
					userData=res.userInfo;
					//缓存用户信息
					plus.storage.setItem('userInfo', JSON.stringify(userInfo));
					plus.storage.setItem('userData', JSON.stringify(userData));

					if (userInfo.hasgPassWord == 1) { //库表存有手势密码则直接进入首页
						plus.nativeUI.closeWaiting();
						c.webviewUtil.show('main','none');
						initApp();
						
					} else {
						plus.nativeUI.closeWaiting();
						$.toast('登录成功，请设定手势！');
						//进入手势页面（设定手势）
						document.getElementById('pageOne').style.display='none';
					    document.getElementById('pageTwo').style.display='none';
					    document.getElementById('pageThree').style.display='block';
						isSetGPwd=1;
						initPages(isSetGPwd);

					}
					
				} else {
					plus.nativeUI.closeWaiting();
					$.toast(c.ERROR_CONFIG[res.SystemCode]);
					return;
				}
			},function () {
				plus.nativeUI.closeWaiting();
				$.toast('服务器异常，请稍后重试！');
				return;
			});
		});
	}
	

	//函数：获取输入信息并验证
	function getInputData() {
		var username = document.getElementById('userNameInput').value.trim(), //用户名
			password = document.getElementById('pwdInput').value.trim(), //密码
			regTel = /^[\da-zA-Z]{5,6}$/,
			regPwd = /^[\da-zA-Z]{6,12}$/;
		if(username == "" || password == "") {
			$.toast('用户名或密码不能为空');
			return false;
		}
		if(!regTel.test(username)) {
			$.toast('请输入您的工号');
			return false;
		}
		if(!regPwd.test(password)) {
			$.toast('密码错误');
			return false;
		}
		if(password.length < 6) {
			$.toast('密码错误');
			return false;
		}
		if(password.length > 12) {
			$.toast('密码错误');
			return false;
		}
		return {
			userName: username,
			password: password
		}
	}
function initApp(){
		var views=['main','appIndex','mineIndex','rosterIndex'];
		views.forEach(function(e){
			mui.fire(plus.webview.getWebviewById(e),'login',{
				userInfo: userInfo,
				userData:userData
			});
		});
	}

	//手势密码登录or设定
	var tipTxt = document.getElementById('tipTxt');

	
	
	//绑定事件
	function bindEventHandlers () {
		//返回密码登录按钮点击
		document.getElementById('toPwdLogin').addEventListener('tap', function() {	
			document.getElementById('pageOne').style.display='none';
			document.getElementById('pageTwo').style.display='block';
			document.getElementById('pageThree').style.display='none';
		});

		/* 手势密码事件处理 */
		var holder = document.querySelector('#holder'), //手势密码绘画控件
			record = [];
		holder.addEventListener('done', function(event) {
			var rs = event.detail;
			if (isSetGPwd == 0) { //手势登录
				if (rs.points.length == 0) {
					return;
				}
				if (rs.points.length < 4 && rs.points.length > 0) {
					$.toast("密码错误");
					record = [];
					rs.sender.clear();
					return;
				}
				plus.nativeUI.showWaiting('登录中...');
				var gPassword = rs.points.join(''); //手势密码数据
					
				userInfo = JSON.parse(plus.storage.getItem('userInfo')); //缓存中的用户信息
				userData = JSON.parse(plus.storage.getItem('userData')); 
				var userName = userInfo.userName; //用户名
				//加密手势密码
				gPassword = encrypt.encrypt(gPassword);
				//ajax——手势密码登录请求
				c.dataUtil.login({userName: userName, gPassword: gPassword}, function (res) { //success
					console.log('【==用户手势登录==】' + JSON.stringify(res));
					record = [];
					rs.sender.clear();
					if(res.SystemCode === 1) { //验证成功
						userInfo = res.data;
						//上传设备编号
//						postUUID();
						loginSuccess();
//						plus.nativeUI.closeWaiting();
					} else {
						plus.nativeUI.closeWaiting();
						$.toast(c.ERROR_CONFIG[res.SystemCode]);
						return;
					}
				},function () { //error
					plus.nativeUI.closeWaiting();
					$.toast('服务器异常，请稍后重试！');
					record = [];
					rs.sender.clear();
				});
			} else { //设定手势密码
				if (rs.points.length < 4) {
					$.toast("设定的手势太简单了");
					if (record.length == 1) { //当前为第二次
						rs.sender.clear();
						return;
					} else { //当前为第一次
						record = [];
						rs.sender.clear();
						return;
					}
				}
				record.push(rs.points.join(''));
				if (record.length >= 2) {
					if (record[0] == record[1]) {
						plus.nativeUI.showWaiting('手势设定中...');
						userInfo = JSON.parse(plus.storage.getItem('userInfo')); //缓存中的用户信息
						userData = JSON.parse(plus.storage.getItem('userData')); 
						var userName = userInfo.userName; //用户名
						//加密手势密码
						gPassword = encrypt.encrypt(record[1]);
						//Ajax请求修改手势密码
						c.dataUtil.modifyPassword({userName: userName,password:'', newPassWord: '', newGPassWord: gPassword}, userInfo.token, function (res) { //success
								
								console.log("gesturelogin"+JSON.stringify(res));
								
								if(res.SystemCode === 1){ //手势设定成功
									loginSuccess();
								} else {
									plus.nativeUI.closeWaiting();
									$.toast(c.ERROR_CONFIG[res.SystemCode] + '，请重新设定');
									rs.sender.clear();
									record = [];
									return;
								}
							}, function () { //error
								plus.nativeUI.closeWaiting();
								$.toast('服务器异常，请重新设定！');
						});
					} else {
						$.toast('两次手势设定不一致');
					}
					rs.sender.clear();
					record = [];
				} else {
					tipTxt.innerText = '请确认手势';
					rs.sender.clear();
				}
			}
		});
		/* /手势密码事件处理 */
	}
	
	function loginSuccess() {
		//缓存用户信息
		//plus.storage.setItem('userInfo', JSON.stringify(userInfo));
		setTimeout(function(){ //延迟执行 防止页面没有loaded
			//初始化化应用数据
			initApp();
			if(isSetGPwd == 1){
				userInfo.hasgPassWord = 1;
				plus.storage.setItem('userInfo', JSON.stringify(userInfo));
				plus.storage.setItem('userData', JSON.stringify(userData));
				$.toast('手势设定成功');
			}else{
				plus.storage.setItem('userInfo', JSON.stringify(userInfo));
				plus.storage.setItem('userData', JSON.stringify(userData));
				$.toast('登录成功');	
			}
			webviewUtil.show('main','none');
			plus.nativeUI.closeWaiting();
		},800);
	}
	

	//初始化页面
	function initPages (isSetGPwd) {
		if (isSetGPwd == 0) { //手势密码登录
			tipTxt.innerText = '手势登录';
		} else { //设置手势密码
			tipTxt.innerText = '手势设定';
		}
	}
	
	
	return {
		init: function () {
			bindEventHandler();
			//var currView = plus.webview.currentWebview();
			bindEventHandlers();
			setTimeout(function(){//延迟预加载主页面
				webviewUtil.create(c.VIEW_CONFIG['main']);
			},100);
		}
	}
})(window, mui);


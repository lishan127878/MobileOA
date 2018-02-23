/*
 * 说明：视图配置文件
 * 创建人：zwz
 * 创建时间：2017/5/4 14:50
 * 修改人：zwz
 * 修改时间：2017/7/21 10:45
 */
(function (context) {
	//视图配置
	context.VIEW_CONFIG = {
		main: { //主面板
			id: 'main',
			url: '../main/main_container.html'
		},
		appIndex: { //应用
			id: 'appIndex',
			url: '../main/_app.html'
		},
		mineIndex: { //我的
			id: 'mineIndex',
			url: '../main/_mine.html'
		},
		rosterIndex: { //通讯录
			id: 'rosterIndex',
			url: '../main/_roster.html'
		},
		announcement: { //公告
			id: 'announcement',
			url: '../notice/list.html'
		},
		noticeDetail: { //公告详情
			id: 'noticeDetail',
			url: '../notice/detail.html'
		},
		schedule: { //待办事项列表页面
			id: 'schedule',
			url: '../schedule/list.html'
		},
		work: { //待办事项加班详情页面
			id: 'work',
			url: '../schedule/work.html'
		},
		holiday: { //待办事项休假详情页面
			id: 'holiday',
			url: '../schedule/holiday.html'
		},
		purchase: { //待办事项采购详情页面
			id: 'purchase',
			url: '../schedule/purchase.html'
		},
		expense: { //待办事项费用报销详情页面
			id: 'expense',
			url: '../schedule/reimbursement.html'
		},
		myApply: { //我的申请
			id: 'myApply',
			url: '../mine/index.html'
		},
		applyDetail: { //我的申请申请详情
			id: 'applyDetail',
			url: '../mine/detail.html'
		},
		setting: { //我的设置
			id: 'setting',
			url: '../setting/index.html'
		},
		setLogin: { //验证原密码页
			id: 'setLogin',
			url: '../setting/password.html'
		},
		setGesture: { //修改手势密码页
			id: 'setGesture',
			url: '../setting/gesture.html'
		},
		about: { //关于页
			id: "about",
			url: '../setting/about.html'
		},
		checkPwd: { //登陆密码修改页
			id: 'checkPwd',
			url: '../setting/replace.html'
		},
		mobileAttendance: { //移动考勤
			id: 'mobileAttendance',
			url: '../attendance/index.html'
		},
		petition: { //申请填写
			id: 'petition',
			url: "../petition/index.html"
		},
		reimbursement: { //费用报销列表
			id: "reimbursement",
			url: "../reimbursement/list.html"
		},
		reimbursementDetail: { //费用报销的填写页面
			id: "reimbursementDetail",
			url: "../reimbursement/detail.html"
		},
		reimbursementApply: { //费用报销的填写页面
			id: "reimbursementApply",
			url: "../reimbursement/reimbursementApply.html"
		},
		vacationLetter: {//休假申请书
			id: "vacationLetter",
			url: "../vacationletter/list.html"
		},
		vacationFill: {//休假申请书的填写页面
			id: "vacationFill",
			url: "../vacationletter/vacationletterApply.html"
		},
		vacationDetail: {//请假详情展示
			id: "vacationDetail",
			url: '../vacationletter/detail.html'
		},
		vacationletterEdit: {//休假申请书的填写页面
			id: "vacationletterEdit",
			url: "../vacationletter/vacationletterEdit.html"
		},
		overtime: {//加班申请书
			id: "overtime",
			url: '../overtime/list.html'
		},
		overtimeFill: {//加班申请书的填写页面
			id: "overtimeFill",
			url: "../overtime/fill.html"
		},

		overtimeDetail:{//加班详情展示
			id:"overtimeDetail",
			url:'../overtime/detail.html'
		},
		customervisit:{//客户拜访列表加载页
			id:"customervisit",
			url:"../customervisit/list.html"
		},
		visitFollow:{//客户拜访跟进页面
			id:"visitFollow",
			url:"../customervisit/follow.html"
		},
		visitFollowFill:{//客户跟进
			id:"visitFollowFill",
			url:"../customervisit/fill.html"

		},
		visitChange:{//客户更改
			id:"visitChange",
			url:"../customervisit/Change.html"
		}
		
		
	};
}(window));
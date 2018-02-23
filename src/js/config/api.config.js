/*
 * 说明：接口配置文件
 * 创建人：zwz
 * 创建时间：2017/5/4 11:00
 * 修改人：zwz                                                                                                                  
 * 修改时间：2017/6/26 9:25
 */
(function(context) {
	//主机地址
	//context.HOST_CONFIG = "http://192.168.241.64:8080/jsryoa/";//石志敏
	//context.HOST_CONFIG = "http://192.168.241.65:8080/jsryoa/";//李树春
	//context.HOST_CONFIG = "http://192.168.1.103:8080/jsryoa/";//李树春
	//context.HOST_CONFIG = "http://192.168.1.100:8080/jsryoa/";//李树春
	//context.HOST_CONFIG = "http://192.168.1.104:8080/jsryoa/";//李树春
	//context.HOST_CONFIG = "http://192.168.1.102:8080/jsryoa/";//李树春
	context.HOST_CONFIG = "http://192.168.241.60:8080/jsryoa/" //俞俊杰
	//context.HOST_CONFIG = "http://192.168.241.53:8080/jsryoa/"//王瑞峰

		//文件服务器
		//context.FILE_SERVER = "http://file.huhuschool.com:8081/fileServer/api/"; //外网

	//context.FILE_SERVER = "http://192.168.241.48:8085/fileServer/api/"; //测试服务器
	//图片服务器
	context.IMAGE_SERVER = 'http://192.168.241.48:9000/'; //测试图片服务
	//	context.IMAGE_SERVER = 'http://static.huhuschool.com:9000/';	//外网
	//图片操作
	context.IMAGE_GET_CONFIG = context.IMAGE_SERVER + 'get-image/'; //获取图片
	context.IMAGE_UPLOAD_CONFIG = context.IMAGE_SERVER + 'image/add/'; //上传图片
	//文件操作
	context.FILE_HOST_CONFIG = context.FILE_SERVER + "getFile/"; //获取文件
	context.UPLOADIMGURL = context.IMAGE_SERVER + 'image/add/'; //图片上传
	

	//聊天服务器
	//  context.CHAT_SERVER = 'ws://192.168.241.48:8081/'; //测试服务器
	context.CHAT_SERVER = 'ws://139.196.115.139:8081/'; //外网
	//文件转换服务器
	context.FILE_TRANSFORM_SERVER = 'http://118.178.123.53/op/view.aspx?src=';
	//接口地址
	context.API_CONFIG = {
		//登录
		login: context.HOST_CONFIG + 'mobile/login/userLogin',
		//公告列表数据
		getAnnoucementList: context.HOST_CONFIG + 'mobile/notice/noticeList',
		//公告详情数据
		getAnnoucementDetail: context.HOST_CONFIG + 'mobile/notice/noticeDetail',
		//修改密码数据
		modifyPassword: context.HOST_CONFIG + 'mobile/login/updatePassword',
		//移动打卡数据
		getLocation: context.HOST_CONFIG + 'mobile/clock/insertClock',
		//显示移动打卡信息
		getLocationInfo: context.HOST_CONFIG + 'mobile/clock/clockList',
		//待办事项列表
		getApprovelList: context.HOST_CONFIG + 'mobile/instance/listData',
		//待办事项详情
		getApproveDetail: context.HOST_CONFIG + 'mobile/instance/getId',
		//待办事项审核
		getApproveResult: context.HOST_CONFIG + 'mobile/instance/process',
		//费用报销列表
		getReimbursementList: context.HOST_CONFIG + 'mobile/expense/listData',
		//费用报销详情
		getReimbursementDetail: context.HOST_CONFIG + 'mobile/expense/getId',
		//显示移动打卡信息数据
		getLocationInfo: context.HOST_CONFIG + 'mobile/clock/clockList',
		//申请填写中加班申请的列表数据
		getOvertimeList: context.HOST_CONFIG + 'mobile/workLimitApply/applyList',
		//申请填写中加班申请的详情数据
		getOvertimeDetail: context.HOST_CONFIG + 'mobile/workLimitApply/applyDetail',
		//申请填写中加班申请的新建加班数据
		addOvertime: context.HOST_CONFIG + 'mobile/workLimitApply/insertApply',
		//申请填写中加班申请的审批数据
		getApprovalInfo: context.HOST_CONFIG + 'mobile/workLimitApply/reviewDetail',
		//申请填写中休假申请的列表数据
		getVacationletterList: context.HOST_CONFIG + 'mobile/vacation/listData',
		//申请填写中休假申请的详情数据
		getVacationletterDetail: context.HOST_CONFIG + 'mobile/vacation/getId',
		//申请填写中休假申请的保存数据
		addVacationletter:context.HOST_CONFIG +'mobile/vacation/save',
		//申请填写中休假申请的提交数据
		submitVacationletter:context.HOST_CONFIG +'mobile/vacation/submit',
		//申请填写中休假申请的休假天数
		getAvailableDays:context.HOST_CONFIG +'mobile/vacation/getAvailableDays',

		//获取计划列表
		getPlanList: context.HOST_CONFIG + 'mobile/followup/getPlanList',
		//获取计划详情
		getPlanDetail: context.HOST_CONFIG + 'mobile/followup/getPlan',
		//客户计划提交
		visitPlanSubmit: context.HOST_CONFIG + 'mobile/followup/planSubmit',
		//客户计划变更
		visitPlanChange: context.HOST_CONFIG + 'mobile/followup/changePlan',
		//客户计划跟进提交
		visitPlanFollowSubmit: context.HOST_CONFIG + 'mobile/followup/followSubmit',
		//获得被访机构列
		getVisitCustomerList: context.HOST_CONFIG + 'mobile/followup/getCustomerList',
		//获得被访人
		getVisitCustomerPersonList: context.HOST_CONFIG + 'mobile/followup/getCustomerPersonList',
		//客户拜访中得到位置
        getVisitPosition:context.HOST_CONFIG + 'mobile/followup/getLocation',
        //上传图片的接口
//      uploadImg:context.IMAGE_SERVER+"image/add/",
        uploadImg:context.IMAGE_SERVER+"image/add/",
	};
}(window));
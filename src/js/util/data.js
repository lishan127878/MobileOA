/*
 * 说明：获取数据工具类
 * 创建人：zwz
 * 创建时间：2017/5/4 21:50
 * 修改人：ls
 * 修改时间：2017/11/27 9:30
 */
(function(c) {
	
		function login(paramObj, sCallBack, fCallBack) {
			mui.ajax({
				url: c.API_CONFIG.login,
				type: "GET",
				dataType: "json",
				timeout: GOBAL_CONFIG.timeOut,
				data: paramObj,
				error: function(xhr, type, error) {
					methodUtil.checkToken(xhr, type, error, fCallBack);
				},
				success: function(data) {
					sCallBack && sCallBack(data);
				}
			})
		}
		//公告列表
		function getAnnoucementList(token, nextUrl, successCB, errorCB) {
			mui.ajax(nextUrl, {
				headers: {
					token: token
				},
				dataType: 'json',
				type: 'GET',
				timeout: GOBAL_CONFIG.timeOut,
				success: function(data) {
					successCB && successCB(data);
				},
				error: function(xhr, type, error) {
					methodUtil.checkToken(xhr, type, error, errorCB);
				}
			});
		}
		//公告详情
		function getAnnoucementDetail(token, noticeId, successCB, errorCB) {
			mui.ajax(c.API_CONFIG.getAnnoucementDetail, {
				headers: {
					token: token
				},
				data: {
					id: noticeId,
				},
				dataType: 'json',
				type: 'GET',
				timeout: 3000,
				success: function(data) {
					successCB && successCB(data);
				},
				error: function(xhr, type, error) {
					errorCB && errorCB(xhr, type, error);
				}
			});
		}
		//修改密码
		function modifyPassword(paramObj, token, sCallBack, fCallBack) {
			mui.ajax({
				url: c.API_CONFIG.modifyPassword,
				headers: {
					'token': token
				},
				type: "POST",
				dataType: "json",
				timeout: GOBAL_CONFIG.timeOut,
				data: paramObj,
				error: function(xhr, type, error) {
					methodUtil.checkToken(xhr, type, error, fCallBack);
				},
				success: function(data) {
					sCallBack && sCallBack(data);
				}
			})
		}
		//移动打卡
		function getLocation(token, longitude, laititude, successCB, errorCB) {
			mui.ajax(c.API_CONFIG.getLocation, {
				headers: {
					token: token
				},
				data: {
					longitude: longitude,
					laititude: laititude
				},
				dataType: 'json',
				type: 'GET',
				timeout: 3000,
				success: function(data) {
					successCB && successCB(data);
				},
				error: function(xhr, type, error) {
					errorCB && errorCB(xhr, type, error);
				}
			});
		}
		//打卡信息显示
		function getLocationInfo(token, successCB, errorCB) {
			mui.ajax(c.API_CONFIG.getLocationInfo, {
				headers: {
					token: token
				},
				dataType: 'json',
				type: 'GET',
				timeout: 3000,
				success: function(data) {
					successCB && successCB(data);
				},
				error: function(xhr, type, error) {
					errorCB && errorCB(xhr, type, error);
				}
			});
		}
		//申请填写中加班申请列表
		function getOvertimeList(token, nextUrl, sCallBack, fCallBack) {
			nextUrl = nextUrl || c.API_CONFIG.getOvertimeList
			mui.ajax(nextUrl, {
				headers: {
					token: token
				},
				dataType: 'json',
				type: 'GET',
				timeout: c.GOBAL_CONFIG.timeOut,
				success: function(data) {
					sCallBack && sCallBack(data);
				},
				error: function(xhr, type, error) {
					methodUtil.checkToken(xhr, type, error, fCallBack);
				}
			});
		}
		//申请填写中加班申请详情
		function getOvertimeDetail(token, overtimeId, successCB, errorCB) {
			mui.ajax(c.API_CONFIG.getOvertimeDetail, {
				headers: {
					token: token
				},
				data: {
					id: overtimeId,
				},
				dataType: 'json',
				type: 'GET',
				timeout: 3000,
				success: function(data) {
					successCB && successCB(data);
				},
				error: function(xhr, type, error) {
					errorCB && errorCB(xhr, type, error);
				}
			});
		}
		//待办事项列表
		function getApproveList(token, nextUrl, sCallBack, fCallBack) {
			mui.ajax(nextUrl, {
				headers: {
					token: token
				},
				dataType: 'json',
				type: 'GET',
				timeout: c.GOBAL_CONFIG.timeOut,
				success: function(data) {
					sCallBack && sCallBack(data);
				},
				error: function(xhr, type, error) {
					methodUtil.checkToken(xhr, type, error, fCallBack);
				}
			});
		}
		//待办事项、费用报销、休假申请列表数据
		function getListInfo(token, nextUrl, sCallBack, fCallBack) {
			mui.ajax(nextUrl, {
				headers: {
					token: token
				},
				dataType: 'json',
				type: 'GET',
				timeout: c.GOBAL_CONFIG.timeOut,
				success: function(data) {
					sCallBack && sCallBack(data);
				},
				error: function(xhr, type, error) {
					methodUtil.checkToken(xhr, type, error, fCallBack);
				}
			});
		}
	
		//待办事项详情
		function getApproveDetail(token, id, flowCode, sCallBack, fCallBack) {
			console.log(id + flowCode)
			mui.ajax(c.API_CONFIG.getApproveDetail, {
				headers: {
					token: token
				},
				data: {
					id: id,
					flowCode: flowCode
				},
				dataType: 'json',
				type: 'GET',
				timeout: c.GOBAL_CONFIG.timeOut,
				success: function(data) {
					sCallBack && sCallBack(data);
				},
				error: function(xhr, type, error) {
					methodUtil.checkToken(xhr, type, error, fCallBack);
				}
			});
		}
	
		//待办事项审核
		function getApproveResult(token, obj, sCallBack, fCallBack) {
			mui.ajax(c.API_CONFIG.getApproveResult, {
				headers: {
					token: token
				},
				data: obj,
				dataType: 'json',
				type: 'GET',
				timeout: c.GOBAL_CONFIG.timeOut,
				success: function(data) {
					sCallBack && sCallBack(data);
				},
				error: function(xhr, type, error) {
					methodUtil.checkToken(xhr, type, error, fCallBack);
				}
			});
	
		}
		//费用报销申请
		function reimbursementApply(token, obj, sCallBack, fCallBack) {
			mui.ajax(c.API_CONFIG.reimbursementApply, {
				headers: {
					token: token
				},
				data: obj,
				dataType: 'json',
				type: 'GET',
				timeout: c.GOBAL_CONFIG.timeOut,
				success: function(data) {
					sCallBack && sCallBack(data);
				},
				error: function(xhr, type, error) {
					methodUtil.checkToken(xhr, type, error, fCallBack);
				}
			});
		}
		//费用报销、休假申请详情
		function getDetailInfo(token, id, url, sCallBack, fCallBack) {
			mui.ajax(url, {
				headers: {
					token: token
				},
				data: {
					id: id
				},
				dataType: 'json',
				type: 'GET',
				timeout: c.GOBAL_CONFIG.timeOut,
				success: function(data) {
					sCallBack && sCallBack(data);
				},
				error: function(xhr, type, error) {
					methodUtil.checkToken(xhr, type, error, fCallBack);
				}
			});
		}
		//申请填写中新增加班
		function addOvertime(token, workStartTime, workTime, reason, applyStatus, successCB, errorCB) {
			mui.ajax(c.API_CONFIG.addOvertime, {
				headers: {
					token: token
				},
				data: {
					workStartTime: workStartTime,
					workTime: workTime,
					reason: reason,
					applyStatus: applyStatus
				},
				dataType: 'json',
				type: 'GET',
				timeout: GOBAL_CONFIG.timeOut,
				success: function(data) {
					successCB && successCB(data);
				},
				error: function(xhr, type, error) {
					methodUtil.checkToken(xhr, type, error, errorCB);
				}
			});
		}
	
		//获得加班申请审批意见
		function getApprovalInfo(token, overtimeId, successCB, errorCB) {
			mui.ajax(c.API_CONFIG.getApprovalInfo, {
				headers: {
					token: token
				},
				data: {
					id: overtimeId,
				},
				dataType: 'json',
				type: 'GET',
				timeout: 3000,
				success: function(data) {
					successCB && successCB(data);
				},
				error: function(xhr, type, error) {
					errorCB && errorCB(xhr, type, error);
				}
			});
		}
		
		//休假申请书新增
		function addVacationletter(token, applyInfo, url,sCallBack, fCallBack) {
			console.log("token:" + token + "vacation:" + applyInfo);
			mui.ajax(url, {
				headers: {
					token: token
				},
				data: { vacation: applyInfo },
				dataType: 'json',
				type: 'GET',
				timeout: GOBAL_CONFIG.timeOut,
				success: function(data) {
					sCallBack && sCallBack(data);
				},
				error: function(xhr, type, error) {
					methodUtil.checkToken(xhr, type, error, fCallBack);
				}
			});
		}
	
		//休假申请书新增休假天数
		function getAvailableDays(token, vacationType, appStfId, sCallBack, fCallBack) {
			mui.ajax(c.API_CONFIG.getAvailableDays, {
				headers: {
					token: token
				},
				data: {
					vacationType: vacationType,
					appStfId: appStfId
				},
				dataType: 'json',
				type: 'GET',
				timeout: c.GOBAL_CONFIG.timeOut,
				success: function(data) {
					sCallBack && sCallBack(data);
				},
				error: function(xhr, type, error) {
					methodUtil.checkToken(xhr, type, error, fCallBack);
				}
			});
		}
	
		function getPlanList(token, nextUrl, sCallBack, fCallBack) {
			nextUrl = nextUrl || c.API_CONFIG.getPlanList
			mui.ajax(nextUrl, {
				headers: {
					token: token
				},
				dataType: 'json',
				type: 'GET',
				timeout: c.GOBAL_CONFIG.timeOut,
				success: function(data) {
					sCallBack && sCallBack(data);
				},
				error: function(xhr, type, error) {
					methodUtil.checkToken(xhr, type, error, fCallBack);
				}
			});
		}
		//获取客户拜访计划详情
		function getPlanDetail(token, planId, sCallBack, fCallBack) {
			mui.ajax(c.API_CONFIG.getPlanDetail, {
				headers: {
					token: token
				},
				data: {
					planId: planId
				},
				dataType: 'json',
				type: 'POST',
				timeout: 3000,
				success: function(data) {
					sCallBack && sCallBack(data);
				},
				error: function(xhr, type, error) {
					fCallBack && fCallBack(xhr, type, error);
				}
			});
		}
		//客户计划提交
	
		function visitPlanSubmit(token, Ids, sCallBack, fCallBack) {
			mui.ajax(c.API_CONFIG.visitPlanSubmit, {
				headers: {
					token: token
				},
				data: Ids,
				dataType: 'json',
				type: 'POST',
				timeout: 3000,
				success: function(data) {
					sCallBack && sCallBack(data);
				},
				error: function(xhr, type, error) {
					fCallBack && fCallBack(xhr, type, error);
				}
			});
		}
		//客户跟进
		function visitPlanFollowSubmit(token, planId, followupVisitTime, followupContent, photoId, locationId, longitude, latitude, sCallBack, fCallBack) {
			mui.ajax(c.API_CONFIG.visitPlanFollowSubmit, {
				headers: {
					token: token
				},
				data: {
					planId: planId,
					followupVisitTime: followupVisitTime,
					followupContent: followupContent,
					photoId: photoId,
					locationId: locationId,
					longitude: longitude,
					latitude: latitude
				},
				dataType: 'json',
				type: 'POST',
				timeout: 3000,
				success: function(data) {
					sCallBack && sCallBack(data);
				},
				error: function(xhr, type, error) {
					fCallBack && fCallBack(xhr, type, error);
				}
			});
		}
		//客户拜访中得到位置
		function getVisitPosition(token, longitude, latitude, successCB, errorCB) {
			mui.ajax(c.API_CONFIG.getVisitPosition, {
				headers: {
					token: token
				},
				data: {
					longitude: longitude,
					latitude: latitude
				},
				dataType: 'json',
				type: 'GET',
				timeout: 3000,
				success: function(data) {
					successCB && successCB(data);
				},
				error: function(xhr, type, error) {
					errorCB && errorCB(xhr, type, error);
				}
			});
		}
		//计划变更
		function visitPlanChange(token, planId, customerNum, customerStaff, startDate, endDate, planContent, weekPlanId, successCB, errorCB) {
			mui.ajax(c.API_CONFIG.visitPlanChange, {
				headers: {
					token: token
				},
				data: {
					planId: planId,
					customerNum: customerNum,
					customerStaff: customerStaff,
					startDate: startDate,
					endDate: endDate,
					planContent: planContent,
					weekPlanId: weekPlanId
				},
				dataType: 'json',
				type: 'GET',
				timeout: 3000,
				success: function(data) {
					successCB && successCB(data);
				},
				error: function(xhr, type, error) {
					errorCB && errorCB(xhr, type, error);
				}
			});
		}
		//得到被访组织
		function getVisitCustomerList(token,sCallBack,fCallBack) {
			mui.ajax(c.API_CONFIG.getVisitCustomerList, {
				headers: {
					token: token
				},
				dataType: 'json',
				type: 'POST',
				timeout: 3000,
				success: function(data) {
					sCallBack && sCallBack(data);
				},
				error: function(xhr, type, error) {
					fCallBack && fCallBack(xhr, type, error);
				}
			});
		}
		//得到被访人
		function getVisitCustomerPersonList(token, customerNum, sCallBack, fCallBack) {
			mui.ajax(c.API_CONFIG.getVisitCustomerPersonList, {
				headers: {
					token: token
				},
				data: {
					customerNum:customerNum
				},
				dataType: 'json',
				type: 'POST',
				timeout: 3000,
				success: function(data) {
					sCallBack && sCallBack(data);
				},
				error: function(xhr, type, error) {
					fCallBack && fCallBack(xhr, type, error);
				}
			});
		}
		c.dataUtil = {
			login: login,
			getAnnoucementList: getAnnoucementList,
			getAnnoucementDetail: getAnnoucementDetail,
			modifyPassword: modifyPassword,
			getLocation: getLocation,
			getLocationInfo: getLocationInfo,
			getListInfo: getListInfo,
			getApproveDetail: getApproveDetail,
			getApproveResult: getApproveResult,
			getDetailInfo: getDetailInfo,
			reimbursementApply: reimbursementApply,
			getOvertimeList: getOvertimeList,
			getOvertimeDetail: getOvertimeDetail,
			addOvertime: addOvertime,
			getApprovalInfo: getApprovalInfo,
			addVacationletter: addVacationletter,
			getApprovalInfo: getApprovalInfo,
			getAvailableDays: getAvailableDays,
			getApprovalInfo: getApprovalInfo,
			getPlanList: getPlanList,
			getPlanDetail: getPlanDetail,
			visitPlanSubmit: visitPlanSubmit,
			visitPlanFollowSubmit: visitPlanFollowSubmit,
			getVisitPosition: getVisitPosition,
			visitPlanChange: visitPlanChange,
			getVisitCustomerList:getVisitCustomerList,
			getVisitCustomerPersonList:getVisitCustomerPersonList	
		};
	}(window));
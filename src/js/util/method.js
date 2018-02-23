/*
 * 说明：常用方法工具类
 * 创建人：zwz
 * 创建时间：2017/5/4 21:50
 * 修改人：zwz
 * 修改时间：2017/5/4 21:50
 */
(function (c) {
	//调用相机
	function getCamera(callBack) {
		var camera = plus.camera.getCamera();
		camera.captureImage(function (path) {
			callBack(path);
		}, function (error) {
			console.log(error.message);
		}, {
				filename: "_doc/camera/",
				index: 1
			})
	}


	/*
	 * 压缩图片
	 * @param src 文件路径
	 * @param 压缩后路径
	 * @quality 图片质量
	 */
	function compressImage(src, dst, sCallBack, fCallBack, quality) {
		quality = quality || 40;
		plus.zip.compressImage({
			src: src,
			dst: dst,
			overwrite: true,
			quality: quality
		}, function (event) {
			sCallBack && sCallBack(event);
		}, function () {
			fCallBack && fCallBack();
			console.log("压缩失败");
			plus.nativeUI.toast("压缩失败");
		});
	}

	//上传图片
	function uploadImage(path, callBack) {
		var task = plus.uploader.createUpload(IMAGE_UPLOAD_CONFIG, {
			method: "POST"
		},
			function (t, status) {
				if (status == 200) {
					var result = JSON.parse(t.responseText);
					console.log("path，" + path)
					console.log("success: " + JSON.stringify(result))
					callBack(result);
				} else {
					plus.nativeUI.toast('图片上传失败');
					console.log("Upload failed: " + status)
				}
			}
		);
		task.addFile(path, {
			key: "file"
		});
		task.addData("title", "1");
		task.addData("collection", "1");
		task.start();
	}


	//验证token是否过期
	function checkToken(xhr, type, err, callBack) {
		if (xhr.status == 99) {//99 token过期
			mui.toast('身份验证已过期，请重新登录');
			plus.nativeUI.closeWaiting();//关闭等待框
			plus.runtime.restart();//重启应用
		} else {
			callBack && callBack(xhr, type, err);
		}
	}

	//过滤Emoji表情
	function filterEmoji(content) {
		for (var i = 0; i < content.length; i++) {
			var hs = content.charCodeAt(i);
			if (0xd800 <= hs && hs <= 0xdbff) {
				if (content.length > 1) {
					var ls = content.charCodeAt(i + 1);
					var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
					if (0x1d000 <= uc && uc <= 0x1f77f) {
						plus.nativeUI.toast("不能输入emoji表情!");
						return false;
					}
				}
			} else if (content.length > 1) {
				var ls = content.charCodeAt(i + 1);
				if (ls == 0x20e3) {
					plus.nativeUI.toast("不能输入emoji表情!");
					return false;
				}
			} else {
				if (0x2100 <= hs && hs <= 0x27ff) {
					plus.nativeUI.toast("不能输入emoji表情!");
					return false;
				} else if (0x2B05 <= hs && hs <= 0x2b07) {
					plus.nativeUI.toast("不能输入emoji表情!");
					return false;
				} else if (0x2934 <= hs && hs <= 0x2935) {
					plus.nativeUI.toast("不能输入emoji表情!");
					return false;
				} else if (0x3297 <= hs && hs <= 0x3299) {
					plus.nativeUI.toast("不能输入emoji表情!");
					return false;
				} else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
					|| hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
					|| hs == 0x2b50) {
					plus.nativeUI.toast("不能输入emoji表情!");
					return false;
				}
			}
		}
		return true;
	}

	/*
	 *上传语音文件 
	 */
	function uploadFile(path, sCallBack, fCallBack) {
		var task = plus.uploader.createUpload(UPLOADVOICEURL,
			{ method: "POST" },
			function (t, status) {
				if (status == 200) {
					sCallBack && sCallBack(t.responseText);
				} else {
					fCallBack && fCallBack(status);
				}
			}
		);
		task.addFile(path, { key: "files" });
		task.start();
	}
	//地理位置
	function getPosition(callBack) {
		plus.geolocation.getCurrentPosition(function (position) {
			callBack(position);
		}, function (e) {
			alert('地理位置错误: ' + e.message);
		});
	}
	//可获取文件系统管理对象
	function getIo(path,callBack) {
		plus.io.resolveLocalFileSystemURL(path, function(entry) {
			var newPath = entry.toLocalURL();
			callBack(newPath);
		}, function (e) {
			alert('文件转换失败: ' + e.message);
		});
	}
	//本地相册选择 
	function galleryImg(callBack) {
		plus.gallery.pick(function(e) {
			callBack(e); 
		}, function(e) {}, {
			filter: "image"
		});
	}
	c.methodUtil = {
		getCamera: getCamera,
		uploadImage: uploadImage,
		checkToken: checkToken,
		filterEmoji: filterEmoji,
		compressImage: compressImage,
		uploadFile: uploadFile,
		getPosition: getPosition,
		getIo:getIo,
		galleryImg:galleryImg
	};
}(window));
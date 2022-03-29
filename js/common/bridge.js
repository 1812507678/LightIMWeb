/**
 * js和原生方法的桥接服务 chender 20160829
 */
!(function(w) {

	//获取安卓或IOS系统
	var browser = {
		versions: function() {
			var u = navigator.userAgent,
				app = navigator.appVersion;
			return { // 移动终端浏览器版本信息
				trident: u.indexOf('Trident') > -1, // IE内核
				presto: u.indexOf('Presto') > -1, // opera内核
				webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
				mobile: !!u.match(/AppleWebKit.*Mobile.*/) ||
					!!u.match(/AppleWebKit/), // 是否为移动终端
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
				iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, // 是否为iPhone或者QQHD浏览器
				iPad: u.indexOf('iPad') > -1, // 是否iPad
				webApp: u.indexOf('Safari') == -1
				// 是否web应该程序，没有头部与底部
			};
		}(),
		language: (navigator.browserLanguage || navigator.language).toLowerCase()
	};

	w.Bridge = new function() {
		//是否为android端
		this.isAndroid = function() {
			return browser.versions.android&&window.SysClientJs;
		};
		//是否为ios端
		this.isIos = function() {
			return browser.versions.ios || browser.versions.iPhone || browser.versions.iPad;
		};
		this.testCallback = function(param,callback) {
			param = addIOSDataFormat(param);
			connectBridge(function (bridge) {
				bridge.callHandler('testCallback', param, function(responseData) {
					console.log('JS got response', responseData, 'js');
					callback(responseData)
				})
			})
		};
		this.getUserInfo = function(param,callback) {
			connectBridge(function (bridge) {
				bridge.callHandler('getUserInfo', param, function(responseData) {
					callback(responseData)
				})
			})
		};
		this.closeWebView = function(param,callback) {
			connectBridge(function (bridge) {
				bridge.callHandler('closeWebView', param, function(responseData) {
					callback(responseData)
				})
			})
		};
		this.goUserHomePage = function(param,callback) {
			param = addIOSDataFormat(param);
			connectBridge(function (bridge) {
				bridge.callHandler('goUserHomePage', param, function(responseData) {
					callback(responseData)
				})
			})
		};
		this.share = function(param,callback) {
			connectBridge(function (bridge) {
				bridge.callHandler('share', param, function(responseData) {
					callback(responseData)
				})
			})
		};
		this.contactUs = function(param,callback) {
			connectBridge(function (bridge) {
				bridge.callHandler('contactUs', param, function(responseData) {
					callback(responseData)
				})
			})
		};
		this.saveImgToLocal = function(param,callback) {
			connectBridge(function (bridge) {
				bridge.callHandler('saveImgToLocal', param, function(responseData) {
					callback(responseData)
				})
			})
		};
		this.toast = function(param,callback) {
			if (Envconfig.IS_BROWSER_TEST) {
				alert(param);
				return
			}

			param = addIOSDataFormat(param);
			connectBridge(function (bridge) {
				bridge.callHandler('toast', param, function(responseData) {
					callback(responseData)
				})
			})
		};
		this.dialog = function(param,callback) {
			connectBridge(function (bridge) {
				bridge.callHandler('dialog', param, function(responseData) {
					callback(responseData)
				})
			})
		};
		this.openWebView = function(url) {
			if(url.indexOf('http') !== 0) {
				url = location.href.split("/LightIMWeb/")[0] + "/LightIMWeb/" + url;
			}

			if (Envconfig.IS_BROWSER_TEST) {
				window.location.href = url;
				return
			}

			url = addIOSDataFormat(url);
			connectBridge(function (bridge) {
				bridge.callHandler('openWebView', url);
			})
		};
		this.getApkVersion = function(param,callback) {
			connectBridge(function (bridge) {
				bridge.callHandler('getApkVersion', param, function(responseData) {
					callback(responseData)
				})
			})
		};
		this.uploadImage = function(param,callback) {
			connectBridge(function (bridge) {
				bridge.callHandler('uploadImage', param, function(responseData) {
					callback(responseData)
				})
			})
		};
		this.getWeiXinOpenId = function(param,callback) {
			connectBridge(function (bridge) {
				bridge.callHandler('getWeiXinOpenId', param, function(responseData) {
					callback(responseData)
				})
			})
		};
		this.getALiPayOpenId = function(param,callback) {
			connectBridge(function (bridge) {
				bridge.callHandler('getALiPayOpenId', param, function(responseData) {
					callback(responseData)
				})
			})
		};
		this.gotoCheckout = function(param,callback) {
			connectBridge(function (bridge) {
				bridge.callHandler('gotoCheckout', param, function(responseData) {
					callback(responseData)
				})
			})
		};
		this.gotoCheckoutWithSerialNumber = function(param,callback) {
			connectBridge(function (bridge) {
				bridge.callHandler('gotoCheckoutWithSerialNumber', param, function(responseData) {
					callback(responseData)
				})
			})
		};
		this.putWebViewActivity = function(param,callback) {
			param = addIOSDataFormat(param);
			connectBridge(function (bridge) {
				bridge.callHandler('putWebViewActivity', param, function(responseData) {
					callback(responseData)
				})
			})
		};
		this.refreshWebViewActivity = function(param) {
			param = addIOSDataFormat(param);
			connectBridge(function (bridge) {
				bridge.callHandler('refreshWebViewActivity', param)
			})
		};
		this.closeWebViewActivity = function(param) {
			param = addIOSDataFormat(param);
			connectBridge(function (bridge) {
				bridge.callHandler('closeWebViewActivity', param)
			})
		};
		this.updateLocalUser = function(param) {
			param = addIOSDataFormat(param);
			connectBridge(function (bridge) {
				bridge.callHandler('updateLocalUser', param)
			})
		};
		this.disableWebViewRefresh = function(param) {
			connectBridge(function (bridge) {
				bridge.callHandler('disableWebViewRefresh', param)
			})
		};
		this.getAppBaseInfo = function(param,callback) {
			connectBridge(function (bridge) {
				bridge.callHandler('getAppBaseInfo', param, function(responseData) {
					callback(responseData)
				})
			})
		};
		this.showRightButton = function(param,callback) {
			connectBridge(function (bridge) {
				bridge.callHandler('showRightButton', param, function(responseData) {
					callback(responseData)
				})
			})
		};
		this.gotoIdCardOCRVerifyPage = function(param) {
			connectBridge(function (bridge) {
				bridge.callHandler('gotoIdCardOCRVerifyPage', param)
			})
		};
		this.gotoGamePlayPage = function(param) {
			connectBridge(function (bridge) {
				bridge.callHandler('gotoGamePlayPage', param)
			})
		};
		this.gotoDoTaskPage = function(param) {
			connectBridge(function (bridge) {
				bridge.callHandler('gotoDoTaskPage', param)
			})
		};
		this.gotoADInspireVideoPage = function(param) {
			connectBridge(function (bridge) {
				bridge.callHandler('gotoADInspireVideoPage', param)
			})
		};
		this.gotoNovelPage = function(param) {
			connectBridge(function (bridge) {
				bridge.callHandler('gotoNovelPage', param)
			})
		};
		this.gotoNovelADSuyiPage = function(param) {
			connectBridge(function (bridge) {
				bridge.callHandler('gotoNovelADSuyiPage', param)
			})
		};
		this.gotoSimpleTaskPage = function(param) {
			connectBridge(function (bridge) {
				bridge.callHandler('gotoSimpleTaskPage', param)
			})
		};
		this.gotoJXWSDKGamePage = function(param) {
			connectBridge(function (bridge) {
				bridge.callHandler('gotoJXWSDKGamePage', param)
			})
		};
		this.gotoLogin = function(param) {
			connectBridge(function (bridge) {
				bridge.callHandler('gotoLogin', param)
			})
		};
        this.setPageVisibleListener = function(param,callback) {
            connectBridge(function (bridge) {
                bridge.callHandler('setPageVisibleListener', param, function(responseData) {
                    callback(responseData)
                })
            })
        };
	};

})(window);

function addIOSDataFormat(param) {
	if (typeof(param)=='string' && Bridge.isIos()){
		param = {"value":param}
	}
	return param
}

//链接js和原生交互桥梁
function connectBridge(callback) {
	if(Bridge.isIos()) {
		setupWKWebViewJavascriptBridge(function(bridge) {
			callback(bridge)
		})
	}
	else {
		connectWebViewJavascriptBridge(function (bridge) {
			callback(bridge)
		});
	}
}

//IOS的Bridge初始化
function setupWKWebViewJavascriptBridge(callback) {
	if (window.WKWebViewJavascriptBridge) {
		return callback(WKWebViewJavascriptBridge);
	}
	if (window.WKWVJBCallbacks) { return window.WKWVJBCallbacks.push(callback); }
	window.WKWVJBCallbacks = [callback];
	window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null)
}

//Android的Bridge初始化第一步
function connectWebViewJavascriptBridge(callback) {
	if (window.WebViewJavascriptBridge) {
		callback(WebViewJavascriptBridge)
	} else {
		document.addEventListener(
			'WebViewJavascriptBridgeReady'
			, function() {
				callback(WebViewJavascriptBridge)
			},
			false
		);
	}
}

//Android的Bridge初始化第二步
connectWebViewJavascriptBridge(function(bridge) {
	bridge.init(function(message, responseCallback) {
		console.log('JS got a message', message);
		var data = {
			'Javascript Responds': '测试中文!'
		};

		if (responseCallback) {
			console.log('JS responding with', data);
			responseCallback(data);
		}
	});

	bridge.registerHandler("functionInJs", function(data, responseCallback) {
		document.getElementById("reponse").innerHTML = ("data from Java: = " + data);
		if (responseCallback) {
			var responseData = "Javascript Says Right back aka!";
			responseCallback(responseData);
		}
	});
});



/*
setupWKWebViewJavascriptBridge(function(bridge) {

	bridge.registerHandler('testJavascriptHandler', function(data, responseCallback) {
		log('iOS called testJavascriptHandler with', data, 'native')
		var responseData = { 'Javascript Says':'Right back atcha!' }
		log('JS responding with', responseData, 'native')
		responseCallback(responseData)
	});

	bridge.callHandler('testiOSCallback', {'foo': 'bar'}, function(response) {
		console.log('JS got response', response, 'js')
	})


})
*/

(function(cordova) {

	function SoftKeyboard() {}

	SoftKeyboard.prototype.show = function(win, fail) {
		return cordova.exec(
			function(args) {
				if (win !== undefined) {
					win(args);
				}
			},
			function(args) {
				if (fail !== undefined) {
					fail(args);
				}
			},
			"SoftKeyboard", "show", []);
	};

	SoftKeyboard.prototype.hide = function(win, fail) {
		return cordova.exec(
			function(args) {
				if (win !== undefined) {
					win(args);
				}
			},
			function(args) {
				if (fail !== undefined) {
					fail(args);
				}
			},
			"SoftKeyboard", "hide", []);
	};

	SoftKeyboard.prototype.isShowing = function(win, fail) {
		return cordova.exec(
			function(args) {
				if (win !== undefined) {
					win(args);
				}
			},
			function(args) {
				if (fail !== undefined) {
					fail(args);
				}
			},
			"SoftKeyboard", "isShowing", []);
	};

	SoftKeyboard.prototype.getWebViewHeight = function(win, fail) {
		return cordova.exec(
			function(height) {
				if (win) {
					win(height);
				}
			},
			function(args) {
				if (fail) {
					fail(args);
				}
			},
			"SoftKeyboard", "getWebViewHeight", []);
	};

	SoftKeyboard.prototype.getDisplayHeight = function(win, fail) {
		return cordova.exec(
			function(height) {
				if (win) {
					win(height);
				}
			},
			function(args) {
				if (fail) {
					fail(args);
				}
			},
			"SoftKeyboard", "getDisplayHeight", []);
	};

	SoftKeyboard.prototype.getWebViewWidth = function(win, fail) {
		return cordova.exec(
			function(width) {
				if (win) {
					win(width);
				}
			},
			function(args) {
				if (fail) {
					fail(args);
				}
			},
			"SoftKeyboard", "getWebViewWidth", []);
	};

	SoftKeyboard.prototype.sendTap = function(posx, posy, win, fail) {
		return cordova.exec(
			function(args) {
				if (win) {
					win(args);
				}
			},
			function(args) {
				if (fail) {
					fail(args);
				}
			},
			"SoftKeyboard", "sendTap", [posx, posy]);
	};

	if (!window.plugins) {
		window.plugins = {};
	}

	if (!window.plugins.SoftKeyboard) {
		window.plugins.SoftKeyboard = new SoftKeyboard();
	}

	var softKeyboard = new SoftKeyboard();
	module.exports = softKeyboard;

})(window.cordova);

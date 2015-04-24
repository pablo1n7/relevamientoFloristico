package com.cordova.plugin.softkeyboard;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.inputmethod.InputMethodManager;

import android.os.SystemClock;
import android.view.View;
import android.view.WindowManager;
import android.view.Display;
import android.graphics.Point;

import android.util.Log;
import java.lang.String;

public class SoftKeyboard extends CordovaPlugin {

    public SoftKeyboard() {
    }

    public void showKeyBoard() {
        InputMethodManager mgr = (InputMethodManager) cordova.getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
        mgr.showSoftInput(webView, InputMethodManager.SHOW_IMPLICIT);

        ((InputMethodManager) cordova.getActivity().getSystemService(Context.INPUT_METHOD_SERVICE)).showSoftInput(webView, 0);
    }

    public void hideKeyBoard() {
        InputMethodManager mgr = (InputMethodManager) cordova.getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
        mgr.hideSoftInputFromWindow(webView.getWindowToken(), 0);
    }

    public boolean isKeyBoardShowing() {
    	int heightDiff = webView.getRootView().getHeight() - webView.getHeight();
    	return (100 < heightDiff); // if more than 100 pixels, its probably a keyboard...
    }

    public int getWebViewWidth() {
        return webView.getWidth();
    }

    public int getWebViewHeight() {
        return webView.getHeight();
    }

    public int getDisplayHeight() {
        WindowManager wm = (WindowManager) cordova.getActivity().getSystemService(Context.WINDOW_SERVICE);
        Display display = wm.getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        return size.y;
    }

    public boolean sendTap(final int posx, final int posy, final CallbackContext callbackContext) {
        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                boolean up, down;
                up = webView.dispatchTouchEvent(MotionEvent.obtain(SystemClock.uptimeMillis(), SystemClock.uptimeMillis(), MotionEvent.ACTION_DOWN, posx, posy, 0));
                down = webView.dispatchTouchEvent(MotionEvent.obtain(SystemClock.uptimeMillis(), SystemClock.uptimeMillis(), MotionEvent.ACTION_UP, posx, posy, 0));
                if (!down || !up) {
                    callbackContext.error("Failed sending key up+down event for coords " + posx + ", " + posy);
                } else {
                    callbackContext.success("Succesfully sent key up+down event for coords " + posx + ", " + posy);
                }
            }
        });
        return true;
    }

    @Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
		if (action.equals("show")) {
            this.showKeyBoard();
            callbackContext.success("done");
            return true;
		}
        else if (action.equals("hide")) {
            this.hideKeyBoard();
            callbackContext.success();
            return true;
        }
        else if (action.equals("getWebViewWidth")) {
            callbackContext.success(getWebViewWidth());
            return true;
        }
        else if (action.equals("getWebViewHeight")) {
            callbackContext.success(getWebViewHeight());
            return true;
        }
        else if (action.equals("getDisplayHeight")) {
            callbackContext.success(getDisplayHeight());
            return true;
        }
        else if (action.equals("isShowing")) {
            callbackContext.success(Boolean.toString(this.isKeyBoardShowing()));
            return true;
        }
		else if (action.equals("sendTap")) {
            try {
                int posx = args.getInt(0);
                int posy = args.getInt(1);
                return this.sendTap(posx, posy, callbackContext);
            } catch (JSONException jsonEx) {
                callbackContext.error(jsonEx.getMessage());
                return false;
            }
        }
        else {
			return false;
		}
	}
}

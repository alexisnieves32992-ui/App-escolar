package com.antigravity.escuela;

import android.os.Bundle;
import android.view.Window;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NavBarPlugin.class);
        super.onCreate(savedInstanceState);

        // Hide the system navigation bar (back, home, recent buttons)
        // Users can still access it by swiping up from the bottom edge
        hideNavigationBar();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        // Re-hide when the app regains focus (e.g. after switching apps)
        if (hasFocus) {
            hideNavigationBar();
        }
    }

    private void hideNavigationBar() {
        Window window = getWindow();
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());

        if (controller != null) {
            // Hide both the status bar and navigation bar
            controller.hide(WindowInsetsCompat.Type.systemBars());
            // When user swipes from bottom edge, bar appears briefly then auto-hides
            controller.setSystemBarsBehavior(
                    WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        }
    }
}

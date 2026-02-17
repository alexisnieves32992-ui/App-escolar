package com.antigravity.escuela;

import android.graphics.Color;
import android.os.Build;
import android.view.View;
import android.view.Window;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NavBar")
public class NavBarPlugin extends Plugin {

    @PluginMethod
    public void setColor(PluginCall call) {
        String color = call.getString("color");
        if (color == null) {
            call.reject("Must provide a color");
            return;
        }

        final int parsedColor;
        try {
            parsedColor = Color.parseColor(color);
        } catch (Exception e) {
            call.reject("Invalid color: " + color);
            return;
        }

        // Resolve immediately so JavaScript doesn't block
        call.resolve();

        // Apply on main thread
        getBridge().executeOnMainThread(() -> {
            // Apply immediately
            applyNavBarColor(parsedColor);

            // Re-apply after a delay to guarantee our changes stick
            // even if another plugin (StatusBar) overwrites system UI flags
            getActivity().getWindow().getDecorView().postDelayed(() -> {
                applyNavBarColor(parsedColor);
            }, 300);
        });
    }

    private void applyNavBarColor(int color) {
        try {
            Window window = getActivity().getWindow();

            // Step 1: Disable contrast enforcement FIRST
            // This prevents Android from adding a grey/white scrim overlay
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                window.setNavigationBarContrastEnforced(false);
            }

            // Step 2: Set the exact navigation bar color
            window.setNavigationBarColor(color);

            // Step 3: Set the icon appearance (dark icons on light bg, light icons on dark
            // bg)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                View decorView = window.getDecorView();
                int currentFlags = decorView.getSystemUiVisibility();

                if (isColorLight(color)) {
                    // White/light background -> need dark icons
                    currentFlags |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                } else {
                    // Dark background -> need light icons
                    currentFlags &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                }

                // Preserve status bar flags (don't overwrite them)
                // We only modify the LIGHT_NAVIGATION_BAR flag
                decorView.setSystemUiVisibility(currentFlags);
            }
        } catch (Exception e) {
            // Activity might be destroyed, ignore silently
        }
    }

    private boolean isColorLight(int color) {
        double darkness = 1 - (0.299 * Color.red(color) + 0.587 * Color.green(color) + 0.114 * Color.blue(color)) / 255;
        return darkness < 0.5;
    }
}

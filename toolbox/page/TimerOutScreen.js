import { AppGesture } from "../../lib/mmk/AppGesture";
import { SCREEN_WIDTH } from "../../lib/mmk/UiParams";

let vibrate;

Page({
  build() {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/TimerOutScreen",
    });
    AppGesture.init();

    hmSetting.setBrightScreen(180);

    // Bell icon
    let counter = 0;
    let icon = hmUI.createWidget(hmUI.widget.IMG, {
      x: (SCREEN_WIDTH - 64) / 2,
      y: 120,
      src: "timer/bell.png"
    });

    // Auto-exit after 0.5m
    timer.createTimer(30000, 30000, () => {
      hmApp.goBack();
    });

    // Exit button
    hmUI.createWidget(hmUI.widget.IMG, {
      x: (SCREEN_WIDTH - 72) / 2,
      y: 300,
      src: "timer/bell_stop.png"
    }).addEventListener(hmUI.event.CLICK_UP, () => {
      hmApp.goBack();
    });

    // Vibro
    vibrate = hmSensor.createSensor(hmSensor.id.VIBRATE);
    vibrate.scene = 1;
    vibrate.start();

    // Wipe
    hmFS.SysProSetChars("mmk_tb_timer_state", "");
  },
  onDestroy: () => {
    vibrate.stop();
    hmSetting.setBrightScreenCancel();
  }
})

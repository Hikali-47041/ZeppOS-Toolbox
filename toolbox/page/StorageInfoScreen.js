import {FsUtils} from "../../lib/FsUtils";
import { AppGesture } from "../../lib/AppGesture";

const { config, t } = getApp()._options.globalData;

class StorageInfoScreen {
  start() {
    const cupStyle = {
      x: 16,
      y: 72,
      w: 32,
      h: 320,
      color: 0x111111
    };

    const storage = hmSetting.getDiskInfo();
    const config = [
      {
        key: "Total",
        color: 0x999999,
      },
      {
        key: "Free",
        color: 0xAAAAAA,
      },
      {
        key: "ZeppOS",
        color: 0xFFCC80
      },
      {
        key: "Watchfaces",
        color: 0x4fc3f7,
      },
      {
        key: "Apps",
        color: 0xFFAB91,
      },
      {
        key: "Unknown",
        color: 0x616161,
      },
    ];

    // Calc unknown
    storage.unknown = storage.total;
    for(let i in config)
      if(config[i].key !== "Total" && config[i].key !== "Unknown") 
        storage.unknown -= storage[config[i].key]

    let posY = 56, usedY = 0;

    hmUI.createWidget(hmUI.widget.FILL_RECT, cupStyle);

    for (let i in config) {
      const currentRow = config[i];
      if(storage[currentRow.key] == 0) continue;

      // Text
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 72,
        y: posY,
        w: 120,
        h: 24,
        color: currentRow.color,
        text: t(currentRow.key),
      });
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 72,
        y: posY + 24,
        w: 120,
        h: 48,
        text_size: 24,
        color: 0xffffff,
        text: FsUtils.printBytes(storage[currentRow.key]),
      });
      posY += 64;

      // Visual
      if (currentRow.key != "Free" && currentRow.key != "Total") {
        let height = Math.round(
          cupStyle.h * (storage[currentRow.key] / storage.total)
        );
        if(height < 2) continue;

        hmUI.createWidget(hmUI.widget.FILL_RECT, {
          ...(cupStyle),
          y: cupStyle.y + cupStyle.h - usedY - height,
          h: height,
          color: currentRow.color,
        });

        usedY += height;
      }
    }
  }
}

Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/StorageInfoScreen",
    });
    AppGesture.init();

    new StorageInfoScreen().start();
  }
});

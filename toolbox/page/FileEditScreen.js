import {FsUtils} from "../lib/FsUtils";
import {t, extendLocale} from "../lib/i18n";
import {SettingsListScreen} from "../utils/SettingsListScreen";

extendLocale({
  "file_view_as_image": {
      "en-US": "View as image",
      "zh-CN": "以图片形式查看",
      "zh-TW": "以圖片形式檢視",
      "ru-RU": "Прсм. изображение",
      "de-DE": "Zeige als Bild"
  },
  "file_view_as_text": {
      "en-US": "View as text",
      "zh-CN": "以文本形式查看",
      "zh-TW": "以文字形式檢視",
      "ru-RU": "Просм. текст",
      "de-DE": "Zeige als Text"
  },
  "file_view_as_bin": {
      "en-US": "View as binary",
      "zh-CN": "以文字形式檢視",
      "zh-TW": "以二進制形式查看",
      "ru-RU": "Просм. бинарно",
      "de-DE": "Zeige binär"
  },
  "file_paste": {
      "en-US": "Paste",
      "zh-CN": "",
      "zh-TW": "",
      "ru-RU": "Вставить",
      "de-DE": ""
  },
  "file_cut": {
      "en-US": "Cut",
      "zh-CN": "",
      "zh-TW": "",
      "ru-RU": "Вырезать",
      "de-DE": ""
  },
  "file_copy": {
      "en-US": "Copy",
      "zh-CN": "",
      "zh-TW": "",
      "ru-RU": "Копировать",
      "de-DE": ""
  },
  "file_delete": {
      "en-US": "Delete",
      "zh-CN": "删除",
      "zh-TW": "刪除",
      "ru-RU": "Удалить",
      "de-DE": "Löschen"
  },
  "file_manage": {
    "en-US": "Managment",
    "zh-CN": "",
    "zh-TW": "",
    "ru-RU": "Управление",
    "de-DE": ""
  }
})

class FileEditScreen extends SettingsListScreen {
  constructor(data) {
    super();
    this.path = data;
  }

  build() {
    // Stats
    this.field("Location", this.path);

    let fileSize = 0;
    try {
      const [st, e] = FsUtils.stat(this.path);
      if(st.size) {
        this.field(t("field_size"), FsUtils.printBytes(st.size));
        fileSize = st.size;
      }
    } catch(e) {}

    // Open btns
    if(fileSize > 0) {
      if(this.path.endsWith(".png")) {
        this.clickableItem(t("file_view_as_image"), "", () => {
          hmApp.gotoPage({
            url: "page/ImageViewScreen",
            param: this.prepareTempFile(this.path)
          });
        })
      }

      this.clickableItem(t("file_view_as_text"), "", () => {
        hmApp.gotoPage({
          url: "page/TextViewScreen",
          param: this.path
        });
      });

      this.clickableItem(t("file_view_as_bin"), "", () => {
        hmApp.gotoPage({
          url: "page/HexdumpScreen",
          param: this.path
        });
      });
    }

    // Delete btn
    this.headline(t("file_manage"));
    if(this.canPaste() && fileSize == 0) {
      this.clickableItem(t("file_paste"), "menu/paste.png", () => {
        this.doPaste();
      })
    }
    this.clickableItem(t("file_cut"), "menu/cut.png", () => {
      this.pathToBuffer(false);
    });
    this.clickableItem(t("file_copy"), "menu/copy.png", () => {
      this.copyToBuffer(true);
    });
    this.clickableItem(t("file_delete"), "menu/delete.png", () => {
      this.delete();
    });
  }

  delete() {
    FsUtils.rmTree(this.path);
    hmApp.goBack();
  }

  canPaste() {
    const val = hmFS.SysProGetChars("mmk_tb_fm_buf");
    if(!val) return false;

    const [st, e] = FsUtils.stat(val);
    return e == 0;
  }

  doPaste() {
    const src = hmFS.SysProGetChars("mmk_tb_fm_buffer_path");
    const filename = src.substring(src.lastIndexOf("/"));
    const dest = this.path + filename;

    // йа ебал, потом доделаю
  }

  pathToBuffer(keepSource) {
    hmFS.SysProSetChars("mmk_tb_fm_buffer_path", this.path);
    hmFS.SysProSetBool("mmk_tb_buffer_keep_source", keepSource);
    hmApp.goBack();
  }

  prepareTempFile(sourcePath) {
    const current = hmFS.SysProGetChars("mmk_tb_temp");
    if(current) {
      const path = FsUtils.fullPath(current);
      hmFS.remove(path);
    }

    const data = FsUtils.read(sourcePath);
    const newFile = "temp_" + Math.round(Math.random() * 100000) + ".png";
    const dest = hmFS.open_asset(newFile, hmFS.O_WRONLY | hmFS.O_CREAT);
    hmFS.seek(dest, 0, hmFS.SEEK_SET);
    hmFS.write(dest, data, 0, data.byteLength);
    hmFS.close(dest);

    hmFS.SysProSetChars("mmk_tb_temp", newFile);
    return newFile;
  }
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    new FileEditScreen(p).start();
  }
});

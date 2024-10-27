// ==UserScript==
// @name          Mouse Gestures command file (with Wheel Gesture and Rocker Gesture)
// @namespace     http://space.geocities.yahoo.co.jp/gl/alice0775
// @description   Commands for Lightweight customizable mouse gestures. Add Reload and Edit commands menu
// @include       main
// @charset       UTF-8
// @author        Alice0775
// @compatibility 127
// @version       2024/05/10 Bug 1880914 - Move Browser* helper functions used from global menubar and similar commands to a single object in a separate file, loaded as-needed
// @version       2024/05/05 Bug 1892965 - Rename Sidebar launcher and SidebarUI
// @version       2023/09/07 remove to use nsIScriptableUnicodeConverter
// @version       2021/04/11 12:00 workaround 選択テキストで検索 Bug 360332
// @version       2020/12/19 15:00 fix typo
// @version       2020/11/29 20:00 add コンテナータブを指定してリンクを開く
// @version       2020/08/17 16:00 HighlightAll extension のトグル 方法 (Firefox userChrome.js greasemonkeyスクリプトｽﾚ41 595)
// @version       2020/01/20 00:00 fix 'Home'
// @version       2019/10/22 09:00 fix 71.0 fix web search

// @version       2019/10/22 08:00 fix 70.0 fix web search Bug 1587803 - Check BrowserContentHandler.jsm doSearch uses the right engine
// @version       2019/05/21 08:30 fix 69.0a1 Bug 1551320 - Replace all createElement calls in XUL documents with createXULElement
// @version       2019/01/21 01:00 reloadAllTabs to reloadTabs
// @version       2018/09/30 03:00 add dispatchEvent command( dispatch event to content from chrome)
// @version       2018/09/29 19:00 support zoomIn/Out/Reset for pdf.js
// @version       2018/09/29 01:00 add commands list (commands popop, toggle style)
// @version       2018/09/29 00:00 fix commands list (missing arguments webSearchPopup)
// @version       2018/09/29 00:00 add commands list ("Closed Tabs Popup" and "Session History Popup")
// @version       2018/09/28 23:20 fix, reload commands should be for all browser
// @version       2018/09/28 22:50 fix bug forgot to overwrite
// @version       2018/09/28 22:50 fix bug
// @version       2018/09/28 22:00
// ==/UserScript==
// @note          MouseGestures2_e10s.uc.jsより後で読み込むようにしておく
// @note          このファイルで定義されたコマンドでMouseGestures2_e10s.uc.jsの定義を上書きします
// @note          This overwrites the command in the MouseGestures2_e10s.uc.js file // @note          Linux and Mac are not supported.

ucjsMouseGestures_menues = {
  defCommands: function () {
    // == config ==
    // This overwrites the command in the MouseGestures2_e10s.uc.js file
    // These are the mouse gesture mappings. Customize this as you like.

    // Gesture Sequence,  UDRL: right-click then move to up down right left
    // Wheel Gestures,    W+ : right-click then wheel turn down , W- : left-click then wheel turn up
    // Rocker Gestures,   L<R : right-click then left-click , L>R : left-click then right-click
    // Any Gesture Sequence,  *hogehoge :  Gesture Sequence following that any faesture
    // ucjsMouseGestures._lastX, ucjsMouseGestures._lastY  : start coordinates

    // ucjsMouseGestures._linkURLs ,ucjsMouseGestures._linkdocURLs : link url hover, ownerDocument url
    // ucjsMouseGestures._selLinkURLs ,ucjsMouseGestures._selLinkdocURLs: link url in selected, ownerDocument url
    // ucjsMouseGestures._docURL : ownerDocument url
    // ucjsMouseGestures._linkURL ,ucjsMouseGestures._linkTXT : ownerDocument url : link url, ownerDocument url
    // ucjsMouseGestures._imgSRC  _imgTYPE _imgDISP: src mime/type contentdisposition
    // ucjsMouseGestures._mediaSRC : media src
    // ucjsMouseGestures._selectedTXT : selected text
    // ucjsMouseGestures._version : browser major version

    try {
      ucjsMouseGestures.commands = [
        [
          "L",
          "Quay lại",
          function () {
            document.getElementById("Browser:Back").doCommand();
          },
        ],
        [
          "",
          "Tiến lên",
          function () {
            document.getElementById("Browser:Forward").doCommand();
          },
        ],
        [
          "",
          "Trang chủ",
          function () {
            BrowserCommands.home();
          },
        ],

        [
          "",
          "Hiển thị lịch sử tab",
          function () {
            ucjsMouseGestures_helper.sessionHistoryPopup();
          },
        ],
        [
          "",
          "Quay về đầu lịch sử",
          function () {
            SessionStore.getSessionHistory(gBrowser.selectedTab, (history) => {
              gBrowser.gotoIndex((history.entries.length = 0));
            });
          },
        ],
        [
          "",
          "Đi đến cuối lịch sử",
          function () {
            SessionStore.getSessionHistory(gBrowser.selectedTab, (history) => {
              gBrowser.gotoIndex(history.entries.length - 1);
            });
          },
        ],
        [
          "RLR",
          ">> Tua nhanh",
          function () {
            ucjsNavigation?.fastNavigationBackForward(1);
          },
        ],
        [
          "LRL",
          "<< Tua lùi nhanh",
          function () {
            ucjsNavigation?.fastNavigationBackForward(-1);
          },
        ],

        [
          "RULD",
          "Di chuyển lên một cấp",
          function () {
            ucjsMouseGestures_helper.goUpperLevel();
          },
        ],
        [
          "ULDR",
          "Di chuyển theo số tăng",
          function () {
            ucjsMouseGestures_helper.goNumericURL(+1);
          },
        ],
        [
          "DLUR",
          "Di chuyển theo số giảm",
          function () {
            ucjsMouseGestures_helper.goNumericURL(-1);
          },
        ],
        [
          "RL",
          "[Tiếp theo] Di chuyển đến liên kết",
          function () {
            ucjsNavigation?.advancedNavigateLink(1);
          },
        ],
        [
          "LR",
          "[Quay lại] Di chuyển đến liên kết",
          function () {
            ucjsNavigation?.advancedNavigateLink(-1);
          },
        ],

        [
          "UD",
          "Tải lại",
          function () {
            document.getElementById("Browser:Reload").doCommand();
          },
        ],
        [
          "UDU",
          "Tải lại (Bỏ qua bộ nhớ cache)",
          function () {
            document.getElementById("Browser:ReloadSkipCache").doCommand();
          },
        ],
        [
          "",
          "Tải lại tất cả tab",
          function () {
            typeof gBrowser.reloadTabs == "function"
              ? gBrowser.reloadTabs(gBrowser.visibleTabs)
              : gBrowser.reloadAllTabs();
          },
        ],
        [
          "",
          "Ngừng tải",
          function () {
            document.getElementById("Browser:Stop").doCommand();
          },
        ],

        [
          "",
          "Mở liên kết trong tab container",
          function () {
            ucjsMouseGestures_helper.openLinkInContainerTab();
          },
        ],

        [
          "",
          "Mở tất cả liên kết trong vùng chọn trong tab (Nếu không có, tìm kiếm bằng công cụ tìm kiếm mặc định)",
          function () {
            ucjsMouseGestures_helper.openURLsInSelection();
          },
        ],
        [
          "*RDL",
          "Mở tất cả liên kết đã chọn trong tab",
          function () {
            ucjsMouseGestures_helper.openSelectedLinksInTabs();
          },
        ],
        [
          "*RUL",
          "Mở tất cả liên kết đã đi qua trong tab",
          function () {
            ucjsMouseGestures_helper.openHoverLinksInTabs();
          },
        ],
        [
          "R",
          "Mở liên kết trong tab mới",
          function () {
            ucjsMouseGestures_helper.openURLs([ucjsMouseGestures._linkURL]);
          },
        ],

        [
          "",
          "Lưu các liên kết đã chọn",
          function () {
            ucjsMouseGestures_helper.saveSelectedLinks();
          },
        ],
        [
          "",
          "Lưu các liên kết đã đi qua",
          function () {
            ucjsMouseGestures_helper.saveHoverLinks();
          },
        ],

        [
          "",
          "Sao chép",
          function () {
            ucjsMouseGestures_helper.copyText(ucjsMouseGestures._selectedTXT);
          },
        ],
        [
          "",
          "Sao chép các liên kết đã đi qua",
          function () {
            ucjsMouseGestures_helper.copyHoverLinks();
          },
        ],
        [
          "",
          "Sao chép các liên kết đã chọn",
          function () {
            ucjsMouseGestures_helper.copySelectedLinks();
          },
        ],

        [
          "",
          "Lưu liên kết",
          function () {
            ucjsMouseGestures_helper.saveLink(
              ucjsMouseGestures._linkURL,
              ucjsMouseGestures._linkReferrerInfo,
            );
          },
        ],
        [
          "",
          "Lưu hình ảnh",
          function () {
            ucjsMouseGestures_helper.saveImage(
              ucjsMouseGestures._imgSRC,
              ucjsMouseGestures._referrerInfo,
              ucjsMouseGestures._imgTYPE,
              ucjsMouseGestures._imgDISP,
            );
          },
        ],

        [
          "UL",
          "Tab trước",
          function () {
            gBrowser.tabContainer.advanceSelectedTab(-1, true);
          },
        ],
        [
          "UR",
          "Tab tiếp theo",
          function () {
            gBrowser.tabContainer.advanceSelectedTab(+1, true);
          },
        ],
        [
          "ULR",
          "Tab đã chọn trước đó",
          function () {
            ucjsNavigation_tabFocusManager?.advancedFocusTab(-1);
          },
        ],
        [
          "URL",
          "Quay lại tab đã chọn trước đó",
          function () {
            ucjsNavigation_tabFocusManager?.advancedFocusTab(1);
          },
        ],

        [
          "",
          "Mở tab mới",
          function () {
            document.getElementById("cmd_newNavigatorTab").doCommand();
          },
        ],
        [
          "",
          "Mở tab container mới",
          function () {
            ucjsMouseGestures_helper.openLinkInContainerTab(
              "about:blank",
              false,
              false,
            );
          },
        ],
        [
          "",
          "Chuyển đổi ghim tab",
          function () {
            var tab = gBrowser.selectedTab;
            tab.pinned ? gBrowser.unpinTab(tab) : gBrowser.pinTab(tab);
          },
        ],
        [
          "",
          "Nhân bản tab",
          function () {
            var orgTab = gBrowser.selectedTab;
            var newTab = gBrowser.duplicateTab(orgTab);
            gBrowser.moveTabTo(newTab, orgTab._tPos + 1);
          },
        ],
        [
          "LD",
          "Đóng tab",
          function () {
            document.getElementById("cmd_close").doCommand();
          },
        ],
        [
          "",
          "Đóng tab (Ngoại trừ tab ghim)",
          function () {
            if (!gBrowser.selectedTab.pinned) {
              document.getElementById("cmd_close").doCommand();
            }
          },
        ],

        [
          "",
          "Đóng tất cả tab bên trái",
          function () {
            ucjsMouseGestures_helper.closeMultipleTabs("left");
          },
        ],
        [
          "",
          "Đóng tất cả tab bên phải",
          function () {
            ucjsMouseGestures_helper.closeMultipleTabs("right");
          },
        ],
        [
          "",
          "Đóng tất cả tab khác",
          function () {
            gBrowser.removeAllTabsBut(gBrowser.selectedTab);
          },
        ],
        [
          "DRU",
          "Khôi phục tab đã đóng",
          function () {
            document.getElementById("History:UndoCloseTab").doCommand();
          },
        ],
        [
          "",
          "Hiển thị pop-up danh sách tab đã đóng",
          function () {
            ucjsMouseGestures_helper.closedTabsPopup();
          },
        ],
        [
          "",
          "Đóng tất cả tab",
          function () {
            var browser = gBrowser;
            var ctab = browser.addTrustedTab(BROWSER_NEW_TAB_URL, {
              skipAnimation: true,
            });
            browser.removeAllTabsBut(ctab);
          },
        ],
        [
          "",
          "Đóng cửa sổ",
          function () {
            document.getElementById("cmd_closeWindow").doCommand();
          },
        ],

        [
          "",
          "Thu nhỏ",
          function () {
            window.minimize();
          },
        ],
        [
          "",
          "Phóng to/Khôi phục kích thước",
          function () {
            window.windowState == 1 ? window.restore() : window.maximize();
          },
        ],
        [
          "LDRU",
          "Toàn màn hình",
          function () {
            document.getElementById("View:FullScreen").doCommand();
          },
        ],

        [
          "RU",
          "Cuộn lên đầu trang",
          function () {
            goDoCommand("cmd_scrollTop");
          },
        ],
        [
          "RD",
          "Cuộn xuống cuối trang",
          function () {
            goDoCommand("cmd_scrollBottom");
          },
        ],
        [
          "U",
          "Cuộn lên",
          function () {
            goDoCommand("cmd_scrollPageUp");
          },
        ],
        [
          "D",
          "Cuộn xuống",
          function () {
            goDoCommand("cmd_scrollPageDown");
          },
        ],

        [
          "W-",
          "Phóng to",
          function () {
            ucjsMouseGestures_helper.zoomIn();
          },
        ],
        [
          "W+",
          "Thu nhỏ",
          function () {
            ucjsMouseGestures_helper.zoomOut();
          },
        ],
        [
          "L<R",
          "Đặt lại thu phóng",
          function () {
            ucjsMouseGestures_helper.zoomReset();
          },
        ],

        [
          "DL",
          "Thanh tìm kiếm trên trang",
          function () {
            if (gFindBarInitialized) {
              gFindBar.hidden ? gFindBar.onFindCommand() : gFindBar.close();
            } else {
              gLazyFindCommand("onFindCommand");
            }
          },
        ],

        [
          "",
          "Tìm kiếm với văn bản đã chọn",
          function () {
            ucjsMouseGestures_helper._loadSearchWithDefaultEngine(
              ucjsMouseGestures._selectedTXT || ucjsMouseGestures._linkTXT,
              false,
            );
          },
        ],
        [
          "DRD",
          "Tìm kiếm với văn bản đã chọn (Pop-up công cụ tìm kiếm)",
          function () {
            ucjsMouseGestures_helper.webSearchPopup(
              ucjsMouseGestures._selectedTXT || ucjsMouseGestures._linkTXT,
            );
          },
        ],
        [
          "DR",
          "Sao chép văn bản đã chọn vào thanh tìm kiếm",
          function () {
            if (BrowserSearch.searchBar) {
              BrowserSearch.searchBar.value =
                ucjsMouseGestures._selectedTXT || ucjsMouseGestures._linkTXT;
              BrowserSearch.searchBar.updateGoButtonVisibility();
            }
          },
        ],
        [
          "",
          "Thêm văn bản đã chọn vào thanh tìm kiếm",
          function () {
            if (BrowserSearch.searchBar.value) {
              BrowserSearch.searchBar.value =
                BrowserSearch.searchBar.value +
                " " +
                (ucjsMouseGestures._selectedTXT || ucjsMouseGestures._linkTXT);
              BrowserSearch.searchBar.updateGoButtonVisibility();
            } else {
              BrowserSearch.searchBar.value =
                ucjsMouseGestures._selectedTXT || ucjsMouseGestures._linkTXT;
              BrowserSearch.searchBar.updateGoButtonVisibility();
            }
          },
        ],
        [
          "",
          "Xóa thanh tìm kiếm (Hộp tìm kiếm web)",
          function () {
            document.getElementById("searchbar").value = "";
            BrowserSearch.searchBar.updateGoButtonVisibility();
          },
        ],
        [
          "",
          "Chuyển đổi CSS",
          function () {
            var styleDisabled = gPageStyleMenu._getStyleSheetInfo(
              gBrowser.selectedBrowser,
            ).authorStyleDisabled;
            if (styleDisabled) gPageStyleMenu.switchStyleSheet("");
            else gPageStyleMenu.disableStyle();
          },
        ],

        [
          "UDUD",
          "Hiển thị lệnh cử chỉ",
          function () {
            ucjsMouseGestures_helper.commandsPopop();
          },
        ],
        [
          "",
          "Khởi động lại",
          function () {
            ucjsMouseGestures_helper.restart();
          },
        ],

        [
          "",
          "Thanh bên bookmark",
          function () {
            SidebarController.toggle("viewBookmarksSidebar");
          },
        ],
        [
          "",
          "Thanh bên lịch sử",
          function () {
            SidebarController.toggle("viewHistorySidebar");
          },
        ],

        [
          "",
          "Xóa lịch sử gần đây",
          function () {
            setTimeout(function () {
              document.getElementById("Tools:Sanitize").doCommand();
            }, 0);
          },
        ],
        [
          "",
          "Bảng điều khiển trình duyệt",
          function () {
            ucjsMouseGestures_helper.openBrowserConsole();
          },
        ],
        [
          "",
          "Quản lý tiện ích mở rộng",
          function () {
            openTrustedLinkIn("about:addons", "tab", {
              inBackground: false,
              relatedToCurrent: true,
            });
          },
        ],
        [
          "",
          "Thông tin khắc phục sự cố",
          function () {
            openTrustedLinkIn("about:support", "tab", {
              inBackground: false,
              relatedToCurrent: true,
            });
          },
        ],
        [
          "",
          "Cài đặt (Tùy chọn)",
          function () {
            openTrustedLinkIn("about:preferences", "tab", {
              inBackground: false,
              relatedToCurrent: true,
            });
          },
        ],
        [
          "",
          "Bật/tắt weAutopagerize",
          function () {
            ucjsMouseGestures_helper.dispatchEvent({
              target: "document",
              type: "AutoPagerizeToggleRequest",
            });
          },
        ],
        [
          "",
          "Bật/tắt weAutopagerize Phương pháp 2",
          function () {
            ucjsMouseGestures_helper.executeInContent(function aFrameScript() {
              content.document.dispatchEvent(
                new content.Event("AutoPagerizeToggleRequest"),
              );
            });
          },
        ],

        [
          "",
          "Lưu tất cả canvas trong trang",
          function () {
            let browserMM = gBrowser.selectedBrowser.messageManager;
            browserMM.addMessageListener("getCanvas", function fnc(listener) {
              browserMM.removeMessageListener("getCanvas", fnc, true);
              let data = listener.data;
              let i = data.length;
              while (i) {
                let IMGtitle = ("000" + i).slice(-3);
                i--;
                saveURL(
                  data[i],
                  null,
                  IMGtitle + ".png",
                  null,
                  false,
                  true,
                  ucjsMouseGestures._referrerInfo,
                  ucjsMouseGestures._cookieJarSettings,
                  null,
                  PrivateBrowsingUtils.isWindowPrivate(window),
                  Services.scriptSecurityManager.createNullPrincipal({}),
                );
              }
            });
            function contentScript() {
              function populate(win) {
                let data = [];
                for (let j = 0; j < win.frames.length; j++) {
                  data = data.concat(populate(win.frames[j]));
                }

                let elems = win.document.getElementsByTagName("canvas");
                let i = elems.length;
                while (i--) {
                  data.push(elems[i].toDataURL("image/png"));
                }
                return data;
              }
              let data = populate(content.document.defaultView);
              sendAsyncMessage("getCanvas", data);
            }
            let script =
              "data:application/javascript;charset=utf-8," +
              encodeURIComponent("(" + contentScript.toString() + ")();");
            browserMM.loadFrameScript(script, false);
          },
        ],

        [
          "",
          "Kiểm tra mã script frame",
          function () {
            // Thực thi mã script frame
            ucjsMouseGestures_helper.executeInContent(
              function aFrameScript(window) {
                // các biến sau có sẵn trong script frame
                // ucjsMouseGestures._linkURL     // URL liên kết tại thời điểm cử chỉ chuột (chuỗi)
                // ucjsMouseGestures._linkTXT     //      văn bản liên kết (chuỗi)
                // ucjsMouseGestures._imgSRC      // nguồn hình ảnh tại thời điểm cử chỉ chuột (chuỗi)
                // ucjsMouseGestures._imgTYPE     //       mime/type (chuỗi)
                // ucjsMouseGestures._imgDISP     //       cpntent-disposition (chuỗi)
                // ucjsMouseGestures._mediaSRC    // nguồn media tại thời điểm cử chỉ chuột (chuỗi)

                // Thử nghiệm thực thi mã Chrome từ mã script frame
                ucjsMouseGestures.executeInChrome(
                  function aChromeScript(url, inBackground = true) {
                    gBrowser.addTab(url, {
                      relatedToCurrent: true,
                      inBackground: inBackground,
                      triggeringPrincipal:
                        Services.scriptSecurityManager.createNullPrincipal({}),
                    });
                  },
                  ["http://www.yahoo.co.jp", false],
                );
              },
            );
          },
        ],
        [
          "",
          "HighlightAll extension のトグル 方法",
          function () {
            let tip = Cc["@mozilla.org/text-input-processor;1"].createInstance(
              Ci.nsITextInputProcessor,
            );
            if (!tip.beginInputTransactionForTests(window)) {
              return;
            }
            let keyEventF8 = new KeyboardEvent("", {
              key: "F8",
              keyCode: KeyboardEvent.DOM_VK_F8,
            });
            let keyEventCtrl = new KeyboardEvent("", {
              key: "Control",
              keyCode: KeyboardEvent.DOM_VK_CONTROL,
            });
            tip.keydown(keyEventCtrl);
            tip.keydown(keyEventF8);
            tip.keyup(keyEventF8);
            tip.keyup(keyEventCtrl);
          },
        ],
      ];

      // == /config ==
    } catch (ex) {
      Services.console.logMessage(ex);
    }
  },

  // == config ==
  editor: "C:\\Program Files\\hidemaru\\hidemaru.exe",
  // editor: "/usr/bin/gedit",
  // == /config ==

  load: function () {
    this.defCommands();
    if (document.getElementById("ucjsMouseGestures_menues")) return;
    this.createMenu();
  },

  createMenu: function () {
    let ref = document.getElementById("menu_preferences");
    let menu = document.createXULElement("menu");
    menu.setAttribute("id", "ucjsMouseGestures_menues");
    menu.setAttribute("label", "ucjsMouseGestures");
    ref.parentNode.insertBefore(menu, ref);
    let menupopup = document.createXULElement("menupopup");
    menu.appendChild(menupopup);
    let menuitem = document.createXULElement("menuitem");
    menupopup.appendChild(menuitem);
    menuitem.setAttribute("id", "ucjsMouseGestures_menuepopup");
    menuitem.setAttribute("label", "Reload commands");
    menuitem.setAttribute(
      "oncommand",
      "ucjsMouseGestures_menues.reloadCommands();",
    );

    menuitem = document.createXULElement("menuitem");
    menupopup.appendChild(menuitem);
    menuitem.setAttribute("id", "ucjsMouseGestures_menues_launchEditor");
    menuitem.setAttribute("label", "Edit commands");
    menuitem.setAttribute(
      "oncommand",
      "ucjsMouseGestures_menues.launchEditor();",
    );
  },

  launchEditor: function () {
    var editor = this.editor;
    /*
    var UI = Components.classes['@mozilla.org/intl/scriptableunicodeconverter'].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);

    var platform = window.navigator.platform.toLowerCase();

    if(platform.indexOf('win') > -1){
      UI.charset = 'Shift_JIS';
    }else{
      UI.charset =  'UTF-8';
    }
    var path = Services.io.getProtocolHandler("file").
               QueryInterface(Components.interfaces.nsIFileProtocolHandler).
               getFileFromURLSpec(this.getThisFileUrl()).path
    path = UI.ConvertFromUnicode(path);
*/
    var path = Services.io
      .newURI(this.getThisFileUrl())
      .QueryInterface(Ci.nsIFileURL).file.path;

    var appfile = Components.classes[
      "@mozilla.org/file/local;1"
    ].createInstance(Components.interfaces.nsIFile);
    appfile.initWithPath(editor);
    var process = Components.classes[
      "@mozilla.org/process/util;1"
    ].createInstance(Components.interfaces.nsIProcess);
    process.init(appfile);
    process.runw(false, [path], 1, {});
  },

  getThisFileUrl: function () {
    return Error().fileName.split(" -> ").pop().split("?")[0];
  },

  reloadCommands: function () {
    let url = this.getThisFileUrl();
    let file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
    let fileProtocolHandler = Services.io
      .getProtocolHandler("file")
      .QueryInterface(Ci.nsIFileProtocolHandler);
    let path = fileProtocolHandler.getFileFromURLSpec(url).path;
    file.initWithPath(path);

    let enumerator = Services.wm.getEnumerator("navigator:browser");
    while (enumerator.hasMoreElements()) {
      let win = enumerator.getNext();
      Cc["@mozilla.org/moz/jssubscript-loader;1"]
        .getService(Ci.mozIJSSubScriptLoader)
        .loadSubScript(
          url + "?" + this.getLastModifiedTime(file),
          win,
          "utf-8",
        );
    }
  },

  getLastModifiedTime: function (aFile) {
    Components.classes["@mozilla.org/consoleservice;1"]
      .getService(Components.interfaces.nsIConsoleService)
      .logStringMessage(aFile.lastModifiedTime);
    return aFile.lastModifiedTime;
  },
};
if (typeof ucjsMouseGestures != "undefined") ucjsMouseGestures_menues.load();

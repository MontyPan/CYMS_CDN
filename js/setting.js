var h5_version = "0.9.1";
var api_url = "//123.59.68.12";

/** 
 * key 是 locale 名稱，要能在 ../i18n 下找到對應 JSON 檔。
 * value 是在 UI 上頭顯示的字串，這裡就沒法套 i18n 了...... XD
 * 
 * 另外，這邊的順序通常也會是 UI 呈現時的順序
 */
var language = {
    "zh_cn": "简体中文",
    "zh_tw": "繁體中文", 
    "ko": "한국어",
    "jp": "日本語",
    "id": "Indonesia",
    "vi": "Tiếng việt",
    "th": "ไทย",
    "en": "English"
};

var footerText = "DontCareAbout CYMS \\囧/";

/**
 * custom.js 當中「自主管理狀態下定時跳到問卷畫面」的時間間隔長度設定，
 * 單位是「秒」。
 */
var selfManagementQuestionPeriod = 30000;
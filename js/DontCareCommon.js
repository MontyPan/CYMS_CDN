var storageItem = {
	locale: "locale",
}
Object.freeze(storageItem);	//確保不會被改值

var dontCare = {
	decideLocale: function() {
		var url = new URL(location.href);
		var key = storageItem.locale;
		if (url.searchParams.has(key)) {
			localStorage.setItem(key, url.searchParams.get(key));
		}

		var result = this.localeInStorage();
		if (result != null) { return result; }

		return "zh_cn";
	},

	localeInStorage: function() {
		return localStorage.getItem(storageItem.locale);
	},

	prepareI18N: function(customFunction) {
		var locale = dontCare.decideLocale();
	
		$.i18n().locale = locale;
		$.i18n().load('i18n/' + locale + '.json', locale).then(
			function() {
				$('html').i18n();
				if (customFunction != null) { customFunction(); }
			}
		);
	}
}

//避免還沒包 dontCare 的 code 要重寫，所以用這招重新指定
//以後就統統包在 dontCare 裡頭吧...... Orz
var prepareI18N = dontCare.prepareI18N;

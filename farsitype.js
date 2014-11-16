
var FarsiType = {
	farsiKey: [
		32,	33,	34,	35,	36,	37,	1548,	1711,
		41,	40,	215,	43,	1608,	45,	46,	47,
		48,	49,	50,	51,	52,	53,	54,	55,
		56,	57,	58,	1705,	44,	61,	46,	1567,
		64,	1616,	1584,	125,	1609,	1615,	1609,	1604,
		1570,	247,	1600,	1548,	47,	8217,	1583,	215,
		1563,	1614,	1569,	1613,	1601,	8216,	123,	1611,
		1618,	1573,	126,	1580,	1688,	1670,	94,	95,
		1662,	1588,	1584,	1586,	1740,	1579,	1576,	1604,
		1575,	1607,	1578,	1606,	1605,	1574,	1583,	1582,
		1581,	1590,	1602,	1587,	1601,	1593,	1585,	1589,
		1591,	1594,	1592,	60,	124,	62,	1617
	],
	Type: true,
	ShowLang: 1
}

FarsiType.init = function(d) {
	d.find('input[type=text][lang],textarea[lang]').each(function()
	{
		new FarsiType.KeyObject(this);
	});	
}

FarsiType.KeyObject = function(z) {
	z.farsi = false;
	if($(z).attr('lang') == 'fa')
	{
		z.farsi = true;
	}
	if (FarsiType.ShowLang == 1 && z.farsi == true) {
		str = $('<input type="button" class="btn btn-grey btn-mini"  value="fa" />');
		str.insertAfter($(z)).on('click',function(k){
			ChangeLang(k,z);
		});
	}
	setSelectionRange = function(input, selectionStart, selectionEnd) {
		input.focus()
		input.setSelectionRange(selectionStart, selectionEnd)
	}

	ChangeLang = function(e, ze) {
		z = ze;
		if (FarsiType.Type) {
			if (z.farsi) {
				z.farsi = false;
				if (FarsiType.ShowLang == 1) { 
					$(z).next().val('en');
				}
			} else {
				z.farsi = true;
				if (FarsiType.ShowLang == 1) { 
					$(z).next().val('fa');
				}
			}
			z.focus();
		}
		
		if (e.preventDefault) e.preventDefault();
		e.returnValue = false;
		return false;
	}

	Convert = function(e) {

		if (e == null)
			e = window.event;

		var key = e.which || e.charCode || e.keyCode;
		var eElement = e.target || e.originalTarget || e.srcElement;

		if (e.ctrlKey && key == 32) {
			ChangeLang(e, z);
		}

		if (FarsiType.Type) {
			if (
				(e.charCode != null && e.charCode != key) ||
				(e.which != null && e.which != key) ||
				(e.ctrlKey || e.altKey || e.metaKey) ||
				(key == 13 || key == 27 || key == 8)
			) return true;

			//check windows lang
			if (key > 128) {
					alert("Please change your windows language to English");
					return false;
			}

			// If Farsi
			if (FarsiType.Type && z.farsi) {

				//check CpasLock
				if ((key >= 65 && key <= 90&& !e.shiftKey) || (key >= 97 && key <= 122 ) && e.shiftKey) {
					alert("Caps Lock is On. To prevent entering farsi incorrectly, you should press Caps Lock to turn it off.");
					return false;
				}

				// Shift-space -> ZWNJ
				if (key == 32 && e.shiftKey)
					key = 8204;
				else
					key = FarsiType.farsiKey[key-32];

				key = typeof key == 'string' ? key : String.fromCharCode(key);

				// to farsi
				try {
				
					var docSelection = document.selection;
					var selectionStart = eElement.selectionStart;
					var selectionEnd = eElement.selectionEnd;

					if (typeof selectionStart == 'number') { 
						//FOR W3C STANDARD BROWSERS
						var nScrollTop = eElement.scrollTop;
						var nScrollLeft = eElement.scrollLeft;
						var nScrollWidth = eElement.scrollWidth;
	
						eElement.value = eElement.value.substring(0, selectionStart) + key + eElement.value.substring(selectionEnd);
						setSelectionRange(eElement, selectionStart + key.length, selectionStart + key.length);
		
						var nW = eElement.scrollWidth - nScrollWidth;
						if (eElement.scrollTop == 0) { eElement.scrollTop = nScrollTop }
					} else if (docSelection) {
						var nRange = docSelection.createRange();
						nRange.text = key;
						nRange.setEndPoint('StartToEnd', nRange);
						nRange.select();
					}
	
				} catch(error) {
					try {
						// IE
						e.keyCode = key
					} catch(error) {
						try {
							// OLD GECKO
							e.initKeyEvent("keypress", true, true, document.defaultView, false, false, true, false, 0, key, eElement);
						} catch(error) {
								eElement.value += key;						
						}
					}
				}

				if (e.preventDefault)
					e.preventDefault();
				e.returnValue = false;
			}
		}
		return true;
	}
	z.onkeypress = Convert;
}

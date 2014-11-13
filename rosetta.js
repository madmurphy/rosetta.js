"use strict";

/*\
|*|
|*|  :: rosetta.js ::
|*|
|*|  A possible, extensible collection of compilers to native ECMAScript.
|*|
|*|  November 12, 2014
|*|
|*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
|*|  https://developer.mozilla.org/User:fusionchess
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntax:
|*|
|*|  * rosetta.appendCompiler([ "text/x-csrc", "text/x-c" ], yourSourceBuilder);
|*|
\*/

var rosetta = new (function () {

	function createScript (oScript, oXHR200) {

		var
			sMimeType = oScript.getAttribute("type").toLowerCase(),
			oBaton = document.createComment(" The previous code has been automatically translated from \"" + sMimeType + "\" to \"text/ecmascript\". ");

		if (!oDicts.hasOwnProperty(sMimeType)) {
			alert("rosetta.translateScript() \u2013 Unknown mime-type \"" + sMimeType + "\": script ignored.");
			return;
		}

		var oCompiled = document.createElement("script");
		oScript.parentNode.insertBefore(oBaton, oScript);
		oScript.parentNode.removeChild(oScript);

		for (var aAttrs = oScript.attributes, nAttr = 0; nAttr < aAttrs.length; nAttr++) {
			oCompiled.setAttribute(aAttrs[nAttr].name, aAttrs[nAttr].value);
		}

		oCompiled.type = "text\/ecmascript";
		if (oXHR200) { oCompiled.src = "data:text\/javascript," + encodeURIComponent(oDicts[sMimeType](oXHR200.responseText)); }
		oCompiled.text = oXHR200 ? "" : oDicts[sMimeType](oScript.text);
		oBaton.parentNode.insertBefore(oCompiled, oBaton);

	}

	function reqError (oError) {
		throw new URIError("The script " + oError.target.src + " is not accessible.");
	}

	function reqSuccess () {
		createScript(this.refScript, this);
	}

	function getSource (oScript) {
		var oReq = new XMLHttpRequest();
		oReq.onload = reqSuccess;
		oReq.onerror = reqError;
		oReq.refScript = oScript;
		oReq.open("GET", oScript.src, true);
		oReq.send(null);
	}

	function parseScript (oScript) {
		if (oScript.hasAttribute("type") && !rIgnoreMimes.test(oScript.getAttribute("type").toLowerCase())) {
			oScript.hasAttribute("src") ? getSource(oScript) : createScript(oScript);
		}
	}

	function parseDocument () {
		for (
			var
				aScripts = document.getElementsByTagName("script"),
				nIdx = 0;
			nIdx < aScripts.length;
			parseScript(aScripts[nIdx++])
		);
	}

	var
		oDicts = {},
		rIgnoreMimes = /^\s*(?:text\/javascript|text\/ecmascript)\s*$/;

	this.translateScript = parseScript;

	this.translateAll = parseDocument;

	this.appendCompiler = function (vMimeTypes, fCompiler) {

		if (arguments.length < 2) {
			throw new TypeError("rosetta.appendCompiler() \u2013 not enough arguments");
		}

		if (typeof fCompiler !== "function") {
			throw new TypeError("rosetta.appendCompiler() \u2013 second argument must be a function");
		}

		if (!Array.isArray(vMimeTypes)) {
			oDicts[(vMimeTypes).toString()] = fCompiler;
			return true;
		}

		for (var nIdx = 0; nIdx < vMimeTypes.length; nIdx++) {
			oDicts[(vMimeTypes[nIdx]).toString()] = fCompiler;
		}

		return true;
	};

})();

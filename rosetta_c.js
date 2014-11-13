/* C Compiler for Rosetta */

(function () {

	if (!window.rosetta) { return; }

	/* This function takes as argument a plain text (in this case, a code written in C) and returns another plain text written in ECMAScript */
	function createECMASrc (sCSrc) {
		/* This is just an empty example... Enjoy in creating your C compiler! */
		return "alert(\"Here you have the C code to be compiled to ECMAScript:\\n\\n\" + " + JSON.stringify(sCSrc) + ");";
	}

	rosetta.appendCompiler([ "text/x-csrc", "text/x-c" ], createECMASrc);

})();

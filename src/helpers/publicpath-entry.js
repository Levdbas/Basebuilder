/**
 * Setting entrypath by checking the variable bp_site.
 */
if (window.basebuilder) {
	__webpack_public_path__ = window.basebuilder['dist'];
}
else if (window.bp_site) {
	__webpack_public_path__ = window.bp_site['dist'];
}
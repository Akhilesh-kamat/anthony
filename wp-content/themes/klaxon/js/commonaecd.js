//Global utility functions that may be used by different script files - loaded early
var desktopScreenSize = 1025; //Mobile-desktop screen size cutoff in pixels

//Returns true if window is above mobile size
function isDesktopScreen() {
	if (window.innerWidth >= desktopScreenSize) {
		return true;
	}
	return false;
}

//Returns true if window is mobile size
function isMobileScreen() {
	if (window.innerWidth < desktopScreenSize) {
		return true;
	}
	return false;
}

//Returns a random integer between a minimum and maximum
//Minimum is INCLUSIVE, maximum is EXCLUSIVE (min. 1, max. 3 will returns 1s and 2s)
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}

//Returns TRUE if page contains any of selected elements
//Usage: if ($(selector).exists())
jQuery.fn.exists = function() {
	return this.length !== 0;
}

//Adds "active" class to an element
//Usage: $(selector).addActive()
jQuery.fn.addActive = function() {
	jQuery(this).addClass('active');
}

//Removes "active" class from an element
jQuery.fn.removeActive = function() {
	jQuery(this).removeClass('active');
}

//Returns TRUE if an element has the "active" class
//Usage: if ($(selector).isActive())
jQuery.fn.isActive = function() {
	return jQuery(this).hasClass('active');
}

//Sorts elements based on data attribute after load
//Call in document ready like so: $('.search-results-attorneys').sortItems("li", "relevance", true);
//HTML setup has parent container with class "search-results-attorneys" and list items with custom data attribute, e.g. <li data-relevance="50">
jQuery.fn.sortItems = function sortItems(elementType, dataAttribute, ascending) {
	if (ascending)
	{
		$("> " + elementType, this[0]).sort(asc_sort).appendTo(this[0]);
	}
	else
	{
		$("> " + elementType, this[0]).sort(desc_sort).appendTo(this[0]);
	}

	function asc_sort(a, b){ return ($(b).data(dataAttribute)) > ($(a).data(dataAttribute)) ? 1 : -1; }
	function desc_sort(a, b){ return ($(b).data(dataAttribute)) < ($(a).data(dataAttribute)) ? 1 : -1; }
}
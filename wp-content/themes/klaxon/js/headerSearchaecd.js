//Header search with AJAX script
(function($) {
	//Global variables
	var minCharactersPredictiveSearch = 4; //Minimum number of characters in header search to activate lazy search

	//Document ready - search setup
	$(function() {
		prepareHeaderSearch();
	});

	//Search toggle condition on button click
	$(".header-search-toggle").on("click", function(e) {
		toggleHeaderSearch();
	});


	//Search toggle condition on keypress
	$(document).keyup(function(e) {
		if ((e.key === "Escape") && (isDesktopScreen())) { //Escape key maps to keycode 27
			toggleHeaderSearch();
		}
	});

	//Open and close header search panel
	function toggleHeaderSearch() {
		$("#header-search").toggleClass("active");
		$('#header-search-results').removeActive();
		if ($("body").hasClass("search-open") == false) {
			//OPEN top search
			$("#desktop-header-search-input").focus(); //Force focus to the search
			$("body").addClass("search-open");

			//Ensure keyboard focus on search features
			$('#header-search input, #header-search button').attr('tabindex','0');
		}
		else {
			//CLOSE top search
			$("body").removeClass("search-open");

			//Do not want a closed header search to be keyboard focusable
			$('#header-search input, #header-search button').attr('tabindex','-1');
		}
	}

	//Attach event listener for input on header search so AJAX can fire
	function prepareHeaderSearch() {
		$('#header-search-input').one('input', headerSearchTrigger);
	}

	//Triggers an AJAX search request or prepares listener again
	var headerSearchTrigger = function() {
		//If at least x characters entered in search bar, launch AJAX search; if not, reattach event listener
		if ($('#header-search-input').val().length >= minCharactersPredictiveSearch)
		{
			requestSearchResponse();
		}
		else
		{
			prepareHeaderSearch();
			$('#header-search-results').removeActive();
		}
	}

	//Fires AJAX request that is handled in PHP, result returned via JSON
	function requestSearchResponse() {
		jQuery.ajax({
			type: 'get',
			url: $('#header-search-input').attr('data-ajax-action'), //Points to file handling AJAX request
			data: {
				action: 'header_search_change', //PHP hears this action and responds
				keyword: $('#header-search-input').val() //Value sent with GET so PHP can use it
			},
			success: function(response) {
				$('#header-search-results').html(response);
				$('#header-search-results').addActive();

				//If the term searched no longer matches what's in the search input, re-run search
				if ($('#header-search .search-results-container').attr('data-keyword-searched') != $('#header-search-input').val())
				{
					requestSearchResponse();
				}
				else
				{
					//Allow header search to happen again
					prepareHeaderSearch();
				}
			}
		});
	}
})(jQuery);
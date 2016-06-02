/*A jQuery plugin which add loading indicators into buttons
* By Minoli Perera
* MIT Licensed.
*/
(function ($) {
    $.fn.buttonLoader = function (action) {
        var self = $(this);
        //start loading animation
        if (action == 'start') {
            if ($(self).attr("disabled") == "disabled") {
                e.preventDefault();
            }
            //disable buttons when loading state
            $('.has-spinner').attr("disabled", "disabled");
            var loderText = "Loading...";
            $(self).attr('data-btn-text', $(self).html()); 
            console.log("$(self).text() == " + $(self).html());
            //binding spinner element to button and changing button text
            if(loderText !== undefined && loderText !== "") {
                $(self).html('<span class="spinner"><i class="fa fa-spinner fa-spin"></i></span>' + loderText);
            }
            else {
                $(self).html('<span class="spinner"><i class="fa fa-spinner fa-spin"></i></span>Loading');
            }
            
            $(self).addClass('active');
        }
        //stop loading animation
        if (action == 'stop') {
            $(self).html($(self).attr('data-btn-text'));
            $(self).removeClass('active');
            //enable buttons after finish loading
            $('.has-spinner').removeAttr("disabled");
        }
    }
})(jQuery);

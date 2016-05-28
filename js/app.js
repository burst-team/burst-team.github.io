//Reszing things based on screensize
function sizes(){
    $("#docs-anchor").width( ( $("#docs-item-content").width() / 3 ) );
    activateTab($("nav ul.desktop-navigation li.active a").attr("href"));
    $(".nano").nanoScroller();
}

//init materialize stuff
$('.button-collapse').sideNav({closeOnClick: true});
function materialInit(){
    $('#docs-anchor').pushpin({
        top: 124,
        offset: 64
    });
    $('.collapsible').collapsible({
        accordion : true
    });
    $('.tooltipped').tooltip({delay: 50});
    // Set element sizes
    sizes();
};


//When initial page loads remove preloader
$(document).ready(function(){
    materialInit();
    $("#preloader").fadeOut(600).hide();
    activateTab($("nav ul.desktop-navigation li.active a").attr("href"));
});

//Fix sizes on resize
$(window).resize(function(){
    sizes();
});


// Page changing
function getLocation() {
    return location.pathname + location.search;
}

//Vars
var currentLocation = getLocation();
var previousHistory = window.location.href;

// Page changer
function changePage(href){
    //Show the preloader
    $("#preloader").show();

    //Load content
    $('#page-body').load(href + " #page-body-inner", function(response, status, xhr){

        // Check for error
        if ( status == "error" ) {
            //For console
            console.log(xhr);
            //Show a toast with the error
            Materialize.toast("<span class='red-text'>Error! &nbsp;</span> (code: &nbsp; <b>" + xhr.status + "</b>)", 4000,"white primary-text");


            console.log(previousHistory);
            history.pushState(null, null, previousHistory);
        }

        // Re activate plugins
        materialInit()

        // Ditch loader and show page
        $("#preloader").hide();

        // Change active tab
        activateTab(href);

        // Animate scrolling back to the top
        $("html, body").animate({ scrollTop: 0 }, "slow");

    });

    //Load the title tag
    $('#title').load(href + " #title", "", function(data) {
        document.title = $(this).text();
    });

    console.log(href);
    // If forum page
    if(href == "/forum/"){
        window.location.reload();
    };

    // Set new current location
    currentLocation = getLocation();
}
// Link click
$(document).on("click", ".internal-link", function(e){
    //Make sure the browser is new enough
    if (typeof(window.history.pushState) === typeof(Function)){

        //Show preloader
        $("#preloader").show();

        //Stop default changing page
        e.preventDefault();

        //Clicked link's href
        var href = $(this).attr("href");

        //Store the old history
        previousHistory = window.location.href;

        //set the history
        history.pushState(null, null, href);

        //Change the page contents
        changePage(href);

        // Close sidenav
        //$('.button-collapse').sideNav('hide');
    }
});

// Browser back button
window.onpopstate = function(e){

    //New loaction from back button
    var newLocation = getLocation();
    //Check the loaction has actually changed before acting on it
    if(newLocation != currentLocation) {
        // If yes, change the page
        changePage( location.pathname);
    }
};

// Contact form
$(document).on("submit", "#contact-form", function(e){
    e.preventDefault();
    console.log($(this).serialize());
    $.ajax({
        url: "//formspree.io/irontiga@gmail.com",
        method: "POST",
        data: $(this).serialize(),
        dataType: "json",
        beforeSend: function() {
            $("#contact-loading").removeClass("hidden");
            $("#contact-submit").addClass("hidden");
        },
        success: function(data) {
            Materialize.toast('<b>Success!</b>', 4000,"white teal-text");
            $("contact-form").trigger("reset");
            $("#contact-loading").addClass("hidden");
            $("#contact-submit").removeClass("hidden");
        },
        error: function(err) {
            Materialize.toast('<b>Error!</b> &nbsp; Please check your submission', 4000,"white red-text");
            $("#contact-loading").addClass("hidden");
            $("#contact-submit").removeClass("hidden");
        }
    });
});



// Navbar underline
function activateTab(href){

    if(typeof href == "undefined"){
        return;
    }
    
    var isTab = false;
    $("nav ul.desktop-navigation li a").each(function(){
        if(href.indexOf($(this).attr("href")) > -1){
            toActivate = $(this).parent();
            isTab = true;
            return false;
        }
    });
    if(!isTab || href == "/"){
        $(".active-indicator").css({
            "left" : 0,
            "width" : 0
        });
    }
    else{
        $("nav ul.desktop-navigation li.active").removeClass("active");
        toActivate.addClass("active");

        activateLi = $("nav ul.desktop-navigation li.active");

        $(".active-indicator").css({
            "left" : activateLi.position().left,
            "width" : activateLi.width()
        });
    }


    isTab = false;
    //console.log($("#mobile-menu li a"));

    $("#mobile-menu li a").each(function(){

        if(href.indexOf($(this).attr("href")) > -1){
            toActivate = $(this).parent();
            isTab = true;
            return false;
        }
    });
    $("#mobile-menu li.active").removeClass("active");
    if(isTab || href !== "/"){
        toActivate.addClass("active");
    }
}



// top-nav

function topNav(){
    var st = $(window).scrollTop();
    console.log(st);
    if(st < 10){
        $("#navbar").addClass("top-nav");
        $(".side-nav.fixed").css({
            top:"80px"
        });
    }
    else{
        $("#navbar").removeClass("top-nav");
        $(".side-nav.fixed").css({
            top:"64px"
        });
    }
};

$(topNav());
$(window).scroll(function(){
    topNav();
});





// Fire a resize event when the scrollbar appears (for the forum page)
var iframe = document.createElement('iframe');
iframe.id = "window-size-listener";
iframe.style.cssText = 'height: 0; background-color: transparent; margin: 0; padding: 0; overflow: hidden; border-width: 0; position: absolute; width: 100%;';
iframe.onload = function() {
    iframe.contentWindow.addEventListener('resize', function() {
        try {
            var evt = document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);
        } catch(e) {}
    });
};
document.body.appendChild(iframe);
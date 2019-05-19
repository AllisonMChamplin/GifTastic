$(document).ready(function () {

    var topicsArray = ["Breakfast at Tiffany's", "Some Like it Hot", "Casablanca", "Gone With the Wind", "Sabrina", "Psycho", "Cool Hand Luke"];
    var colors = ["656565", "646b73", "928f8a"];
    var currentTopic = "";
    var currentTopicTen = 1;
    var topicSpacer = "";
    var tempTopic = "";
    var tempTopicSpacer = "";
    var tempDiv = "";
    var wrapDiv = "";

    // This function creates a button for each item in topicsArray and appends them to #tags
    var topicList = function () {
        console.log("---- hi topicList ----");
        $('#tags').empty();
        // Create a button for each topic in topicsArray
        for (var i = 0; i < topicsArray.length; i++) {
            // Variable to hold the new button
            var tagDiv = $("<button>");
            // Assign each button a random color (for fun)
            tagDiv.css("background-color", "#" + randomColor());
            // Add the current topic from topicsArray into the button HTML
            tagDiv.html(topicsArray[i]);
            // Add class and identifier attributes to the button
            tagDiv.attr("class", "tag");
            // Store the cooresponding topic in the data-topic attribute
            tagDiv.attr("data-topic", topicsArray[i]);
            // Append the button to #tags
            $('#tags').append(tagDiv);
        }
    };

    // Rando colors (called by topicList)
    var randomColor = function () {
        // console.log("---- hi randomColor ----");
        var c = colors[Math.floor(Math.random() * colors.length)];
        return c;
    };




    // Click handler for the Search Button
    $("#run-search").on("click", function (event) {
        console.log("---- hi search event ----");
        // Prevents the page from reloading on form submit.
        event.preventDefault();
        $('#warn').empty();
        // Grab text the user typed into the search input
        tempTopic = $("#search-term").val().trim();
        // If the tempTopic is not empty, call matcherAjax to see if it's in the OMDBAPI database.
        if (tempTopic) {
            tempTopicSpacer = encodeURIComponent(tempTopic);
            if (matcherAjax(tempTopicSpacer) == true) {
                topicsArray.push(tempTopic);
                topicList();
                $('#searchbox').find('input:text').val('');
                currentTopic == tempTopic;
            } else {
                return false;
            };
        } else {
            console.log("blank input search entered");
        };
    });

    // matcherAjax checks if the user's topic has a match in OMDB API
    var matcherAjax = function (x) {
        var APIKEY = "c7c89c17";
        var queryURL = "http://www.omdbapi.com/?s=" +
            x + "&apikey=" + APIKEY + "&limit=1";
        console.log("queryURL: ", queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                console.log("response", response);
                console.log(response.Response);
                if (response.Response == "False") {
                    console.log("Matcher: its false");
                    $('#warn').html(response.Error + ' Try again!');
                    return false;
                } else {
                    console.log("Matcher: its true");
                    var q = decodeURIComponent(topicSpacer);
                    console.log("q: ", q);
                    return q;
                }
            });
    };


    // Click handler for buttons inside #tags div
    $("#tags").on("click", "button", function () {
        console.log("***** CLICK! hi #tags listener *****");
        // Storing the data-topic property value from the button
        currentTopic = $(this).attr("data-topic");
        topicSpacer = encodeURIComponent(currentTopic);
        $('#warn').empty();
        $("#search-term").val('');
        movieRequestAjax();
        console.log("now call GIPHYAPI");
    });

    // Click handler for input box
    $("#search-term").on("click", function () {
        $("#search-term").val('');
    });

    //////////////////////////////////////////////
    // Ajax call to OMDBAPI using parameter from #tags listener
    var movieRequestAjax = function () {
        console.log("---- hi movieRequestAjax ----");
        // Constructing a queryURL using the topic name
        var APIKEY = "c7c89c17";
        var queryURL = "http://www.omdbapi.com/?t=" +
            topicSpacer + "&apikey=" + APIKEY + "&plot=full" + "&limit=1";
        console.log("queryURL: ", queryURL);
        // Performing an AJAX request with the queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            // After data comes back from the request
            .then(function (response) {
                // storing the data from the AJAX request in the results variable
                var results = response;
                console.log("movieRequestAjax results:", results);
                displayMovie(results);
            });
    };


    // Function to add OMDBAPI info to the page
    var displayMovie = function (x) {
        // Movie holds the AJAX results passed in from the OMDB API call
        var movie = x;
        $('#movies-view').empty();
        tempDiv = $('<div class="movie-title clearfix">');
        tempDiv.html('<h2>' + movie.Title + '</h2>' + '<br><h3>Year: ' + movie.Year + '</h3><br>' + '<h3>Rating: ' + movie.Rated + '</h3><br>' + '<p><strong>' + 'Plot: ' + '</strong>' + movie.Plot + '</p>');
        var img = $('<img />');
        img.attr("src", movie.Poster);
        tempDiv.prepend(img);
        $('#gifs-appear-here').prepend(tempDiv);
        gifRequest();
    };


    //////////////////////////////////////////////


    /////////////////////////////////////////////
    // Ajax call to GiphyAPI using parameter from #tags listener
    var gifRequest = function () {
        console.log("---- hi gifRequest ----");

        // Constructing a queryURL using the topic name
        var APIKEY = "DPBvGpuy5v0lsWlSAd51dsjMvJ6rjWcP";
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            topicSpacer + "&api_key=" + APIKEY + "&limit=10";
        // Performing an AJAX request with the queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            // After data comes back from the request
            .then(function (response) {
                displayGifs(response.data);
            });
    };

    // Function to add GIPHYAPI ajax results array to the page
    var displayGifs = function (x) {
        console.log("---- hi displayGifs ----");
        var resultsList = x;
        // Looping through each result item
        for (var i = 0; i < resultsList.length; i++) {
            // Creating and storing a div tag
            var topicDiv = $("<div>");
            wrapDiv = $('<div class="wrap">');
            // Creating a paragraph tag with the result item's rating
            var rating = $("<p>").text("Rating: " + resultsList[i].rating.toUpperCase());
            rating.attr("class", "meta");
            // Creating a paragraph tag with the result item's title
            var title = $("<p>").text("Title: " + resultsList[i].title);
            title.attr("class", "meta");
            // Creating and storing an image tag
            var topicImage = $("<img>");
            // Setting the src attribute of the image to the fixed height still property
            topicImage.attr("src", resultsList[i].images.fixed_height_still.url);
            topicImage.attr("data-state", "still");
            topicImage.attr("data-still", resultsList[i].images.fixed_height_still.url);
            topicImage.attr("data-animate", resultsList[i].images.fixed_height.url);
            topicImage.attr("class", "clicky");
            // Appending the paragraph and image tag to the topicDiv
            topicDiv.attr("class", "topic-image");
            topicDiv.append(topicImage);
            topicDiv.append(rating);
            topicDiv.append(title);
            wrapDiv.html(topicDiv);
            $("#gifs-appear-here").prepend(wrapDiv);
        }
        $("#gifs-appear-here").prepend(tempDiv);
    };
    ///////////////////////////////////////////////////////


    // Click handler to toggle between still image and animated GIFs
    $('body').on('click', 'img', function () {
        console.log('---- hi body listener ----');
        // Store the data state attribute
        var state = $(this).attr("data-state");
        // Toggle the data state on click
        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    });



    // Initialize function
    var init = function () {
        console.log("---- hi init ----");
        topicList();
    };

    // Start the 'app'
    init();


});
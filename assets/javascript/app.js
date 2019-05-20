$(document).ready(function () {

    var topicsArray = ["Breakfast at Tiffany's", "Some Like it Hot", "Casablanca", "Gone With the Wind", "Sabrina", "Psycho", "Cool Hand Luke"];
    var colors = ["656565", "646b73", "928f8a"];
    var currentTopic = "";
    var topicSpacer = "";
    var tempTopic = "";
    var tempResponse = "";
    var tempDiv = "";

    // This function creates a button for each item in topicsArray and appends them to #tags
    var topicList = function () {
        console.log("---- hi topicList ----");
        $('#tags').empty();
        // Create a button for each topic in topicsArray
        $('#tags').append("Tags: ");
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

    // matcherAjax checks if the user's topic has a match in OMDB API
    var matcherAjax = function () {
        var APIKEY = "c7c89c17";
        var queryURL = "http://www.omdbapi.com/?t=" +
            tempTopic + "&apikey=" + APIKEY + "&limit=1";
        console.log("queryURL: ", queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                console.log("response", response);
                tempResponse = response;
                processMatcher();
            });
    };

    // Click handler for the Search Button
    $("#run-search").on("click", function (event) {
        event.preventDefault();
        $('#warn').empty();
        tempTopic = $("#search-term").val().trim();
        tempTopicSpacer = encodeURIComponent(tempTopic);
        matcherAjax(tempTopicSpacer);
        $('#search-term').val('');
    });

    // Add title associated with user input to the topics
    var addTopic = function () {
        var title = tempResponse.Title;
        console.log("title ", title);
        topicsArray.push(title);
        topicList();
    };

    // processMatcher determines if user input has a match in OMDB API
    var processMatcher = function () {
        if (tempResponse.Response == "True") {
            console.log("Execute true path");
            addTopic();
        } else if (tempResponse.Response == "False") {
            console.log("Execute false path");
            $('#warn').html(tempResponse.Error + ' Try again!');
            return false;
        }
    };

    $("#search-term").on("click", function () {
        $(this).val('');
        $('#warn').empty();
    })




    // Click handler for buttons inside #tags div
    $("#tags").on("click", "button", function () {
        currentTopic = $(this).attr("data-topic");
        topicSpacer = encodeURIComponent(currentTopic);
        $('#warn').empty();
        $("#id").val('');
        movieRequestAjax();
        console.log("now call GIPHYAPI");
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
        $('#movies-view').empty();
        tempDiv = $('<div class="movie-title clearfix">');
        tempDiv.html('<h2>' + x.Title + '</h2>' + '<br><h3>Year: ' + x.Year + '</h3><br>' + '<h3>Rating: ' + x.Rated + '</h3><br>' + '<p><strong>' + 'Plot: ' + '</strong>' + x.Plot + '</p>');
        var img = $('<img />');
        img.attr("src", x.Poster);
        tempDiv.prepend(img);
        // $('#gifs-appear-here').prepend(tempDiv);
        gifRequest();
    };


    //////////////////////////////////////////////


    /////////////////////////////////////////////
    // Ajax call to GiphyAPI using parameter from #tags listener
    var gifRequest = function () {
        var APIKEY = "DPBvGpuy5v0lsWlSAd51dsjMvJ6rjWcP";
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            topicSpacer + "&api_key=" + APIKEY + "&limit=10";
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                displayGifs(response.data);
            });
    };

    // Function to add GIPHYAPI ajax results array to the page
    var displayGifs = function (x) {
        var resultsList = x;
        var wrapDiv = $("<div class='wrap clearfix'>");
        for (var i = 0; i < resultsList.length; i++) {
            var gifDiv = $("<div class='topic'>");
            // Creating a paragraph tag with the result item's rating
            var rating = $("<p>").text("Rating: " + resultsList[i].rating.toUpperCase());
            rating.attr("class", "meta");
            var topicImage = $("<img />");
            // Setting the src attribute of the image to the fixed height still property
            topicImage.attr("src", resultsList[i].images.fixed_height_still.url);
            topicImage.attr("data-state", "still");
            topicImage.attr("data-still", resultsList[i].images.fixed_height_still.url);
            topicImage.attr("data-animate", resultsList[i].images.fixed_height.url);
            topicImage.attr("class", "clicky");
            // Appending the paragraph and image tag to the gifDiv
            gifDiv.attr("class", "topic-image");
            gifDiv.append(topicImage);
            gifDiv.append(rating);
            // gifDiv.append(title);
            wrapDiv.append(gifDiv);
        }
        wrapDiv.prepend(tempDiv);
        $("#gifs-appear-here").prepend(wrapDiv);
        
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
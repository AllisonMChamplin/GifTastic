$(document).ready(function () {

    var topicsArray = ["Rainbows", "Fairies", "Unicorns", "Sparkles", "Princesses", "Pink kittens", "Ponies", "Twilight sparkle", "Pinkie Pie", "Rainbow Dash", "Fluttershy"];
    var colors = ["c8bddd", "a68fc3", "a94698", "7754a4", "652d92", "8b2475", "c41a7b", "ef1468", "e46075", "ed6967", "c82262"];
    var currentTopic = "";
    var currentTopicTen = 1;

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
        console.log("---- hi randomColor ----");
        var c = colors[Math.floor(Math.random() * colors.length)];
        return c;
    };

    // Ajax call to GiphyAPI using parameter from #tags listener
    var gifRequest = function (topic) {
        console.log("---- hi gifRequest ----");
        var x = 10;
        console.log("currentTopicTen: ", currentTopicTen);
        // Has user already received a set of 10 results?
        if (currentTopicTen === 0) {
            x = 10;
        } else {
            x = currentTopicTen * 10;
        };

        // Constructing a queryURL using the topic name
        var APIKEY = "DPBvGpuy5v0lsWlSAd51dsjMvJ6rjWcP";
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            topic + "&api_key=" + APIKEY + "&limit=10" + "&offset=" + x;
        // Performing an AJAX request with the queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            // After data comes back from the request
            .then(function (response) {
                console.log(queryURL);
                console.log(response);

                // storing the data from the AJAX request in the results variable
                var results = response.data;
                displayGifs(results);
                currentTopicTen++;
            });
    };

    // Function to add ajax array to the page
    var displayGifs = function (x) {
        console.log("---- hi displayGifs ----");
        var resultsList = x;
        // Looping through each result item
        for (var i = 0; i < resultsList.length; i++) {
            // Creating and storing a div tag
            var topicDiv = $("<div>");

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
            // Setting the 
            // Adding a class to the image
            topicImage.attr("class", "clicky");
            // Appending the paragraph and image tag to the topicDiv
            topicDiv.attr("class", "topic-image");
            topicDiv.append(topicImage);
            topicDiv.append(rating);
            topicDiv.append(title);
            // Prependng the topicDiv to the HTML page in the "#gifs-appear-here" div
            $("#gifs-appear-here").prepend(topicDiv);
        }
    };

    // Function for button to add 10 Gifs to the current topic
    var showAddTenButton = function () {
        console.log("---- hi addTenGifs ----");
        var controlsDiv = $("#controls");
        controlsDiv.empty();
        var addTenButton = $("<button>");
        addTenButton.attr("class", "form-control");
        addTenButton.attr("id", "add");
        addTenButton.text("Add 10 new " + currentTopic + " Gifs!")
        controlsDiv.append(addTenButton);
    };

    // Show current topic div
    var showTopic = function () {
        console.log("---- hi showTopic ----");
        var showDiv = $('#show');
        showDiv.html(currentTopic);
    };

    // Click handler for add 10 button
    $("#controls").on("click", "button", function () {
        console.log("---- hi #controls listener ----");
        gifRequest(currentTopic);
    });

    // Click handler for buttons inside #tags div
    $("#tags").on("click", "button", function () {
        console.log("---- hi #tags listener ----");
        // Storing the data-topic property value from the button
        currentTopic = $(this).attr("data-topic");
        showTopic(currentTopic);
        showAddTenButton();
        gifRequest(currentTopic);
    });

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

    // Click handler for the Search Button
    $("#run-search").on("click", function (event) {
        console.log("---- hi run search listener ----");
        // Prevents the page from reloading on form submit.
        event.preventDefault();
        // Grab text the user typed into the search input
        var input = $("#search-term").val().trim();
        // If the input is not empty, add the topic to the array
        if (input) {
            topicsArray.push(input);
            topicList();
            $('#searchbox').find('input:text').val(''); 
        };
    });

    // Initialize function
    var init = function () {
        console.log("---- hi init ----");
        topicList();
    };

    // Start the 'app'
    init();

});
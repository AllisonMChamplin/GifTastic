
// Array of topics
$(document).ready(function () {

    var topics = ["Rainbows", "Fairies", "Unicorns", "Sparkles", "Princesses", "Pink kittens"];

    var colors = ["c8bddd", "a68fc3", "a94698", "7754a4", "652d92", "8b2475", "c41a7b", "ef1468", "e46075", "ed6967", "c82262"];

    var topicList = function () {
        console.log("hi");
        for (var i = 0; i < topics.length; i++) {
            var tagDiv = $("<button>");
            var randomColor = colors[Math.floor(Math.random() * colors.length)];
            tagDiv.html(topics[i]);
            tagDiv.attr("class", "tag");
            tagDiv.attr("data-topic", topics[i]);
            tagDiv.css("background-color", "#" + randomColor);
            $('#tags').append(tagDiv);
        }
    }


    topicList();

    $("button").on("click", function () {
        // Grabbing and storing the data-topic property value from the button
        var topic = $(this).attr("data-topic");

        // Constructing a queryURL using the animal name
        var APIKEY = "DPBvGpuy5v0lsWlSAd51dsjMvJ6rjWcP";
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            topic + "&api_key=" + APIKEY + "&limit=10";
        console.log("queryURL: ", queryURL);
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

                // Looping through each result item
                for (var i = 0; i < results.length; i++) {

                    // Creating and storing a div tag
                    var topicDiv = $("<div>");

                    // Creating and storing an image tag
                    var topicImage = $("<img>");
                    // Setting the src attribute of the image to a property pulled off the result item
                    topicImage.attr("src", results[i].images.fixed_height.url);

                    // Appending the paragraph and image tag to the topicDiv
                    // topicDiv.append(p);
                    topicDiv.append(topicImage);

                    // Prependng the topicDiv to the HTML page in the "#gifs-appear-here" div
                    $("#gifs-appear-here").prepend(topicDiv);
                }

            });
    });
});
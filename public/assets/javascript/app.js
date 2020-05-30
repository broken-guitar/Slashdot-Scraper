
$("button.show-comments").on("click", function(e) {
    e.preventDefault();

    let articleId = $(this).attr("data-id");
    let $commentsDiv = $("div[comment-div-id='" + articleId + "']");

    console.log("articleId: ", articleId);
    console.log("$commentsDiv: ", $commentsDiv);

    $.ajax({
        method: "GET",
        url: "/comments/" + articleId
    })
    .then(function(data) {
        console.log("return comments: ", data);

        for (e of data) {
            console.log(e.comment);
        }
        
    });
    $commentsDiv.collapse("toggle");
});
    
$("button.add-comment").on("click", function(e) {
    e.preventDefault();

    let articleId = $(this).attr("data-id");
    let $newComment = $("input[data-id='" + articleId + "']");

    console.log("add comment articleId", articleId);

    $.ajax({
        method: "POST",
        url: "/comments/" + articleId,
        data: {
          // Value taken from comment input
          comment: $newComment.val(),
        }
    })
    .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $newComment.empty();
    });
    
});
    
    
    // $(this).addClass("");

let commentGetTimes= [];

$("button.show-comments").on("click", function(e) {
    e.preventDefault();
    
    let articleId = $(this).attr("data-id");
    let $commentsDiv = $("div[comment-div-id='" + articleId + "']");
    
    let lastLoad = $commentsDiv.data("lastLoad");
    let timeDiff = Date.now() - lastLoad;
    console.log("last: ", lastLoad, "timeDiff: ", timeDiff);
    
    let $commentsListDiv = $commentsDiv.children("div.list-group:first-child");
    
    // if comments container is collapsed
    if (!$commentsDiv.hasClass("show")) {
        let commentCount = $commentsListDiv.children("div > .list-group-item").length;
        
        console.log("comment count: ", commentCount);
        
        // get comments for article and render if
        // there are no comments rendered yet,
        // or enough time has passed (to reduce db calls)
        if (commentCount > 0) {
            // there are comments rendered already,  so check if last load time
            if (timeDiff > 10000) {
                // enough time has passed, so get all commments and re-render
                console.log("enough time passed, GET comments again");
                API.getComments(articleId).then(function(data) {
                    // clear the comments div
                    $commentsListDiv.empty(); 
                    // render each comment
                    for (e of data) {
                        let $newComment = $("<div/>").attr({"data-id": e._id, "class":"list-group-item mb-1 bg-light"}).text(e.comment);
                        $commentsListDiv.append($newComment);
                        
                    }
                    $commentsDiv.data({lastLoad: Date.now()});
                    $commentsDiv.collapse("show");
                });
            } else {
                console.log("not enough time passed, did not GET comments");
                $commentsDiv.collapse("show");
            }
        } else {
        // no comments rendered, so find all comments and render
            console.log("no comments rendered yet, GET comments");
            API.getComments(articleId).then(function(data) {
                // clear the comments div
                $commentsListDiv.empty(); 
                // render each comment
                for (e of data) {
                    let $newComment = $("<div/>").attr({"data-id": e._id, "class":"list-group-item mb-1 bg-light"}).text(e.comment);
                    $commentsListDiv.append($newComment)
                }
                $commentsDiv.data({lastLoad: Date.now()});
                $commentsDiv.collapse("show");
            });
        }
    } else {
    // else, collapse comments container
        $commentsDiv.collapse("hide");
    }
});
    
$("button.add-comment").on("click", function(e) {
    e.preventDefault();

    let articleId = $(this).attr("data-id");
    let $newComment = $("input[data-id='" + articleId + "']");

    console.log("add comment articleId", articleId);

    API.saveComment($newComment.val(), articleId)
    .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $newComment.empty();
    });
    // $.ajax({
    //     method: "POST",
    //     url: "/comments/" + articleId,
    //     data: {
    //       // Value taken from comment input
    //       comment: $newComment.val(),
    //       articleId: articleId
    //     }
    // })
    // .then(function(data) {
    //     // Log the response
    //     console.log(data);
    //     // Empty the notes section
    //     $newComment.empty();
    // });
    
});


var API = {
    getComments: function(articleId) {

        return $.ajax({
            method: "GET",
            url: "/comments/" + articleId
        });
    },
    saveComment: function(commentVal, articleId) {
        return $.ajax({
            method: "POST",
            url: "/comments/" + articleId,
            data: {
              // Value taken from comment input
              comment: commentVal,
              articleId: articleId
            }
        })
    }
    // saveExample: function(example) {
    //   return $.ajax({
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     type: "POST",
    //     url: "api/examples",
    //     data: JSON.stringify(example)
    //   });
    // },
    // getExamples: function() {
    //   return $.ajax({
    //     url: "api/examples",
    //     type: "GET"
    //   });
    // },
    // deleteExample: function(id) {
    //   return $.ajax({
    //     url: "api/examples/" + id,
    //     type: "DELETE"
    //   });
    // }
  };
    
    // $(this).addClass("");

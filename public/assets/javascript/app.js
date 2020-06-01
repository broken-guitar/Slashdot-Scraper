const cmtsWaitTime = 10000; // wait 10 seconds

$("button.show-comments").on("click", function(e) {
    e.preventDefault();
    // current article id
    let articleId = $(this).attr("data-id");
    // article's comment container element
    let $commentsDiv = $("div[comment-div-id='" + articleId + "']");
    
    // get time passed since last comment GET request
    let cmtsLoadTime = $commentsDiv.data("cmtsLoadTime") || false;
    let timePassed = cmtsLoadTime ? Date.now() - cmtsLoadTime : 0;
    
    // comment list group element
    let $commentsListDiv = $commentsDiv.children("div.list-group");
    
    // if comments container is collapsed
    if (!$commentsDiv.hasClass("show")) {
        // number of comments rendered
        let commentCount = $commentsListDiv.children("div > .list-group-item").length || 0;    
        
        // if there are no comments rendered yet or enough time has passed, 
        // then GET all of the article's comments and render them to DOM
        if ((commentCount > 0 && timePassed > cmtsWaitTime) || commentCount === 0) {
        
            // console.log("GET comments");
            
            API.getComments(articleId).then(function(dbUserComments) {
                // clear the comments div
                $commentsListDiv.empty();

                // render each comment
                for (cmt of dbUserComments) {
                    renderComment($commentsListDiv, cmt);
                }
                $commentsDiv.data({"cmtsLoadTime": Date.now()}); // update the comment GET timestamp
                $commentsDiv.collapse("show"); // expand to show comments
            });
        } else {
            // not enough time passed, just show the previously rendered comments
            $commentsDiv.collapse("show");
        }
    } else {
        // collapse comments container
        $commentsDiv.collapse("hide");
    }
});

// VALIDATE input, enable add comment button
$("input.comment-input").keyup(function () {
    let articleId = $(this).attr("data-id");
    if ($(this).val().trim() === '') {
        //Check to see if there is any text entered
        // If there is no text within the input ten disable the button
        $("button.add-comment[data-id='" + articleId + "']").prop("disabled", true);
    } else {
        //If there is text in the input, then enable the button
        $("button.add-comment[data-id='" + articleId + "']").prop("disabled", false);
    }
});

// DELETE comment 
$("div.list-group").on("click", "div.delete-comment", function(e) {
    e.preventDefault();
   
    let commentId = $(this).data("commentId");
    let $commentItem = $("div[data-id='" + commentId + "']");
    
    API.deleteComment(commentId)
    .then(function(data) {
        $commentItem.collapse("hide");
        $commentItem.animate({height: "0px"});
        setTimeout(function() {
            $commentItem.remove();
        }, 200);
    });
});

// ADD comment
$("button.add-comment").on("click", function(e) {
    e.preventDefault();
    let $this = $(this);
    let articleId = $this.attr("data-id");
    let $commentsListDiv =  $("div[comment-div-id='" + articleId + "']")
                            .children("div.list-group");
    let $commentItem = $("input[data-id='" + articleId + "']");

    API.saveComment($commentItem.val(), articleId)
    .then(function(data) {
        $commentItem.val("");
        renderComment($commentsListDiv, data, "prepend");
        $this.prop("disabled", true);
    });
});

function renderComment($target, doc, order) {
    let $commentItem = $("<div/>").attr({"data-id": doc._id, "class":"list-group-item mb-1 bg-light border-0"});
    $commentItem.$text = $("<div/>").attr({"class":"text"}).text(doc.comment);
    $commentItem.$delete = $("<div/>").attr({"class":"delete-comment"}).data({"commentId":doc._id}).text("✖");
    $commentItem.append($commentItem.$text);
    $commentItem.append($commentItem.$delete);
    if (order=="prepend") {
        $target.prepend($commentItem)
    } else {
        $target.append($commentItem)
    }
}   

// API obect to hold api calls as methods
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
        });
    },
    deleteComment: function(commentId) {
        return $.ajax({
            method: "DELETE",
            url: "/comments/" + commentId
        });
    }
  };

// todo:   load different parts of the share object
//         to the page. 
function Share_Loader() {

    var self = this;

    self.init = function() {
        self.shareObj = gyg_activity;
        self
            .loadCommentsMod()
            .loadStatsMod();
    },

    self.loadCommentsMod = function() {
        var snippet;
        $.each(self.shareObj.comments, function(i, comment) {
            snippet = self.createComment(comment);
            $("#share-comment-mod section:last").after(snippet);
        });
        return self;
    },

    self.loadStatsMod = function() {

        return self;
    },

    self.createComment = function(comment) {
        var $container = $("#share-comment-template").clone();
        var text, name;
        //$container.find("img").attr("src", comment.user.avatar);
        $container.find("img").attr("src", "img/placeholder-avatar.jpg");
        $container.attr("id", comment.).removeClass("hide");
        name = "<b>" + comment.user.firstname + " " + comment.user.lastname + ":</b>";
        text = name + "  " + comment.body;
        $container.find("p.comment").html(text);
        return $container;
    },

    self.destroy = function() {

    };
}

var share = new Share_Loader();
share.init();

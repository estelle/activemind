// todo:   load different parts of the share object
//         to the page. 
function Share_Loader() {

    var self = this;

    self.init = function() {
        self.shareObj = gyg_activity;
        self
            .loadCommentsMod()
            .loadUserData()
            .loadStatsMod()
            .loadHolesList();
    },

    self.loadCommentsMod = function() {
        var snippet;
        var $title = $("#share-comment-count");
        var count = self.shareObj.comments.length + 1;
        $title.html( count + " " + $title.html() );
        $.each(self.shareObj.comments, function(i, comment) {
            snippet = self.createComment(comment);
            $("#share-comment-mod section:last").after(snippet);
        });
        return self;
    },

    self.loadUserData = function() {
        var $container = $("#user-stats");
        var user = self.shareObj.user;
        var name = user.firstname + " " + user.lastname;
        $container.find("li.user-fullname").html(name);
        $container.find("li.golf-course").html(user);
        //var avatar = user.avatar;
        var avatar = "img/IanPoulter.jpg";

        return self;
    },

    self.loadHolesList = function() {
        var holes = self.shareObj.round.hole_index;
        var $list = $("#hole-list");
        $.each(holes, function(i, hole) {
            var listItem = self._buildHoleList(hole);
            $list.find("li:last").after(listItem);
        });
        //$list.removeClass("hide");
        return self;
    },

    self.loadStatsMod = function() {
        var $container = $("#user-stats");
        var round = self.shareObj.round;
        var golfcourse = round.golfcourse[5].name;
        $container.find("li.golf-course").html(golfcourse);

        // var address = round.golfcourse.5.address.city;
        // var state = round.golfcourse.5.state.name;
        return self;
    },

    self.createComment = function(comment) {
        var $container = $("#share-comment-template").clone();
        var text, name;
        //$container.find("img").attr("src", comment.user.avatar);
        $container.find("img").attr("src", "img/placeholder-avatar.jpg");
        $container.attr("id", comment.activity_id).removeClass("hide");
        name = "<b>" + comment.user.firstname + " " + comment.user.lastname + ":</b>";
        text = name + "  " + comment.body;
        $container.find("p.comment").html(text);
        return $container;
    },

    self._buildHoleList = function(hole) {
        var $list = $("#hole-list li.template").clone();
        $list.find("a").text(hole.holeno).attr("href", ("#hole-" + hole.holeno) );
        return $list;
    },

    self.destroy = function() {

    };
}

var share = new Share_Loader();
share.init();

/**
 * guestbook.js
 */
 

var GB = (function () {

    var selectedOrgName = null;
    var that = this;

    return {


        "signGuestbook": function () {

            that = this;

            $('#myPostModal').modal({
                show: true
            });
            //		    $('#myPostModal .modal-body').html(_.template($('#ErrorTemplate').html(), data));

            return false;
        },


        "getMessages": function () {

            var that = this;


            $.getJSON("/getmessages", function (data) {

                data.messages = data;

                $("#GuestbookContainer").html(_.template($('#GuestbookTemplate').html(), data.messages));

                $("#GuestbookContainer").show();

                $('#GuestbookTable').dataTable({
                    "aaSorting": [
                        [3, "desc"]
                    ],
                    "bPaginate": false,
                    "bInfo": false,
                    "bFilter": false,
                    "bAutoWidth": true,
                    "oLanguage": {
                        "sSearch": "Filter: "
                    }
                });

                $('.deleteEntry').on('click', function (event) {


                    that.deleteMessageConfirm($(this).data("id"));

                });


            });

        },

        "deleteMessageConfirm": function (messageId) {



            $('#myDeleteConfirmModal').modal({
                show: true
            });

            $('#DeleteMessage').data('messageId', messageId);


        },


        "deleteMessage": function (messageId) {

            var that = this;

            $('#myDeleteConfirmModal').modal({
                show: false
            });


            $.getJSON("/deletemessage/" + messageId, function (data) {

                $('#myDeleteModal').modal({
                    show: true
                });

                setTimeout(function () {
                    $('#myDeleteModal').modal('hide');
                    that.getMessages();
                }, 2000);



            });
        },

        "postMessage": function (guestName, messageText, favoriteKeyword) {
         
            var that = this;
            
            $.getJSON("/postmessage/" + messageText + "/" + guestName + "/" + favoriteKeyword, function (data) {

                $('#myPostModal').modal({
                    show: false
                });

                $('#myThanksModal').modal({
                    show: true
                });
                $("#myThanksModal .modal-body").html("Thanks for signing the guestbook, <b>" + guestName + "</b>");
                setTimeout(function () {
                    $('#myThanksModal').modal('hide');
                    that.getMessages();
                }, 2000);
            });



            that.getMessages();

        },


        "init": function () {

            var that = this;

            $("#SignGuestbook").on('click', function (event) {
                that.signGuestbook();
            });
            $("#PostMessage").on('click', function (event) {
                that.postMessage($("#guestName").val(), $("#messageText").val(), $("#favoriteKeyword").val());
            });

            $("#DeleteMessage").on('click', function (event) {

                that.deleteMessage($(this).data('messageId'));
            });
            that.getMessages();
        }




    };

})();

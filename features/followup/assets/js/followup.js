var old_followup = null;

/**
 * get the raw markdown summary and display it in a textedit area instead of
 * the rendered HTML
 * param: optional text to append to the textedit area
 */
function make_followup_editable() {
    var $summary = $("#followup");

    // if a textarea already, append to it
    if ($summary.is('textarea')) {
        $summary.val(function(index, value){
                return value;
            });

        // if not a textarea already, create one and replace the original div with it
    } else {
        $.getJSON(
                  "/events/"+get_current_event_id()+"/followup",
                  function(data) {
                      var textarea = $("<textarea></textarea>")
                          .attr({
                                  "id": "followup",
                                  "name": "followup",
                                  "placeholder": "What have we learned that does or does not improve the situation? In the light of the learning, what should be done? How should the way we work or our standards be adjusted to reflect what we learned? What do we need to learn next?",
                                  "class": "input-xxlarge editable",
                                  "rows": "10"
                              })
                          .val(data.followup);
                      $summary.replaceWith(textarea);
                      $("#followup").on("save", followup_save);
                  },
                  'json' // forces return to be json decoded
                  );
    }
}


/**
 * Depending on the current state either show the editable summary form or
 * save the markdown summary and render as HTML
 */
function followup_save(e, event, history) {
    var new_followup = $("#followup").val();

    var Diff = new diff_match_patch();
    var diff = Diff.diff_main(old_followup, new_followup);
    Diff.diff_cleanupSemantic(diff);
    diff = Diff.diff_prettyHtml(diff);
    history.followup = diff;
    event.followup = new_followup;

    var html = $("<div></div>");
    html.attr("id", "followup");
    html.attr("name", "followup");
    html.attr("class", "input-xxlarge editable");
    html.attr("rows", "10");
    html.html(markdown.toHTML($("#followup").val()));
    $("#followup").remove();
    $("#followup_wrapper").append(html);
    $("#followup_undobutton").hide();
    $("#followup").on("edit", make_followup_editable);
}

/**
 * just abort editing and display the stored data as rendered HTML
 */
function followup_undo_button() {
    $.getJSON("/events/"+get_current_event_id()+"/followup", function(data) {
            $('#followup').val(data.followup);
        });
}

$("#followup").on("edit", make_followup_editable);
$("#followup_undobutton").on("click", followup_undo_button);
$.getJSON("/events/"+get_current_event_id()+"/followup", function(data) {
        old_followup = data.followup;
    $("#followup").html(markdown.toHTML(data.followup));
});


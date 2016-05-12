var old_rca = null;

/**
 * get the raw markdown summary and display it in a textedit area instead of
 * the rendered HTML
 * param: optional text to append to the textedit area
 */
function make_rca_editable() {
    var $summary = $("#rca");

    // if a textarea already, append to it
    if ($summary.is('textarea')) {
        $summary.val(function(index, value){
                return value;
            });

        // if not a textarea already, create one and replace the original div with it
    } else {
        $.getJSON(
                  "/events/"+get_current_event_id()+"/rca",
                  function(data) {
                      var textarea = $("<textarea></textarea>")
                          .attr({
                                  "id": "rca",
                                  "name": "rca",
                                  "placeholder": "Use the simplest problem-analysis tool that will suffice to find the root cause of the problem",
                                  "class": "input-xxlarge editable",
                                  "rows": "10"
                              })
                          .val(data.rca);
                      $summary.replaceWith(textarea);
                      $("#rca").on("save", rca_save);
                  },
                  'json' // forces return to be json decoded
                  );
    }
}


/**
 * Depending on the current state either show the editable summary form or
 * save the markdown summary and render as HTML
 */
function rca_save(e, event, history) {
    var new_rca = $("#rca").val();

    var Diff = new diff_match_patch();
    var diff = Diff.diff_main(old_rca, new_rca);
    Diff.diff_cleanupSemantic(diff);
    diff = Diff.diff_prettyHtml(diff);
    history.rca = diff;
    event.rca = new_rca;

    var html = $("<div></div>");
    html.attr("id", "rca");
    html.attr("name", "rca");
    html.attr("class", "input-xxlarge editable");
    html.attr("rows", "10");
    html.html(markdown.toHTML($("#rca").val()));
    $("#rca").remove();
    $("#rca_wrapper").append(html);
    $("#rca_undobutton").hide();
    $("#rca").on("edit", make_rca_editable);
}

/**
 * just abort editing and display the stored data as rendered HTML
 */
function rca_undo_button() {
    $.getJSON("/events/"+get_current_event_id()+"/rca", function(data) {
            $('#rca').val(data.rca);
        });
}

$("#rca").on("edit", make_rca_editable);
$("#rca_undobutton").on("click", rca_undo_button);
$.getJSON("/events/"+get_current_event_id()+"/rca", function(data) {
        old_rca = data.rca;
    $("#rca").html(markdown.toHTML(data.rca));
});


var old_counters = null;

/**
 * get the raw markdown summary and display it in a textedit area instead of
 * the rendered HTML
 * param: optional text to append to the textedit area
 */
function make_counters_editable() {
    var $summary = $("#counters");

    // if a textarea already, append to it
    if ($summary.is('textarea')) {
        $summary.val(function(index, value){
                return value;
            });

        // if not a textarea already, create one and replace the original div with it
    } else {
        $.getJSON(
                  "/events/"+get_current_event_id()+"/counters",
                  function(data) {
                      var textarea = $("<textarea></textarea>")
                          .attr({
                                  "id": "counters",
                                  "name": "counters",
                                  "placeholder": "Your proposed countermeasure(s) to address each candidate root cause",
                                  "class": "input-xxlarge editable",
                                  "rows": "10"
                              })
                          .val(data.counters);
                      $summary.replaceWith(textarea);
                      $("#counters").on("save", counters_save);
                  },
                  'json' // forces return to be json decoded
                  );
    }
}


/**
 * Depending on the current state either show the editable summary form or
 * save the markdown summary and render as HTML
 */
function counters_save(e, event, history) {
    var new_counters = $("#counters").val();

    var Diff = new diff_match_patch();
    var diff = Diff.diff_main(old_counters, new_counters);
    Diff.diff_cleanupSemantic(diff);
    diff = Diff.diff_prettyHtml(diff);
    history.counters = diff;
    event.counters = new_counters;

    var html = $("<div></div>");
    html.attr("id", "counters");
    html.attr("name", "counters");
    html.attr("class", "input-xxlarge editable");
    html.attr("rows", "10");
    html.html(markdown.toHTML($("#counters").val()));
    $("#counters").remove();
    $("#counters_wrapper").append(html);
    $("#counters_undobutton").hide();
    $("#counters").on("edit", make_counters_editable);
}

/**
 * just abort editing and display the stored data as rendered HTML
 */
function counters_undo_button() {
    $.getJSON("/events/"+get_current_event_id()+"/counters", function(data) {
            $('#counters').val(data.counters);
        });
}

$("#counters").on("edit", make_counters_editable);
$("#counters_undobutton").on("click", counters_undo_button);
$.getJSON("/events/"+get_current_event_id()+"/counters", function(data) {
        old_counters = data.counters;
    $("#counters").html(markdown.toHTML(data.counters));
});


var old_countermeasures = null;

/**
 * get the raw markdown countermeasures and display it in a textedit area instead of
 * the rendered HTML
 * param: optional text to append to the textedit area
 */
function make_countermeasures_editable(text) {
    var $countermeasures = $("#countermeasures");

    if (typeof text !== "string") {
        text = '';
    } else {
        text = "\n"+text;
    }

    // if a textarea already, append to it
    if ($countermeasures.is('textarea')) {
        $countermeasures.val(function(index, value){
                return value + text;
            });

        // if not a textarea already, create one and replace the original div with it
    } else {
        $.getJSON(
                  "/events/"+get_current_event_id()+"/countermeasures",
                  function(data) {
                      var textarea = $("<textarea></textarea>")
                          .attr({
                                  "id": "countermeasures",
                                  "name": "countermeasures",
                                  "class": "input-xxlarge editable",
                                  "rows": "10"
                              })
                          .val(data.countermeasures + text);
                      $countermeasures.replaceWith(textarea);
                      $("#countermeasures").on("save", countermeasures_save);
                  },
                  'json' // forces return to be json decoded
                  );
    }
}

/**
 * Depending on the current state either show the editable countermeasures form or
 * save the markdown countermeasures and render as HTML
 */
function countermeasures_save(e, event, history) {
    var new_countermeasures = $("#countermeasures").val();

    var Diff = new diff_match_patch();
    var diff = Diff.diff_main(old_countermeasures, new_countermeasures);
    Diff.diff_cleanupSemantic(diff);
    diff = Diff.diff_prettyHtml(diff);
    history.countermeasures = diff;
    event.countermeasures = new_countermeasures;

    var html = $("<div></div>");
    html.attr("id", "countermeasures");
    html.attr("name", "countermeasures");
    html.attr("class", "input-xxlarge editable");
    html.attr("rows", "10");
    html.html(markdown.toHTML($("#countermeasures").val()));
    $("#countermeasures").remove();
    $("#countermeasureswrapper").append(html);
    $("#countermeasuresundobutton").hide();
    $("#countermeasures").on("edit", make_countermeasures_editable);
}

/**
 * just abort editing and display the stored data as rendered HTML
 */
function countermeasures_undo_button() {
    $.getJSON("/events/"+get_current_event_id()+"/countermeasures", function(data) {
            $('#countermeasures').val(data.countermeasures);
        });
}

$("#countermeasures").on("edit", make_countermeasures_editable);
$("#countermeasuresundobutton").on("click", countermeasures_undo_button);
$.getJSON("/events/"+get_current_event_id()+"/countermeasures", function(data) {
    old_countermeasures = data.countermeasures;
    $("#countermeasures").html(markdown.toHTML(data.countermeasures));
});


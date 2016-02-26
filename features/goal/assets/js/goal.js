var old_goal = null;

/**
 * get the raw markdown goal and display it in a textedit area instead of
 * the rendered HTML
 * param: optional text to append to the textedit area
 */
function make_goal_editable(text) {
    var $goal = $("#goal");

    if (typeof text !== "string") {
        text = '';
    } else {
        text = "\n"+text;
    }

    // if a textarea already, append to it
    if ($goal.is('textarea')) {
        $goal.val(function(index, value){
                return value + text;
            });

        // if not a textarea already, create one and replace the original div with it
    } else {
        $.getJSON(
                  "/events/"+get_current_event_id()+"/goal",
                  function(data) {
                      var textarea = $("<textarea></textarea>")
                          .attr({
                                  "id": "goal",
                                  "name": "goal",
                                  "class": "input-xxlarge editable",
                                  "rows": "10"
                              })
                          .val(data.goal + text);
                      $goal.replaceWith(textarea);
                      $("#goal").on("save", goal_save);
                  },
                  'json' // forces return to be json decoded
                  );
    }
}

/**
 * Depending on the current state either show the editable goal form or
 * save the markdown goal and render as HTML
 */
function goal_save(e, event, history) {
    var new_goal = $("#goal").val();

    var Diff = new diff_match_patch();
    var diff = Diff.diff_main(old_goal, new_goal);
    Diff.diff_cleanupSemantic(diff);
    diff = Diff.diff_prettyHtml(diff);
    history.goal = diff;
    event.goal = new_goal;

    var html = $("<div></div>");
    html.attr("id", "goal");
    html.attr("name", "goal");
    html.attr("class", "input-xxlarge editable");
    html.attr("rows", "10");
    html.html(markdown.toHTML($("#goal").val()));
    $("#goal").remove();
    $("#goalwrapper").append(html);
    $("#goalundobutton").hide();
    $("#goal").on("edit", make_goal_editable);
}

/**
 * just abort editing and display the stored data as rendered HTML
 */
function goal_undo_button() {
    $.getJSON("/events/"+get_current_event_id()+"/goal", function(data) {
            $('#goal').val(data.goal);
        });
}

$("#goal").on("edit", make_goal_editable);
$("#goalundobutton").on("click", goal_undo_button);
$.getJSON("/events/"+get_current_event_id()+"/goal", function(data) {
    old_goal = data.goal;
    $("#goal").html(markdown.toHTML(data.goal));
});


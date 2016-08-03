var old_plan = null;

/**
 * get the raw markdown summary and display it in a textedit area instead of
 * the rendered HTML
 * param: optional text to append to the textedit area
 */
function make_plan_editable() {
    var $summary = $("#plan");

    // if a textarea already, append to it
    if ($summary.is('textarea')) {
        $summary.val(function(index, value){
                return value;
            });

        // if not a textarea already, create one and replace the original div with it
    } else {
        $.getJSON(
                  "/events/"+get_current_event_id()+"/plan",
                  function(data) {
                      var textarea = $("<textarea></textarea>")
                          .attr({
                                  "id": "plan",
                                  "name": "plan",
                                  "placeholder": "Actual result of each countermeasure (above). How does the system actually behave with the countermeasures that are being proposed for implementation? Note the difference between the intended goal and the actual result. Was the goal achieved, if not, what is missing?",
                                  "class": "input-xxlarge editable",
                                  "rows": "10"
                              })
                          .val(data.plan);
                      $summary.replaceWith(textarea);
                      $("#plan").on("save", plan_save);
                  },
                  'json' // forces return to be json decoded
                  );
    }
}


/**
 * Depending on the current state either show the editable summary form or
 * save the markdown summary and render as HTML
 */
function plan_save(e, event, history) {
    var new_plan = $("#plan").val();

    var Diff = new diff_match_patch();
    var diff = Diff.diff_main(old_plan, new_plan);
    Diff.diff_cleanupSemantic(diff);
    diff = Diff.diff_prettyHtml(diff);
    history.plan = diff;
    event.plan = new_plan;

    var html = $("<div></div>");
    html.attr("id", "plan");
    html.attr("name", "plan");
    html.attr("class", "input-xxlarge watermark editable");
    html.attr("rows", "10");
    html.html(markdown.toHTML($("#plan").val()));
    $("#plan").remove();
    $("#plan_wrapper").append(html);
    $("#plan_undobutton").hide();
    $("#plan").on("edit", make_plan_editable);
}

/**
 * just abort editing and display the stored data as rendered HTML
 */
function plan_undo_button() {
    $.getJSON("/events/"+get_current_event_id()+"/plan", function(data) {
            $('#plan').val(data.plan);
        });
}

$("#plan").on("edit", make_plan_editable);
$("#plan_undobutton").on("click", plan_undo_button);
$.getJSON("/events/"+get_current_event_id()+"/plan", function(data) {
        old_plan = data.plan;
    $("#plan").html(markdown.toHTML(data.plan));
});


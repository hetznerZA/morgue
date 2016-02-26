var old_plan = null;

/**
 * get the raw markdown plan and display it in a textedit area instead of
 * the rendered HTML
 * param: optional text to append to the textedit area
 */
function make_plan_editable(text) {
    var $plan = $("#plan");

    if (typeof text !== "string") {
        text = '';
    } else {
        text = "\n"+text;
    }

    // if a textarea already, append to it
    if ($plan.is('textarea')) {
        $plan.val(function(index, value){
                return value + text;
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
                                  "class": "input-xxlarge editable",
                                  "rows": "10"
                              })
                          .val(data.plan + text);
                      $plan.replaceWith(textarea);
                      $("#plan").on("save", plan_save);
                  },
                  'json' // forces return to be json decoded
                  );
    }
}

/**
 * Depending on the current state either show the editable plan form or
 * save the markdown plan and render as HTML
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
    html.attr("class", "input-xxlarge editable");
    html.attr("rows", "10");
    html.html(markdown.toHTML($("#plan").val()));
    $("#plan").remove();
    $("#planwrapper").append(html);
    $("#planundobutton").hide();
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
$("#planundobutton").on("click", plan_undo_button);
$.getJSON("/events/"+get_current_event_id()+"/plan", function(data) {
    old_plan = data.plan;
    $("#plan").html(markdown.toHTML(data.plan));
});


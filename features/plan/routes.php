<?php

$app->get('/events/:id/plan', function($id) use ($app) {
        $event = Postmortem::get_event($id);
        
        if (is_null($event["id"])) {
            $app->response->status(404);
            return;
        }
        header("Content-Type: application/json");
        echo json_encode(array("plan" => $event["plan"]));
});
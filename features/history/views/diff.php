<div class="row-fluid">
     <h2><?php echo $event["title"]; ?><small><?php echo $edited; ?></small></h2>
     <div class="span12">
     <h3>Background</h3>
     <?php 
     if($history["summary"] === null){
         echo "<hr><h4>No Data Found</h4><br/>";
     } else {
         echo '<pre>' . $history["summary"] . '</pre>';
     }
     ?>
     <h3>Why were we surprised?</h3>
     <?php
     if($history["why_surprised"] === null){
         echo "<hr><h4>No Data Found</h4>";
     } else {
         echo '<pre>' . $history["why_surprised"] . '</pre>';
     }
     ?>
     <h3>Goal</h3>
     <?php
     if($history["goal"] === null){
         echo "<hr><h4>No Data Found</h4>";
     } else {
         echo '<pre>' . $history["goal"] . '</pre>';
     }
     ?>
     <h3>RCA</h3>
     <?php
     if($history["rca"] === null){
         echo "<hr><h4>No Data Found</h4>";
     } else {
         echo '<pre>' . $history["rca"] . '</pre>';
     }
     ?>
     <h3>Countermeasures</h3>
     <?php
     if($history["counters"] === null){
         echo "<hr><h4>No Data Found</h4>";
     } else {
         echo '<pre>' . $history["counters"] . '</pre>';
     }
     ?>
     <h3>Plan</h3>
     <?php
     if($history["plan"] === null){
         echo "<hr><h4>No Data Found</h4>";
     } else {
         echo '<pre>' . $history["plan"] . '</pre>';
     }
     ?>
     <h3>Follow Up</h3>
     <?php
     if($history["followup"] === null){
         echo "<hr><h4>No Data Found</h4>";
     } else {
         echo '<pre>' . $history["followup"] . '</pre>';
     }
     ?>
     </div>
     </div>
</div>

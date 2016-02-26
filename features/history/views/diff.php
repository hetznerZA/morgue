<div class="row-fluid">
     <h2><?php echo $event["title"]; ?><small><?php echo $edited; ?></small></h2>
     <div class="span12">
     <h3>What Happened?</h3>
     <?php 
     if($history["summary"] === null){
         echo "<hr><h4>No Data Found</h4><br/>";
     } else {
         echo '<pre>' . $history["summary"] . '</pre>';
     }
     ?>
     <h3>What Happened?</h3>
     <?php 
     if($history["summary"] === null){
         echo "<hr><h4>No Data Found</h4><br/>";
     } else {
         echo '<pre>' . $history["summary"] . '</pre>';
     }
     ?>
     <h3>Root Cause Analysis</h3>
     <?php
     if($history["rca"] === null){
         echo "<hr><h4>No Data Found</h4>";
     } else {
         echo '<pre>' . $history["rca"] . '</pre>';
     }
     ?>
     </div>
</div>

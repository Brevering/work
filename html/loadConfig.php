<?php
  
  $postParams = json_decode($_POST['json']); 
  $userLogged = intval($postParams->{'user_logged'});
?>

    <?php if ($userLogged == 0) { ?>
{ 
"appId": "bg.ecard.WebApp",
"js_version": 1.1,
"session_id": "8b823099a3821568fab6fe4cafa4143426129631",
"user_logged": 0
}
    <?php } ?>

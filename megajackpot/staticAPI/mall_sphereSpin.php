<?php
  
  $postParams = json_decode($_POST['json']); 
  $thisStep = intval($postParams->{'step_number'});
  $nextStep = $thisStep + 1;
  if ($thisStep == 2) {
//    sleep(2);
  }
?>

<?php if ($thisStep < 2) { ?> 
{
   "current_points_for_draw": "1",
   "RESULT": {
       "next_step_number": "<?=$nextStep?>",
       "valid_selection": "default",
       "choosed_value": "<?=$thisStep?>",
       "user_choosed_value": "default",
       "winning_points": "5000"
   },
   "session_id": "8b823099a3821568fab6fe4cafa4143426129631",
   "current_step_number": "<?=$nextStep?>",
   "status": "active",
   "want_step_number": "1",
   "want_user_idetificator": 1,
   "total_error_count": "0",
   "current_game_points": "<?=$thisStep*5000?>"
}
<?php } else if ($thisStep >= 2) { ?>
{
   "current_points_for_draw": "1",
   "RESULT": {
       "error_count": "1",
       "next_step_number": "<?=$nextStep?>",
       "valid_selection": "down",
       "choosed_value": "<?=$thisStep?>",
       "user_choosed_value": "up"
   },
   "session_id": "8b823099a3821568fab6fe4cafa4143426129631",
   "current_step_number": "<?=$nextStep?>",
   "status": "active",
   "want_step_number": "4",
   "want_user_idetificator": 1,
   "total_error_count": "1",
    "current_game_points": "<?=$thisStep*5000?>"
}
<?php } else { ?>
{
  "current_points_for_draw":"0",
    "RESULT":{
      "next_step_number":"finished",
      "valid_selection":"down",
      "choosed_value":"3",
      "user_choosed_value":"down",
      "winning_points":"200000"
    },
  "session_id":"cfe77066fb7612a88a636fac12fe06937f25e53c",
  "current_step_number":"finished",
  "status":"active",
  "want_step_number":"10",
  "want_user_idetificator":1,
  "total_error_count":"1",
  "current_game_points":"200000"
}
<?php } ?>


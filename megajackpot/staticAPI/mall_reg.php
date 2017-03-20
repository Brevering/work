<?php
  $success = true;
?>
<?php if ($success == true) { ?>
{
  "current_points_for_draw":"1",
  "RESULT": 
  {"success":1},
  "session_id":"d14a8b610fa2f1b6eeca57c3082ac97c5e180265",
  "current_step_number":"2",
  "status":"completed",
  "want_step_number":"2",
  "CONSTANT_PARAMS":{"IS_LOGGED":0},
  "want_user_idetificator":0,
  "total_error_count":"1",
  "current_game_points":"5000"
}
<?php } else { ?>
{
  "current_points_for_draw":"3",
  "RESULT":{
    "success":0,
    "error_text":"Моля въведете коректен телефонен номер!",
    "error":"wrong_phone"
  },
  "session_id":"fa9f5256fd99e84d84f1e9e00672319d33e07f90",
  "current_step_number":"8",
  "status":"completed",
  "want_step_number":"8",
  "want_user_idetificator":1,
  "total_error_count":"2",
  "current_game_points":"17500"
}
<?php } ?>
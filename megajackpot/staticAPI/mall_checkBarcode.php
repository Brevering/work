<?php
//  header("HTTP/1.0 404 Not Found");
  // $postParams = json_decode($_POST['json']);
   $postParams = json_decode('./mall_barcode.json');
  sleep(0);
//  if ($_POST['user_authenticator']) { 


//{"HTML":"<form name=\"checkWinForm\">\r\n\t\r\n\t<div class=\"checkWin\">\r\n\t\t<div class=\"checkWinHead\">\r\n\t\t\t<h1 class=\"fleft\">Проверка на печалба</h1>\r\n\t\t\t<p class=\"fleft upper\">код: 16 0000 0501 6728</p>\r\n\t\t\t<p class=\"pull-right upper\">Печалба: <span class=\"winnig-text\">20 лв.</span>\r\n\t\t\t<div class=\"clear\"></div>\r\n\t\t</div>\r\n\t\t<div class=\"checkWinMain\">\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t<div class=\"ticket-view\">\r\n\t\t\t\t<img src=\"https://web-nl-s.e-devel.eu/images/lottery_tickets/index_golden_7_top.jpg\" alt=\"Златната 7\">\r\n\t\t\t</div>\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t\t<div class=\"ticket-win-box\">\r\n\t\t\t\t\t<p class=\"upper\">Билет: <strong>Златната 7</strong></p>\r\n\t\t\t\t\t\r\n\t\t\t\t\t\t<p class=\"upper\">Печалба: <span class=\"winnig-text\">20 лв.</span></p>\r\n\t\t\t\t\t\t<p>Печалби до 100 лв. се изплащат във всички пунктове на Национална лотария. Вижте най-близкия до <a href=\"/where_to_buy/\" target=\"_top\">Вас</a></p>\r\n\t\t\t\t\t\r\n\t\t\t\t\t\r\n\t\t\t\t\t\r\n\t\t\t\t\t\r\n\t\t\t\t\t<div class=\"clear space\">\r\n\t\t\t\t</div>\r\n\t\t\t\r\n\t\t</div>\r\n\t</div>\r\n\t\r\n</form>\r\n","FATAL_ERROR":"INVALID_TICKET_CODE_FOR_PLAY","TALON_ID":"16000005016728","CONSTANT_PARAMS":{"IS_LOGGED":0}}

//{"custom_vip_points_message":"С този код<br/>с който можете да изиграете 49 MEGAJACKPOT ИГРИ<br/>Имате изиграна 1 игра и участвате 6 пъти в жребия за ГОЛЯМАТА НАГРАДА в MEGAJACKPOT","can_play_games":"49","game_points_required":"10","total_win_games":50,"CONSTANT_PARAMS":{"IS_LOGGED":0},"ticket_left_points":"490","ticket_total_points":"500","TALON_ID":"90689952680492"}

  if (1 == 1) { 
?>

{"can_play_games":2,"session_id":"a24dc703e3f44bcada90611ee8d7e35ddce991e1","current_step_number":"0","game_points_required":"10","total_win_games":2,"CONSTANT_PARAMS":{"IS_LOGGED":1},"ticket_left_points":"20","koef":{"jackpot_sectors":{"6":{"points":"500000"},"3":{"points":"150000"},"7":{"points":"150000"},"9":{"points":"200000"},"2":{"points":"250000"},"8":{"points":"250000"},"1":{"points":"1000000"},"4":{"points":"100000"},"10":{"points":"100000"},"5":{"points":"200000"}},"minimal_win_points":"5000","spheres":{"6":{"points":30000},"3":{"points":15000},"7":{"points":35000},"9":{"points":50000},"2":{"points":10000},"8":{"points":40000},"1":{"points":5000},"4":{"points":20000},"10":{"points":"###JACKPOT###"},"5":{"points":25000}}},"ticket_total_points":"20","TALON_ID":"16000264970001"}

  
   
     <?php } else if ($postParams->start_game) { ?> 
 {
"sess_info":{
"step_number":"0","user_type":null,"session_id":"b9f5f28805b3b5a4a5eeb25382cf18d6e1f61de9","status":"active","betting_type":"2","last_update_ts":"1440416217","points_price_per_draw_register":"5000","winning_points":"0","sc_game_campain_recno":"1","betting_channel":"11","web_user_recno":"0","user_email":null,"payment_type":"MALL_DIRECT_PAYMENT","ticket_num":"90564265148390","points_price_per_game":"10","play_from":"mall","user_phone":null,"sc_game_type_recno":"1","user_identificator":null,"closed_ts":"0","remote_ip":"10.20.10.25","sc_game_type_koef_recno":"1","user_type_identificator":null,"create_ts":"1440416217","error_try_count":"0","winning_points_for_draw":"0","recno":"819"},
"session_id":"b9f5f28805b3b5a4a5eeb25382cf18d6e1f61de9",
"current_step_number":"0",
"koef":{
  "jackpot_sectors":{"6":{"points":"500000"},"3":{"points":"200000"},"7":{"points":"200000"},"9":{"points":"150000"},"2":{"points":"100000"},"8":{"points":"100000"},"1":{"points":"1000000"},"4":{"points":"250000"},"10":{"points":"250000"},"5":{"points":"150000"}},
  "spheres":{"6":{"points":30000},"3":{"points":15000},"7":{"points":35000},"9":{"points":50000},"2":{"points":10000},"8":{"points":40000},"1":{"points":5000},"4":{"points":20000},"10":{"points":"###JACKPOT###"},"5":{"points":25000}}
  },
"TALON_ID":"90564265148390","CONSTANT_PARAMS":{"IS_LOGGED":0}
}
 
  <?php } else { ?>  
{
    "can_play_games": 1,
    "game_points_required": "10",
    "total_win_games": 0,
    "ticket_left_points": "5",
    "LOGIN_FIELD": "email",
    "LOGIN_REQUIRED": 1,
    "ticket_total_points": "5",
    "TALON_ID": "97532721546092",
    "koef":{
  "jackpot_sectors":{"6":{"points":"500000"},"3":{"points":"200000"},"7":{"points":"200000"},"9":{"points":"150000"},"2":{"points":"100000"},"8":{"points":"100000"},"1":{"points":"1000000"},"4":{"points":"250000"},"10":{"points":"250000"},"5":{"points":"150000"}},
  "spheres":{"6":{"points":30000},"3":{"points":15000},"7":{"points":35000},"9":{"points":50000},"2":{"points":10000},"8":{"points":40000},"1":{"points":5000},"4":{"points":20000},"10":{"points":"###JACKPOT###"},"5":{"points":25000}}
  }
}
<?php } ?>
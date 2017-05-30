<?php
  $postParams = json_decode($_POST['json']); 
  $pass = $postParams->{'password'};
  $user = '';
  $email = '';
  if(isset($postParams->{'email'})) {$email = $postParams->{'email'};};
  if(isset($postParams->{'username'})) {$user = $postParams->{'username'};};
?>

    <?php if (($user == 'pesho' || $email == 'pesho@gosho.com') && $pass == '123456Aa') { ?>
{ 
"result": "Hooray! You are logged in!",
"user_logged": 1
}
    <?php }else { ?>  
{ 
"result": "Bad credentials. Try again!",
"user_logged": 0
}
<?php } ?>
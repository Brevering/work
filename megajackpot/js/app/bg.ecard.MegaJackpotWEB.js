'use strict';
bg.ecard.MegaJackpot = new Object();

bg.ecard.MegaJackpot._config = new Object({
	
  SCREEN_RESIZE_TIMEOUT: 250,
  
  defUItimeout: 1,
  
  sections: {
    default: {
      id: 'Intro',
      type: 'Intro'     
    },
    Login: {
      id: 'Login',
      type: 'Login'
    },
    LoginError: {
      id: 'LoginError',
      type: 'LoginError'
    },
    GameStart: {
      id: 'GameStart',
      type: 'GameStart',
    },
    GameWheel: {
      id: 'GameWheel',
      type: 'GameWheel',
    },
    GameWheelResult: {
      id: 'GameWheelResult',
      type: 'GameWheelResult',
    },
    Spheres: {
      id: 'Spheres',
      type: 'Spheres',
    },
    GameError: {
      id: 'GameError',
      type: 'GameError',
    },
    Registration: {
      id: 'Registration',
      type: 'Registration',
    },
    RegistrationSuccess: {
      id: 'RegistrationSuccess',
      type: 'RegistrationSuccess',
    },
    JackpotWon: {
      id: 'JackpotWon',
      type: 'JackpotWon',
    },
  },
  
  keyboards: ['telephone', 'email'],
  
  
  useRAF: true,
  displayResolutionDef: '320p',
  useDevicePixelRatio: false,
  
  displayResolutionCalc: '1080p',
  //forcedAssetResolution: '480p',
  assetsBaseUrl: '',
  assets: [
    {id: 'mega_jackpot_buttons', assetType: 'Image', url: 'images/mega_jackpot_buttons.png'},
    {id: 'section-spheres', assetType: 'Image', url: 'images/section-spheres.png'},
    {id: 'stage-sphere-back', assetType: 'Image', url: 'images/stage-sphere-back.png'},
    {id: 'wheel-back', assetType: 'Image', url: 'images/wheel-back.png'},
    {id: 'home-text-car', assetType: 'Image', url: 'images/home-text-car.png'},
    {id: 'wheel-spin-back', assetType: 'Image', url: 'images/wheel-spin-back.png'},
    {id: 'popup-error', assetType: 'Image', url: 'images/popup-error.png'},
    {id: 'popup-success', assetType: 'Image', url: 'images/popup-success.png'},
    
    {id: 'stage-back', assetType: 'Image', url: 'images/stage-back.png'},
    {id: 'generated-games-text', assetType: 'Image', url: 'images/generated-games-text.png'},
    {id: 'spin-arm', assetType: 'Image', url: 'images/spin-arm.png'},
    {id: 'btns', assetType: 'Image', url: 'images/btns.png'},
    {id: 'spin-wheel-text11', assetType: 'Image', url: 'images/spin-wheel-text11.png'},
    {id: 'generated-win-sum', assetType: 'Image', url: 'images/generated-win-sum.png'},
    {id: 'screen-start-game-text', assetType: 'Image', url: 'images/screen-start-game-text.png'},
    {id: 'stop-descr-text', assetType: 'Image', url: 'images/stop-descr-text.png'},
    {id: 'spin-wheel-text', assetType: 'Image', url: 'images/spin-wheel-text.png'},
    // {id: 'letter-m-spr', assetType: 'Image', url: 'images/letter-m-spr.png'},
    // {id: 'letter-a-spr', assetType: 'Image', url: 'images/letter-a-spr.png'},
    // {id: 'letter-k-spr', assetType: 'Image', url: 'images/letter-k-spr.png'},
    // {id: 'letter-g-spr', assetType: 'Image', url: 'images/letter-g-spr.png'},
    // {id: 'letter-c-spr', assetType: 'Image', url: 'images/letter-c-spr.png'},
    // {id: 'letter-o-spr', assetType: 'Image', url: 'images/letter-o-spr.png'},
    // {id: 'letter-p-spr', assetType: 'Image', url: 'images/letter-p-spr.png'},
    // {id: 'letter-e-spr', assetType: 'Image', url: 'images/letter-e-spr.png'},
    // {id: 'letter-t-spr', assetType: 'Image', url: 'images/letter-t-spr.png'},
    // {id: 'letter-j-spr', assetType: 'Image', url: 'images/letter-j-spr.png'},
    // {id: 'sphere-back', assetType: 'Image', url: 'images/sphere-back.png'},
    // {id: 'screen-reg-btn-save', assetType: 'Image', url: 'images/screen-reg-btn-save.png'},
    // {id: 'btn-start-game', assetType: 'Image', url: 'images/btn-start-game.png'},
    // {id: 'btn-stop', assetType: 'Image', url: 'images/btn-stop.png'},
    {id: 'small-car', assetType: 'Image', url: 'images/small-car.png'},
    // {id: 'turn-here-text', assetType: 'Image', url: 'images/turn-here-text.png'},
    // {id: 'sphere-number-box-back', assetType: 'Image', url: 'images/sphere-number-box-back.png'},
    // {id: 'wheel-stop-arrow', assetType: 'Image', url: 'images/wheel-stop-arrow.png'},
    // {id: 'arrow-down-red', assetType: 'Image', url: 'images/arrow-down-red.png'},
    // {id: 'arrow-down', assetType: 'Image', url: 'images/arrow-down.png'},
    // {id: 'sphere-number-box-nl', assetType: 'Image', url: 'images/sphere-number-box-nl.png'},
    {id: 'sphere-number-box-guessed', assetType: 'Image', url: 'images/sphere-number-box-guessed.png'},
    {id: 'sphere-number-box-wrong', assetType: 'Image', url: 'images/sphere-number-box-wrong.png'},
    
    {id: 'sound-sphereStop', assetType: 'Sound', url: 'images/sound/sphereStop.ogg'},

  ]
  
	
});

bg.ecard.MegaJackpot.start = function(params) {
//	console.log('MegaJackpot.start()');
//  return;
  
  if (params) {
    for (var i in params) {
      bg.ecard.MegaJackpot._config[i] = params[i]
    }
  }
  
//  return;
  if (document.location.href.indexOf('localhost') > 0) {
    bg.ecard.MegaJackpot._config.url = {
      barcodeSubmit: 'staticAPI/mall_checkBarcode.php',
      gameWheelSpin: 'staticAPI/mall_wheelSpin.json',
      gameSphereSpin: 'staticAPI/mall_sphereSpin.php',
      gameResultReg: 'staticAPI/mall_reg.php',
    }
    bg.ecard.MegaJackpot._config.defUItimeout = 0.1;
  }
  
  window.app = new bg.ecard.MegaJackpot.Core( bg.ecard.MegaJackpot._config );
  
}

bg.ecard.MegaJackpot.initCore = function() {
  window.app.init();
}

bg.ecard.utils.registerJS('bg.ecard.MegaJackpot.js');

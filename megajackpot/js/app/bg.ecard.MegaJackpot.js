'use strict';
bg.ecard.MegaJackpot = new Object();

bg.ecard.MegaJackpot._config = new Object({
	
  SCREEN_RESIZE_TIMEOUT: 250,
 
  defUItimeout: 1,
  defSoundVolume: 1,
  
  sections: {
    default: 'Intro',
    BarcodeWorking: {
      id: 'BarcodeWorking',
      type: 'BarcodeWorking'
    },
    Intro: {
      id: 'Intro',
      type: 'Intro'     
    },
    IntroWeb: {
      id: 'IntroWeb',
      type: 'IntroWeb',
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
    TalonHistory: {
      id: 'TalonHistory',
      type: 'TalonHistory',
    },
    NetworkError: {
      id: 'NetworkError',
      type: 'NetworkError',
    }
  },
  
  keyboards: ['telephone', 'email'],
  
  assetsBaseUrl: '',
  assets: [
    {id: 'mega_jackpot_buttons', assetType: 'Image', url: 'images/mega_jackpot_buttons.png'},
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
    {id: 'sphere-back', assetType: 'Image', url: 'images/sphere-back.png'}, 
    {id: 'wheel-back', assetType: 'Image', url: 'images/wheel-back.png'},
    {id: 'wheel-spin-back', assetType: 'Image', url: 'images/wheel-spin-back.png'},
    {id: 'popup-error', assetType: 'Image', url: 'images/popup-error.png'},
    {id: 'popup-success', assetType: 'Image', url: 'images/popup-success.png'},
    {id: 'stage-back', assetType: 'Image', url: 'images/stage-back.png'},
    {id: 'btns', assetType: 'Image', url: 'images/btns.png'},
    {id: 'spin-wheel-text11', assetType: 'Image', url: 'images/spin-wheel-text11.png'},
    // {id: 'screen-reg-btn-save', assetType: 'Image', url: 'images/screen-reg-btn-save.png'},
    // {id: 'btn-start-game', assetType: 'Image', url: 'images/btn-start-game.png'},
    // {id: 'btn-stop', assetType: 'Image', url: 'images/btn-stop.png'},
    // {id: 'turn-here-text', assetType: 'Image', url: 'images/turn-here-text.png'},
    // {id: 'sphere-number-box-back', assetType: 'Image', url: 'images/sphere-number-box-back.png'},
    // {id: 'wheel-stop-arrow', assetType: 'Image', url: 'images/wheel-stop-arrow.png'},
    // {id: 'arrow-down-red', assetType: 'Image', url: 'images/arrow-down-red.png'},
    // {id: 'arrow-down', assetType: 'Image', url: 'images/arrow-down.png'},
    // {id: 'sphere-number-box-nl', assetType: 'Image', url: 'images/sphere-number-box-nl.png'},
    {id: 'sphere-number-box-guessed', assetType: 'Image', url: 'images/sphere-number-box-guessed.png'},
    {id: 'sphere-number-box-wrong', assetType: 'Image', url: 'images/sphere-number-box-wrong.png'},
    // {id: 'btn-stop', assetType: 'Image', url: 'images/btn-stop.png'},
    {id: 'sphere-number-box-guessed', assetType: 'Image', url: 'images/sphere-number-box-guessed.png'},
    {id: 'step-sum-win-back', assetType: 'Image', url: 'images/step-sum-win-back.png'},
    {id: 'btns', assetType: 'Image', url: 'images/btns.png'},
    {id: 'sphere-number-box-wrong', assetType: 'Image', url: 'images/sphere-number-box-wrong.png'},
    {id: 'cancel-win-x', assetType: 'Image', url: 'images/cancel-win-x.png'},
    // {id: 'btn-ready', assetType: 'Image', url: 'images/btn-ready.png'},
    {id: 'sound-spheresIntro', assetType: 'Sound', url: 'images/sound/spheresIntro'},
    {id: 'sound-spheresBack', assetType: 'Sound', url: 'images/sound/spheresBack'},
    {id: 'sound-spheresBackAfterError', assetType: 'Sound', url: 'images/sound/spheresBackAfterError'},
    {id: 'sound-regBack', assetType: 'Sound', url: 'images/sound/regBack'},
    {id: 'sound-wheelClick', assetType: 'Sound', url: 'images/sound/wheelClick'},
    {id: 'sound-sphereStop', assetType: 'Sound', url: 'images/sound/sphereStop'},
  ]
  
	
});

bg.ecard.MegaJackpot.start = function(params) {

  if (params) {
    for (var i in params) {
      bg.ecard.MegaJackpot._config[i] = params[i]
    }
  }
  
  if (params.is_web_game == '1') {
    bg.ecard.MegaJackpot._config.sections.default = 'IntroWeb';
  }
  
  window.app = new bg.ecard.MegaJackpot.Core( bg.ecard.MegaJackpot._config );
  
}

bg.ecard.MegaJackpot.initCore = function() {
  window.app.init();
}

bg.ecard.utils.registerJS('bg.ecard.MegaJackpot.js');

chrome.app.runtime.onLaunched.addListener(function() {
  //chrome.app.window.create('wordsearch.htm', {
  /*
  chrome.app.window.create('http://localhost:3000', {
    'bounds': {
      'width': 1000,
      'height': 700
    }
  });
  */
  chrome.tabs.create({ url: 'http://localhost:3000/' });
});

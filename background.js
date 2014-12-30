chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('wordsearch.htm', {
    'bounds': {
      'width': 1000,
      'height': 700
    }
  });
});

var s = document.createElement('script');
s.src = chrome.runtime.getURL('/src/script.js');
s.onload = function () { this.remove(); };
// see also "Dynamic values in the injected code" section in this answer
(document.head || document.documentElement).appendChild(s);

waitForElm('.css-1o4dex4').then((elm) => {

  console.log('Element is ready');
  console.log(elm.textContent);

  var buttonsContainer = document.getElementsByClassName("chakra-stack css-1o4dex4")[0];
  var buttonsContainerArray = document.getElementsByClassName("chakra-stack css-1o4dex4");

  var toggleSwitch = document.createElement('div');
  toggleSwitch.innerHTML = "<input type = 'checkbox' id='toggleSwitch' onclick='switchWorkingState()'>";
  var toggleSwitchText = document.createElement('div');
  toggleSwitchText.innerHTML = "<p>ON/OFF </p>";

  var inputSkips = document.createElement('div');
  inputSkips.innerHTML = "<input type='number' id='skips' name='skips' />";
  var inputSkipsText = document.createElement('div');
  inputSkipsText.innerHTML = "<p>| Min</p>";

  var inputMaxText = document.createElement('div');
  inputMaxText.innerHTML = "<p> | Max</p>";
  var inputMax = document.createElement('div');
  inputMax.innerHTML = "<input type='number' id='max' name='max' />";

  var inputExampleText = document.createElement('div');
  inputExampleText.innerHTML = "<p> | Example</p>";
  var inputExample = document.createElement('div');
  inputExample.innerHTML = "<input type='number' id='example' name='example' />";



  buttonsContainer.appendChild(toggleSwitch);
  buttonsContainer.appendChild(toggleSwitchText);

  buttonsContainer.appendChild(inputSkipsText);
  buttonsContainer.appendChild(inputSkips);

  buttonsContainer.appendChild(inputMaxText);
  buttonsContainer.appendChild(inputMax);

  buttonsContainer.appendChild(inputExampleText);
  buttonsContainer.appendChild(inputExample);

  document.getElementById('skips').style.width = "50px";
  document.getElementById('max').style.width = "50px";
  document.getElementById('example').style.width = "50px";
});

function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

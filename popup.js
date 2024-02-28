(function(window, document) {

  const fontFamilyField = document.getElementById('font-family');
  const fontFamilyResetButton = document.getElementById('font-family-reset');
  const themeButtons = document.querySelectorAll('.theme-buttons button');
  const themeHexColors = Array.from(themeButtons).map(btn => btn.value);
  const themeHexColorsObj = Object.fromEntries(Array.from(themeButtons).map(btn => [btn.value, btn.name]));
  const backgroundColorField = document.getElementById('background-color');
  const backgroundColorSwatch = document.getElementById('background-color-swatch');
  const themeField = document.getElementById('theme');
  const backgroundColorSwatchLabel = document.getElementById('background-color-swatch-theme-label');
  const status = document.getElementById('status');

  function saveOptions() {
      const fontFamily = fontFamilyField.value;
      const backgroundColor = backgroundColorField.value;
      function updateStatus() {
          status.textContent = '☑ Options saved. Please close and reopen devtools to see changes.';
      }

      chrome.storage.sync.set({
          fontFamily: fontFamily, // maybe change name for localStorage
          consoleBackgroundColor: backgroundColor,
      }, updateStatus);
  }


  // document.addEventListener('DOMContentLoaded', restoreOptions);
  function setFontFamilyFieldStyle(s) {
    let fstack = `'${s}', menlo, monospace, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`;
    fontFamilyField.style.fontFamily = fstack;
  }

  fontFamilyResetButton.addEventListener('click', e => {
    let v = "menlo, monospace";
    fontFamilyField.value = v;
    // Enable Save button if value is different than localStorage. 
    chrome.storage.sync.get({
        fontFamily: "menlo, monospace",
        consoleBackgroundColor: "#ffffff"
    }, items=>{
      let isFontFamilyChange = (items.fontFamily !== v);
      let isBackgroundColorChange = (items.consoleBackgroundColor !== backgroundColorField.value);
      let isNoChange = !isFontFamilyChange && !isBackgroundColorChange;
      console.log(
       "!isFontFamilyChange && !isBackgroundColorChange", isNoChange,
       "isFontFamilyChange", isFontFamilyChange,
       "isBackgroundColorChange", isBackgroundColorChange);
      document.getElementById('save').disabled = isNoChange;
    });
  });

  fontFamilyField.addEventListener('keyup', e => {
    let v = e.target.value
    setFontFamilyFieldStyle(v);

    // Enable Save button if value is different than localStorage. 
    chrome.storage.sync.get({
        fontFamily: "menlo, monospace",
        consoleBackgroundColor: "#ffffff"
    }, items=>{
      let isFontFamilyChange = (items.fontFamily !== v);
      let isBackgroundColorChange = (items.consoleBackgroundColor !== backgroundColorField.value);
      let isNoChange = !isFontFamilyChange && !isBackgroundColorChange;
      console.log(
       "!isFontFamilyChange && !isBackgroundColorChange", isNoChange,
       "isFontFamilyChange", isFontFamilyChange,
       "isBackgroundColorChange", isBackgroundColorChange);
      document.getElementById('save').disabled = isNoChange;
    });
  });

  function isHex(s){
       return s.match(/^#[a-fA-F\d]{3}(?:[a-f\d]?|(?:[a-f\d]{3}(?:[a-f\d]{2})?)?)$/)
  }

  function enableSaveButtonOnBackgroundColorChange(v) {
      // Enable Save button if value is different than localStorage. 
      chrome.storage.sync.get({
          fontFamily: "menlo, monospace",
          consoleBackgroundColor: "#ffffff"
      }, items=>{
        document.getElementById('save').disabled = (items.consoleBackgroundColor === v);
      });
  } 

  function removeInvalidClass () {
    backgroundColorSwatchLabel.classList.remove("invalid");
    backgroundColorField.classList.remove("invalid");
    document.querySelector('label[for="background-color"]').classList.remove("invalid");
  }
  
  function removeSelectedThemeClass() {
    document.querySelector('.selected-theme')?.classList.remove("selected-theme");
  }

  function backgroundColorFieldEventHandler(hex) {
    backgroundColorSwatchLabel.textContent = "";
    console.log(hex);
    const isValidHex = isHex(hex);

    if(isValidHex){
      backgroundColorSwatchLabel.innerText = "";
      removeInvalidClass();
      enableSaveButtonOnBackgroundColorChange(hex);
    }else{
      backgroundColorField.classList.add("invalid");
      document.querySelector('label[for="background-color"]').classList.add("invalid");
      backgroundColorSwatchLabel.classList.add("invalid");
      backgroundColorSwatchLabel.innerText = "Invalid valid hex color.";
    }

    removeSelectedThemeClass();
    const themeHex = isValidHex && themeHexColors.find(x => (hex === x));
    const matchingThemeName = themeHex && themeHexColorsObj[themeHex];
    if(matchingThemeName){
       document.querySelector(`button[name="${matchingThemeName}"]`).classList.add("selected-theme");
       backgroundColorSwatchLabel.textContent = matchingThemeName;
    }
  }

  backgroundColorField.addEventListener('paste', e => {
    const hex = (e.clipboardData || window.clipboardData).getData("text");
    backgroundColorFieldEventHandler(hex);
  });

  backgroundColorField.addEventListener('keyup', e => {
    const hex = e.target.value;
    backgroundColorFieldEventHandler(hex);
  });

  themeButtons.forEach((button)=>{
      button.addEventListener('click', e => {
        let v = e.target.value;
        backgroundColorField.value = v;
        backgroundColorSwatch.style.backgroundColor = v;
        removeSelectedThemeClass();
        let buttonClasses = e.target.classList;
        buttonClasses.add("selected-theme");
        removeInvalidClass();
        backgroundColorSwatchLabel.textContent = e.target.name;
        enableSaveButtonOnBackgroundColorChange(v);
      });
  })

  document.getElementById('save')
      .addEventListener('click', saveOptions);

  document.getElementById('background-color-reset')
      .addEventListener('click', () => {
        let resetColor = "#ffffff";
        backgroundColorField.value = resetColor;
        backgroundColorFieldEventHandler(resetColor);
      });


  // Initial settings of the UI.
  chrome.storage.sync.get({
      fontFamily: 'menlo, monospace',
      consoleBackgroundColor: '#ffffff',
  }, items => {
      let ff = items.fontFamily;
      setFontFamilyFieldStyle(ff);
      fontFamilyField.value = ff;
      backgroundColorField.value = items.consoleBackgroundColor;
      backgroundColorSwatch.style.backgroundColor = items.consoleBackgroundColor;

      const matchingThemeName = themeHexColorsObj[items.consoleBackgroundColor];
      if(matchingThemeName){
        backgroundColorSwatchLabel.textContent = matchingThemeName;
        let themeButton = document.querySelector(`button[name="${matchingThemeName}"]`);
        themeButton.classList.add("selected-theme");
      }

  });

})(window, document);

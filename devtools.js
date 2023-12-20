(function() {

  const styleTemplate = (fontFamily, consoleBackgroundColor) => {
    let isFontFamilyReset = (fontFamily==="menlo, monospace");
    let isConsoleBackgroundReset = consoleBackgroundColor==="#ffffff" || consoleBackgroundColor==="#fff";
    let ff = isFontFamilyReset ? "" : `font-family: ${fontFamily} !important;`;
    let bgc = isConsoleBackgroundReset ? "" : `background-color: ${consoleBackgroundColor} !important;`;
    return `
      :host-context(.platform-windows) .monospace, 
      :host-context(.platform-windows) .token-variable, 
      :host-context(.platform-windows) .source-code, 
      .platform-windows .monospace,
      .platform-windows .token-variable,
      .platform-windows .source-code,
      :host-context(.platform-mac) .monospace,
      :host-context(.platform-mac) .token-variable,
      :host-context(.platform-mac) .source-code,
      .platform-mac .monospace,
      .platform-mac .token-variable,
      .platform-mac .source-code,
      :host-context(.platform-linux) .monospace, 
      :host-context(.platform-linux) .token-variable, 
      :host-context(.platform-linux) .source-code, 
      .platform-linux .monospace,
      .platform-linux .token-variable,
      .platform-linux .source-code {
        ${ff}
      }
      #console-messages {
        ${bgc}
      }
  `};

  chrome.storage.sync.get({
      fontFamily: 'monospace',
      consoleBackgroundColor: '#ffffff',
  }, items => {
      chrome.devtools.panels.applyStyleSheet(styleTemplate(items.fontFamily, items.consoleBackgroundColor));
  });

  chrome.devtools.panels.create('Devtools Console Customizer',
      'devtool.png',
      'panel.html'
  );

})();

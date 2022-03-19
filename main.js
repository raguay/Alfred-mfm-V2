var alfred = {
  extMan: null,
  fs: null,
  init: function(extManager) {
    //
    // This function adds all the commands for working with alfred and 
    // setting up references to variables that are used.
    //
    alfred.extMan = extManager;
    alfred.fs = extManager.getLocalFS();
    alfred.extMan.getCommands().addCommand('Open in Alfred', 'alfred.open', 'Open the current entry in the Alfred browser.', alfred.open);
  },
  installKeyMaps: function() {
    alfred.extMan.getExtCommand('addKeyboardShort').command('normal', false, false, false, 'a', alfred.open);
  },
  open: async function() {
    //
    // This command will open the current cursor in the Alfred browser.
    //
    // First, get the current cursor:
    //
    var cursor = alfred.extMan.getExtCommand('getCursor').command();

    //
    // Use AppleScript command line to open the cursor in Alfred.
    //
    await alfred.fs.runCommandLine('osascript -e \'tell application "Alfred 4" to browse "' + cursor.entry.dir + '/' + cursor.entry.name + '" \'');
  }
};
return (alfred);

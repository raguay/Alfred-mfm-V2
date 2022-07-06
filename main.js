var alfred = {
  extMan: null,
  fs: null,
  alfredString: '',
  alfredConfig: '',
  init: async function(extManager) {
    //
    // This function adds all the commands for working with alfred and 
    // setting up references to variables that are used.
    //
    alfred.extMan = extManager;
    alfred.fs = extManager.getLocalFS();
    let configDir = await alfred.fs.getConfigDir();
    alfred.alfredConfig = `${configDir}/alfred.json`;
    if(await alfred.fs.fileExists(alfred.alfredConfig)) {
      alfred.alfredString = await alfred.fs.readFile(alfred.alfredConfig);
      alfred.alfredString = JSON.parse(alfred.alfredString).alfredString;
    } else {
      alfred.alfredString = "Alfred 5";
      await alfred.fs.writeFile(alfred.alfredConfig, JSON.stringify({
        alfredString: alfred.alfredString
      }));
    }
    alfred.extMan.getCommands().addCommand('Open in Alfred', 'alfred.open', 'Open the current entry in the Alfred browser.', alfred.open);
    alfred.extMan.getCommands().addCommand('Set Alfred\'s Name', 'alfred.setName', 'Set the name for the Alfred Application', alfred.setName);
  },
  setName: function() {
    alfred.extMan.getExtCommand('askQuestion').command('Alfred', 'What is the name of the Alfred program?', async (result) => {
      result = result.trim();
      if(result !== '') {
        alfred.alfredString = result;
        await alfred.fs.writeFile(alfred.alfredConfig, JSON.stringify({
          alfredString: alfred.alfredString
        }));
      }
    });
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
    console.log(`osascript -e 'tell application "${alfred.alfredString}" to browse "${cursor.entry.dir}/${cursor.entry.name}"'`);
    await alfred.fs.runCommandLine(`osascript -e 'tell application "${alfred.alfredString}" to browse "${cursor.entry.dir}/${cursor.entry.name}"'`);
  }
};
return (alfred);

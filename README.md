# Stream Credits
Firebot script to scroll end stream credits.

# Setup - Extract
1. Add this to the script directory in Firebot. Custom scripts must be enabled.
2. If you already have a pm.includes folder, this should add to it, and may replace existing files. Up to you, if you have made any local changes to files that it overwrites.
3. You should end up with a credits folder, with a data folder, with folders for each action.

# Setup - Events
In Firebot create events with the following chat effect:

(check whisper and enter your username for each)

- Follow
  - !creditcommands add follows $(user)
- Sub
  - !creditcommands add subs $(user)
- Host
  - !creditcommands add hosts $(user)
- Banned
  - !creditcommands add bans $(user)

# Setup - Commands
In Firebot create the following commands:

- creditCmds
  - Trigger: !creditcommands
  - Custom script: credits.js
- rollcredits
  - Trigger: !rollcredits
  - Toggle Connection -> Interactive (this is optional, but I prefer to turn off other buttons for credits)
  - Custom script: credits.js
  - Chat: whisper a message to yourself telling you credits started (optional)
- wipecredits
  - Trigger: !wc
  - Chat: (whisper yourself) !creditcommands clear
- dono
  - Trigger: !dono
  - Chat: (whisper yourself) !creditcommands add donos $(arg1) $(user) true
  
# Setup - Moderator Credit
This can be a button, or a command. Totally up to you.

Create a button or command for your mods to add themselves to the credits, to show they were here and helped.

Chat (whisper yourself) !creditcommands add mods $(user) $(user) true

# Setup - Tracking, Titles, and Images
In the pm.includes/credits folder you can edit
- Titles
- Sponsors
  - Just an array of names, adjust to your liking. I left mine as examples.
- Images
  - I stuck mine on Imgur and left them in the file for examples for you. You can add/remove to your needs.
  - Note how the twitter image has a "txt" value, you can do that with each image if you wanted.
- Tracking booleans
  - Set a section to false, to not track it.

In the settings.js file

# Use
After setting up, close Firebot and refresh your source just to be sure (OBS, xSplit, etc)

- When you get a donation, use the !dono command ex: !dono @mrviewer
- To wipe the credits for a new stream, or at the end of the stream use !wc (you can whisper this to yourself too)
- To start the credits at the end of the stream, type !rollcredits.

# Notes
Im sure there will be issues. This is just a script I wrote for myself, and wanted to share with the rest of my friends at Mixer.


  
  
  
  
  

// main languages
// version: 1.1

// List languages in order of appearance, first being the default

var mainLanguages = new Array('English');

var LANG = new Array();

// English

LANG['English'] = new Array();

LANG['English']['menu'] = 'MENU';
LANG['English']['main'] = 'Main';
LANG['English']['options'] = 'Options';
LANG['English']['options2'] = 'Options 2';
LANG['English']['load'] = 'Load';
LANG['English']['info'] = 'Information';
LANG['English']['enter'] = 'Enter your words';
LANG['English']['sep'] = 'Separated by commas, spaces, or one word per line';
LANG['English']['puzlang'] = 'Puzzle language';
LANG['English']['or'] = 'OR';
LANG['English']['rows'] = 'Rows';
LANG['English']['cols'] = 'Columns';
LANG['English']['fontsize'] = 'Font size';
LANG['English']['gridstyle'] = 'Puzzle style';
LANG['English']['mcustom'] = 'Make custom';
LANG['English']['gridlang'] = 'Grid language';
LANG['English']['borf'] = 'Fowards and Backwards';
LANG['English']['bonly'] = 'Backwards only';
LANG['English']['fonly'] = 'Forwards only';
LANG['English']['diag'] = 'Diagonal words';
LANG['English']['donly'] = 'Diagonal words only';
LANG['English']['nodiag'] = 'No diagonal words';
LANG['English']['uandd'] = 'Up and down words';
LANG['English']['uanddo'] = 'Up and down words only';
LANG['English']['nouandd'] = 'No up and down words';
LANG['English']['sort'] = 'Sort alphabetically';
LANG['English']['lower'] = 'Lowercase letters';
LANG['English']['wordlist'] = 'Use word list letters';
LANG['English']['paste'] = 'Paste your saved game below';
LANG['English']['high'] = 'To highlight a word';
LANG['English']['high2'] = 'Put mouse cursor over the first or last letter in a word you want to highlight.';
LANG['English']['high3'] = 'Hold down the left mouse button and drag the cursor to highlight the word.';
LANG['English']['high4'] = 'Release the mouse button, and the word will be highlighted and automatically crossed out in the list.';
LANG['English']['keys'] = 'Keys';
LANG['English']['keyR'] = 'R = Refresh puzzle';
LANG['English']['keyS'] = 'S = Show save game box and address';
LANG['English']['create'] = 'Create Puzzle';
LANG['English']['save'] = 'Save Settings';
LANG['English']['return'] = 'Return';
LANG['English']['nowords'] = 'Enter at least one word';
LANG['English']['cont'] = 'Continue';
LANG['English']['sg'] = 'Save game address';
LANG['English']['err1'] = 'None of your words made it into the puzzle, please try again.';
LANG['English']['err2'] = 'Custom shape empty';
LANG['English']['prompt'] = 'Enter your custom shape below';
LANG['English']['width'] = 'Width';
LANG['English']['height'] = 'Height';
LANG['English']['make'] = 'Make';
LANG['English']['start'] = 'Start marking';
LANG['English']['shift'] = 'Shift';
LANG['English']['up'] = 'Up';
LANG['English']['left'] = 'Left';
LANG['English']['right'] = 'Right';
LANG['English']['down'] = 'Down';
LANG['English']['copythis'] = 'Style code (save for later use)';
LANG['English']['setsaved'] = 'Settings saved';
LANG['English']['wlnum'] = 'Number of words';
LANG['English']['wlwords'] = 'Word list';
LANG['English']['fontcolor'] = 'Font color';
LANG['English']['bgcolor'] = 'Background color';
LANG['English']['hlcolor'] = 'Highlight color';
LANG['English']['right'] = 'Right';
LANG['English']['bottom'] = 'Bottom';
LANG['English']['wlplace'] = 'Placement of word list';
LANG['English']['fin'] = 'Puzzle finished';
LANG['English']['mis'] = 'Mistakes';
LANG['English']['rev'] = 'Words revealed';
LANG['English']['close'] = 'Close window without saving';
LANG['English']['savestyle'] = 'Save style and close window';
LANG['English']['input'] = 'Input custom';
LANG['English']['inputcs'] = 'Input custom code below';
LANG['English']['warn'] = 'Warning: Since you are using a custom style, you will not be able to pass the saved game via the URL.';
LANG['English']['man'] = 'Manually place words into puzzle';
LANG['English']['avail'] = 'Available words';
LANG['English']['savew'] = 'Save word';
LANG['English']['resetw'] = 'Reset word';
LANG['English']['inserted'] = 'Inserted words';
LANG['English']['removew'] = 'Remove word';
LANG['English']['clear'] = 'Clear puzzle';
LANG['English']['entire'] = 'You must enter the entire word.';


/*******************************************************************/

var selectedLanguage;
var temp = document.cookie.split(';');
var t = '';
for(var a=temp.length-1;a>=0;a--) {
  t = temp[a].split('=');
  if(t[0].match('mainLang')) { break; }
}
if(t[0].match('mainLang')) { selectedLanguage = t[1]; } else { selectedLanguage = mainLanguages[0]; }


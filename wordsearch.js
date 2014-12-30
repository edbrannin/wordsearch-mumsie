/***********************************************************
 jsWordsearch
 Version:	0.4
 Author:	Robert
 Email:	brathna@gmail.com
 Website:	http://jswordsearch.sourceforge.net/
************************************************************
 jsWordsearch, prints out a letter grid with words hidden inside.
 Copyright (C) Robert Klein

 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU General Public License as
 published by the Free Software Foundation; either version 2 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful, but
 WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program; if not, write to the
 Free Software Foundation, Inc.
 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 or visit the following website:
 http://www.opensource.org/licenses/gpl-license.php
***********************************************************/

var d = document;

d.write('<script type="text/javascript" src="options.js"></script>');
d.write('<script type="text/javascript" src="languages.js"></script>');
d.write('<script type="text/javascript" src="gridstyles.js"></script>');
d.write('<script type="text/javascript" src="wordlists/wordlists.js"></script>');
d.write('<script type="text/javascript" src="mainlanguages.js"></script>');

var prev = 'main';
var grid = new Array();
var gridWords = new Array();
var xyArray = new Array();
var inserted = new Array();
var unsorted = new Array();
var wordsArray = new Array();
var xnum = 0;
var ynum = 0;
var dir = 0;
var mouseIsDown = 0;
var xy = '';
var revealed = '';
var paused = 0;
var wordcount = 0;
var rev = 0;
var mistakes = 0;
var puzzleActive = 0;
var inputActive = 0;
var scoreTemp = 0;
var scoreXYTemp = '';
var startingSeed = 0;
var randomSeed = 0;
var reload = 0;
var counter = 0;
var customStyle = '';
var chars;
var rows;
var cols;
var fontSize;
var fontColor;
var backgroundColor;
var highlightColor;
var lowerCase;
var sortAlpha;
var useLetters;
var selectedStyle;
var borf;
var diag;
var uand;

function eventHandle() {
	d.onkeypress=keycheck;
	d.onmousedown=omd;
	d.onmouseup=omu;
	d.onselectstart=omd;
}

function omd() { if(!puzzleActive || puzzleActive==2) { return true; } mouseIsDown = 1; return false; }

function omu() { if(!puzzleActive || puzzleActive==2) { return true; } mouseIsDown = 0; if(highlighted.length) clearHighlighted(0,0); return false; }

function showStart() {
	d.title = title;

	var temp = window.location.toString();
	temp = temp.split('?');
	if(temp.length==2) {
		if(temp[1].match('savegame')) {
			temp = temp[1].split('=');
			d.getElementById('code').value=temp[1];
			d.getElementById('loadGameButton').onclick();
			return 1;
		}
	}

	var temp = d.cookie.split(';');
	var cook = '';
	for(var a=temp.length-1;a>=0;a--) {
		cook = temp[a].split('=');
		if(cook[0].match('jswordsearch')) { break; }
	}
	if(cook[0].match('jswordsearch')) {
		cook = cook[1].split(',');
		d.getElementById('numRows').value = cook[0];
		d.getElementById('numCols').value = cook[1];
		d.getElementById('fontSize').value = cook[2];
		if(cook[3]!=d.getElementById('gridStyle').options.length-1) d.getElementById('gridStyle').options[cook[3]].selected = true;
		d.getElementById('gridLanguage').options[cook[4]].selected = true;
		d.getElementById('BorF').options[cook[5]].selected = true;
		d.getElementById('diag').options[cook[6]].selected = true;
		d.getElementById('uand').options[cook[7]].selected = true;
		if(cook[8]) d.getElementById('sortAlpha').checked=true;
		if(cook[9]) d.getElementById('lowerCase').checked=true;
		if(cook[10]) d.getElementById('useLetters').checked=true;
		d.getElementById('fontColor').value = cook[11];
		d.getElementById('title').style.color = cook[11];
		d.getElementById('menuButton').style.color = cook[11];
		d.getElementById('bgColor').value = cook[12];
		d.bgColor=cook[12];
		d.getElementById('hlColor').value = cook[13];
		d.getElementById('wordListPlacement').options[cook[14]].selected = true;
	} else {
		d.getElementById('numRows').value = defRows;
		d.getElementById('numCols').value = defCols;
		d.getElementById('fontSize').value = defFontSize;
		d.getElementById('fontColor').value = defFontColor;
		d.getElementById('bgColor').value = defBGColor;
		d.bgColor=defBGColor;
		d.getElementById('hlColor').value = defHighlightColor;
	}
	d.getElementById('mainDiv').style.visibility = 'visible';
}

var menuToggle = 1;
function keycheck(e) {
	var code;
	if (!e) var e = window.event;
	if (e.keyCode) code = e.keyCode;
	else if (e.which) code = e.which;
	if(code==13) { // Enter key
		if(puzzleActive==1) {
		} else if(!inputActive && puzzleActive!=2) {
			d.getElementById('create').onclick();
		}
	} else if(code==114 || code==82) { // key r and R
		if(puzzleActive) {
			if(saveTemp=='') d.getElementById('create').onclick();
			else createPuzzle(0);
		}
	} else if(code==115 || code==83) { // key s and S
		if(puzzleActive) {
			d.getElementById('puzzle').style.display = 'none';
			d.getElementById('saveGameForm').style.display = 'block';
			var settings = d.getElementById('numRows').value+','+d.getElementById('numCols').value+','+d.getElementById('fontSize').value+','+d.getElementById('gridStyle').selectedIndex+','+d.getElementById('gridLanguage').selectedIndex+','+d.getElementById('BorF').selectedIndex+','+d.getElementById('diag').selectedIndex+','+d.getElementById('uand').selectedIndex+','+((d.getElementById('sortAlpha').checked==true) ? 1 : '')+','+((d.getElementById('lowerCase').checked==true) ? 1 : '')+','+((d.getElementById('useLetters').checked==true) ? 1 : '')+','+d.getElementById('fontColor').value+','+d.getElementById('bgColor').value+','+d.getElementById('hlColor').value+','+d.getElementById('wordListPlacement').selectedIndex;
			var temp = escape(startingSeed + '|' + settings + '|' + unsorted + '|' + wordsArray + '|' + revealed + '|' + mistakes + '|' + customStyle + '|' + saveTemp + '|' + counter);
			d.getElementById('saveGameData').value = temp;
			if(d.getElementById('gridStyle').options[d.getElementById('gridStyle').selectedIndex].value!='custom') d.getElementById('saveGameURL').innerHTML = '<a href="?savegame='+temp+'" style="color:'+fontColor+';text-decoration:underline;">'+LANG[selectedLanguage]['sg']+'</a>';
			else d.getElementById('saveGameURL').innerHTML = LANG[selectedLanguage]['warn'];
			puzzleActive = 2;
		}
	}
}

function showMenu() {
	d.getElementById('puzzle').style.display = 'none';
	d.getElementById('menuButton').style.display = 'none';
	d.getElementById('saveGameForm').style.display = 'none';
	d.getElementById('menu').style.display = 'block';
	d.getElementById('buttons').style.display = 'block';
	d.getElementById('returnToGame').style.visibility = 'visible';
	puzzleActive = 0;
}

function returnToGame() {
	d.getElementById('menuButton').style.display = 'block';
	d.getElementById('puzzle').style.display = 'block';
	d.getElementById('menu').style.display = 'none';
	d.getElementById('buttons').style.display = 'none';
	d.getElementById('returnToGame').style.visibility = 'hidden';
	puzzleActive = 1;
}

function tab(id) {
	d.getElementById(prev).style.backgroundColor = '#BBB';
	d.getElementById(id).style.backgroundColor = '#DDD';

	d.getElementById('_'+prev).style.display = 'none';
	d.getElementById('_'+id).style.display = 'block';
	d.getElementById('_'+id).blur;
	prev = id;

	d.getElementById(id).blur();

	return false;
}

function rnd() {
	randomSeed = (randomSeed*9301+49297) % 233280;
	return randomSeed/(233280.0);
}

function rand(number) {
	return Math.ceil(rnd()*number);
}

// manually place words

var wordlistWords = new Array();
function manuallyPlace() {
	wordlistWords = new Array();
	original = new Array();
	count = 0;
	xy = '';
	saveTemp = '';
	var temp = new Date();
	randomSeed = startingSeed = temp.getTime();

	chars = langs[d.getElementById('gridLanguage').options[d.getElementById('gridLanguage').selectedIndex].value];
	var tempWords;
	tempWords = parseWords();
	if(tempWords=='') { alert(LANG[selectedLanguage]['err1']); return 0; }

	selectedStyle = d.getElementById('gridStyle').options[d.getElementById('gridStyle').selectedIndex].value;

	var echoThis = '';

	echoThis += '<table cellpadding="0" cellspacing="0" align="center"><tr><td style="border:0px;">';

	echoThis += '<table cellpadding="0" cellspacing="0" style="background:black;border:1px solid;">';

	if(selectedStyle!='square') {
		var gS = gridStyle[selectedStyle].split(',');
		rows = parseInt(gS[1]);
		cols = parseInt(gS[2]);
		var v = 0; var c = 1; var z = 0;
		for(var a=1;a<=rows;a++) {
			echoThis += '<tr>';
			for(var b=1;b<=cols;b++) {
				temp = (d.getElementById('lowerCase').checked) ? 'lowercase' : 'uppercase';
				echoThis += (gS[0].charAt(z)=='1')
				? '<td style="width:20px;border:1px solid;padding:0px;" id="_'+c+'" onmousedown="c('+c+');"><input type="text" id="__'+c+'" size="1" style="font-weight:bold;text-align:center;text-transform:'+temp+';width:20px;height:20px;border:0px;" READONLY /></td>'
				: '<td style="width:20px;visibility:hidden;padding:0px;" id="_'+c+'">&nbsp;</td>';
				c++; z++;
			}
			echoThis += '</tr>';
		}
	} else {
		rows = (d.getElementById('numRows').value.replace(/[^0-9]/g,'')!='') ? parseInt(d.getElementById('numRows').value.replace(/[^0-9]/g,'')) : defRows;
		cols = (d.getElementById('numCols').value.replace(/[^0-9]/g,'')!='') ? parseInt(d.getElementById('numCols').value.replace(/[^0-9]/g,'')) : defCols;
		var c = 1;
		for(var a=1;a<=rows;a++) {
			echoThis += '<tr>';
			for(var b=1;b<=cols;b++) {
				temp = (d.getElementById('lowerCase').checked) ? 'lowercase' : 'uppercase';				echoThis += '<td style="width:20px;border:1px solid;padding:0px;" id="_'+c+'" onmousedown="c('+c+');"><input type="text" id="__'+c+'" size="1" style="font-weight:bold;text-align:center;text-transform:'+temp+';width:20px;height:20px;border:0px;" READONLY /></td>';
				c++;
			}
			echoThis += '</tr>';
		}
	}

	echoThis += '</table></td><td valign="top">';

	echoThis += '<div>'+LANG[selectedLanguage]['avail']+':<br /><select id="word" onchange="checkWord();">';
	for(var a=0;a<tempWords.length;a++) {
		temp = (d.getElementById('lowerCase').checked) ? tempWords[a].toLowerCase() : tempWords[a].toUpperCase();
		echoThis += '<option value="'+temp+'">'+temp+'</option>';
	}
	echoThis += '</select>';

	echoThis += ' \
		<br /><br /><input type="button" id="saveWord" value="'+LANG[selectedLanguage]['savew']+'" onclick="saveWord();" /> \
		<br /><br /><input type="button" id="resetWord" value="'+LANG[selectedLanguage]['resetw']+'" onclick="redraw();" /> \
		<br /><br /> \
		'+LANG[selectedLanguage]['inserted']+':<br /> \
		<select multiple size="5" id="inserted"></select> \
		<br /><br /><input type="button" id="removeWords" value="'+LANG[selectedLanguage]['removew']+'" onclick="removeWords();" /> \
		<br /><br /><input type="button" id="clearPuzzle" value="'+LANG[selectedLanguage]['clear']+'" onclick="clearPuzzle();" /> \
		<br /><br /><input type="button" value="'+LANG[selectedLanguage]['create']+'" onclick="submitManually();" /> \
		</div> \
		</td></tr></table> \
	';

	d.getElementById('menu').style.display = 'none';
	d.getElementById('buttons').style.display = 'none';

	d.getElementById('puzzle').style.display = 'block';
	d.getElementById('menuButton').style.display = 'block';

	d.getElementById('puzzleText').innerHTML = echoThis;
}

function submitManually() {
	original = new Array();
	createPuzzle(0);
}

var original = new Array();
var count = 0;
var saveTemp = '';

function c(id) {
	if(document.getElementById('word').options[document.getElementById('word').selectedIndex].value == '') {
		alert(LANG[selectedLanguage]['err1']);
	} else {
		if(count <= (document.getElementById('word').options[document.getElementById('word').selectedIndex].value.length-1)) {
			if(!original[id]) {
				if(document.getElementById('__'+id).value == document.getElementById('word').options[document.getElementById('word').selectedIndex].value.charAt(count) || document.getElementById('__'+id).value == '') {
					original[id] = 1;
					document.getElementById('__'+id).style.backgroundColor = 'red';
					document.getElementById('__'+id).value = document.getElementById('word').options[document.getElementById('word').selectedIndex].value.charAt(count);
					xy += id + ',';
					count++;
				}
			}
		}
	}
}

function saveWord() {
	if(count==document.getElementById('word').options[document.getElementById('word').selectedIndex].value.length) {
		var t = xy.split(',');
		for(var i=0;i<(t.length-1);i++) {
			document.getElementById('__'+t[i]).style.backgroundColor = '#FAA';
		}
		var temp = (d.getElementById('lowerCase').checked) ? document.getElementById('word').value.toLowerCase() : document.getElementById('word').value.toUpperCase();
		saveTemp += temp + ',' + xy + '!';

		xy = '';
		count = 0;
		original = new Array();

		var optionName = new Option(document.getElementById('word').options[document.getElementById('word').selectedIndex].value, document.getElementById('word').options[document.getElementById('word').selectedIndex].value)
		document.getElementById('inserted').options[document.getElementById('inserted').options.length] = optionName;
		document.getElementById('word').options[document.getElementById('word').selectedIndex] = null;
		document.getElementById('inserted').options[(document.getElementById('inserted').options.length-1)].selected = false;
	} else {
		alert(LANG[selectedLanguage]['entire']);
	}
}

function removeWords() {
	var l = document.getElementById('inserted').options.length;
	var t_words = '';
	if(l) {
		var t = saveTemp.split('!');
		for(var i=0;i<l;i++) {
			if(document.getElementById('inserted').options[i].selected) {
				var optionName = new Option(document.getElementById('inserted').options[i].value, document.getElementById('inserted').options[i].value, true, true)
				document.getElementById('word').options[document.getElementById('word').options.length] = optionName;
				document.getElementById('inserted').options[i].value = 'remove';
			} else {
				t_words += t[i] + '!';
			}
		}
		for(var i=(l-1);i>=0;i--) {
			if(document.getElementById('inserted').options[i].value=='remove') {
				document.getElementById('inserted').options[i] = null;
			}
		}
		saveTemp = t_words;
		redraw();
	}
}

function redraw() {
	xy = '';
	count = 0;
	original = new Array();

	clear();

	var t = saveTemp.split('!');
	for(var i=0;i<t.length;i++) {
		var u = t[i].split(',');
		for(var h=1;h<=u[0].length;h++) {
			document.getElementById('__'+u[h]).style.backgroundColor = '#FAA';
			document.getElementById('__'+u[h]).value = u[0].charAt(count);
			count++;
		}
		count = 0;
	}
}

function clear() {
	for(var i=1;i<=(rows*cols);i++) {
		document.getElementById('__'+i).style.backgroundColor = '#CCC';
		document.getElementById('__'+i).value = '';
	}
}

function clearPuzzle() {
	var l = document.getElementById('inserted').options.length;
	for(var i=0;i<l;i++) document.getElementById('inserted').options[i].selected = true;
	removeWords();
}

function checkWord() {
	if(count>0) redraw();
}

// create puzzle

function createPuzzle(clean) {

	if(clean) { saveTemp = ''; wordlistWords = new Array(); }

	counter = 0;
	mistakes = 0;

	var temp = new Date();
	if(!reload) { randomSeed = startingSeed = temp.getTime(); }
	else {
		randomSeed = startingSeed;
		var t = unescape(d.getElementById('code').value).split('|');
		if(t!='') {
			mistakes = parseInt(t[5]);
			customStyle = t[6];
			if(customStyle!='') d.getElementById('gridStyle').options[d.getElementById('gridStyle').options.length-1].selected = 'true';
			saveTemp = t[7];
			counter = parseInt(t[8]);
			if(counter) {
				var temp = 0;
				for(var a=counter;a>0;a--) temp = rnd();
			}
		}
		t = null;
	}

	inserted = new Array();
	unsorted = new Array();
	var tempWords = '';

	chars = langs[d.getElementById('gridLanguage').options[d.getElementById('gridLanguage').selectedIndex].value];

	tempWords = parseWords();

	var words = new Array();

// remove duplicates and put uniques into words array

	for(var a=tempWords.length-1;a>=0;a--) {
		if(tempWords[a]!='') {
			var good = true;
			for(var b=words.length-1;b>=0;b--) {
				if(tempWords[a]==words[b]) { good = false; break; }
			}
			if(good) words[words.length] = tempWords[a];
		}
	}

	selectedStyle = d.getElementById('gridStyle').options[d.getElementById('gridStyle').selectedIndex].value;

	if(selectedStyle=='custom') {
		var styleParsed = customStyle.split(',');
		if(styleParsed=='') { alert(LANG[selectedLanguage]['err2']); return 0; }
		rows = parseInt(styleParsed[1]);
		cols = parseInt(styleParsed[2]);
	} else if(selectedStyle!='square') {
		var styleParsed = gridStyle[selectedStyle].split(',');
		rows = parseInt(styleParsed[1]);
		cols = parseInt(styleParsed[2]);
	} else {
		rows = (d.getElementById('numRows').value.replace(/[^0-9]/g,'')!='') ? parseInt(d.getElementById('numRows').value.replace(/[^0-9]/g,'')) : defRows;
		cols = (d.getElementById('numCols').value.replace(/[^0-9]/g,'')!='') ? parseInt(d.getElementById('numCols').value.replace(/[^0-9]/g,'')) : defCols;
	}

	fontSize = (d.getElementById('fontSize').value.replace(/[^0-9]/g,'')!='') ? parseInt(d.getElementById('fontSize').value.replace(/[^0-9.]/g,'')) : defFontSize;
	fontColor = (d.getElementById('fontColor').value!='') ? d.getElementById('fontColor').value : defFontColor;
	backgroundColor = (d.getElementById('bgColor').value!='') ? d.getElementById('bgColor').value : defBGColor;
	changebgcolor(backgroundColor);
	d.getElementById('title').style.color = fontColor;
	d.getElementById('menuButton').style.color = fontColor;
	highlightColor = (d.getElementById('hlColor').value!='') ? d.getElementById('hlColor').value : defHighlightColor;
	lowerCase = (d.getElementById('lowerCase').checked) ? true : false;
	sortAlpha = (d.getElementById('sortAlpha').checked) ? true : false;
	useLetters = (d.getElementById('useLetters').checked) ? true : false;

	var echoThis = '';

// zero out main arrays

	for(var x=1;x<=rows;x++) {
		for(var y=1;y<=cols;y++) {
			var a = ((x-1)*cols)+y;
			if(selectedStyle!='square') {
				if(styleParsed[0].charAt((a-1))=='0') grid[a] = '&nbsp;'; else grid[a] = '';
			} else {
				grid[a] = '';
			}
			gridWords[a] = '';
			xyArray[a] = '';
		}
	}
	
	borf = d.getElementById('BorF').options[d.getElementById('BorF').selectedIndex].value;
	diag = d.getElementById('diag').options[d.getElementById('diag').selectedIndex].value;
	uand = d.getElementById('uand').options[d.getElementById('uand').selectedIndex].value;

	var tempInserted = new Array();
	var q = 0;

	if(saveTemp!='') {
		var t = saveTemp.split('!');
		var co = '';
		for(var a=0;a<(t.length-1);a++) {
			var u = t[a].split(',');
			for(var b=1;b<(u.length-1);b++) {
				co += u[b]+',';
				grid[u[b]] = u[0].charAt(b-1);
				gridWords[u[b]] += u[0]+',';
			}
			tempInserted[q] = u[0];
			xyArray[tempInserted[q]] = co;
			q++;
			co = '';
		}
	}

// main loop

	for(var ab=(words.length-1);ab>=0;ab--) {

		if(saveTemp!='') {
			var found = 0;
			for(var z=(t.length-1);z>=0;z--) {
				var reg = new RegExp(words[ab],"i");
				if(t[z].match(reg)) found = 1;
			}
			if(found) continue;
		}

		var wordLength = words[ab].length-1;
		if(rand(3)>1) {
			var score = 0;
			var scoreXY = '';
			scoreXYTemp = '';
			var dirXY = 0;
			for(var tries=1;tries<=retries;tries++) {
				var ranNumber = rand(wordLength)-1;
				make_random();
				scoreTemp = 0;
				switch(dir) {
					case 1: xnum+=ranNumber; ynum+=ranNumber; break;
					case 2: xnum+=ranNumber; break;
					case 3: xnum+=ranNumber; ynum-=ranNumber; break;
					case 4: ynum+=ranNumber; break;
					case 5: ynum-=ranNumber; break;
					case 6: xnum-=ranNumber; ynum+=ranNumber; break;
					case 7: xnum-=ranNumber; break;
					case 8: xnum-=ranNumber; ynum-=ranNumber; break;
				}
				if(xnum>0 && xnum<=rows && ynum>0 && ynum<=cols) {
					if(check(words[ab],0)) {
						if(scoreTemp>score) { score=scoreTemp; scoreXY=scoreXYTemp; dirXY=dir; }
						else if(score==0 && scoreTemp==0) { scoreXY=scoreXYTemp; dirXY=dir; }
					}
				}
			}
			if(scoreXY!='') {
				dir=dirXY;
				var temp = scoreXY.split(',');
				xnum = parseInt(temp[0]);
				ynum = parseInt(temp[1]);
				if(check(words[ab],1)) { tempInserted[q]=words[ab]; xyArray[tempInserted[q]]=xy; q++; }
			}
		} else {
			for(var tries=1;tries<=retries;tries++) {
				if(words[ab]!='') {
					make_random();
					if(check(words[ab],1)) { tempInserted[q]=words[ab]; xyArray[tempInserted[q]]=xy; q++; break; }
				}
			}
		}
	}

	if(tempInserted.length==0) { alert(LANG[selectedLanguage]['err1']); return 0; }

	inserted = tempInserted;

	unsorted = inserted.concat();

	// sort words alphabetically
	if(sortAlpha) inserted.sort();

	tempInserted = new Array();
	words = new Array();

	if(useLetters) {
		chars = '';
		for(var a=inserted.length-1;a>=0;a--) {
			var good = true;
			for(var b=chars.length-1;b>=0;b--) {
				if(inserted[a]==chars.charAt(b)) { good = false; break; }
			}
			if(good) chars += inserted[a];
		}
	}

	echoThis += '<table border="0" style="margin-left:auto;margin-right:auto;font-size:'+fontSize+'mm;color:'+fontColor+';"><tr><td style="vertical-align:top;border:0px;">';

// print out grid

	var t = 1;
	var ran = 0;
	for(var x=1;x<=rows;x++) {
		for(var y=1;y<=cols;y++) {
			var a = ((x-1)*cols)+y;
			var gridWordsTemp = new Array();
			var gridTemp = '';
			var xyTemp = '';
			if(gridWords[a]!='') {
				gridWordsTemp = gridWords[a].split(',');
				var c = gridWordsTemp.length-1;

				gridTemp = 'w=new Array(\''+gridWordsTemp[0]+'\'';

				xyTemp = 'x=new Array(\''+xyArray[gridWordsTemp[0]].replace(/,/gi,'|')+'\'';

				for(var z=1;z<c;z++) { gridTemp += ',\''+gridWordsTemp[z]+'\''; xyTemp += ',\''+xyArray[gridWordsTemp[z]].replace(/,/gi,'|')+'\''; }

				gridTemp += ')';
				xyTemp += ')';
			}

			ran = rand(chars.length)-1;

			if(lowerCase) {
				var gridChar = grid[t].toLowerCase();
				var ranChar = chars.charAt(ran).toLowerCase();
			} else {
				var gridChar = (grid[t]!='&nbsp;') ? grid[t].toUpperCase() : grid[t];
				var ranChar = chars.charAt(ran).toUpperCase();
			}

			if(grid[t]) { echoThis += '<span id="_'+t+'" style="font-family:Courier New;padding:0px '+(fontSize+1)+'px 0px '+(fontSize+1)+'px;" onmouseover="if(mouseIsDown) cellHighlight('+t+');" onmousedown="mouseIsDown=1;cellHighlight('+t+');highlightColor=this.style.backgroundColor;" onmouseup="var x=w=0;'+gridTemp+';'+xyTemp+';clearHighlighted(x,w);">'+gridChar+'</span>'; }
			else { echoThis += '<span id="_'+t+'" style="font-family:Courier New;padding:0px '+(fontSize+1)+'px 0px '+(fontSize+1)+'px;" onmouseover="if(mouseIsDown) cellHighlight('+t+');" onmousedown="mouseIsDown=1;cellHighlight('+t+');" onmouseup="var w,x=0;clearHighlighted(x,w);">'+ranChar+'</span>'; }

			if((t%cols)==0) echoThis += '<br />';

			t++;
		}
	}

// print out word list

	if(d.getElementById('wordListPlacement').options[d.getElementById('wordListPlacement').selectedIndex].value=='right') {
		echoThis += '</td><td style="width:0px;border:0px;">&nbsp;</td><td style="padding-left:20px;vertical-align:top;border:0px;border-left:1px solid '+fontColor+';font-family:Courier New;">';
	} else if(d.getElementById('wordListPlacement').options[d.getElementById('wordListPlacement').selectedIndex].value=='bottom') {
		echoThis += '</td></tr><tr><td style="width:0px;border:0px;">&nbsp;</td></tr><tr><td style="padding-top:20px;vertical-align:top;border:0px;border-top:2px solid '+fontColor+';font-family:Courier New;">';
	}

	echoThis += '<span style="float:left;text-align:left;color:'+fontColor+';">';

	var a=(inserted.length-1);
	for(var i=0;i<=a;i++) {
		var xyArrayTemp = xyArray[inserted[i]].split(',');
		var xyTemp = 'v=\''+xyArrayTemp+'\'';

		if(lowerCase) {
			var inWord = inserted[i].toLowerCase();
		} else {
			var inWord = inserted[i].toUpperCase();
		}

		echoThis += '<span id="'+inserted[i]+'r" onmousedown="'+xyTemp+';r(\''+inserted[i]+'\',v);"> (?) </span><span id="'+inserted[i]+'">'+inWord+'</span><br />';
		if(((i+1)%rows)==0) echoThis += '</span><span style="float:left;text-align:left;color:'+fontColor+';padding-left:5px;">';
	}

	echoThis += '</span>';

	echoThis += '</td></tr></table>';

// finish up puzzle creation

	d.getElementById('puzzleText').innerHTML = echoThis;

	d.getElementById('menu').style.display = 'none';
	d.getElementById('buttons').style.display = 'none';

	d.getElementById('puzzle').style.display = 'block';
	d.getElementById('menuButton').style.display = 'block';

	puzzleActive = 1;
	menuToggle = 0;
	paused = 0;
	mouseIsDown = 0;
	rev = 0;
	wordcount = 0;

	if(reload) {
		var t = unescape(d.getElementById('code').value).split('|');
		var tWords = t[3].split(',');
		var tRevealed = t[4].split(',');
		mouseIsDown = 1;
		if(tWords!='') {
			for(var a=tWords.length-1;a>=0;a--) {
				d.getElementById(tWords[a]+'r').onmousedown();
			}
		}
		mouseIsDown = 0;
		for(var a=tRevealed.length-2;a>=0;a--) {
			d.getElementById(tRevealed[a]).onmousedown();
		}
	}
}

function parseWords() {
	var tempWords;
	if(d.getElementById('numWords').value && wordlistWords.length==0 && !reload) {
		var numWords = parseInt(d.getElementById('numWords').value);
		tempWords = makeRequest('wordlists/'+d.getElementById('wordList').options[d.getElementById('wordList').selectedIndex].value);
		tempWords = tempWords.replace(/\n/g,",");
		tempWords = tempWords.replace(/\r/g,",");
		tempWords = tempWords.replace(/,,/g,",");
		var regEx = new RegExp('[^'+chars+',]','gi');
		tempWords = tempWords.replace(regEx,"");
		tempWords = tempWords.split(',');
		var twLength = tempWords.length;
		if(numWords>twLength) numWords = twLength;
		var temp = new Array();
		var t = 0;
		for(var a=1;a<=numWords;) {
			t = rand(twLength)-1;
			counter++;
			if(tempWords[t]) {
				temp[temp.length] = tempWords[t];
				tempWords[t] = null;
				a++;
			}
		}
		tempWords = temp;
		if(d.getElementById('manually').checked) wordlistWords = tempWords.concat();
	} else {
		if(wordlistWords.length>0) { return wordlistWords; }
		else {
			tempWords = d.getElementById('inputWords').value;
			tempWords = tempWords.replace(/ /g,",");
			tempWords = tempWords.replace(/\n/g,",");
			tempWords = tempWords.replace(/\r/g,",");
			var regEx = new RegExp('[^'+chars+',]','gi');
			tempWords = tempWords.replace(regEx,"");
			tempWords = tempWords.split(',');
		}
	}
	return tempWords;
}

function reloadGame() {
	reload = 1;
	var t = unescape(d.getElementById('code').value).split('|');
	randomSeed = startingSeed = parseInt(t[0]);
	var cook = t[1].split(',');

	d.getElementById('numRows').value = cook[0];
	d.getElementById('numCols').value = cook[1];
	d.getElementById('fontSize').value = cook[2];
	d.getElementById('gridStyle').options[cook[3]].selected = true;
	d.getElementById('gridLanguage').options[cook[4]].selected = true;
	d.getElementById('BorF').options[cook[5]].selected = true;
	d.getElementById('diag').options[cook[6]].selected = true;
	d.getElementById('uand').options[cook[7]].selected = true;
	if(cook[8]) d.getElementById('sortAlpha').checked=true;
	if(cook[9]) d.getElementById('lowerCase').checked=true;
	if(cook[10]) d.getElementById('useLetters').checked=true;
	d.getElementById('fontColor').value = cook[11];
	d.getElementById('bgColor').value = cook[12];
	d.getElementById('hlColor').value = cook[13];
	d.getElementById('wordListPlacement').options[cook[14]].selected = true;

	d.getElementById('manually').checked=false;

	d.getElementById('inputWords').value = t[2];
	d.getElementById('create').onclick();
// startingSeed + '|' + settings + '|' + unsorted + '|' + wordsArray + '|' + revealed + '|' + mistakes + '|' + customStyle + '|' + saveTemp + '|' + counter
}

function r(cross,revealLetters) {
	revealLetters = revealLetters.split(",");
	var id = '';

	if(!mouseIsDown) {
		for(var i=0;i<revealLetters.length-1;i++) {
			id = revealLetters[i];
			d.getElementById('_'+id).style.color = 'red';
		}
		revealed+=cross+'r,';
		hideQM(cross+'r');
		lineme(cross,1);

	} else {
		for(var i=0;i<revealLetters.length-1;i++) {
			id = revealLetters[i];
			d.getElementById('_'+id).style.backgroundColor = highlightColor;
		}
		hideQM(cross+'r');
		lineme(cross,0);
	}
}

function hideQM(id) {
	d.getElementById(id).style.visibility = 'hidden';
}

function lineme(id,revealed) {
	d.getElementById(id).style.textDecoration = 'line-through';
	wordcount++;
	if(revealed) rev++;
	if(wordcount==inserted.length) {
		paused = 2;
		alert(LANG[selectedLanguage]['fin']+'\n==========\n'+LANG[selectedLanguage]['mis']+':\t\t'+mistakes+'\n'+LANG[selectedLanguage]['rev']+':\t'+rev);
	}
}

var highlighted = new Array();
var startingCell = 0;
var endingCell = 0;
var startX = 0;
var startY = 0;
function cellHighlight(cell) {

	if(paused==2) return false;

	var good = true;
	var x = Math.ceil(cell/cols);
	var y = (cols-((x*cols)-cell));

	endingCell = cell;
	if(startingCell==0) {
		startingCell = cell;
		startX = Math.ceil(cell/cols);
		startY = (cols-((x*cols)-cell));
	}

	var relX = x - startX;
	var relY = y - startY;

	if(startingCell==endingCell) {
		d.getElementById('_'+cell).style.backgroundColor = highlightColor;
		highlighted[highlighted.length]=cell;
	} else if(relY==0 && relX<0) {
		cleanUp();
		for(var a=startingCell;;a=(a-cols)) {
			highlightMe(a);
			if(a==endingCell) break;
		}
	} else if(relY==0 && relX>0) {
		cleanUp();
		for(var a=startingCell;;a=(a+cols)) {
			highlightMe(a);
			if(a==endingCell) break;
		}
	} else if(relX==0 && relY<0) {
		cleanUp();
		for(var a=startingCell;;a=(a-1)) {
			highlightMe(a);
			if(a==endingCell) break;
		}
	} else if(relX==0 && relY>0) {
		cleanUp();
		for(var a=startingCell;;a=(a+1)) {
			highlightMe(a);
			if(a==endingCell) break;
		}
	} else if(Math.abs(relX)==Math.abs(relY)) {
		cleanUp();
		if(relX<0 && relY<0) {
			for(var a=startingCell;;a=(a-(cols+1))) {
				highlightMe(a);
				if(a==endingCell) break;
			}
		} else if(relX<0 && relY>0) {
			for(var a=startingCell;;a=(a-(cols-1))) {
				highlightMe(a);
				if(a==endingCell) break;
			}
		} else if(relX>0 && relY<0) {
			for(var a=startingCell;;a=(a+cols-1)) {
				highlightMe(a);
				if(a==endingCell) break;
			}
		} else if(relX>0 && relY>0) {
			for(var a=startingCell;;a=(a+cols+1)) {
				highlightMe(a);
				if(a==endingCell) break;
			}
		}
	} else { good = false; }
}

function clearHighlighted(xy,word) {
	var good = false;
	var temp = 0;
	if(xy!=0) {
		for(var x=xy.length-1;x>=0;x--) {
			var xyTemp = xy[x].split("|");
			var xyt = '';
			temp = 0;
			if(highlighted.length==xyTemp.length-1) {
				for(var a=xyTemp.length-1;a>=0;a--) {
					for(var b=xyTemp.length-2;b>=0;b--) {
						var highTemp = highlighted[b].toString();
						if(highTemp.charAt(0)=='x') xyt='x'+xyTemp[a];
						else xyt = xyTemp[a];
						if(xyt==highlighted[b]) { temp++; break; }
					}
					if(temp==xyTemp.length-1) break;
				}
				if(temp==xyTemp.length-1) {
					if(d.getElementById(word[x]).style.textDecoration!='line-through') {
						wordsArray[wordsArray.length] = word[x];
						hideQM(word[x]+'r');
						lineme(word[x],0);
						good = true;
					} else if(d.getElementById('_'+highlighted[0]).style.color=='red') {
						good = false;
					} else { good = true; }
				}
			}
		}
	}

	if(!good) {
		if(highlighted.length>0) mistakes++;
		for(var a=highlighted.length-1;a>=0;a--) {
			var highTemp = highlighted[a].toString();
			if(highTemp.charAt(0)!='x') {
				d.getElementById('_'+highlighted[a]).style.backgroundColor = backgroundColor;
			}
		}
	}
	highlighted = new Array();
	startingCell = 0;
	savedGame = 0;
}

function cleanUp() {
	for(var a=highlighted.length-1;a>=0;a--) {
		var highTemp = highlighted[a].toString();
		if(highTemp.charAt(0)!='x') {
			d.getElementById('_'+highlighted[a]).style.backgroundColor = backgroundColor;
		}
	}
	highlighted = new Array();
}

function highlightMe(a) {
	if(d.getElementById('_'+a).style.backgroundColor != highlightColor) {
		d.getElementById('_'+a).style.backgroundColor = highlightColor;
		highlighted[highlighted.length]=a;
	} else {
		highlighted[highlighted.length]='x'+a;
	}
}

function make_random() {
	direction();

	xnum = rand(rows);
	ynum = rand(cols);
}

function direction() {
	if(borf=='fonly') {
		var temp = new Array(3,8,5,7);
		if(diag=='diagonly') { dir = temp[rand(2)-1]; }
		else if(uand=='uandonly') { dir = 7; }
		else if(diag=='nodiag') { if(uand=='nouand') { dir = 5; } else { dir = temp[rand(2)+1]; } }
		else if(diag=='diag') { if(uand=='nouand') { dir = temp[rand(3)-1]; } else { dir = temp[rand(4)-1]; } }
		else { dir = temp[rand(4)-1]; }
	}
	else if(borf=='bonly') {
		var temp = new Array(1,6,4,2);
		if(diag=='diagonly') { dir = temp[rand(2)-1]; }
		else if(uand=='uandonly') { dir = 2; }
		else if(diag=='nodiag') { if(uand=='nouand') { dir = 4; } else { dir = temp[rand(2)+1]; } }
		else if(diag=='diag') { if(uand=='nouand') { dir = temp[rand(3)-1]; } else { dir = temp[rand(4)-1]; } }
		else { dir = temp[rand(4)-1]; }
	}
	else {
		if(diag=='diagonly') { var temp = new Array(1,3,6,8); dir = temp[rand(4)-1]; }
		else if(uand=='uandonly') { var temp = new Array(2,7); dir = temp[rand(2)-1]; }
		else if(diag=='nodiag') { if(uand=='nouand') { var temp = new Array(4,5); dir = temp[rand(2)-1]; } else { var temp = new Array(2,4,5,7); dir = temp[rand(4)-1]; } }
		else if(diag=='diag') { if(uand=='nouand') { var temp = new Array(1,3,4,5,6,8); dir = temp[rand(6)-1]; } else { dir = rand(8); } }
		else { dir = rand(8); }
	}
}

function check(word,add) {
	xy = '';
	var count = word.length;

	var x = xnum;
	var y = ynum;

	var a;

	if(dir==1) {
		if((xnum-count)>=0 && (ynum-count)>=0) {
			for(var i=0;i<count;i++) {
				a = ((x-1)*cols)+y;
				if(grid[a]!='' && grid[a]!=word.charAt(i)) return 0;
				x--; y--;
			}
			x = xnum; y = ynum;
			for(var i=0;i<count;i++) {
				a = ((x-1)*cols)+y;
				if(!add) {
					if(grid[a]==word.charAt(i)) scoreTemp++;
				} else {
					grid[a] = word.charAt(i);
					xy += a+',';
					gridWords[a]+=word+',';
				}
				x--; y--;
			}
		} else {
			return 0;
		}
	}
	else if(dir==2) {
		if((xnum-count)>=0) {
			for(var i=0;i<count;i++) {
				a = ((x-1)*cols)+y;
				if(grid[a]!='' && grid[a]!=word.charAt(i)) return 0;
				x--;
			}
			x = xnum; y = ynum;
			for(var i=0;i<count;i++) {
				a = ((x-1)*cols)+y;
				if(!add) {
					if(grid[a]==word.charAt(i)) scoreTemp++;
				} else {
					grid[a] = word.charAt(i);
					xy += a+',';
					gridWords[a]+=word+',';
				}
				x--;
			}
		} else {
			return 0;
		}
	}
	else if(dir==3) {
		if((xnum-count)>=0 && (ynum+(count-1))<=cols) {
			for(var i=0;i<count;i++) {
				a = ((x-1)*cols)+y;
				if(grid[a]!='' && grid[a]!=word.charAt(i)) return 0;
				x--; y++;
			}
			x = xnum; y = ynum;
			for(var i=0;i<count;i++) {
				a = ((x-1)*cols)+y;
				if(!add) {
					if(grid[a]==word.charAt(i)) scoreTemp++;
				} else {
					grid[a] = word.charAt(i);
					xy += a+',';
					gridWords[a]+=word+',';
				}
				x--; y++;
			}
		} else {
			return 0;
		}
	}
	else if(dir==4) {
		if((ynum-count)>=0) {
			for(var i=0;i<count;i++) {
				a = ((x-1)*cols)+y;
				if(grid[a]!='' && grid[a]!=word.charAt(i)) return 0;
				y--;
			}
			x = xnum; y = ynum;
			for(var i=0;i<count;i++) {
				a = ((x-1)*cols)+y;
				if(!add) {
					if(grid[a]==word.charAt(i)) scoreTemp++;
				} else {
					grid[a] = word.charAt(i);
					xy += a+',';
					gridWords[a]+=word+',';
				}
				y--;
			}
		} else {
			return 0;
		}
	}
	else if(dir==5) {
		if((ynum+(count-1))<=cols) {
			for(var i=0;i<count;i++) {
				a = ((x-1)*cols)+y;
				if(grid[a]!='' && grid[a]!=word.charAt(i)) return 0;
				y++;
			}
			x = xnum; y = ynum;
			for(var i=0;i<count;i++) {
				a = ((x-1)*cols)+y;
				if(!add) {
					if(grid[a]==word.charAt(i)) scoreTemp++;
				} else {
					grid[a] = word.charAt(i);
					xy += a+',';
					gridWords[a]+=word+',';
				}
				y++;
			}
		} else {
			return 0;
		}
	}
	else if(dir==6) {
		if((xnum+(count-1))<=rows && (ynum-count)>=0) {
			for(var i=0;i<count;i++) {
				a = ((x-1)*cols)+y;
				if(grid[a]!='' && grid[a]!=word.charAt(i)) return 0;
				x++; y--;
			}
			x = xnum; y = ynum;
			for(var i=0;i<count;i++) {
				a = ((x-1)*cols)+y;
				if(!add) {
					if(grid[a]==word.charAt(i)) scoreTemp++;
				} else {
					grid[a] = word.charAt(i);
					xy += a+',';
					gridWords[a]+=word+',';
				}
				x++; y--;
			}
		} else {
			return 0;
		}
	}
	else if(dir==7) {
		if((xnum+(count-1))<=rows) {
			for(var i=0;i<count;i++) {
				a = ((x-1)*cols)+y;
				if(grid[a]!='' && grid[a]!=word.charAt(i)) return 0;
				x++;
			}
			x = xnum; y = ynum;
			for(var i=0;i<count;i++) {
				a = ((x-1)*cols)+y;
				if(!add) {
					if(grid[a]==word.charAt(i)) scoreTemp++;
				} else {
					grid[a] = word.charAt(i);
					xy += a+',';
					gridWords[a]+=word+',';
				}
				x++;
			}
		} else {
			return 0;
		}
	}
	else if(dir==8) {
		if((xnum+(count-1))<=rows && (ynum+(count-1))<=cols) {
			for(var i=0;i<count;i++) {
				a = ((x-1)*cols)+y;
				if(grid[a]!='' && grid[a]!=word.charAt(i)) return 0;
				x++; y++;
			}
			x = xnum; y = ynum;
			for(var i=0;i<count;i++) {
				a = ((x-1)*cols)+y;
				if(!add) {
					if(grid[a]==word.charAt(i)) scoreTemp++;
				} else {
					grid[a] = word.charAt(i);
					xy += a+',';
					gridWords[a]+=word+',';
				}
				x++; y++;
			}
		} else {
			return 0;
		}
	}
	if(!add) scoreXYTemp=xnum+','+ynum;
	return 1;
}

function makeCustom() {
	var mC = null;
	w = (screen.width) ? screen.width : 800;
	h = (screen.height) ? screen.height : 600;
	LeftPosition=(screen.width)?(screen.width-w)/2:100;TopPosition=(screen.height)?(screen.height-h)/2:100;
	settings='width='+w+',height='+h+',top='+TopPosition+',left='+LeftPosition+',scrollbars=yes,location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=yes';
	mC=window.open('','makeCustomWin',settings);

	doc = mC.d;
	doc.open('text/html');
	doc.write('<html><head><title>'+title+'</title>');

var echo = ' \
	<script type="text/javascript"> \
\
	var cell = 1; \
	var startMarking = 0; \
	var cols = (window.opener.d.getElementById(\'numCols\').value!=\'\') ? parseInt(window.opener.d.getElementById(\'numCols\').value) : 20; \
	var rows = (window.opener.d.getElementById(\'numRows\').value!=\'\') ? parseInt(window.opener.d.getElementById(\'numRows\').value) : 20; \
	var path = 20; \
	var prev = \'white\'; \
	var code = \'\'; \
	var codeArray = new Array(); \
	var createThis = 0; \
	var startBegEnd = 0; \
	var custom = new Array(); \
	var loadShape = 0; \
\
	function createMainTable() { \
		if(startMarking==1) d.getElementById(\'startMarking\').onclick(); \
		prev = \'white\'; \
		cols = parseInt(d.getElementById(\'cols\').value); \
		rows = parseInt(d.getElementById(\'rows\').value); \
		cell = 1; \
		code = \'\'; \
		codeArray = new Array(); \
\
		if(loadShape) { \
			var temp = prompt(\''+LANG[selectedLanguage]['prompt']+'\'); \
			custom = temp.split(\',\'); \
			rows = custom[1]; \
			cols = custom[2]; \
		} \
\
		var l = (rows*cols); \
		for(var i=0;i<l;i++) { codeArray[i]=\'0\'; } \
\
		if(createThis) d.body.removeChild(createThis); \
		createThis = d.createElement("DIV"); \
		createThis.id = "mainTable"; \
\
		var echoThis = \'<div id="main" style="text-align:center;position:absolute;left:0px;top:200px;width:100%;"><table cellpadding="0" cellspacing="0" style="height:99%;margin-left:auto;margin-right:auto;"><tr><td><table cellpadding="0" cellspacing="0" style="border:0px;">\'; \
\
		for(var a=1,c=1;a<=rows;a++) { \
			echoThis += \'<tr>\'; \
			for(var b=1;b<=cols;b++,c++) { \
				if(c==1) var t = \'green\'; else var t = \'white\'; \
			     echoThis += \'<td onmouseover="mouseDisplay(\'+c+\');" onmousedown="if(startBegEnd==1) begEnd(\'+c+\'); else mark(\'+c+\');" style="background:\'+t+\';border:1px solid black;width:\'+path+\'px;line-height:\'+path+\'px;" id="_\'+c+\'">&nbsp;</td>\'; \
			} \
			echoThis += \'</tr>\'; \
		} \
		echoThis += \'</table></td></tr></table></div>\'; \
\
		createThis.innerHTML = echoThis; \
		d.body.appendChild(createThis); \
\
		if(custom!=\'\') { \
			var l = custom[0].length; \
			for(var a=0;a<l;a++) { \
				if(custom[0].charAt(a)==\'1\') { \
					d.getElementById(\'_\'+(a+1)).style.backgroundColor = \'red\'; codeArray[a] = 1; \
				} \
			} \
			display(); \
		} \
		custom = new Array(); \
\
		display(); \
	} \
\
	function display() { \
		code = codeArray.join(\'\'); \
		d.getElementById(\'code\').value = code +\',\'+ rows +\',\'+ cols; \
	} \
\
	function eventHandle() { d.onkeypress=move; } \
\
	function move(e) { \
		var code; \
		var currentCell = cell; \
		if (!e) var e = window.event; \
		if (e.keyCode) code = e.keyCode; \
		else if (e.which) code = e.which; \
\
		if(code==13) { \
			code = \'a\'; \
			d.getElementById(\'rows\').blur(); \
			d.getElementById(\'cols\').blur(); \
			d.getElementById(\'path\').blur(); \
			d.getElementById(\'makeNew\').onclick(); \
		} \
		else if(code==106 || code==74) { \
			d.getElementById(\'_\'+currentCell).style.backgroundColor = prev; \
			x = Math.ceil(currentCell/cols); \
			y = (cols - ((x*cols)-currentCell)); \
			y--; \
			currentCell = (((x-1)*cols)+y); \
			if(startMarking==1) { codeArray[currentCell-1]=1; d.getElementById(\'_\'+currentCell).style.backgroundColor = \'red\'; } \
			prev = d.getElementById(\'_\'+currentCell).style.backgroundColor; \
			d.getElementById(\'_\'+currentCell).style.backgroundColor = \'green\'; \
			window.status = "X: "+x+" Y: "+y; \
		} else if(code==105 || code==73) { \
			d.getElementById(\'_\'+currentCell).style.backgroundColor = prev; \
			x = Math.ceil(currentCell/cols); \
			y = (cols - ((x*cols)-currentCell)); \
			x--; \
			if(x==0) { x = rows; y--; } \
			currentCell = (((x-1)*cols)+y); \
			if(startMarking==1) { codeArray[currentCell-1]=1; d.getElementById(\'_\'+currentCell).style.backgroundColor = \'red\'; } \
			prev = d.getElementById(\'_\'+currentCell).style.backgroundColor; \
			d.getElementById(\'_\'+currentCell).style.backgroundColor = \'green\'; \
			window.status = "X: "+x+" Y: "+y; \
		} else if(code==108 || code==76) { \
			d.getElementById(\'_\'+currentCell).style.backgroundColor = prev; \
			x = Math.ceil(currentCell/cols); \
			y = (cols - ((x*cols)-currentCell)); \
			y++; \
			currentCell = (((x-1)*cols)+y); \
			if(startMarking==1) { codeArray[currentCell-1]=1; d.getElementById(\'_\'+currentCell).style.backgroundColor = \'red\'; } \
			prev = d.getElementById(\'_\'+currentCell).style.backgroundColor; \
			d.getElementById(\'_\'+currentCell).style.backgroundColor = \'green\'; \
			window.status = "X: "+x+" Y: "+y; \
		} else if(code==107 || code==75) { \
			d.getElementById(\'_\'+currentCell).style.backgroundColor = prev; \
			x = Math.ceil(currentCell/cols); \
			y = (cols - ((x*cols)-currentCell)); \
			x++; \
			if(x>rows) { x = 1; y++; } \
			currentCell = (((x-1)*cols)+y); \
			if(startMarking==1) { codeArray[currentCell-1]=1; d.getElementById(\'_\'+currentCell).style.backgroundColor = \'red\'; } \
			prev = d.getElementById(\'_\'+currentCell).style.backgroundColor; \
			d.getElementById(\'_\'+currentCell).style.backgroundColor = \'green\'; \
			window.status = "X: "+x+" Y: "+y; \
		} \
		if(code!=\'a\') { \
			cell = currentCell; \
			display(); \
		} \
	} \
\
	function mouseDisplay(c) { \
		x = Math.ceil(c/cols); \
		y = (cols - ((x*cols)-c)); \
		window.status = "X: "+x+" Y: "+y; \
	} \
\
	function markFirst() { \
		codeArray[cell-1]=1; \
		d.getElementById(\'_\'+cell).style.backgroundColor = \'red\'; \
		prev = d.getElementById(\'_\'+cell).style.backgroundColor; \
		d.getElementById(\'_\'+cell).style.backgroundColor = \'green\'; \
		display(); \
	} \
\
	function mark(c) { \
		if(d.getElementById(\'_\'+c).style.backgroundColor == \'red\') erase(c); \
		else { d.getElementById(\'_\'+c).style.backgroundColor = \'red\'; codeArray[c-1] = 1; display(); } \
	} \
\
	function erase(c) { \
		d.getElementById(\'_\'+c).style.backgroundColor = \'white\'; \
		codeArray[c-1] = 0; \
		display(); \
	} \
\
	function shiftUp() { \
		var t = d.getElementById(\'code\').value.split(\',\'); \
		var l = t[0].length; \
\
		t[0] = t[0].substr((d.getElementById(\'cols\').value*d.getElementById(\'shift\').value),(l-1)); \
		for(var i=1;i<=(d.getElementById(\'cols\').value*d.getElementById(\'shift\').value);i++) t[0] += \'0\'; \
\
		for(var a=0;a<l;a++) { \
			if(t[0].charAt(a)==\'1\') { \
				d.getElementById(\'_\'+(a+1)).style.backgroundColor = \'red\'; codeArray[a] = \'1\'; \
			} else { \
				d.getElementById(\'_\'+(a+1)).style.backgroundColor = \'white\'; codeArray[a] = \'0\'; \
			} \
		} \
\
		d.getElementById(\'code\').value = t; \
	} \
\
	function shiftDown() { \
		var t = d.getElementById(\'code\').value.split(\',\'); \
		var l = t[0].length; \
		var u = \'\'; \
\
		t[0] = t[0].substr(0,(l-(d.getElementById(\'cols\').value*d.getElementById(\'shift\').value))); \
		for(var i=1;i<=(d.getElementById(\'cols\').value*d.getElementById(\'shift\').value);i++) u += \'0\'; \
		t[0] = u + t[0]; \
\
		for(var a=0;a<l;a++) { \
			if(t[0].charAt(a)==\'1\') { \
				d.getElementById(\'_\'+(a+1)).style.backgroundColor = \'red\'; codeArray[a] = \'1\'; \
			} else { \
				d.getElementById(\'_\'+(a+1)).style.backgroundColor = \'white\'; codeArray[a] = \'0\'; \
			} \
		} \
\
		d.getElementById(\'code\').value = t; \
	} \
\
	function shiftLeft() { \
		var t = d.getElementById(\'code\').value.split(\',\'); \
		var l = t[0].length; \
		var u = \'\'; \
\
		for(var i=0;i<d.getElementById(\'rows\').value;i++) { \
			u += t[0].substr(((d.getElementById(\'rows\').value*i)+parseInt(d.getElementById(\'shift\').value)),(d.getElementById(\'cols\').value-d.getElementById(\'shift\').value)); \
			for(var h=1;h<=d.getElementById(\'shift\').value;h++) u += \'0\'; \
		} \
		t[0] = u; \
\
		for(var a=0;a<l;a++) { \
			if(t[0].charAt(a)==\'1\') { \
				d.getElementById(\'_\'+(a+1)).style.backgroundColor = \'red\'; codeArray[a] = \'1\'; \
			} else { \
				d.getElementById(\'_\'+(a+1)).style.backgroundColor = \'white\'; codeArray[a] = \'0\'; \
			} \
		} \
\
		d.getElementById(\'code\').value = t; \
	} \
\
	function shiftRight() { \
		var t = d.getElementById(\'code\').value.split(\',\'); \
		var l = t[0].length; \
		var u = \'\'; \
		var v = \'\'; \
\
		for(var i=0;i<d.getElementById(\'rows\').value;i++) { \
			for(var h=1;h<=d.getElementById(\'shift\').value;h++) v += \'0\'; \
			u += v + t[0].substr((d.getElementById(\'rows\').value*i),(d.getElementById(\'cols\').value-d.getElementById(\'shift\').value)); \
			v = \'\'; \
		} \
		t[0] = u; \
\
		for(var a=0;a<l;a++) { \
			if(t[0].charAt(a)==\'1\') { \
				d.getElementById(\'_\'+(a+1)).style.backgroundColor = \'red\'; codeArray[a] = \'1\'; \
			} else { \
				d.getElementById(\'_\'+(a+1)).style.backgroundColor = \'white\'; codeArray[a] = \'0\'; \
			} \
		} \
\
		d.getElementById(\'code\').value = t; \
	} \
\
	</script>';

	doc.write(echo);
	doc.write('</head>\n<body onload="eventHandle();createMainTable();">');

var echo = ' \
	<div id="controls" style="text-align:center;width:100%;position:absolute;left:0px;top:0px;"> \
		'+LANG[selectedLanguage]['width']+': <input id="cols" size="2" value="20" /> '+LANG[selectedLanguage]['height']+': <input id="rows" size="2" value="20" /> <input type="button" id="loadShapeDiv" onclick="loadShape=1;createMainTable();loadShape=1;" value="'+LANG[selectedLanguage]['load']+'" /> <input type="button" id="makeNew" onclick="createMainTable();" value="'+LANG[selectedLanguage]['make']+'" /> <input type="button" id="startMarking" value="'+LANG[selectedLanguage]['start']+'" onclick="startMarking=!startMarking; if(startMarking==1) { markFirst(); d.getElementById(\'startMarking\').value = \'Stop marking\'; } else { d.getElementById(\'startMarking\').value = \'Start marking\'; }" /> \
		<br /><div style="text-align:center;">'+LANG[selectedLanguage]['shift']+'<br /><input type="button" value="'+LANG[selectedLanguage]['up']+'" onclick="shiftUp();" /><br /><input type="button" value="'+LANG[selectedLanguage]['left']+'" onclick="shiftLeft();" /> <input type="text" id="shift" size="2" value="1"> <input type="button" value="'+LANG[selectedLanguage]['right']+'" onclick="shiftRight();" /><br /><input type="button" value="'+LANG[selectedLanguage]['down']+'" onclick="shiftDown();" /> \
		<br /><br />'+LANG[selectedLanguage]['copythis']+': <input type="text" id="code" size="20" /> \
		<br /><input type="button" value="'+LANG[selectedLanguage]['savestyle']+'" onclick="window.opener.customStyle = d.getElementById(\'code\').value; window.opener.d.getElementById(\'gridStyle\').options[window.opener.d.getElementById(\'gridStyle\').options.length-1].selected = \'true\'; window.close();" /> <input type="button" value="'+LANG[selectedLanguage]['close']+'" onclick="window.close();" /> \
	</div> \
	<script type="text/javascript"> \
		d.getElementById(\'cols\').value = cols; \
		d.getElementById(\'rows\').value = rows; \
	</script>';

	doc.write(echo);
	doc.write('</body></html>');
	doc.close();
}

/*
	 The following AJAX code distributed under the MIT license
	 Retrieved from: http://developer.mozilla.org/en/docs/AJAX:Getting_Started
	 Editted by Robert
*/
function makeRequest(url) {
	var http_request = false;
	if (window.XMLHttpRequest) {
		http_request = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		try {
			http_request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				http_request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}
	if (!http_request) {
		alert('Cannot create an XMLHTTP instance. You will not be able to use word lists');
		return false;
	}
	http_request.open('GET', url, false);
	http_request.send(null);
	return http_request.responseText;
}
// End of AJAX code

function saveSettings() {
	t = d.getElementById('numRows').value+','+d.getElementById('numCols').value+','+d.getElementById('fontSize').value+','+d.getElementById('gridStyle').selectedIndex+','+d.getElementById('gridLanguage').selectedIndex+','+d.getElementById('BorF').selectedIndex+','+d.getElementById('diag').selectedIndex+','+d.getElementById('uand').selectedIndex+','+((d.getElementById('sortAlpha').checked==true) ? 1 : '')+','+((d.getElementById('lowerCase').checked==true) ? 1 : '')+','+((d.getElementById('useLetters').checked==true) ? 1 : '')+','+d.getElementById('fontColor').value+','+d.getElementById('bgColor').value+','+d.getElementById('hlColor').value+','+d.getElementById('wordListPlacement').selectedIndex;
	var today = new Date();
	var expires = new Date(today.getTime() + (365 * 86400000));
	d.cookie = "jswordsearch" + "=" + t + ";expires="+expires.toGMTString();
	alert(LANG[selectedLanguage]['setsaved']);
}

function changeLanguages() {
	var t = d.getElementById('mainLang').options[d.getElementById('mainLang').selectedIndex].value;
	var today = new Date();
	var expires = new Date(today.getTime() + (365 * 86400000));
	d.cookie = "mainLang" + "=" + t + ";expires="+expires.toGMTString();
	window.location.href=window.location.href
}


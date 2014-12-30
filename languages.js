//  Saved in UTF-8
//  Only save in UTF-8, otherwise alphabets will break
//  Make sure your text editor is actually saving in UTF-8
//  Version: 1.0.1
//  Changelog:
//  1.0.1 - Fixed Gaeilge in langsArray
//  1.0 - Initial public release
var langs = new Array();

// list languages in order of appearence

var langsArray = new Array(
'English',
'Česky',
'Albanian',
'Dansk',
'Nederlands',
'Suomi',
'Français',
'Deutsch',
'Ελληνικά',
'עברית',
'Gaeilge',
'Italiano',
'Polski',
'Português',
'Русский',
'Tiếng Việt',
'Svenska',
'Español',
'1234567890'
);

// list out entire alphabet and allowed chars

langs['English'] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

langs['Česky'] = 'ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽABCDEFGHIJKLMNOPQRSTUVWXYZ';

langs['Albanian'] = 'ÂÇËABCDEFGHIJKLMNOPQRSTUVWXYZ';

langs['Dansk'] = 'ÆØÅABCDEFGHIJKLMNOPQRSTUVWXYZ';

langs['Nederlands'] = 'ÀÁÂÄÈÉÊËÌÍÎÏÒÓÔÖÙÚÛÜABCDEFGHIJKLMNOPQRSTUVWXYZ';

langs['Suomi'] = 'ÅÄÖABCDEFGHIJKLMNOPQRSTUVWXYZ';

langs['Français'] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZàâçéèêëîïôûùüÿ';

langs['Deutsch'] = 'ÄËÏÖÜABCDEFGHIJKLMNOPQRSTUVWXYZ';

langs['Ελληνικά'] = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ';

langs['עברית'] = 'אבגדהוזחטיכלמנסעפצקרשת';

langs['Gaeilge'] = 'ÁÉÍÓÚABCDEFGHIJKLMNOPQRSTUVWXYZ';

langs['Italiano'] = 'ÀÈÉÌÍÎÒÓÙÚABCDEFGHIJKLMNOPQRSTUVWXYZ';

langs['Polski'] = 'ĄĆĘŁŃÓŚŹŻABCDEFGHIJKLMNOPQRSTUVWXYZ';

langs['Português'] = 'ÀÁÂÃÇÉÊÍÒÓÔÕÚÜABCDEFGHIJKLMNOPQRSTUVWXYZ';

langs['Русский'] = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';

langs['Tiếng Việt'] = 'AĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXYÀẰẦÈỀÌÒỒỜÙỪỲÁẮẤÉẾÍÓỐỚÚỨÝẢẲẨẺỂỈỎỔỞỦỬỶÃẴẪẼỄĨÕỖỠŨỮỸẠẶẬẸỆỊỌỘỢỤỰỴ';

langs['Svenska'] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ';

langs['Español'] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZáéíóúüñ';

langs['1234567890'] = '1234567890';

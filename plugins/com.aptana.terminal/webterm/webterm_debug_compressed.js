/*
 *
 * This program is Copyright (C) 2009 Aptana, Inc. All Rights Reserved
 *
 */
function clamp(_1,_2,_3){
var _4=_1;
if(isNumber(_1)&&isNumber(_2)&&isNumber(_3)){
_4=Math.min(_3,Math.max(_2,_1));
}
return _4;
};
function createXHR(){
var _5;
if(window.XMLHttpRequest){
_5=new XMLHttpRequest();
}else{
_5=new ActiveXObject("Microsoft.XMLHTTP");
}
return _5;
};
function createURL(_6,_7){
var _8=_6;
var _9=[];
if(isDefined(_7)){
for(var k in _7){
if(_7.hasOwnProperty(k)){
_9.push(k+"="+_7[k]);
}
}
}
if(_9.length>0){
_8+="?"+_9.join("&");
}
return _8;
};
function isBoolean(b){
return b!==null&&b!==undefined&&b.constructor===Boolean;
};
function isCharacter(ch){
return ch!==null&&ch!==undefined&&ch.constructor===String&&ch.length>0;
};
function isDefined(o){
return o!==null&&o!==undefined;
};
function isFunction(f){
return f!==null&&f!==undefined&&f.constructor===Function;
};
function isNumber(n){
return n!==null&&n!==undefined&&n.constructor===Number;
};
function isString(s){
return s!==null&&s!==undefined&&s.constructor===String;
};
function protectedClone(_a){
var f=function(){
};
f.prototype=_a;
var _b=new f();
_b.$parent=_a;
return _b;
};
Attribute.DEFAULT_BACKGROUND="b";
Attribute.DEFAULT_FOREGROUND="f";
function Attribute(){
this.reset();
};
Attribute.prototype.copy=function(){
var _c=new Attribute();
_c.foreground=this.foreground;
_c.background=this.background;
_c.bold=this.bold;
_c.italic=this.italic;
_c.underline=this.underline;
_c.inverse=this.inverse;
_c.strikethrough=this.strikethrough;
_c.blink=this.blink;
return _c;
};
Attribute.prototype.equals=function(_d){
var _e=false;
if(_d instanceof Attribute){
_e=this===_d||(this.foreground==_d.foreground&&this.background==_d.background&&this.bold==_d.bold&&this.italic==_d.italic&&this.underline==_d.underline&&this.inverse==_d.inverse&&this.strikethrough==_d.strikethrough&&this.blink==_d.blink);
}
return _e;
};
Attribute.prototype.getStartingHTML=function(){
var _f=[];
var _10=(isNumber(this.background))?this.background:Attribute.DEFAULT_BACKGROUND;
var _11=(isNumber(this.foreground))?this.foreground:Attribute.DEFAULT_FOREGROUND;
if(this.inverse){
_f.push("f"+_10);
_f.push("b"+_11);
}else{
_f.push("f"+_11);
_f.push("b"+_10);
}
if(this.bold){
_f.push("b");
}
if(this.italic){
_f.push("i");
}
if(this.underline){
_f.push("u");
}else{
if(this.strikethrough){
_f.push("lt");
}else{
if(this.blink){
_f.push("bl");
}
}
}
return "<span class=\""+_f.join(" ")+"\">";
};
Attribute.prototype.getEndingHTML=function(){
return "</span>";
};
Attribute.prototype.reset=function(){
this.resetBackground();
this.resetForeground();
this.bold=false;
this.italic=false;
this.underline=false;
this.inverse=false;
this.strikethrough=false;
this.blink=false;
};
Attribute.prototype.resetBackground=function(){
this.background=Attribute.DEFAULT_BACKGROUND;
};
Attribute.prototype.resetForeground=function(){
this.foreground=Attribute.DEFAULT_FOREGROUND;
};
Line.DEFAULT_WIDTH=80;
Line.MIN_WIDTH=20;
Line.MAX_WIDTH=512;
function Line(_12){
if(isNumber(_12)){
_12=clamp(_12,Line.MIN_WIDTH,Line.MAX_WIDTH);
}else{
_12=Line.DEFAULT_WIDTH;
}
this._chars=new Array(_12);
this._attributes=new Array(_12);
this.clear();
};
Line.prototype.clear=function(ch){
ch=(isCharacter(ch))?ch.charAt(0):" ";
for(var i=0;i<this._chars.length;i++){
this._chars[i]=ch;
this._attributes[i]=new Attribute();
}
};
Line.prototype.clearLeft=function(_13){
if(isNumber(_13)&&0<=_13&&_13<this._chars.length){
for(var i=0;i<=_13;i++){
this._chars[i]=" ";
this._attributes[i]=new Attribute();
}
}
};
Line.prototype.clearRight=function(_14){
if(isNumber(_14)&&0<=_14&&_14<this._chars.length){
for(var i=_14;i<this._chars.length;i++){
this._chars[i]=" ";
this._attributes[i]=new Attribute();
}
}
};
Line.prototype.deleteCharacter=function(_15,_16){
if(isNumber(_15)){
var _17=this._chars.length;
_16=(isNumber(_16))?_16:1;
if(_16>0&&0<=_15&&_15<_17){
if(_15+_16>_17){
_16=_17-_15;
}
this._chars.splice(_15,_16);
this._attributes.splice(_15,_16);
for(var i=0;i<_16;i++){
this._chars.push(" ");
this._attributes.push(new Attribute());
}
}
}
};
Line.prototype.getHTMLInfo=function(_18,_19){
var _1a=[];
for(var i=0;i<this._chars.length;i++){
var ch=this._chars[i];
var _1b=this._attributes[i];
if(_1b&&_1b.equals(_18)==false){
if(_18!==null){
_1a.push(_18.getEndingHTML());
}
_1a.push(_1b.getStartingHTML());
_18=_1b;
}
if(i===_19){
_1a.push("<span class=\"cursor\">");
}
switch(ch){
case "&":
_1a.push("&amp;");
break;
case "<":
_1a.push("&lt;");
break;
case ">":
_1a.push("&gt;");
break;
case " ":
_1a.push("&nbsp;");
break;
default:
_1a.push(ch);
break;
}
if(i===_19){
_1a.push("</span>");
}
}
return {html:_1a.join(""),attribute:_18};
};
Line.prototype.getWidth=function(){
return this._chars.length;
};
Line.prototype.insertCharacter=function(ch,_1c,_1d){
if(isCharacter(ch)&&isNumber(_1c)){
var _1e=this._chars.length;
_1d=(isNumber(_1d))?_1d:1;
if(_1d>0&&0<=_1c&&_1c<_1e){
ch=ch.charAt(0);
if(_1c+_1d>_1e){
_1d=_1e-_1c;
}
this._chars.splice(_1e-_1d,_1d);
this._attributes.splice(_1e-_1d,_1d);
var _1f=new Array(_1d);
var _20=new Array(_1d);
for(var i=0;i<_1d;i++){
this._chars.splice(_1c+i,0,ch);
this._attributes.splice(_1c+i,0,new Attribute());
}
}
}
};
Line.prototype.putCharacter=function(ch,_21,_22){
if(isCharacter(ch)&&isDefined(_21)&&_21.constructor==Attribute&&isNumber(_22)){
if(0<=_22&&_22<this._chars.length){
this._chars[_22]=ch.charAt(0);
this._attributes[_22]=_21;
}
}
};
Line.prototype.resize=function(_23){
if(isNumber(_23)){
var _24=this._chars.length;
if(Line.MIN_WIDTH<=_23&&_23<=Line.MAX_WIDTH&&_24!=_23){
this._chars.length=_23;
if(_23>_24){
for(var i=_24;i<_23;i++){
this._chars[i]=" ";
this._attributes[i]=new Attribute();
}
}
}
}
};
Line.prototype.toString=function(){
return this._chars.join("");
};
KeyHandler.BACKSPACE="";
KeyHandler.DELETE="[3~";
KeyHandler.ESCAPE="";
KeyHandler.F1="[[A";
KeyHandler.F2="[[B";
KeyHandler.F3="[[C";
KeyHandler.F4="[[D";
KeyHandler.F5="[[E";
KeyHandler.F6="[17~";
KeyHandler.F7="[18~";
KeyHandler.F8="[19~";
KeyHandler.F9="[20~";
KeyHandler.F10="[21~";
KeyHandler.F11="[23~";
KeyHandler.F12="[24~";
KeyHandler.F13="[25~";
KeyHandler.F14="[26~";
KeyHandler.F15="[28~";
KeyHandler.F16="[29~";
KeyHandler.F17="[31~";
KeyHandler.F18="[32~";
KeyHandler.F19="[33~";
KeyHandler.F20="[34~";
KeyHandler.INSERT="[2~";
KeyHandler.TAB="\t";
KeyHandler.APP_UP="OA";
KeyHandler.APP_DOWN="OB";
KeyHandler.APP_RIGHT="OC";
KeyHandler.APP_LEFT="OD";
KeyHandler.APP_HOME="OH";
KeyHandler.APP_END="OF";
KeyHandler.UP="[A";
KeyHandler.DOWN="[B";
KeyHandler.RIGHT="[C";
KeyHandler.LEFT="[D";
KeyHandler.HOME="[H";
KeyHandler.END="[F";
KeyHandler.PAGE_UP="[5~";
KeyHandler.PAGE_DOWN="[6~";
function KeyHandler(){
var _25=this;
this._queue=[];
this._applicationKeys=false;
document.onkeypress=function(e){
return _25.processKeyPress(e);
};
document.onkeydown=function(e){
return _25.processKeyDown(e);
};
};
KeyHandler.prototype.addKeys=function(_26){
this._queue.push(_26);
if(isDefined(this.callback)){
this.callback(true);
}
};
KeyHandler.prototype.dequeueAll=function(){
var _27=this._queue.join("");
this._queue.length=0;
return _27;
};
KeyHandler.prototype.hasContent=function(){
return this._queue.length>0;
};
KeyHandler.prototype.processKeyDown=function(e){
if(!e){
e=window.event;
}
var _28=e.keyCode;
var _29=null;
var _2a=this._applicationKeys;
switch(_28){
case 8:
_29=KeyHandler.BACKSPACE;
break;
case 9:
_29=KeyHandler.TAB;
break;
case 27:
_29=KeyHandler.ESCAPE;
break;
case 33:
_29=KeyHandler.PAGE_UP;
break;
case 34:
_29=KeyHandler.PAGE_DOWN;
break;
case 35:
_29=(_2a)?KeyHandler.APP_END:KeyHandler.END;
break;
case 36:
_29=(_2a)?KeyHandler.APP_HOME:KeyHandler.HOME;
break;
case 37:
_29=(_2a)?KeyHandler.APP_LEFT:KeyHandler.LEFT;
break;
case 38:
_29=(_2a)?KeyHandler.APP_UP:KeyHandler.UP;
break;
case 39:
_29=(_2a)?KeyHandler.APP_RIGHT:KeyHandler.RIGHT;
break;
case 40:
_29=(_2a)?KeyHandler.APP_DOWN:KeyHandler.DOWN;
break;
case 45:
_29=KeyHandler.INSERT;
break;
case 46:
_29=KeyHandler.DELETE;
break;
case 112:
_29=e.shiftKey?KeyHandler.F13:KeyHandler.F1;
break;
case 113:
_29=e.shiftKey?KeyHandler.F14:KeyHandler.F2;
break;
case 114:
_29=e.shiftKey?KeyHandler.F15:KeyHandler.F3;
break;
case 115:
_29=e.shiftKey?KeyHandler.F16:KeyHandler.F4;
break;
case 116:
_29=e.shiftKey?KeyHandler.F17:KeyHandler.F5;
break;
case 117:
_29=e.shiftKey?KeyHandler.F18:KeyHandler.F6;
break;
case 118:
_29=e.shiftKey?KeyHandler.F19:KeyHandler.F7;
break;
case 119:
_29=e.shiftKey?KeyHandler.F20:KeyHandler.F8;
break;
case 120:
_29=KeyHandler.F9;
break;
case 121:
_29=KeyHandler.F10;
break;
case 122:
_29=KeyHandler.F11;
break;
case 123:
_29=KeyHandler.F12;
break;
default:
if(!e.ctrlKey||(e.ctrlKey&&e.altKey)||(e.keyCode==17)){
}else{
if(e.shiftKey){
switch(_28){
case 50:
_29=String.fromCharCode(0);
break;
case 54:
_29=String.fromCharCode(30);
break;
case 94:
_29=String.fromCharCode(30);
break;
case 109:
_29=String.fromCharCode(31);
break;
default:
break;
}
}else{
switch(_28){
case 32:
_29=String.fromCharCode(0);
break;
case 190:
_29=String.fromCharCode(30);
break;
case 219:
_29=String.fromCharCode(27);
break;
case 220:
_29=String.fromCharCode(28);
break;
case 221:
_29=String.fromCharCode(29);
break;
default:
if(65<=_28&&_28<=90){
_29=String.fromCharCode(_28-64);
}
break;
}
}
}
break;
}
if(_29!==null){
this.addKeys(_29);
return this.stopEvent(e);
}else{
return this.suppressEvent(e);
}
};
KeyHandler.prototype.processKeyPress=function(e){
if(!e){
e=window.event;
}
if(!e||e.metaKey){
return true;
}
if((e.ctrlKey&&!e.altKey)||(e.which==0)||(e.keyCode==8)||(e.keyCode==16)){
}else{
var _2b;
if(e.keyCode){
_2b=e.keyCode;
}
if(e.which){
_2b=e.which;
}
if(e.altKey&&!e.ctrlKey){
this.addKeys(KeyHandler.ESCAPE);
}
this.addKeys(String.fromCharCode(_2b));
}
return this.stopEvent(e);
};
KeyHandler.prototype.setApplicationKeys=function(_2c){
if(isBoolean(_2c)){
this._applicationKeys=_2c;
}
};
KeyHandler.prototype.stopEvent=function(e){
if(e){
e.cancelBubble=true;
if(e.stopPropagtion){
e.stopPropagation();
}
if(e.preventDefault){
e.preventDefault();
}
}
return false;
};
KeyHandler.prototype.suppressEvent=function(e){
if(e){
e.cancelBubble=true;
if(e.stopPropagtion){
e.stopPropagation();
}
}
return true;
};
var XTermTables={format:"rle",version:1,actions:[["<error>"],["ANSI",2,0],["ANSI_SYS"],["APC"],["APP_CTRL",2,2],["BEL"],["BS"],["CBT",2,1],["CHA",2,1],["CHT",2,1],["CNL",2,1],["CPL",2,1],["CR"],["CSI"],["CUB",2,1],["CUD",2,1],["CUF",2,1],["CUP",2,1],["CURSOR_LOWER_LEFT"],["CUU",2,1],["DA1",2,1],["DA2",3,1],["DCH",2,1],["DCS"],["DECALN"],["DECCARA",2,2],["DECCRA",2,2],["DECDHL_BH"],["DECDHL_TH"],["DECDWL"],["DECEFR",2,2],["DECELR",2,2],["DECERA",2,2],["DECFRA",2,2],["DECID"],["DECPAM"],["DECPNM"],["DECRARA",2,2],["DECRC"],["DECREQTPARM_OR_DECSACE",2,1],["DECRQLP",2,2],["DECRQSS",4,2],["DECRST",3,1],["DECSC"],["DECSCA",2,2],["DECSCL",2,2],["DECSED",3,1],["DECSEL",3,1],["DECSERA",2,2],["DECSET",3,1],["DECSLE",2,2],["DECSTBM",2,1],["DECSTR"],["DECSWL"],["DECUDK",2,2],["DEFAULT_CHARSET"],["DL",2,1],["DSR",2,1],["DSR2",3,1],["ECH",2,1],["ED",2,1],["EL",2,1],["ENQ"],["EPA"],["FF"],["G0_CHARSET",2,0],["G1_CHARSET",2,0],["G2_CHARSET",2,0],["G3_CHARSET",2,0],["HPA",2,1],["HTS"],["HVP",2,1],["ICH",2,1],["IL",2,1],["IND"],["LF"],["LS1R"],["LS2"],["LS2R"],["LS3"],["LS3R"],["MC",2,1],["MC2",3,1],["MEM_LOCK"],["MEM_UNLOCK"],["MOUSE_TRACKING",2,1],["NEL"],["OSC"],["PM"],["PRI_MSG",2,2],["REP",2,1],["RESTORE_MODE",3,1],["RI"],["RIS"],["RM",2,1],["S7C1T"],["S8C1T"],["SAVE_MODE",3,1],["SD",2,1],["SET_TEXT_PARAMS",2,1],["SET_TEXT_PARAMS2",2,2],["SGR",2,1],["SI"],["SM",2,1],["SO"],["SOS"],["SPA"],["SS2"],["SS3"],["ST"],["SU",2,1],["TAB"],["TBC",2,1],["UTF8_CHARSET"],["VPA",2,1],["VT"]],nodes:[[[-5,256,-1,512,768,1024,1280,1536,1792,2048,2304,2560,-11,2816,-104,3072,3328,-2,3584,-4,3840,4096,4352,4608,-5,4864,5120,5376,-1,5632,5888,6144,6400,6656,6912,-96],-1],[[-256],62],[[-256],5],[[-256],6],[[-256],111],[[-256],75],[[-256],115],[[-256],64],[[-256],12],[[-256],104],[[-256],102],[[-32,7168,-2,7424,-1,7680,-2,7936,8192,8448,8704,-11,8960,9216,-4,9472,9728,-5,9984,10240,10496,-1,10752,-4,11008,11264,11520,11776,-5,12032,12288,12544,-1,12800,13056,13312,13568,13824,14080,-3,14336,-8,14592,14848,15104,15360,-12,15616,15872,16128,-129],-1],[[-256],74],[[-256],86],[[-256],70],[[-256],92],[[-256],107],[[-256],108],[[-256],23],[[-256],106],[[-256],63],[[-256],105],[[-256],34],[[-256],13],[[-256],109],[[-256],87],[[-256],88],[[-256],3],[[16393,-1,16385,-1,16439,16640,16896,16567],-1],[[-51,17152,17408,17664,17920,-1,18176,-199],-1],[[-64,18432,-6,18688,-184],-1],[[18953,-1,18945,-1,19185],-1],[[19209,-1,19201,-1,19441],-1],[[19465,-1,19457,-1,19697],-1],[[19721,-1,19713,-1,19953],-1],[[-256],43],[[-256],38],[[-256],35],[[-256],36],[[-256],74],[[-256],86],[[-256],18],[[-256],70],[[-256],92],[[-256],107],[[-256],108],[[-36,19968,-11,20233,-1,20480,-196],23],[[-256],106],[[-256],63],[[-256],105],[[-256],34],[[-33,20736,20992,-13,21257,-1,21504,-2,21760,22016,22272,22528,22784,23040,23296,23552,23808,24064,24320,24576,24832,25088,25344,25600,-2,25856,-2,26112,26368,-3,26624,-1,26880,-5,27136,-1,27392,27648,27904,-2,28160,28416,28672,-2,28928,29184,29440,-4,29696,-1,29952,-2,30208,-135],13],[[-256],109],[[-48,30473,-1,30720,-196],87],[[31002,31232,31203],88],[[31514,31744,31715],3],[[-256],93],[[-256],83],[[-256],84],[[-256],77],[[-256],79],[[-256],80],[[-256],78],[[-256],76],[[-256],1],[[-256],95],[[-256],96],[[-256],28],[[-256],27],[[-256],53],[[-256],29],[[-256],24],[[-256],55],[[-256],113],[[-256],65],[[-256],66],[[-256],67],[[-256],68],[[-113,32000,-142],-1],[[-48,20233,-1,20480,-196],-1],[[-48,32265,-66,32512,-131],-1],[[-112,32768,-143],-1],[[-113,33024,-142],-1],[[-34,20992,-13,21257,-1,21504,-4,22272,22528,22784,23040,23296,23552,23808,24064,-1,24576,24832,25088,25344,25600,-2,25856,-2,26112,26368,-3,26624,-1,26880,-5,27136,-1,27392,27648,27904,-2,28160,28416,28672,-2,28928,29184,29440,-9,30208,-135],-1],[[-34,33280,-4,33536,-8,33801,-1,34048,-12,34304,-23,34560,-5,34816,-1,28416,28672,-2,28928,29184,-4,35072,-141],-1],[[-48,35337,-41,35584,-156],-1],[[-48,35849,-1,36096,-14,36352,36608,-28,36864,37120,-2,37376,-1,37632,-3,37888,38144,-140],-1],[[-256],72],[[-256],19],[[-256],15],[[-256],16],[[-256],14],[[-256],10],[[-256],11],[[-256],8],[[-256],17],[[-256],9],[[-256],60],[[-256],61],[[-256],73],[[-256],56],[[-256],22],[[-256],110],[[-256],98],[[-256],59],[[-256],7],[[-123,38400,38656,-131],69],[[-256],90],[[-256],20],[[-256],114],[[-256],112],[[-256],103],[[-256],81],[[-256],94],[[-256],101],[[-256],57],[[-256],2],[[-256],2],[[-256],39],[[-48,30473,-1,30720,-196],-1],[[38918,39168,38930,39424,39139],-1],[[31002,31232,31203],-1],[[-92,39680,-163],-1],[[31514,31744,31715],-1],[[-92,39936,-163],-1],[[40218,40448,40419],-1],[[-48,32265,-66,32512,-131],-1],[[40730,40960,40931],-1],[[-256],52],[[-256],44],[[-112,41216,-143],-1],[[-122,41472,-133],-1],[[-34,33280,-4,33536,-8,33801,-1,34048,-12,34304,-23,34560,-5,34816,-1,28416,28672,-2,28928,29184,-4,35072,-141],-1],[[-48,41737,-1,41984,-36,34560,-7,28416,28672,-2,28928,29184,-146],-1],[[-256],17],[[-123,38400,-132],-1],[[-256],71],[[-256],51],[[-48,35337,-41,35584,-156],-1],[[-256],21],[[-48,35849,-1,36096,-14,36352,36608,-28,36864,37120,-2,37376,-1,37632,-3,37888,38144,-140],-1],[[-48,42249,-1,36096,-44,36864,37120,-2,37376,-5,37888,38144,-140],-1],[[-256],46],[[-256],47],[[-256],49],[[-256],82],[[-256],42],[[-256],58],[[-256],91],[[-256],97],[[-256],50],[[-256],40],[[38918,39168,38930,39424,39139],-1],[[42522,42752,42723],99],[[43014,43264,43091,43520,43170],-1],[[-256],89],[[-256],4],[[40218,40448,40419],-1],[[-92,43776,-163],-1],[[40730,40960,40931],-1],[[-92,44032,-163],-1],[[-256],45],[[-256],31],[[-48,41737,-1,41984,-36,34560,-7,28416,28672,-2,28928,29184,-146],-1],[[-36,44288,-2,44544,-8,44809,-1,45056,-36,34560,-7,28416,28672,-2,28928,29184,-146],-1],[[-48,42249,-1,36096,-44,36864,37120,-2,37376,-5,37888,38144,-140],-1],[[42522,42752,42723],-1],[[-92,45312,-163],-1],[[43014,43264,43255],-1],[[-256],99],[[43014,43264,43255],100],[[-256],41],[[-256],54],[[-122,45568,45824,-132],-1],[[-119,46080,-136],-1],[[-36,44288,-2,44544,-8,44809,-1,45056,-36,34560,-7,28416,28672,-2,28928,29184,-146],-1],[[-36,46336,-11,46601,-1,46848,-24,47104,-11,34560,-7,28416,28672,-2,28928,29184,-146],-1],[[-256],100],[[-256],32],[[-256],48],[[-256],30],[[-114,47360,-1,47616,-3,47872,-135],-1],[[-36,46336,-11,46601,-1,46848,-24,47104,-11,34560,-7,28416,28672,-2,28928,29184,-146],-1],[[-48,48137,-1,48384,-36,34560,-7,28416,28672,-2,28928,29184,-146],-1],[[-256],85],[[-256],25],[[-256],37],[[-256],33],[[-48,48137,-1,48384,-36,34560,-7,28416,28672,-2,28928,29184,-146],-1],[[-48,48649,-1,48896,-36,34560,-7,28416,28672,-2,28928,29184,-146],-1],[[-48,48649,-1,48896,-36,34560,-7,28416,28672,-2,28928,29184,-146],-1],[[-36,49152,-11,49417,-1,49664,-36,34560,-7,28416,28672,-2,28928,29184,-146],-1],[[-118,49920,-137],-1],[[-36,49152,-11,49417,-1,49664,-36,34560,-7,28416,28672,-2,28928,29184,-146],-1],[[-48,50185,-1,49664,-36,34560,-7,28416,28672,-2,28928,29184,-146],-1],[[-256],26],[[-48,50185,-1,49664,-36,34560,-7,28416,28672,-2,28928,29184,-146],-1]]};
function XTermHandler(_2d){
this._term=_2d;
this._insertMode=false;
this._missingCommands={};
};
XTermHandler.prototype.BEL=function(_2e,_2f){
};
XTermHandler.prototype.BS=function(_30,_31){
var col=this._term.getColumn()-1;
col=Math.max(0,col);
this._term.setColumn(col);
};
XTermHandler.prototype.CHA=function(_32,_33){
var _34=0;
if(_33.length>0){
_34=_33-1;
}
this._term.setColumn(_34);
};
XTermHandler.prototype.CR=function(_35,_36){
this._term.setColumn(0);
};
XTermHandler.prototype.CUB=function(_37,_38){
var _39=1;
if(_38.length>0){
_39=_38-0;
if(_39==0){
_39=1;
}
}
var col=this._term.getColumn()-_39;
col=Math.max(0,col);
this._term.setColumn(col);
};
XTermHandler.prototype.CUD=function(_3a,_3b){
var _3c=1;
if(_3b.length>0){
_3c=_3b-0;
if(_3c==0){
_3c=1;
}
}
var _3d=this._term.getRow();
var _3e=this._term.getScrollRegion().bottom;
var _3f;
if(_3d<=_3e){
_3f=Math.min(_3d+_3c,_3e);
}else{
_3f=Math.min(_3d+_3c,this._term.getHeight()-1);
}
this._term.setRow(_3f);
};
XTermHandler.prototype.CUF=function(_40,_41){
var _42=1;
if(_41.length>0){
_42=_41-0;
if(_42==0){
_42=1;
}
}
var col=this._term.getColumn()+_42;
col=Math.min(col,this._term.getWidth()-1);
this._term.setColumn(col);
};
XTermHandler.prototype.CUP=function(_43,_44){
var row=0;
var col=0;
var _45=this._term.getHeight();
if(_44.length>0){
var _46=_44.split(/;/);
var row=_46[0]-1;
var col=_46[1]-1;
}
if(row>=_45){
var _47=_45-row;
row=_45-1;
this._term.scrollUp(_47);
}
this._term.setPosition(row,col);
};
XTermHandler.prototype.CUU=function(_48,_49){
var _4a=1;
if(_49.length>0){
_4a=_49-0;
if(_4a==0){
_4a=1;
}
}
var _4b=this._term.getRow();
var _4c=this._term.getScrollRegion().top;
var _4d;
if(_4c<=_4b){
_4d=Math.max(_4c,_4b-_4a);
}else{
_4d=Math.max(0,_4b-_4a);
}
this._term.setRow(_4d);
};
XTermHandler.prototype.DCH=function(_4e,_4f){
var _50=_4f-0;
this._term.deleteCharacter(_50);
};
XTermHandler.prototype.DECALN=function(_51,_52){
this._term.clear("E");
};
XTermHandler.prototype.DECRC=function(_53,_54){
this._term.popPosition();
};
XTermHandler.prototype.DECPAM=function(_55,_56){
this._term.setApplicationKeys(true);
};
XTermHandler.prototype.DECPNM=function(_57,_58){
this._term.setApplicationKeys(false);
};
XTermHandler.prototype.DECRST=function(_59,_5a){
var _5b=_5a-0;
switch(_5b){
case 1:
this._term.setApplicationKeys(false);
break;
case 3:
this._term.setWidth(80);
break;
case 25:
this._term.setCursorVisible(false);
break;
case 47:
this._term.popBuffer();
break;
case 1049:
this._term.popPosition();
this._term.popBuffer();
break;
default:
this.genericHandler(_59,_5a);
break;
}
};
XTermHandler.prototype.DECSC=function(_5c,_5d){
this._term.pushPosition();
};
XTermHandler.prototype.DECSET=function(_5e,_5f){
var _60=_5f-0;
switch(_60){
case 1:
this._term.setApplicationKeys(true);
break;
case 3:
this._term.setWidth(132);
break;
case 25:
this._term.setCursorVisible(true);
break;
case 47:
this._term.pushBuffer();
break;
case 1049:
this._term.pushPosition();
this._term.pushBuffer();
break;
default:
this.genericHandler(_5e,_5f);
break;
}
};
XTermHandler.prototype.DECSTBM=function(_61,_62){
var _63=_62.split(/;/);
var top=_63[0]-1;
var _64=_63[1]-1;
this._term.setScrollRegion(top,0,_64,this._term.getWidth()-1);
};
XTermHandler.prototype.DL=function(_65,_66){
var _67=1;
if(_66.length>0){
_67=_66-0;
if(_67==0){
_67=1;
}
}
this._term.deleteLine(_67);
};
XTermHandler.prototype.ED=function(_68,_69){
var _6a=_69-0;
switch(_6a){
case 0:
this._term.clearAfter();
break;
case 1:
this._term.clearBefore();
break;
case 2:
this._term.clear();
break;
default:
this.genericHandler(_68+":"+_69,"");
break;
}
};
XTermHandler.prototype.EL=function(_6b,_6c){
var _6d=_6c-0;
switch(_6d){
case 0:
this._term.clearRight();
break;
case 1:
this._term.clearLeft();
break;
case 2:
this._term.clearLine();
break;
default:
this.genericHandler(_6b+":"+_6c,"");
break;
}
};
XTermHandler.prototype.genericHandler=function(_6e,_6f){
if(this._missingCommands.hasOwnProperty(_6e)===false){
this._missingCommands[_6e]=0;
}
this._missingCommands[_6e]++;
};
XTermHandler.prototype.getMissingCommands=function(){
return this._missingCommands;
};
XTermHandler.prototype.HVP=XTermHandler.prototype.CUP;
XTermHandler.prototype.ICH=function(_70,_71){
var _72=_71-0;
this._term.insertCharacter(" ",_72);
};
XTermHandler.prototype.IL=function(_73,_74){
var _75=1;
if(_74.length>0){
_75=_74-0;
if(_75==0){
_75=1;
}
}
this._term.insertLine(_75);
};
XTermHandler.prototype.IND=function(_76,_77){
var _78=this._term.getRow();
var _79=this._term.getScrollRegion().bottom;
var _7a=_78+1;
if(_78<=_79){
this._term.setRow(_7a);
}else{
this._term.scrollUp(1);
this._term.setRow(_79);
}
};
XTermHandler.prototype.LF=function(_7b,_7c){
var _7d=this._term;
var row=_7d.getRow()+1;
var _7e=_7d.getScrollRegion().bottom;
if(row>_7e){
_7d.scrollUp();
row=_7e;
}
_7d.setPosition(row,0);
};
XTermHandler.prototype.NEL=XTermHandler.prototype.LF;
XTermHandler.prototype.processCharacter=function(_7f,_80){
if(this._insertMode){
this._term.insertCharacter(" ",1);
}
this._term.displayCharacters(_80);
};
XTermHandler.prototype.RI=function(_81,_82){
var _83=this._term.getRow();
var _84=this._term.getScrollRegion().top;
var _85=_83-1;
if(_84<=_85){
this._term.setRow(_85);
}else{
this._term.scrollDown(1);
this._term.setRow(_84);
}
};
XTermHandler.prototype.RM=function(_86,_87){
var _88=_87-0;
switch(_88){
case 4:
this._insertMode=false;
break;
case 2:
case 12:
case 20:
default:
this.genericHandler(_86,_87);
break;
}
};
XTermHandler.prototype.SD=function(_89,_8a){
var _8b=1;
if(_8a.length>0){
_8b=_8a-0;
}
var _8c=this._term.getRow();
var _8d=this._term.getScrollRegion().top;
var _8e=_8c-_8b;
if(_8d<=_8e){
this._term.setRow(_8e);
}else{
this._term.scrollDown(_8b);
this._term.setRow(_8d);
}
};
XTermHandler.prototype.SET_TEXT_PARAMS=function(_8f,_90){
var _91=_90.split(/;/);
var _92=_91[0]-0;
var _93=_91[1];
if(_92==0){
this._term.setTitle(_93);
}else{
this.genericHandler(_8f+":"+_90,"");
}
};
XTermHandler.prototype.SET_TEXT_PARAMS2=XTermHandler.prototype.SET_TEXT_PARAMS;
XTermHandler.prototype.SGR=function(_94,_95){
var _96=this._term.getCurrentAttribute();
var _97=_95.split(/;/);
for(var i=0;i<_97.length;i++){
var _98=_97[i]-0;
if(_98<50){
var _99=Math.floor(_98/10);
var _9a=_98%10;
switch(_99){
case 0:
switch(_9a){
case 0:
_96.reset();
break;
case 1:
_96.bold=true;
break;
case 3:
_96.italic=true;
break;
case 4:
_96.underline=true;
break;
case 7:
_96.inverse=true;
break;
case 9:
_96.strikethrough=true;
break;
default:
this.genericHandler(_94+":"+_95,"");
break;
}
break;
case 2:
switch(_9a){
case 2:
_96.bold=false;
break;
case 3:
_96.italic=false;
break;
case 4:
_96.underline=false;
break;
case 7:
_96.inverse=false;
break;
case 9:
_96.strikethough=false;
break;
default:
this.genericHandler(_94+":"+_95,"");
break;
}
break;
case 3:
switch(_9a){
case 0:
case 1:
case 2:
case 3:
case 4:
case 5:
case 6:
case 7:
_96.foreground=_9a;
break;
case 9:
_96.resetForeground();
break;
default:
this.genericHandler(_94+":"+_95,"");
break;
}
break;
case 4:
switch(_9a){
case 0:
case 1:
case 2:
case 3:
case 4:
case 5:
case 6:
case 7:
_96.background=_9a;
break;
case 9:
_96.resetBackground();
break;
default:
this.genericHandler(_94+":"+_95,"");
break;
}
break;
default:
this.genericHandler(_94+":"+_95,"");
break;
}
}else{
this.genericHandler(_94+":"+_95,"");
}
}
this._term.setCurrentAttribute(_96);
};
XTermHandler.prototype.SM=function(_9b,_9c){
var _9d=_9c-0;
switch(_9d){
case 4:
this._insertMode=true;
break;
case 2:
case 12:
case 20:
default:
this.genericHandler(_9b,_9c);
break;
}
};
XTermHandler.prototype.SU=function(_9e,_9f){
var _a0=1;
if(_9f.length>0){
_a0=_9f-0;
}
var _a1=this._term.getRow();
var _a2=this._term.getScrollRegion().bottom;
var _a3=_a1+_a0;
if(_a1<=_a2){
this._term.setRow(_a3);
}else{
this._term.scrollUp(_a0);
this._term.setRow(_a2);
}
};
XTermHandler.prototype.TAB=function(_a4,_a5){
var _a6=this._term.getColumn();
var _a7=8-(_a6%8);
this._term.displayCharacters(new Array(_a7+1).join(" "));
};
XTermHandler.prototype.VPA=function(_a8,_a9){
var row=0;
if(_a9.length>0){
row=_a9-1;
}
this._term.setRow(row);
};
XTermHandler.prototype.VT=XTermHandler.prototype.LF;
function BroadcastHandler(){
this._handlers=[];
};
BroadcastHandler.prototype.addHandler=function(_aa){
this._handlers.push(_aa);
};
BroadcastHandler.prototype.genericHandler=function(_ab,_ac){
for(var i=0;i<this._handlers.length;i++){
var _ad=this._handlers[i];
if(_ad[_ab]&&_ad[_ab] instanceof Function){
_ad[_ab](_ab,_ac);
}else{
if(_ad.genericHandler&&_ad.genericHandler instanceof Function){
_ad.genericHandler(_ab,_ac);
}
}
}
};
BroadcastHandler.prototype.processCharacter=function(_ae,_af){
for(var i=0;i<this._handlers.length;i++){
var _b0=this._handlers[i];
if(_b0.processCharacter&&_b0.processCharacter instanceof Function){
_b0.processCharacter(_ae,_af);
}
}
};
BroadcastHandler.prototype.removeHandler=function(_b1){
for(var i=0;i<this._handlers.length;i++){
if(_b1===this._handlers[i]){
this._handlers.splice(i,1);
break;
}
}
};
function DebugHandler(){
this.clear();
};
DebugHandler.prototype.clear=function(){
this._commands={};
this._commandsWithParams={};
this._actions=[];
this._text=[];
};
DebugHandler.prototype.genericHandler=function(_b2,_b3){
if(this._commands.hasOwnProperty(_b2)==false){
this._commands[_b2]=1;
}else{
this._commands[_b2]++;
}
var key=_b2+":"+_b3;
if(this._commandsWithParams.hasOwnProperty(key)==false){
this._commandsWithParams[key]=1;
}else{
this._commandsWithParams[key]++;
}
if(this._text.length>0){
this._actions.push("text: "+this._text.join(""));
this._text=[];
}
this._actions.push(_b2+"("+_b3+")");
};
DebugHandler.prototype.getActions=function(){
return this._actions;
};
DebugHandler.prototype.getCommands=function(){
return this._commands;
};
DebugHandler.prototype.getCommandsWithParams=function(){
return this._commandsWithParams;
};
DebugHandler.prototype.processCharacter=function(_b4,_b5){
function _b6(d){
var hex=d.toString(16).toUpperCase();
if(hex.length<2){
hex="0"+hex;
}
return hex;
};
if(_b5.match(/[\x20-\x7e]/)){
this._text.push(_b5);
}else{
this._text.push(_b6(_b5.charAt(0)));
}
};
function TermParser(_b7,_b8){
if(_b7===null||_b7===undefined){
throw new Error("Parsing tables must be defined when creating a new TermParser");
}
this._processTables(_b7);
this._actions=_b7.actions;
this._nodes=_b7.nodes;
this.setHandler(_b8);
this.singleStep=false;
this.offset=-1;
};
TermParser.prototype.getHandler=function(){
return this._handler;
};
TermParser.prototype.parse=function(_b9){
var _ba=0;
var _bb=isString(_b9)?_b9.length:0;
while(_ba<_bb){
var _bc=0;
var _bd=this._nodes[_bc][1];
var _be=(_bd==-1)?-2:_ba;
for(var i=_ba;i<_bb;i++){
var _bf=this._nodes[_bc];
if(_bf){
var _c0=_b9.charCodeAt(i);
var _c1=_bf[0][_c0];
if(_c1!=-1){
_bc=_c1;
var _c2=this._nodes[_bc][1];
if(_c2!=-1){
_be=i;
_bd=_c2;
}
}else{
break;
}
}
}
if(_bd==-1){
if(this._handler!=null){
if(this._handler.processCharacter){
this._handler.processCharacter("processCharacter",_b9.charAt(_ba));
}
}
_ba++;
}else{
var _c3=_be+1;
if(this._handler!=null){
var _c4=this._actions[_bd];
var _c5=_c4[0];
var _c6="";
if(_c4.length>=3&&_c4[1]!=-1&&_c4[2]!=-1){
_c6=_b9.substring(_ba+_c4[1],_c3-_c4[2]);
}
this._handler[_c5](_c5,_c6);
}
_ba=_c3;
if(this.singleStep){
this.offset=_ba;
break;
}
}
}
};
TermParser.prototype._processTables=function(_c7){
if(_c7.hasOwnProperty("processed")==false||_c7.processed==false){
switch(_c7.format){
case "expanded":
break;
case "rle":
var mos=new Array(256);
for(var i=0;i<mos.length;i++){
mos[i]=-1;
}
var _c8=_c7.nodes;
for(var i=0;i<_c8.length;i++){
var _c9=_c8[i][0];
var _ca=[];
for(var j=0;j<_c9.length;j++){
var _cb=_c9[j];
if(_cb<0){
_ca=_ca.concat(mos.slice(0,-_cb));
}else{
var _cc=_cb>>8;
var _cd=(_cb&255)+1;
for(var k=0;k<_cd;k++){
_ca.push(_cc);
}
}
}
_c8[i][0]=_ca;
}
break;
default:
break;
}
_c7.processed=true;
}
};
TermParser.prototype.setHandler=function(_ce){
var _cf=null;
if(_ce){
var _d0=null;
var _d1=function(_d2,_d3){
};
for(var i=0;i<this._actions.length;i++){
var _d4=this._actions[i];
var _d5=_d4[0];
if(!_ce[_d5]){
if(_cf==null){
_cf=protectedClone(_ce);
if(!_ce.genericHandler){
_d0=_d1;
}else{
_d0=_ce.genericHandler;
}
}
_cf[_d5]=_d0;
}
}
}
if(_cf==null){
this._handler=_ce;
}else{
this._handler=_cf;
}
};
TermComm.POLLING_INTERVAL_MIN=125;
TermComm.POLLING_INTERVAL_MAX=2000;
TermComm.POLLING_GROWTH_RATE=2;
TermComm.DEFAULT_REQUEST_URL="/stream";
TermComm.DEFAULT_GET_UNIQUE_ID_URL="/id";
function TermComm(_d6,_d7){
var _d8=this;
this.terminal=_d6;
this.keyHandler=_d6.getKeyHandler();
this.keyHandler.callback=function(){
_d8.sendKeys();
};
this.minInterval=125;
this.maxInterval=2000;
this.growthRate=2;
this.timeoutInterval=5000;
this.requestURL=TermComm.DEFAULT_REQUEST_URL;
this.getUniqueIdURL=TermComm.DEFAULT_GET_UNIQUE_ID_URL;
if(isDefined(_d7)){
if(_d7.hasOwnProperty("minInterval")&&isNumber(_d7.minInterval)){
this.minInterval=_d7.minInterval;
}
if(_d7.hasOwnProperty("maxInterval")&&isNumber(_d7.maxInterval)){
this.maxInterval=_d7.maxInterval;
}
if(_d7.hasOwnProperty("growthRate")&&isNumber(_d7.growthRate)){
this.growthRate=_d7.growthRate;
}
if(_d7.hasOwnProperty("timeoutInterval")&&isNumber(_d7.timeoutInterval)){
this.timeoutInterval=_d7.timeoutInterval;
}
if(_d7.hasOwnProperty("requestURL")&&isString(_d7.requestURL)&&_d7.requestURL.length>0){
this.requestURL=_d7.requestURL;
}
if(_d7.hasOwnProperty("getUniqueIdURL")&&isString(_d7.getUniqueIdURL)&&_d7.getUniqueIdURL.length>0){
this.getUniqueIdURL=_d7.getUniqueIdURL;
}
}
this.pollingInterval=this.minInterval;
this.watchdogID=null;
this.requestID=null;
this.running=false;
this.gettingInput=false;
this.updateQueued=false;
this.sendingKeys=false;
this.cacheBusterID=0;
this.ie=(window.ActiveXObject)?true:false;
};
TermComm.prototype.getUniqueID=function(){
var req=createXHR();
req.open("GET",this.getUniqueIdURL,false);
req.send("");
return req.responseText;
};
TermComm.prototype.isRunning=function(){
return this.running;
};
TermComm.prototype.getInput=function(){
if(this.watchdogID===null){
var _d9=this;
var req=createXHR();
var _da={id:this.terminal.getId(),cb:new Date().getTime()+":"+this.cacheBusterID++};
req.open("GET",createURL(this.requestURL,_da),true);
if(this.ie){
req.setRequestHeader("If-Modified-Since","Sat, 1 Jan 2000 00:00:00 GMT");
}
req.onreadystatechange=function(){
if(req.readyState==4){
if(_d9.watchdogID!==null){
window.clearTimeout(_d9.watchdogID);
_d9.watchdogID=null;
}
var _db=req.responseText;
if(isString(_db)&&_db.length>0){
_d9.terminal.processCharacters(_db);
_d9.pollingInterval=_d9.minInterval;
}else{
_d9.pollingInterval*=_d9.growthRate;
if(_d9.pollingInterval>_d9.maxInterval){
_d9.pollingInterval=_d9.maxInterval;
}
}
_d9.requestID=window.setTimeout(function(){
_d9.update();
},(this.updateQueued)?0:_d9.pollingInterval);
this.updateQueued=false;
}
};
this.watchdogID=window.setTimeout(function(){
_d9.timeout();
},this.timeoutInterval);
req.send("");
}else{
this.updateQueued=true;
}
};
TermComm.prototype.sendKeys=function(){
var id=this.terminal.getId();
if(isDefined(this.keyHandler)&&id!==null){
if(this.keyHandler.hasContent()&&this.sendingKeys===false){
this.sendingKeys=true;
var _dc=this;
var req=createXHR();
var _dd={id:id};
req.open("POST",createURL(this.requestURL,_dd),true);
req.onreadystatechange=function(){
if(req.readyState==4){
_dc.sendingKeys=false;
_dc.update(true);
}
};
req.send(this.keyHandler.dequeueAll());
}
}
};
TermComm.prototype.timeout=function(){
};
TermComm.prototype.toggleRunState=function(){
this.running=!this.running;
if(this.running){
this.update(true);
}
};
TermComm.prototype.update=function(_de){
if(this.running&&this.terminal.getId()!==null){
if(isBoolean(_de)){
if(this.requestID!==null){
window.clearTimeout(this.requestID);
this.requestID=null;
}
if(_de){
this.sendKeys();
this.pollingInterval=this.minInterval;
}
}
this.getInput();
}
};
Term.DEFAULT_ID="terminal";
Term.DEFAULT_HEIGHT=24;
Term.MIN_HEIGHT=5;
Term.MAX_HEIGHT=512;
function Term(id,_df,_e0,_e1){
if(isString(id)===false||id.length===0){
id="terminal";
}
this._id=(_e1&&_e1.hasOwnProperty("id"))?_e1.id:null;
this._remainingText="";
this._rootNode=document.getElementById(id);
if(this._rootNode){
this._rootNode.className="webterm";
this._termNode=document.createElement("pre");
this._rootNode.appendChild(this._termNode);
this._width=(isNumber(_df))?clamp(_df,Line.MIN_WIDTH,Line.MAX_WIDTH):Line.DEFAULT_WIDTH;
this._height=(isNumber(_e0))?clamp(_e0,Term.MIN_HEIGHT,Term.MAX_HEIGHT):Term.DEFAULT_HEIGHT;
this._title="Aptana WebTerm";
this._row=0;
this._column=0;
this._scrollRegion={top:0,left:0,bottom:this._height-1,right:this._width-1};
this._cursorVisible=true;
this._buffers=[];
this._positions=[];
this._currentAttribute=new Attribute();
this._sendResizeSequence=(_e1&&_e1.hasOwnProperty("sendResizeSequence"))?_e1.sendResizeSequence:true;
this._showTitle=(_e1&&_e1.hasOwnProperty("showTitle"))?_e1.showTitle:true;
this._onTitleChange=(_e1&&_e1.hasOwnProperty("onTitleChange"))?_e1.onTitleChange:null;
var _e2=(_e1&&_e1.hasOwnProperty("handler"))?_e1.handler:new XTermHandler(this);
var _e3=(_e1&&_e1.hasOwnProperty("tables"))?_e1.tables:XTermTables;
var _e4=(_e1&&_e1.hasOwnProperty("parser"))?_e1.parser:new TermParser(_e3,_e2);
var _e5=(_e1&&_e1.hasOwnProperty("keyHandler"))?_e1.keyHandler:new KeyHandler();
this._parser=_e4;
this._keyHandler=_e5;
var _e6=(_e1&&_e1.hasOwnProperty("commHandler"))?_e1.commHandler:new TermComm(this,_e1);
var _e7=(_e1&&_e1.hasOwnProperty("autoStart"))?_e1.autoStart:true;
this._commHandler=_e6;
this.createBuffer();
this.refresh();
if(_e7){
this.toggleRunState();
}
}else{
throw new Error("Unable to create a new Term because there is no element named '"+id+"'");
}
};
Term.prototype.clear=function(ch){
for(var i=0;i<this._lines.length;i++){
this._lines[i].clear(ch);
}
this._row=0;
this._column=0;
};
Term.prototype.clearAfter=function(){
this._lines[this._row].clearRight(this._column);
for(var i=this._row+1;i<this._lines.length;i++){
this._lines[i].clear();
}
};
Term.prototype.clearBefore=function(){
this._lines[this._row].clearLeft(this._column);
for(var i=this._row-1;i>=0;i--){
this._lines[i].clear();
}
};
Term.prototype.clearLeft=function(){
this._lines[this._row].clearLeft(this._column);
};
Term.prototype.clearLine=function(){
this._lines[this._row].clear();
};
Term.prototype.clearRight=function(){
this._lines[this._row].clearRight(this._column);
};
Term.prototype.createBuffer=function(){
var _e8=new Array(this._height);
for(var i=0;i<_e8.length;i++){
_e8[i]=new Line(this._width);
}
this._lines=_e8;
};
Term.prototype.deleteCharacter=function(_e9){
this._lines[this._row].deleteCharacter(this._column,_e9);
};
Term.prototype.deleteLine=function(_ea){
_ea=(_ea===undefined)?1:_ea;
if(_ea>0){
var _eb=this._scrollRegion;
if(_eb.left==0&&_eb.right==this._width-1){
if(this._row+_ea>_eb.bottom){
_ea=_eb.bottom-this._row+1;
}
if(_ea==this._height){
this.clear();
}else{
var _ec=this._lines.splice(this._row,_ea);
for(var i=0;i<_ea;i++){
_ec[i].clear();
}
if(_eb.bottom+1==this.height){
this._lines=this._lines.concat(_ec);
}else{
for(var i=0;i<_ea;i++){
this._lines.splice(_eb.bottom-_ea+i+1,0,_ec[i]);
}
}
}
}else{
}
}
};
Term.prototype.displayCharacters=function(_ed){
if(isString(_ed)){
for(var i=0;i<_ed.length;i++){
var ch=_ed.charAt(i);
var _ee=this._lines[this._row];
if(/[\x20-\x7F]+/.test(ch)==false){
ch=" ";
}
_ee.putCharacter(ch,this._currentAttribute,this._column);
this._column++;
if(this._column>=this._width){
this._column=this._width-1;
}
}
}
};
Term.prototype.getColumn=function(){
return this._column;
};
Term.prototype.getCommunicationHandler=function(){
return this._commHandler;
};
Term.prototype.getCurrentAttribute=function(){
return this._currentAttribute.copy();
};
Term.prototype.getHeight=function(){
return this._height;
};
Term.prototype.getId=function(){
return this._id;
};
Term.prototype.getKeyHandler=function(){
return this._keyHandler;
};
Term.prototype.getParser=function(){
return this._parser;
};
Term.prototype.getRow=function(){
return this._row;
};
Term.prototype.getScrollRegion=function(){
return protectedClone(this._scrollRegion);
};
Term.prototype.getTitle=function(){
return this._title;
};
Term.prototype.getWidth=function(){
return this._width;
};
Term.prototype.insertCharacter=function(ch,_ef){
this._lines[this._row].insertCharacter(ch,this._column,_ef);
};
Term.prototype.insertLine=function(_f0){
_f0=(_f0===undefined)?1:_f0;
if(_f0>0){
var _f1=this._scrollRegion;
if(_f1.left==0&&_f1.right==this._width-1){
if(this._row+_f0>_f1.bottom){
_f0=_f1.bottom-this._row+1;
}
if(_f0==this._height){
this.clear();
}else{
var _f2=this._lines.splice(_f1.bottom-_f0+1,_f0);
for(var i=0;i<_f0;i++){
_f2[i].clear();
}
if(this._row==0){
this._lines=_f2.concat(this._lines);
}else{
for(var i=0;i<_f0;i++){
this._lines.splice(this._row+i,0,_f2[i]);
}
}
}
}else{
}
}
};
Term.prototype.popBuffer=function(){
if(this._buffers.length>0){
this._lines=this._buffers.pop();
}
};
Term.prototype.popPosition=function(){
if(this._positions.length>0){
var _f3=this._positions.pop();
this._row=_f3[0];
this._column=_f3[1];
}
};
Term.prototype.processCharacters=function(_f4){
if(isString(_f4)&&_f4.length>0){
this._parser.parse(_f4);
this.refresh();
}
};
Term.prototype.pushBuffer=function(){
this._buffers.push(this._lines);
this.createBuffer();
};
Term.prototype.pushPosition=function(){
this._positions.push([this._row,this._column]);
};
Term.prototype.refresh=function(){
var _f5=[];
var _f6=null;
var _f7=this._title+" — "+this._width+"x"+this._height;
var _f8="<div class='title'>"+_f7+"</div>";
for(var row=0;row<this._height;row++){
var _f9=this._lines[row];
var _fa=(this._cursorVisible)?(row==this._row)?this._column:-1:-1;
var _fb=_f9.getHTMLInfo(_f6,_fa);
_f6=_fb.attribute;
_f5.push(_fb.html);
}
if(_f6!=null){
_f5[_f5.length-1]+=_f6.getEndingHTML();
}
if(this._showTitle){
this._termNode.innerHTML=_f8+_f5.join("<br />");
}else{
this._termNode.innerHTML=_f5.join("<br />");
}
};
Term.prototype.scrollDown=function(_fc){
_fc=(_fc===undefined)?1:_fc;
if(_fc>0){
var _fd=this._scrollRegion;
if(_fd.left==0&&_fd.right==this._width-1){
var _fe=_fd.bottom-_fd.top+1;
if(_fc>=_fe){
this.clear();
}else{
var _ff=this._lines.splice(_fd.bottom-_fc+1,_fc);
for(var i=0;i<_fc;i++){
_ff[i].clear();
}
if(_fd.top==0){
this._lines=_ff.concat(this._lines);
}else{
for(var i=0;i<_fc;i++){
this._lines.splice(_fd.top+i,0,_ff[i]);
}
}
}
}else{
}
}
};
Term.prototype.scrollUp=function(_100){
_100=(_100===undefined)?1:_100;
if(_100>0){
var _101=this._scrollRegion;
if(_101.left==0&&_101.right==this._width-1){
var _102=_101.bottom-_101.top+1;
if(_100>=_102){
this.clear();
}else{
var _103=this._lines.splice(_101.top,_100);
for(var i=0;i<_100;i++){
_103[i].clear();
}
if(_101.bottom+1==this.height){
this._lines=this._lines.concat(_103);
}else{
for(var i=0;i<_100;i++){
this._lines.splice(_101.bottom-_100+i+1,0,_103[i]);
}
}
}
}else{
}
}
};
Term.prototype.setApplicationKeys=function(_104){
if(isBoolean(_104)){
this._keyHandler.setApplicationKeys(_104);
}
};
Term.prototype.setColumn=function(_105){
if(isNumber(_105)&&0<=_105&&_105<this._width){
this._column=_105;
}
};
Term.prototype.setCurrentAttribute=function(attr){
if(isDefined(attr)&&attr.constructor===Attribute){
this._currentAttribute=attr;
}
};
Term.prototype.setCursorVisible=function(_106){
if(isBoolean(_106)){
this._cursorVisible=_106;
}
};
Term.prototype.setHeight=function(_107){
this.setSize(this._width,_107);
};
Term.prototype.setPosition=function(row,_108){
if(isNumber(row)&&0<=row&&row<this._height){
this._row=row;
}
if(isNumber(_108)&&0<=_108&&_108<this._width){
this._column=_108;
}
};
Term.prototype.setRow=function(row){
if(0<=row&&row<this._height){
this._row=row;
}
};
Term.prototype.setScrollRegion=function(top,left,_109,_10a){
if(isNumber(top)&&isNumber(left)&&isNumber(_109)&&isNumber(_10a)){
if(top<_109&&left<_10a){
var _10b=(0<=top&&top<this._height);
var _10c=(0<=left&&left<this._width);
var _10d=(0<=_109&&_109<this._height);
var _10e=(0<=_10a&&_10a<this._width);
if(_10b&&_10c&&_10d&&_10e){
this._scrollRegion={top:top,left:left,bottom:_109,right:_10a};
}
}
}
};
Term.prototype.setSize=function(_10f,_110){
var _111=false;
if(isNumber(_10f)&&Line.MIN_WIDTH<=_10f&&_10f<=Line.MAX_WIDTH&&this._width!=_10f){
for(var i=0;i<this._height;i++){
this._lines[i].resize(_10f);
}
this._width=_10f;
this._column=Math.min(this._width-1,this._column);
_111=true;
}
if(isNumber(_110)&&Term.MIN_HEIGHT<=_110&&_110<=Term.MAX_HEIGHT&&this._height!=_110){
if(_110>this._height){
for(var i=this._height;i<_110;i++){
this._lines.push(new Line(this._width));
}
}else{
this._lines=this._lines.splice(this._height-_110,_110);
}
this._height=_110;
this._row=Math.min(this._height-1,this._row);
_111=true;
}
if(_111){
this.setScrollRegion(0,0,this._height-1,this._width-1);
if(this._sendResizeSequence){
var ESC=String.fromCharCode(27);
var CSI=ESC+"[";
this._keyHandler.addKeys(CSI+[8,this._height,this._width].join(";")+"t");
}
}
};
Term.prototype.setTitle=function(_112){
this._title=_112;
if(isFunction(this._onTitleChange)){
this._onTitleChange(_112);
}
};
Term.prototype.showTitle=function(_113){
if(isBoolean(_113)){
this._showTitle=_113;
this.refresh();
}
};
Term.prototype.toggleRunState=function(){
if(this._commHandler!==null){
if(this._id===null&&this._commHandler.isRunning()==false){
this._id=this._commHandler.getUniqueID();
}
this._commHandler.toggleRunState();
}
};
Term.prototype.setWidth=function(_114){
this.setSize(_114,this._height);
};
Term.prototype.toString=function(){
var _115=[];
for(var i=0;i<this._lines.length;i++){
_115.push(this._lines[i].toString());
}
return _115.join("\n");
};


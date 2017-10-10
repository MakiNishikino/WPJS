function UnicodeToAnsi(chrCode)
{
        var chrHex=chrCode.toString(16);
        chrHex="000"+chrHex.toUpperCase();
        chrHex=chrHex.substr(chrHex.length-4);
        var i=UnicodeChr().indexOf(chrHex);
        if(i!=-1)
        {
                chrHex=AnsicodeChr().substr(i,4);
        }
        return parseInt(chrHex,16)
}

function AnsiToUnicode(chrCode)
{
        var chrHex=chrCode.toString(16);
        chrHex="000"+chrHex.toUpperCase();
        chrHex=chrHex.substr(chrHex.length-4);
        var i=AnsicodeChr().indexOf(chrHex);
        if(i!=-1)
        {
                chrHex=UnicodeChr().substr(i,4);
        }
        return parseInt(chrHex,16)
}

//将Unicode编码的字符串，转换成Ansi编码的字符串
function strUnicode2Ansi(asContents)
{
        var len1=asContents.length;
        var temp="";
        for(var i=0;i<len1;i++)
        {
                var varasc=asContents.charCodeAt(i);
                if(varasc<0)
                        varasc+=65536;
                if(varasc>127)
                        varasc=UnicodeToAnsi(varasc);
                if(varasc>255)
                {
                        var varlow=varasc & 65280;
                        varlow=varlow>>8;
                        var varhigh=varasc & 255;
                        temp+=String.fromCharCode(varlow)+String.fromCharCode(varhigh);
                }
                else
                {
                        temp+=String.fromCharCode(varasc);
                }
        }
        return temp;
}

//将Ansi编码的字符串，转换成Unicode编码的字符串
function strAnsi2Unicode(asContents)
{
        var len1=asContents.length;
        var temp="";
        var chrcode;
        for(var i=0;i<len1;i++)
        {
                var varasc=asContents.charCodeAt(i);
                if(varasc>127)
                {
                        chrcode=AnsiToUnicode((varasc<<8)+asContents.charCodeAt(++i));
                }
                else
                {
                        chrcode=varasc;
                }
                temp+=String.fromCharCode(chrcode);
        }
        return temp;
}

   var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  //将Ansi编码的字符串进行Base64编码
   function encode64(input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      do {
                 chr1 = input.charCodeAt(i++);
         chr2 = input.charCodeAt(i++);
         chr3 = input.charCodeAt(i++);

         enc1 = chr1 >> 2;
         enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
         enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
         enc4 = chr3 & 63;

         if (isNaN(chr2)) {
            enc3 = enc4 = 64;
         } else if (isNaN(chr3)) {
            enc4 = 64;
         }

         output = output +
            keyStr.charAt(enc1) +
            keyStr.charAt(enc2) +
            keyStr.charAt(enc3) +
            keyStr.charAt(enc4);
         chr1 = chr2 = chr3 = "";
         enc1 = enc2 = enc3 = enc4 = "";
      } while (i < input.length);

      return output;
   }

  //将Base64编码字符串转换成Ansi编码的字符串
   function decode64(input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

          if(input.length%4!=0)
          {
                    return "";
          }
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
          if (base64test.exec(input))
          {
                    return "";
          }

      do {
         enc1 = keyStr.indexOf(input.charAt(i++));
         enc2 = keyStr.indexOf(input.charAt(i++));
         enc3 = keyStr.indexOf(input.charAt(i++));
         enc4 = keyStr.indexOf(input.charAt(i++));

         chr1 = (enc1 << 2) | (enc2 >> 4);
         chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
         chr3 = ((enc3 & 3) << 6) | enc4;

                 output = output + String.fromCharCode(chr1);

         if (enc3 != 64) {
                        output+=String.fromCharCode(chr2);
         }
         if (enc4 != 64) {
                        output+=String.fromCharCode(chr3);
         }

         chr1 = chr2 = chr3 = "";
         enc1 = enc2 = enc3 = enc4 = "";

      } while (i < input.length);

      return output;
   }

//迅雷、快车、旋风URL加密方法
function Encryption() {
	var str=input.value.replace(/ +$/g,"");
	if (str.search(/^thunder|^flashget/i)==-1) {
		var thunder="AA"+str+"ZZ";
		thunder="thunder://"+encode64(strUnicode2Ansi(thunder));
		var flashget="[FLASHGET]"+str+"[FLASHGET]";
		flashget="flashget://"+encode64(strUnicode2Ansi(flashget))+"&abc";
		var xuanfeng="qqdl://"+encode64(strUnicode2Ansi(str));
		re.innerHTML="<div style='word-break:break-all;margin-left:18px;'><p style='font-weight:bold'>Thunder：</p><p align='left' id='rethunder'><a href="+thunder+">"+thunder+"<\/a></p><br/><p style='font-weight:bold;'>FlashGet：</p><p align='left' id='reflashget'><a href="+flashget+">"+flashget+"<\/a></p><br/><p style='font-weight:bold;'>QQDL：</p><p align='left' id='reppdl'><a href="+xuanfeng+">"+xuanfeng+"<\/a></p></div> ";
	}
}
//迅雷、快车、旋风URL解密方法
function Decryption() {
	var str=input.value.replace(/ +$|\/$/g,"").replace("Flashget://","flashget://");
	if (str.search(/^thunder/i)!=-1) {
		str=str.replace("thunder://","");
		str=strAnsi2Unicode(decode64(str)).replace(/^AA|ZZ$/gi,"");
		re.innerHTML="<div style='word-break:break-all;margin-left:18px;'><p style='font-weight:bold'>HTTP：</p><p align='left' id='rethunder'><a href="+str+">"+str+"<\/a></p></div>";
	}
	else if (str.search(/^flashget/i)!=-1) {
		str=str.replace("flashget://","");
		str=str.replace(/&.*$/,"");
		str=strAnsi2Unicode(decode64(str)).replace(/^\[FLASHGET\]|\[FLASHGET\]$/gi,"");
		re.innerHTML="<div style='word-break:break-all;margin-left:18px;'><p style='font-weight:bold'>HTTP：</><p align='left' id='reflashget'><a href="+str+">"+str+"<\/a></p></div>";
	}	else if (str.search(/^qqdl/i)!=-1) {
		str=str.replace("qqdl://","");
		str=strAnsi2Unicode(decode64(str));
		re.innerHTML="<div style='word-break:break-all;margin-left:18px;'><p style='font-weight:bold'>HTTP：</p><span align='left' id='reppdl'><a href="+str+">"+str+"<\/a></p></div>";
	}
	else re.innerHTML="<div align='center'><span style='color:#F00'>地址格式不正确，请重新输入~</div>";
}
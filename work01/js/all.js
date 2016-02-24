/*
 * 提供base层级接口，实现跨浏览器兼容和扩展原生接口
 * email:gmaso1987@163.com.
 * Created by kevin on 2015/11/22.
 * Last changed 2015/12/09.
 */



// 创建全局命名空间变量
var GLOBAL={
  //  提供定义命名空间的方法
  namespace:function(str){
    var arr=str.split("."),o=GLOBAL;
    for(var i=(arr[0]=="GLOBAL") ? 1 :0; i<arr.length; i++){
      o[arr[i]]=o[arr[i]] || {};
      o=o[arr[i]];
    }
  }
};



/**
 * GLOBAL.Dom命名空间，用来操作DOM，包括获取DOM节点和设置DOM属性
 * 2015/11/22
 */
GLOBAL.namespace("Dom");


GLOBAL.Dom={
  // getNextNode方法，获取下一个节点
  getNextNode:function(node){
    node=typeof node=="string" ? document.getElementById(node) : node;
    var nextNode=node.nextSibling;
    if(!nextNode) return null;
    if(!document.all){
      while(true){
        if(nextNode.nodeType==1){
          break;
        } else {}
        if(nextNode.nextSibling){
          nextNode=nextNode.nextSibling;
        } else {
          break;
        }
      }
    }
  },

  // setOpacity方法，实现跨浏览器设置透明度
  setOpacity:function(node, level){
    node=typeof node=="string" ? document.getElementById(node) : node;
    if(document.all){
      node.style.filter='alpha(opacity=' + level + ')';
    } else {
      node.style.opacity=level / 100;
    }
  },

  // get方法，获取节点
  get:function(node){
    node=typeof node=="string" ? document.getElementById(node) : node;
    return node;
  },

  // getElementsByClassName方法，通过类名获取节点
  getElementsByClassName:function(str,root,tag){
    if(root){
      root=typeof root=="string" ? document.getElementById(root) : root;
    } else {
      root=document;
    }
    var arr=[];
    tag=tag || "*";
    if(document.getElementsByClassName){
      var els=root.getElementsByClassName(str);
      if(tag=="*"){
        arr=els;
      } else {
        for(var i=0,j=els.length;i<j;i++){
          if(els[i].tagName===tag.toUpperCase()){
            arr.push(els[i]);
          }
        }
      }
    } else {
      var els=root.getElementsByTagName(tag);
      for(var f=0,g=str.split(" "),h=g.length;f<h;f++){
        for(var i=0,n=els.length;i<n;i++){
          for(var j=0,k=els[i].className.split(" "),l=k.length;j<l;j++){
            if(k[j]==g[f]){
              arr.push(els[i]);
              break;
            }
          }
        }
        if(f<h-1){els=arr,arr=[];}
      }
    }
    return arr;
  },

  // hasClass方法，为节点添加类名
  hasClass:function(node,cls){
    return node.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  },

  // addClass方法，为节点添加类名
  addClass:function(node,cls){
    // if(!new RegExp("(^|\\s+)"+cls).test(node.className)){
    //   node.className=node.className + " " +cls;
    // } else {
    //   node.className=cls;
    // }
  if (!this.hasClass(node, cls)) node.className += " " + cls;
  },

  // delClass方法，删除节点的指定类名
  delClass:function(node,cls){
    if (this.hasClass(node, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      node.className = node.className.replace(reg, ' ');
    }
  },

  // getXY方法，获取节点相对于页面左上角的左边
  getXY:function(node){
    var pos = {"top":0, "left":0};
      if (node.offsetParent){
       while (node.offsetParent){
         pos.top += node.offsetTop;
         pos.left += node.offsetLeft;
         node = node.offsetParent;
       }
      }else if(node.x){
       pos.left += node.x;
      }else if(node.x){
       pos.top += node.y;
      }
    return pos;
  }
};



/**
 * GLOBAL.Event命名空间，用来操作事件，包括访问event对象的属性和设置事件监听等
 * 2015/11/22
 */
GLOBAL.namespace("Event");


GLOBAL.Event={
  // getEvent函数，实现跨浏览器获取event对象
  getEvent:function(e){
    e=window.event || e;
  },

  // getTarget函数，实现跨浏览器获取event对象目标
  getTarget:function(e){
    e=window.event || e;
    return e.target || e.srcElement;
  },

  // addListerner函数，用于跨浏览器设置事件监听
  addListener:function(node,eventType,handler,scope){
    // scope用于显式地指定this指针指向
    node=typeof node=="string" ? document.getElementById(node) : node;
    scope=scope || node;
    if(node.addEventListener){
      // 使用匿名函数调整this指向
      node.addEventListener(eventType,function(){handler.apply(scope,arguments);},false);
    } else if(node.attachEvent) {
      node.attachEvent("on"+eventType,function(){handler.apply(scope,arguments);});
    } else {
      node["on"+eventType] = handler;
    }
  },

  // removeListener函数，用于跨浏览器移除事件监听
  removeListener:function(node,eventType,handler,scope){
    // scope用于显式地指定this指针指向
    node=typeof node=="string" ? document.getElementById(node) : node;
    scope=scope || node;
    if(node.removeEventListener){
      // 使用匿名函数调整this指向
      node.removeEventListener(eventType,function(){handler.apply(scope,arguments);},false);
    } else if(node.detachEvent) {
      node.detachEvent("on"+eventType,function(){handler.apply(scope,arguments);});
    } else {
      node["on"+eventType] = null;
    }
  },

  // preventDefault函数，阻止默认行为
  preventDefault:function(event){
    if(event.preventDefault){
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  },

  // stopPropagation函数，实现跨浏览器阻止冒泡
  stopPropagation:function(e){
    e=window.event || e;
    if(e.stopPropagation){
      e.stopPropagation();
    } else {
      e.cancelBubble=true;
    }
  }
};


/**
 * GLOBAL.Lang命名空间，用来模仿其他语言提供原生JavaScript不提供的函数
 * 2015/11/22
 */
GLOBAL.namespace("Lang");


GLOBAL.Lang={
  // trim方法，去除
  trim:function(ostr){
    return ostr.replace(/^\s+|\s+$/g,"");
  },

  isNumber:function(s){
    return !isNan(s);
  }
};

/**
 *  完.
 */



/**
 * 提供common层级常用组件，包括cookie、ajax等
 * email:gmaso1987@163.com.
 * Created by kevin on 2015/11/22.
 * Last changed 2015/12/09.
 */

// hideElement方法，隐藏元素
GLOBAL.hideElement=function(str){
  var e=GLOBAL.Dom.get(str);
  GLOBAL.Dom.addClass(e,"none");
  e.style.display="none";
}

// showElement方法，显示元素
GLOBAL.showElement=function(str){
  var e=GLOBAL.Dom.get(str);
  GLOBAL.Dom.delClass(e,"none");
  e.style.display="";

}

// 编码URL传递的信息
GLOBAL.addURLParam=function(url,name,value){
  return url + ((url.indexOf("?") == -1) ? "?" : "&") + encodeURIComponent(name) + "=" + encodeURIComponent(value);
}

// each方法，遍历传入元素的子元素执行回调函数
GLOBAL.each=function(_objects,_fn){
  for(var i=0,len=_objects.length;i<len;i++){
    _fn(_objects[i],i);
  }
}

// chooseItem方法，单击时选中传入元素的一个子元素并设置监听事件
GLOBAL.chooseItem=function(_objects,tag,handler){
  var _items = _objects.getElementsByTagName(tag);
  GLOBAL.each(_items,function(_item,i){
    _item.onclick=function(){
      GLOBAL.each(_items,function(_item,i){
        GLOBAL.Dom.delClass(_item,"z-crt");
      });
      GLOBAL.Dom.addClass(_items[i],"z-crt");
      handler();
    }
  });
}


/**
 * GLOBAL.Cookie命名空间，用来操作Cookie，包括读取、设置和删除
 * 2015/11/22
 */
GLOBAL.namespace("Cookie");


GLOBAL.Cookie={
  // 读取
  read : function(n){
    var m = document.cookie.match(new RegExp("(^|)"+n+"=([^;]*)(;|$)"));
        return !m ? "":unescape(m[2]);
  },

  // 设置
  set : function(name,value,expires){
    var expDays=expires*24*60*60*1000;
    var expDate=new Date();
    expDate.setTime(expDate.getTime()+expDays);
    var expString=expires ? "; expires="+expDate.toGMTString() : "";
    var pathString=";path=/";
    document.cookie=name + "="+escape(value) + expString + pathString;
  },

  // 删除
  del : function(name){
    var exp=new Date(new Date().getTime()-1);
    var s=this.read(name);
    if(s!=null){
      document.cookie=name+"=;expires="+exp.toGMTString()+";path=/";
    }
  },

  // 删除所有cookie
  clear:function(){
    var rs = document.cookie.match(new RegExp("([^ ;][^;]*)(?=(=[^;]*)(;|$))", "gi"));

    for (var i in rs){
      document.cookie = rs[i] + "=;expires=Mon, 26 Jul 1997 05:00:00 GMT; path=/; " ;
    }
  }
};




/**
 * GLOBAL.ajax命名空间
 * 2015/11/26
 */
GLOBAL.namespace("Ajax");


GLOBAL.Ajax={

  // 根据传入参数异步获取数据并执行回调函数
  getXHR:function(url,async,handler){
    var _xhr = new XMLHttpRequest();
    var _async = async || true;
    var _handler = handler || function(){};
    var _url = GLOBAL.addURLParam(url,"rand",Math.random());
    _xhr.onreadystatechange=function(){
      if(_xhr.readyState==4){
        if ((_xhr.status >= 200 && _xhr.status < 300) || _xhr.status ==304){
          // console.log(_xhr.responseText);
          _handler(_xhr.responseText);
        } else {
          console.log("Request was unsucessful: " + _xhr.status);
        }
      }
    };
    _xhr.open("get",_url,_async);
    _xhr.send(null);
  }
};


/**
 * 完.
 */



/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;   /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = "";  /* base-64 pad character. "=" for strict RFC compliance   */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s)    { return rstr2hex(rstr_md5(str2rstr_utf8(s))); }
function b64_md5(s)    { return rstr2b64(rstr_md5(str2rstr_utf8(s))); }
function any_md5(s, e) { return rstr2any(rstr_md5(str2rstr_utf8(s)), e); }
function hex_hmac_md5(k, d)
  { return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
function b64_hmac_md5(k, d)
  { return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
function any_hmac_md5(k, d, e)
  { return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of a raw string
 */
function rstr_md5(s)
{
  return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
}

/*
 * Calculate the HMAC-MD5, of a key and some data (raw strings)
 */
function rstr_hmac_md5(key, data)
{
  var bkey = rstr2binl(key);
  if(bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
  return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
}

/*
 * Convert a raw string to a hex string
 */
function rstr2hex(input)
{
  try { hexcase } catch(e) { hexcase=0; }
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var output = "";
  var x;
  for(var i = 0; i < input.length; i++)
  {
    x = input.charCodeAt(i);
    output += hex_tab.charAt((x >>> 4) & 0x0F)
           +  hex_tab.charAt( x        & 0x0F);
  }
  return output;
}

/*
 * Convert a raw string to a base-64 string
 */
function rstr2b64(input)
{
  try { b64pad } catch(e) { b64pad=''; }
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var output = "";
  var len = input.length;
  for(var i = 0; i < len; i += 3)
  {
    var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > input.length * 8) output += b64pad;
      else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
    }
  }
  return output;
}

/*
 * Convert a raw string to an arbitrary string encoding
 */
function rstr2any(input, encoding)
{
  var divisor = encoding.length;
  var i, j, q, x, quotient;

  /* Convert to an array of 16-bit big-endian values, forming the dividend */
  var dividend = Array(Math.ceil(input.length / 2));
  for(i = 0; i < dividend.length; i++)
  {
    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
  }

  /*
   * Repeatedly perform a long division. The binary array forms the dividend,
   * the length of the encoding is the divisor. Once computed, the quotient
   * forms the dividend for the next step. All remainders are stored for later
   * use.
   */
  var full_length = Math.ceil(input.length * 8 /
                                    (Math.log(encoding.length) / Math.log(2)));
  var remainders = Array(full_length);
  for(j = 0; j < full_length; j++)
  {
    quotient = Array();
    x = 0;
    for(i = 0; i < dividend.length; i++)
    {
      x = (x << 16) + dividend[i];
      q = Math.floor(x / divisor);
      x -= q * divisor;
      if(quotient.length > 0 || q > 0)
        quotient[quotient.length] = q;
    }
    remainders[j] = x;
    dividend = quotient;
  }

  /* Convert the remainders to the output string */
  var output = "";
  for(i = remainders.length - 1; i >= 0; i--)
    output += encoding.charAt(remainders[i]);

  return output;
}

/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input)
{
  var output = "";
  var i = -1;
  var x, y;

  while(++i < input.length)
  {
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
    {
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i++;
    }

    /* Encode output as utf-8 */
    if(x <= 0x7F)
      output += String.fromCharCode(x);
    else if(x <= 0x7FF)
      output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0xFFFF)
      output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0x1FFFFF)
      output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                    0x80 | ((x >>> 12) & 0x3F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
  }
  return output;
}

/*
 * Encode a string as utf-16
 */
function str2rstr_utf16le(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                  (input.charCodeAt(i) >>> 8) & 0xFF);
  return output;
}

function str2rstr_utf16be(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                   input.charCodeAt(i)        & 0xFF);
  return output;
}

/*
 * Convert a raw string to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binl(input)
{
  var output = Array(input.length >> 2);
  for(var i = 0; i < output.length; i++)
    output[i] = 0;
  for(var i = 0; i < input.length * 8; i += 8)
    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
  return output;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2rstr(input)
{
  var output = "";
  for(var i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
  return output;
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */
function binl_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);
}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}



/**
 * 页面交互
 * email:gmaso1987@163.com.
 * Created by kevin on 2015/11/22.
 * Last changed 2015/12/09.
 */

// 用于数据交换的全局变量
GLOBAL.namespace("P");
// 课程排行当前页面序号
GLOBAL.P.pageNo=1;
// 课程排行总页数
GLOBAL.P.totalPage=10;
// 热门排行课程数据
GLOBAL.P.hot={};
// 热门排行显示项第一项序号
GLOBAL.P.hotIndex=0;



// 页面总体调用函数
window.onload=function(){
  gInfo();
  gHd();
  gBanner();
  hotCourse();
  gCourse();
  showVideo();
}



// 提示栏交互效果
function gInfo(){
  var btnInfo=GLOBAL.Dom.getElementsByClassName("j-close")[0],
      info=GLOBAL.Dom.getElementsByClassName("g-info")[0];
  if(GLOBAL.Cookie.read("info")){
    GLOBAL.hideElement(info);
  } else {
    GLOBAL.Event.addListener(btnInfo,"click",function(){GLOBAL.hideElement(info);GLOBAL.Cookie.set("info","yes");});
  }
}



// 登录及关注
function gHd(){
  var logNo=GLOBAL.Dom.getElementsByClassName("logout")[0],
      logYes=GLOBAL.Dom.getElementsByClassName("login")[0],
      logWin=GLOBAL.Dom.getElementsByClassName("g-logWin")[0],
      btnLog=GLOBAL.Dom.getElementsByClassName("j-close")[1],
      userName=document.getElementById("j-userName"),
      password=document.getElementById("j-password"),
      btnSubmit=GLOBAL.Dom.getElementsByClassName("btnSubmit")[0],
      logForm=document.forms[0];
  if(GLOBAL.Cookie.read("loginSuc")){
    GLOBAL.hideElement(logNo);
    GLOBAL.showElement(logYes);
  } else {
    GLOBAL.hideElement(logYes);
  }
  GLOBAL.Event.addListener(logNo,"click",gLog);
  GLOBAL.Event.addListener(logYes.lastElementChild,"click",function(){GLOBAL.showElement(logNo);GLOBAL.hideElement(logYes);GLOBAL.Cookie.del("loginSuc");});

  // 登录弹窗交互
  function gLog(){
    GLOBAL.showElement(logWin);
    GLOBAL.Event.addListener(btnLog,"click",function(){GLOBAL.hideElement(logWin);});
    GLOBAL.Event.addListener(userName,"focus",function(){GLOBAL.hideElement(userName.nextElementSibling);});
    GLOBAL.Event.addListener(password,"focus",function(){GLOBAL.hideElement(password.nextElementSibling);});
    GLOBAL.Event.addListener(userName,"blur",function(){if(userName.value!=""){GLOBAL.hideElement(userName.nextElementSibling);} else {GLOBAL.showElement(userName.nextElementSibling);}});
    GLOBAL.Event.addListener(password,"blur",function(){if(password.value!=""){GLOBAL.hideElement(password.nextElementSibling);} else {GLOBAL.showElement(password.nextElementSibling);}});
    GLOBAL.Event.addListener(logForm,"submit",log);

  }


  // 提交用户数据到服务器
  function log(){
    var userName=document.getElementById("j-userName"),
        password=document.getElementById("j-password"),
        _url=GLOBAL.addURLParam("http://study.163.com/webDev/login.htm","userName",hex_md5(userName.value));
    _url=GLOBAL.addURLParam(_url,"password",hex_md5(password.value));
    GLOBAL.Ajax.getXHR(_url,"false",follow);
  }

  // 根据服务器返回数据设置登录框和关注状态
  function follow(a){
    if(a==1){
      GLOBAL.Cookie.set("loginSuc","yes");
      GLOBAL.hideElement(logWin);
      GLOBAL.hideElement(logNo);
      GLOBAL.showElement(logYes);
      GLOBAL.Ajax.getXHR("http://study.163.com/webDev/attention.htm","true",function(){GLOBAL.Cookie.set("followSuc","yes");});
    } else {
      logForm.lastElementChild.innerHTML="失败，重新登录";
    }
  }
}



// 幻灯片循环播放及鼠标点击切换
function gBanner(){
  var eBanner = setInterval(banner,5000);
  GLOBAL.Event.addListener(GLOBAL.Dom.getElementsByClassName('m-slide')[0],"mouseover",function(a){clearInterval(eBanner)});
  GLOBAL.Event.addListener(GLOBAL.Dom.getElementsByClassName('m-slide')[0],"mouseout",function(a){eBanner=setInterval(banner,5000);});
  slide(GLOBAL.Dom.getElementsByClassName('m-slide')[0]);

  // 幻灯片点击切换效果
  function slide(_slide){
    var _ctrls = _slide.getElementsByTagName('i'),
        _lists = _slide.getElementsByTagName('li');
    GLOBAL.each(_ctrls,function(_ctrl,i){
      _ctrl.onclick=function(){
        GLOBAL.each(_lists,function(_list,i){
          GLOBAL.Dom.delClass(_list,"z-crt");
        });
        GLOBAL.each(_ctrls,function(_ctrl,i){
          GLOBAL.Dom.delClass(_ctrl,"z-crt");
        });
        GLOBAL.Dom.addClass(_lists[i],"z-crt");
        GLOBAL.Dom.addClass(_ctrls[i],"z-crt");
      }
    });
  }

  // 幻灯片滚动切换下一张效果
  function next(parentNode,tag){
    var els = GLOBAL.Dom.getElementsByClassName("z-crt",parentNode,tag)[0];
    GLOBAL.Dom.delClass(els,"z-crt");
    if(els.nextElementSibling){
      GLOBAL.Dom.addClass(els.nextElementSibling,"z-crt");
    } else {
      GLOBAL.Dom.addClass(parentNode.getElementsByTagName(tag)[0],"z-crt");
    }
  }

  // 封装幻灯片及指示器切换
  function banner(){
    var els = GLOBAL.Dom.getElementsByClassName('m-slide')[0];
    next(els.getElementsByTagName("ol")[0],"li");
    next(els.getElementsByTagName("span")[0],"i");
  }
}



// 课程获取及切换
function gCourse(){
  GLOBAL.P.step=8;
  changeCourseType();
  getCourses();

  // 获取课程数据
  function getCourses(){
    var psize,ptype,
        btnType=GLOBAL.Dom.getElementsByClassName("btnType");
    if(GLOBAL.Dom.hasClass(btnType[0],"z-crt")){ptype=10;} else if(GLOBAL.Dom.hasClass(btnType[1],"z-crt")){ptype=20;}
    if(GLOBAL.Dom.getElementsByClassName("courbd")[0].offsetWidth>800){
      psize=20;
    } else {
      psize=15;
    }
    var mPage=GLOBAL.Dom.getElementsByClassName("m-page")[0].getElementsByTagName("a");
    for(var i=1,len=mPage.length-1;i<len;i++){
      if(GLOBAL.Dom.hasClass(mPage[i],"z-crt")){GLOBAL.P.pageNo=parseInt(mPage[i].innerHTML);}
    }
    var url = "http://study.163.com/webDev/couresByCategory.htm";
    url=GLOBAL.addURLParam(url,"pageNo",GLOBAL.P.pageNo);
    url=GLOBAL.addURLParam(url,"psize",psize);
    url=GLOBAL.addURLParam(url,"type",ptype);
    GLOBAL.Ajax.getXHR(url,"yes",fillCourses);
  }

  // 填充课程数据
  function fillCourses(data){
    var courseList = JSON.parse(data),
        listElement = document.getElementById("courList");
    GLOBAL.P.totalPage = courseList.totalPage;
    listElement.innerHTML = "";
    for(var i=0;i<courseList.list.length;i++){
      var oLi = document.createElement("li");
      listElement.appendChild(oLi);

      var _img = document.createElement("img"),
          _name = document.createElement("h5"),
          _provider = document.createElement("p"),
          _learnerCount = document.createElement("p"),
          _price = document.createElement("p"),
          _category = document.createElement("p"),
          _descrip = document.createElement("p");

      _img.setAttribute("src", courseList.list[i].middlePhotoUrl);
      _name.innerHTML=courseList.list[i].name;
      _provider.innerHTML=courseList.list[i].provider;
      _learnerCount.innerHTML=courseList.list[i].learnerCount;
      _price.innerHTML="&yen;"+courseList.list[i].price;
      _category.innerHTML=courseList.list[i].categoryName;
      _descrip.innerHTML=courseList.list[i].description;

      oLi.appendChild(_img);
      oLi.appendChild(_name);
      oLi.appendChild(_provider);
      oLi.appendChild(_learnerCount);
      oLi.appendChild(_price);
      oLi.appendChild(_category);
      oLi.appendChild(_descrip);

      oLi.setAttribute("class", "m-course");
      _img.setAttribute("class", "cor-img");
      _name.setAttribute("class", "cor-tit");
      _provider.setAttribute("class", "cor-prov");
      _learnerCount.setAttribute("class", "cor-num");
      _price.setAttribute("class", "cor-pric");
      _category.setAttribute("class", "cor-category hidden");
      _descrip.setAttribute("class", "cor-descrip hidden");
    }
    fillPage();
    showDetail();
  }

  // 填充课程列表翻页器
  function fillPage(){
    var screenIndex = Math.ceil(GLOBAL.P.pageNo/GLOBAL.P.step),
        pageStart = (screenIndex-1)*GLOBAL.P.step+1,
        index = (GLOBAL.P.step*screenIndex>GLOBAL.P.totalPage) ? (GLOBAL.P.totalPage-GLOBAL.P.step*(screenIndex-1)) : GLOBAL.P.step,
        pNode=GLOBAL.Dom.getElementsByClassName("m-page")[0];
    pNode.innerHTML = "";
    var oprv = document.createElement("a");
    oprv.innerHTML="&lt;";
    pNode.appendChild(oprv);
    oprv.setAttribute("class", "pageprv");
    for(var i=0;i<index;i++){
      var o = document.createElement("a");
      pNode.appendChild(o);
      o.innerHTML=pageStart+i;
      o.setAttribute("href", "####");
      if(i==GLOBAL.P.pageNo-pageStart){
        o.setAttribute("class", "z-crt");
      }
    }
    var onext = document.createElement("a");
    onext.innerHTML="&gt;";
    pNode.appendChild(onext);
    onext.setAttribute("class", "pagenxt");
    GLOBAL.chooseItem(GLOBAL.Dom.getElementsByClassName("m-page")[0],"a",getCourses);
    changeScreen();
  }

  // 添加翻页器事件
  function changeScreen(){
    var pageprv=GLOBAL.Dom.getElementsByClassName("pageprv")[0];
    GLOBAL.Event.removeListener(pageprv,"click",getCourses);
    GLOBAL.Event.addListener(pageprv,"click",prvScreen);
    var pagenxt=GLOBAL.Dom.getElementsByClassName("pagenxt")[0];
    GLOBAL.Event.removeListener(pagenxt,"click",getCourses);
    GLOBAL.Event.addListener(pagenxt,"click",nextScreen);
  }

  // 添加选择课程类型切换事件
  function changeCourseType(){
    var btnType=GLOBAL.Dom.getElementsByClassName("courType")[0];
    GLOBAL.chooseItem(btnType,"h3",function(){GLOBAL.P.pageNo=1;fillPage();getCourses();});
  }

  // 切换翻页器上一屏
  function prvScreen(){
    if(GLOBAL.P.pageNo>GLOBAL.P.step){
      GLOBAL.P.pageNo = (Math.ceil(GLOBAL.P.pageNo/GLOBAL.P.step)-1)*GLOBAL.P.step;
      fillPage();
      getCourses();
    }
  }

  // 切换翻页器下一屏
  function nextScreen(){
    if(Math.ceil(GLOBAL.P.pageNo/GLOBAL.P.step)*GLOBAL.P.step<GLOBAL.P.totalPage){
      GLOBAL.P.pageNo = Math.ceil(GLOBAL.P.pageNo/GLOBAL.P.step)*GLOBAL.P.step+1;
      fillPage();
      getCourses();
    }
  }

  // 课程介绍弹窗
  function showDetail(){
    var _courses=document.getElementsByClassName("m-course"),
          _detail = GLOBAL.Dom.getElementsByClassName("detailLayer")[0];

    GLOBAL.each(_courses,function(_item){
      _item.onmouseover=Detail;
    });
    _detail.onmouseout=function(){GLOBAL.hideElement(_detail);};

    function Detail(event){
      var _target = event || window.event,
          _img = GLOBAL.Dom.getElementsByClassName("cor-img",_detail)[0],
          _title = GLOBAL.Dom.getElementsByClassName("cor-tit",_detail)[0],
          _number = GLOBAL.Dom.getElementsByClassName("cor-num",_detail)[0],
          _provider = GLOBAL.Dom.getElementsByClassName("cor-prov",_detail)[0],
          _category = GLOBAL.Dom.getElementsByClassName("cor-category",_detail)[0],
          _description = GLOBAL.Dom.getElementsByClassName("cor-descrip",_detail)[0],
          _els;
      _target = _target.target || _target.srcElement;
      if(!GLOBAL.Dom.hasClass(_target,"m-course")){_target=_target.parentNode;}
      _els=_target.getElementsByTagName("*");
      // console.log(_els);
      _img.setAttribute("src",_els[0].getAttribute("src"));
      _title.innerHTML = _els[1].innerHTML;
      _number.innerHTML = _els[3].innerHTML + "人在学";
      _provider.innerHTML = "发布者：" + _els[2].innerHTML;
      _category.innerHTML = "分类：" + _els[5].innerHTML;
      _description.innerHTML = _els[6].innerHTML;
      _detail.style.left = parseInt(GLOBAL.Dom.getXY(_target).left)-10+"px";
      _detail.style.top = parseInt(GLOBAL.Dom.getXY(_target).top)-10+"px";
      // console.log(_target,_category,_description);
      GLOBAL.showElement(_detail);
    }
  }
}



// 视频窗口弹出
function showVideo(){
  var showVideo=GLOBAL.Dom.getElementsByClassName("j-showVideo")[0],
      videoWin=GLOBAL.Dom.getElementsByClassName("g-showVideo")[0],
      btnVideo=GLOBAL.Dom.getElementsByClassName("j-close")[2];
  GLOBAL.Event.addListener(showVideo,"click",function(){GLOBAL.showElement(videoWin);});
  GLOBAL.Event.addListener(btnVideo,"click",function(){GLOBAL.hideElement(videoWin);});
}



// 热门课程排行
function hotCourse(){
  var _url = "http://study.163.com/webDev/hotcouresByCategory.htm";
  GLOBAL.Ajax.getXHR(_url,"yes",fillHotCourses);

  // 滚动填充热门排行数据
  function fillHotCourses(data){
    GLOBAL.P.hot= JSON.parse(data);
    var eHot = setInterval(fill,5000);
  }

  // 填充热门排行数据
  function fill(){
    var listElement = document.getElementById("hotCour");
    listElement.innerHTML = "";
    var hotIndex;
    for(var i=0;i<10;i++){
      hotIndex = GLOBAL.P.hotIndex + i;
      if(hotIndex>=GLOBAL.P.hot.length){hotIndex -= GLOBAL.P.hot.length;}
      var oLi = document.createElement("li");
      listElement.appendChild(oLi);

      var _img = document.createElement("img"),
          _name = document.createElement("h5"),
          _learnerCount = document.createElement("p");

      _img.setAttribute("src", GLOBAL.P.hot[hotIndex].smallPhotoUrl);
      _name.innerHTML=GLOBAL.P.hot[hotIndex].name;
      _learnerCount.innerHTML=GLOBAL.P.hot[hotIndex].learnerCount;

      oLi.appendChild(_img);
      oLi.appendChild(_name);
      oLi.appendChild(_learnerCount);

      oLi.setAttribute("class", "m-hotCourse");
    }
    GLOBAL.P.hotIndex++;
    if(GLOBAL.P.hotIndex>=GLOBAL.P.hot.length){GLOBAL.P.hotIndex -= GLOBAL.P.hot.length;}
  }
}

/**
 * 完.
 */
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

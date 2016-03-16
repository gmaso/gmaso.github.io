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
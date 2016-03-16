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
      o.setAttribute("href", "javascript:;");
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
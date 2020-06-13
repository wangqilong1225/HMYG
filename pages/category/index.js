import {request} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime"

Page({
  data:{
    leftMenuList:[],
    rightContent:[],
    currentIndex:0,
    scrollTop:0
  },

  Cates:[],

  onLoad:function(options){
    /*
      0. web中的本地缓存和小程序缓存区别
        a:代码写法区别
         web: localStorage.setItem("Key","value"); localStorage.getItem("key");
         小程序: wx.setStorageSync("Key","value");  wx.getStorageSync("key");
        b:存储时
         web: 不管存入的是什么类型的数据，最终都会先调用toString()方法，把数据变成字符串，再存入内存
         小程序： 不存在类型转换

      1.先判断一下本地存储中有没有旧的数据
        {time:Date.now(),data:[...]}
      2.没有旧数据，直接发送新请求
      3.有旧数据，同时旧数据没有过期，就使用本地存储中的旧数据
    */

    //1.获取本地储存的数据
    const Cates=wx.getStorageSync("cates");
    //2.判断
    if(!Cates){
      //不存在 新请求数据
      this.getCates();
    }else{
      //有旧数据，定义过期时间 5min 
      if(Date.now()-Cates.time>1000*60*5){
        this.getCates();
      }else{
        //console.log("获取缓存数据了...");
        this.Cates=Cates.data;
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        let rightContent=this.Cates[0].children;

        this.setData({
          leftMenuList,
          rightContent
        });
      }
    }

   
  },

  //获取分类数据
  async getCates(){
    // request({url:'/categories'})
    // .then(result=>{
    //   this.Cates=result.data.message;

    //   //把接口的数据存入到本地存储中
    //   wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});

    //   //构造左侧大菜单数据
    //   let leftMenuList=this.Cates.map(v=>v.cat_name);

    //   //构造右侧的商品数据
    //   let rightContent=this.Cates[0].children;

    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   });
    // })

    // 1. 使用es7的async await 来发送请求
    const res=await request({url:"/categories"});

    this.Cates=res;

    //把接口的数据存入到本地存储中
    wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});

    //构造左侧大菜单数据
    let leftMenuList=this.Cates.map(v=>v.cat_name);

    //构造右侧的商品数据
    let rightContent=this.Cates[0].children;

    this.setData({
      leftMenuList,
      rightContent
    });


  },

  //左侧菜单点击事件
  handleItemTap(e){
    //console.log(e)
    const index=e.currentTarget.dataset.index;
    let rightContent=this.Cates[index].children;

    this.setData({
      currentIndex:index,
      rightContent:rightContent,
      //重新设置 右侧内容的scroll-view标签的距离顶部的距离
      scrollTop:0
    });

    
  }
})
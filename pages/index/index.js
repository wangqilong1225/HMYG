import {request} from "../../request/index.js"

Page({
  data:{
    swiperList:[],
    catesList:[],
    floorList:[]
  },
  onLoad:function(options){
    // var reqTask = wx.request({
    //   //url: 'http://localhost:8084/WXTest/Swiperdata',
    //   url:'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   header: {'content-type':'application/json'},

    //   success: (result) => {
    //     //console.log(result)
    //     this.setData({
    //       swiperList:result.data.message
    //     });
        
    //   }
    // });
      
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },

  //获取轮播图
  getSwiperList(){
    request({url:'/home/swiperdata'})
    .then(result=>{
      this.setData({
        swiperList:result
      });
    })
  },

   //获取分类导航
   getCatesList(){
    request({url:'/home/catitems'})
    .then(result=>{
      this.setData({
        catesList:result
      });
    })
  },

  //获取楼层数据
  getFloorList(){
    request({url:'/home/floordata'})
     .then(result=>{
       this.setData({
        floorList:result
       });
     });

  }
})
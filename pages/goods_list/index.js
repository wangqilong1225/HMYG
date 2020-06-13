/*
  1. 用户上滑页面 滚动条触底 开始加载下一页数据
    a. 找到滚动条触底事件
    b.判断还有没有下一页数据
      1.获取总页数
        总页数=Math.ceil(总条数 / 页容量)
      2.获取当前页码
      3.判断下 当前的页码是否大于等于 总页数
    c.假如没有下一页数据 弹出一个提示
    d.加入有下一页数据，继续加载数据
      1.当前的页面 ++
      2.重新发送请求
      3.数据请求回来 要对data中的数组 进行拼接

  2.下拉刷新页面
    a.触发下拉刷新事件
    b.重置 数据 数组
    c.重置页码 设置为1
    d.重新发送请求
    e.数据请求回来 手动关闭等待效果
*/


import {request} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime"

Page({
  data:{
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }

    ],
    goodsList:[]

  },

  //接口请求参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },

  //总页数
  totalPages:1,

  onLoad: function (options) {
    this.QueryParams.cid=options.cid;
    this.getGoodsList();
  },

  //获取商品事件
  async getGoodsList(){
    const res=await request({url:"/goods/search",data:this.QueryParams});
    //获取总条数
    const total=res.total;
    //计算总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);

    this.setData({
      //数据拼接
      goodsList:[...this.data.goodsList,...res.goods]
    });

    //关闭下拉刷新窗口
    wx.stopPullDownRefresh();
      
  },

  //标题点击事件
  handTapsItemChange(e){
    const index=e.detail.index;
    let tabs=this.data.tabs;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs:tabs
    });
  },

  //页面上滑 滚动条触底事件
  onReachBottom(){
    //console.log("页面触底");
    if(this.QueryParams.pagenum>=this.totalPages){
      //console.log("已经到达最后一页了。");
      wx.showToast({
        title: '没有下一页数据了'
      });
        
    }else{
      //console.log("继续啊");
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  //下拉刷新事件
  onPullDownRefresh(){
    //1.重置数组
    this.setData({
      goodsList:[]
    });
    //2.重置页码
    this.QueryParams.pagenum=1;
    //3.重新发送请求
    this.getGoodsList();
  }
})
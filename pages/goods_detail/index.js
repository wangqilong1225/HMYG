/*
  加入购物车逻辑
  1.先绑定点击事件
  2.获取缓存中的购物车数据 数组格式
  3.先判断 当前商品是否已经存在购物车
  4.已经存在 修改商品 执行数量++ 重新把购物车数据填充到缓存中
  5.不存在购物车中，直接给购物车数组添加一个新元素，带上购买数量属性，填充到缓存中
  6.弹出提示

*/

import {request} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime"

Page({
  data: {
      goodsObj:{}
  },

  onLoad: function (options) {
    const goods_id=options.goods_id;
    this.getGoodsDetail(goods_id);
  },

  //商品对象
  GoodsInfo:{},

  //获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj=await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo=goodsObj;
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      }
    });
  },

  //点击轮播图 放大预览
  handlePrevewImage(e){
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current: current,  // 当前显示图片的http链接
      urls: urls     // 需要预览的图片http链接列表
    });
  },

  //点击加入购物车
  handleCartAdd(){
    // 1.获取缓存中的购物车 数组
    let cart=wx.getStorageSync("cart")||[];
    // 2.判断 商品对象是否存在购物车中
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      //不存在
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      //已经存在购物车
      cart[index].num++;
    }
    // 3.把购物车重新添加到缓存中
    wx.setStorageSync("cart",cart);
    console.log(cart);

    // 4.弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      image: '',
      duration: 1500,
      mask: true
    });
      
  }
 
})
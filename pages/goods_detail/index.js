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
  }
 
})
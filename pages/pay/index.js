/*
  1.页面加载的时候
    1.从缓存中获取购物车数据 渲染到页面中
      这些数据 checked=true

  2.微信支付
    1.哪些人 哪些账号可以支付
    
*/

import { getSetting, chooseAddress, openSetting, showModel, showTost } from "../../utils/asyncWx.js"
import regeneratorRuntime from "../../lib/runtime/runtime"

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    //获取地址信息
    const address = wx.getStorageSync('address');
    //获取购物车信息
    let cart = wx.getStorageSync('cart') || [];

    //过滤checked=true的购物车数据
    cart = cart.filter(v => v.checked);

    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;

    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });

    this.setData({
      address: address,
      cart: cart,
      totalPrice: totalPrice,
      totalNum: totalNum
    });
  }
})
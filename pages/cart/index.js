/*
 1. 获取用户地址
   1.绑定点击事件
   2.调用小程序内置api 获取用户的收货地址

   2.获取用户对小程序所授予获取地址的权限状态 scope
    1.假设 用户第一次点击确定收货地址的提示框 确定 authSettting scope.address
       scope 为 true  直接调用 获取收货地址
    2.假设 用户重来没有调用过 收货地址的api
       scope 为 undefined  直接调用 获取收货地址
    3.假设 用户第一次点击确定收货地址的提示框 取消 authSettting scope.address
       scope 为 false 
       1.诱导用户自己打开授权设置页面 当用户重新给与获取地址的权限的时候
       2.获取地址
    4.把获取的收货地址存入到本地储存中
  
  2.页面加载完毕
    1.获取本地存储中的地址数据
    2.把数据设置给data中的一个变量

  3. onShow
    1.获取缓存中的购物车数据
    2.把购物车数据 填充到data中

*/

import { getSetting, chooseAddress, openSetting } from "../../utils/asyncWx.js"
import regeneratorRuntime from "../../lib/runtime/runtime"

Page({
  data: {
    address: {},
    cart:[]
  },

  onShow() {
    //获取地址信息
    const address = wx.getStorageSync('address');
    //获取购物车信息
    const cart=wx.getStorageSync('cart');

    this.setData({
      address: address,
      cart:cart
    });

  },

  async handleChooseAddress() {
    //获取权限状态
    // wx.getSetting({
    //   success: (result) => {
    //     const scopeAddress = result.authSetting["scope.address"];
    //     if (scopeAddress === true || scopeAddress === undefined) {
    //       wx.chooseAddress({
    //         success: (result) => {
    //           console.log(111)
    //         }
    //       });
    //     } else {
    //       //用户以前拒绝过授予权限
    //       wx.openSetting({
    //         success: (result) => {
    //           wx.chooseAddress({
    //             success: (result) => {
    //               console.log(222)
    //             }
    //           });
    //         }
    //       });

    //     }
    //   }
    // });

    try {
      //1. 获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      //2. 判断权限状态
      if (scopeAddress === false) {
        //3.诱导用户打开权限
        await openSetting();
      }

      //3.调用获取收货地址api
      const address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      wx.setStorageSync("address", address);

    } catch (error) {
      console.log(error);
    }
  }



})
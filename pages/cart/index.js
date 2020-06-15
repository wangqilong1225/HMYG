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

  4.全选的实现 数据展示
    1.onshow 获取缓存中的购物车数组
    2.根据购物车中的商品数据 所有的商品都被选中 checked=true

  5.总价格和总数量
    1.需要商品被选中 才计算
    2.获取购物车数组
    3.遍历商品
    4.判断商品是否被选中
    5.总价格 += 商品的单价 * 商品的数量
    6.总数量 += 商品的数量
    7.把计算后的价格和数量展示

  6.商品的选中
    1.绑定change事件
    2.获取到被修改的商品对象
    3.商品对象的选中状态取反
    4.重新填充回data到缓存中
    5.重新计算全选，总价格，总数量
*/

import { getSetting, chooseAddress, openSetting } from "../../utils/asyncWx.js"
import regeneratorRuntime from "../../lib/runtime/runtime"

Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    //获取地址信息
    const address = wx.getStorageSync('address');
    //获取购物车信息
    const cart = wx.getStorageSync('cart') || [];
    //计算全选
    //const allChecked = cart.length != 0 ? cart.every(v => v.checked) : false;
    let allChecked = true;
    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;

    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });

    allChecked = cart.length != 0 ? allChecked : false;

    this.setData({
      address: address,
      cart: cart,
      allChecked: allChecked,
      totalPrice: totalPrice,
      totalNum: totalNum
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
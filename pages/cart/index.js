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

  7.全选和反选
    1.全选复选框绑定事件 change
    2.获取data中的全选变量 allchecked
    3.直接取反
    4.遍历购物车数组 让里面 商品选中状态跟随 allchecked改变而改变
    5.把购物车数组和allchecked重新设置到data，缓存中

  8.商品数量的编辑
    1.“+”，“-”按钮 绑定到同一个点击事件
    2.传递被点击商品的id
*/

import { getSetting, chooseAddress, openSetting, showModel } from "../../utils/asyncWx.js"
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

    this.setData({
      address: address
    });

    this.setCart(cart);
  },

  //选择地址
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
  },

  //商品的选中
  handeItemChange(e) {
    //获取被修改商品的Id
    const goods_id = e.currentTarget.dataset.id;
    //获取购物车数组
    let { cart } = this.data;
    //找到被修改的商品
    let index = cart.findIndex(v => v.goods_id === goods_id);
    //选中状态取反
    cart[index].checked = !cart[index].checked;

    this.setCart(cart);
  },

  //设置购物车状态同时计算工具栏数据
  setCart(cart) {
    //##把购物车数据重新设置到data和缓存中

    //计算全选
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
      cart: cart,
      allChecked: allChecked,
      totalPrice: totalPrice,
      totalNum: totalNum
    });
    wx.setStorageSync("cart", cart);
  },

  //商品全选功能
  handleItemAllcheck() {
    //1.获取data中的数据
    let cart = this.data.cart;
    let allChecked = this.data.allChecked;
    //2.修改值
    allChecked = !allChecked;
    //3.循环修改cart数组中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    //4.把修改后值填充回data或者缓存中
    this.setCart(cart);
  },

  //商品数量编辑功能
  async handleItemNumEdit(e) {
    const operation = e.currentTarget.dataset.operation;
    const id = e.currentTarget.dataset.id;
    let cart = this.data.cart;
    //找到商品索引
    const index = cart.findIndex(v => v.goods_id === id);
    //数量为1时 减少为0判断是否要进行删除
    if (cart[index].num === 1 && operation === -1) {
      const result = await showModel({ content: '您是否要删除？' });
      if (result.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      //修改数量
      cart[index].num += operation;
      this.setCart(cart);
    }

  }
})
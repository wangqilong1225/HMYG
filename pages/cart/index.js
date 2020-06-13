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
    
*/
Page({
  handleChooseAddress(){
    //获取权限状态
    wx.getSetting({
      success: (result) => {
        const scopeAddress=result.authSetting["scope.address"];
        if(scopeAddress===true||scopeAddress===undefined){
          wx.chooseAddress({
            success:(result)=>{
              console.log(111)        
            }
          });
        }else{
          //用户以前拒绝过授予权限
          wx.openSetting({
            success: (result) => {
              wx.chooseAddress({
                success:(result)=>{
                  console.log(222)        
                }
              });
            }
          });
            
        }
      }
    });
    
    
      
  }
})
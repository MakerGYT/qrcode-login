# 方案
## 微信扫小程序码
扫码后打开小程序
qrcode
react
express
扫描: 打开小程序
## 小程序扫普通二维码
可以实现，并且支持不授权登录
## 微信扫普通二维码
暂时不可实现：可识别信息，但无法携带微信账户信息

综上，为了提高用户体验，使用第一种方式，微信扫描带参数小程序码，调起小程序至授权页面。当然，这也就天然支持小程序环境直接扫描小程序码，这样就对用户模糊了操作界限
# 过程
## 客户端生成uuid
```
cnpm i uuid --save
import uuidv1 from 'uuid/v1';
uuidv1();
```
## 客户端建立websocket

# Reference
<small>
[1] jianshu.通过微信小程序扫码，在PC端登陆跳转相应页面.https://www.jianshu.com/p/2356fdc7f135 [EB/OL] 2018

[2] 大转转FE.微信小程序使用场景延伸：扫码登录、扫码支付.https://blog.csdn.net/P6P7qsW6ua47A2Sb/article/details/78892430 [EB/OL] 2018

[3] 大象笔记.微信小程序扫码登录网站逻辑.https://www.sunzhongwei.com/sweep-wechat-small-program-code-website-logic [EB/OL] 2018

[4] 一桶浆糊的博客.websocket配合小程序实现扫码登录.https://blog.mrabit.com/details/46 [EB/OL] 2017
</small>




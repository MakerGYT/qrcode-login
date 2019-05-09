# 方案
扫码的过程实际是识别当前登录用户，（等同于用户输入账号信息），验证用户权限，（等同于服务端异步处理表单数据），用户授权，（等同于用户输入密码）。不同的是，如果用户直接输入，自然将用户行为与客户端绑定；若扫码，还需判定用户操作的客户端关系，此关系由二维码信息提供。可明文传递与存储
暂时二维码信息由服务端生成并管理，目前不知道为什么这样做，但觉得好像是对的
## 微信扫小程序码
扫码后打开小程序
qrcode
react
express
扫描: 打开小程序
## 小程序扫普通二维码
可以实现，并且支持不授权登录。
但普通二维码如何避免被使用其他工具扫描泄露key，文本不可避免要被扫描出来，只能进行一步加密操作
工具扫码大致流程：识别文本－>判别类型，如果是网址直接使用内置浏览器打开
## 微信扫普通二维码
暂时不可实现：可识别信息，但无法携带微信账户信息

综上，为了提高用户体验，使用第一种方式，微信扫描带参数小程序码，调起小程序至授权页面。当然，这也就天然支持小程序环境直接扫描小程序码，这样就对用户模糊了操作界限。实际操作中，先使用小程序扫描普通二维码，验证流程。（缺：小程序码的请求和渲染，扫码后跳转到小程序的授权登录界面）  

## 小程序端扫码
扫码后，小程序端将识别的key发至服务端，
保证小程序扫码过程完成，客户端要知道当前的key已经失效（除非被授权），即key的生命期 = 从服务端生成发至客户端开始至被扫码　|| 固定时间有效期, 
扫码完成后，服务端调用用户管理接口，授权完成后，客户端将此key与用户session绑定

## error
```json
"packOptions": {
		"ignore": [
			{
				"type": "file",
				"value": "README.md"
			}
		]
	},
```
无效，编译预览报错
手机USB共享网络后导致网段不一致：手机仍然是原10网段,无法识别192网段
# Reference
<small>
[1] jianshu.通过微信小程序扫码，在PC端登陆跳转相应页面.https://www.jianshu.com/p/2356fdc7f135 [EB/OL] 2018

[2] 大转转FE.微信小程序使用场景延伸：扫码登录、扫码支付.https://blog.csdn.net/P6P7qsW6ua47A2Sb/article/details/78892430 [EB/OL] 2018

[3] 大象笔记.微信小程序扫码登录网站逻辑.https://www.sunzhongwei.com/sweep-wechat-small-program-code-website-logic [EB/OL] 2018

[4] 一桶浆糊的博客.websocket配合小程序实现扫码登录.https://blog.mrabit.com/details/46 [EB/OL] 2017

</small>
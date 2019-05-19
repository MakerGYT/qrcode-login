# error
## 编译预览报错
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
无效，
手机USB共享网络后导致网段不一致：手机仍然是原10网段,无法识别192网段
## 400
```sh
# etc/nginx/conf.d/qrcode.conf
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_set_header Host $host;
```
# Reference
<small>
[1] jianshu.通过微信小程序扫码，在PC端登陆跳转相应页面.https://www.jianshu.com/p/2356fdc7f135 [EB/OL] 2018

[2] 大转转FE.微信小程序使用场景延伸：扫码登录、扫码支付.https://blog.csdn.net/P6P7qsW6ua47A2Sb/article/details/78892430 [EB/OL] 2018

[3] 大象笔记.微信小程序扫码登录网站逻辑.https://www.sunzhongwei.com/sweep-wechat-small-program-code-website-logic [EB/OL] 2018

[4] 一桶浆糊的博客.websocket配合小程序实现扫码登录.https://blog.mrabit.com/details/46 [EB/OL] 2017

</small>
/**
 * Created by Jayce on 2017/4/21 0021.
 */

//引入net模块
var net = require('net');

// 创建服务器
var socket = net.createServer();

//监听一个端口号
socket.listen(3000);

//定义一个变量，用作识别客户端的对象
var i = 0;

//定义一个数组，保存所有的客户端对象

var clientList = [];
//监听客户端连接
socket.on('connection',function (client) {
	client.name = ++i;
	clientList.push(client);
	console.log('有新的客户端进来了');
	//监听客户端发过来的消息
	client.on('data',function (msg) {
		broadCast(msg,client);
	});
	//监听异常错误
	client.on('err',function () {
		console.log('有人离开了群聊。。')
	})
});

//给所有客户端发消息
function broadCast(msg,client){
	for (var i = 0; i <clientList .length; i++) {
		clientList[i].write(client.name+":"+msg);
	}
}

/**
 * Created by Jayce on 2017/4/21 0021.
 */

//引入net模块
var net = require('net');
var readline= require('readline');

var rl = readline.createInterface({
	input:process.stdin,
	output:process.stdout
});

//定义一个客户端
var client = new net.Socket();

//连接服务器
client.connect(3000,'127.0.0.1',function () {
	client.on('data',function(msg){
		console.log(msg.toString());
		rl.prompt();
	});
	rl.prompt();
	rl.on('line',function (msg) {
		client.write(msg);
	})
});
/**
 * Created by 祥 on 2018/3/11.
 */
window.onload = function(){

    //用户类

    function User(url, name, id){
        return{
            headImageUrl: url,
            name: name,
            id: id
        }
    }

    //创建用户

    var user0001 = User('images/user0001.jpg', 'user0001','0001');

    //Vue实例

    var individual  = new Vue({
        el:'.individual',
        data:user0001
    });
    var myId = new Vue({
        el:'.myId',
        data:user0001
    });

    //好友列表

    var friend = new Vue({
        el:'.list',
        data:{
            user0002:User('images/user0002.jpg', '一二三四五','0002'),
            user0003:User('images/user0002.jpg', 'ABCDEFG','0003'),
            user0004:User('images/user0002.jpg', 'abcdefghijkl','0004'),
            user0005:User('images/user0002.jpg', '0123456789','0005'),
            user0006:User('images/user0002.jpg', '!@#$%^&*()','0006'),
            user0007:User('images/user0002.jpg', 'user0007','0007'),
            user0008:User('images/user0002.jpg', 'user0008','0008'),
            user0009:User('images/user0002.jpg', 'user0009','0009'),
            user0010:User('images/user0002.jpg', 'user0010','0010')
        }
    });

    //正在视频用户

    var chattingUser = new Vue({
        el:'.chattingList',
        data:{
            user0002:User('images/user0002.jpg', '一二三四五','0002'),
            user0003:User('images/user0002.jpg', 'ABCDEFG','0003'),
            user0004:User('images/user0002.jpg', 'abcdefghijkl','0004'),
            user0005:User('images/user0002.jpg', '0123456789','0005'),
            user0006:User('images/user0002.jpg', '!@#$%^&*()','0006')
        }
    });
    var Btn = new Vue({
        el: '.container-fluid',
        data:{
            show: true
        }
    });


    //受邀弹窗，仅演示用
    setStatus();
    videoWindowHover();
    // 连接的服务器的套接字
    var connection = new WebSocket('ws://120.78.132.246:8888');
//存放所有已连接的用户（包括自己）
    var userArray = new Array;
    var m=0;
    var mainStream;
    name = "";
//当前要连接的用户姓名
    var connectedUser;
//用于用户间连接的信道
    var yourConnection=new Array;
//allstream存放所有的媒体流
    var allStreams= new Array;
//当前的主讲人窗口
    var speakerVideo = document.querySelector('#windows0');
//设置stun服务器
    var configuration = {
        "incServers": [{ "url": "stun:stun.sipgate.net:10000" }]
    };
//html中对应的各个元素、div
    var loginPage = document.querySelector('#login-page'),
        usernameInput = document.querySelector('#username'),
        loginButton = document.querySelector('#login'),
        callPage = document.querySelector('#call-page'),
    //buttonPage=document.querySelector('#button'),
    //    changespeaker=document.querySelector('#changespeaker'),
        theirUsernameInput = document.querySelector('#their-username'),
        callButton = document.querySelector('#call'),
        hangUpButton = document.querySelector('#hang-up'),
        changeButton=document.querySelector('#change'),
        addButton=document.querySelector('#add');
    callPage.style.display = "none";
    //buttonPage.style.display="none";
    //changespeaker.style.display="none";
    //为登录按钮添加点击事件
    loginButton.addEventListener("click", function (event) {
        name = usernameInput.value;
        if (name.length > 0) {
            userArray[0]=name;
            send({
                type: "login",
                name: name
            });
        }
    });


    var offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
    };


    connection.onopen = function () {
    }


//通过回调函数处理所有的消息
    connection.onmessage = function (message) {
        var data = JSON.parse(message.data);
        console.log(data.type);
        console.log(data.name);
        switch (data.type) {
            //登录
            case "login":
                onLogin(data.success);
                break;
            //offer
            case "offer":
                onOffer(data.offer, data.name);
                break;
            //应答
            case "answer":
                onAnswer(data.answer);
                break;
            //申请会话
            case "candidate":
                console.log("candidate")
                onCandidate(data.candidate);
                break;
            //挂断
            case "leave":
                onLeave(data.name);
                console.log(data.name);
                break;
            case "disConn":
                console.log("disConnected from:"+ data.name);
                onDisconn(data.name);
                break;
            default:
                break;
        }
    };


    connection.onerror = function (err) {
        console.log("Got error", err);
    };


//向服务器发送信息
    function send(message) {
        if (connectedUser && !message.name) {
            message.name = connectedUser;
        }
        connection.send(JSON.stringify(message));
    };


//登录请求发出后，对服务器的回复进行处理
    function onLogin(success) {
        if (success == false) {
            alert("此用户名已被占用，请换一个试试吧！");

        } else {
            loginPage.style.display = "none";
            callPage.style.display = "block";
            //buttonPage.style.display="block";
            //准备好通话通道
            startConnection();
        }
    };


//为呼叫按钮添加点击事件
    callButton.addEventListener("click", function () {
        //获取被呼叫人的姓名
        var theirUsername = document.querySelector('#their-username').value;
        if (theirUsername.length > 0) {
            //在已连接的用户数组中加入当前被呼叫人
            userArray.push(theirUsername);
            //changespeaker.style.display="block";
            startPeerConnection(theirUsername,allStreams[0]);
        }
    });


//设置主讲人
    changeButton.addEventListener("click",function(event){
        //获取被设为主讲人的用户姓名
        var speakerName=document.querySelector("#speaker-name").value;
        //与其他用户断开连接
        var s = findUser(speakerName);
        if(s<-1){
            alert("查无此人");
            return;
        }

        //临时存放当前连接的所有用户的数组
        var temUserArray=new Array;
        for(var j=0;j<userArray.length;j++){
            temUserArray.push(userArray[j]);
        }
        for(var i=1;i<temUserArray.length;i++){
            if(i!=s){
                console.log(userArray[i]);
                send({
                    type: "disConn",
                    name:userArray[i]
                });
                onLeave(userArray[i]);
            }
        }
        var firstvideo=document.querySelector('#windows0');
        var secondvideo=document.querySelector('#windows1');
        /*allStreams[2]=allStreams[0];
         allStreams[0]=allStreams[1];
         allStreams[1]=allStreams[2];
         allStreams[2]=null;
         firstvideo.srcObject=allStreams[0];
         secondvideo.srcObject=allStreams[1];
         var tmname;
         temname=userArray[0];
         userArray[0]=userArray[1];
         userArray[1]=temname;*/
        for(var i=0;i<temUserArray.length;i++)
        {
            if((temUserArray[i]!=userArray[0])&&(temUserArray[i]!=userArray[1])){
                console.log(temUserArray[i]);
                userArray.push(temUserArray[i]);
                startPeerConnection(temUserArray[i],allStreams[0]);
            }
        }
    })


//为挂断按钮添加点击事件
    hangUpButton.addEventListener("click", function () {
        var leaveName=document.querySelector('#leave-username').value;
        send({
            type: "disConn",
            name:leaveName
        });
        onLeave(leaveName);
    })


//
    function onOffer(offer, name) {
        connectedUser = name;
        //在已有用户数组中查找name
        var i=findUser(name);
        //如果不存在
        if(i=-1){
            userArray.push(name);
            i=userArray.length;
        }
        i=i-2;
        //如果当前的通讯信道还没有建立
        //新建一个信道
        if(yourConnection[i]==null){
            setupPeerConnection(allStreams[0],i);
        }
        yourConnection[i].setRemoteDescription(new RTCSessionDescription(offer));
        yourConnection[i].createAnswer(function (answer) {
            yourConnection[i].setLocalDescription(answer);
            send({
                type: "answer",
                answer: answer
            });
        }, function (error) {
            alert("发生了一个错误--1");
        });
    }


//应答对方请求
    function onAnswer(answer) {
        console.log("执行了onAnswer");
        var i=userArray.length-2;
        yourConnection[i].setRemoteDescription(new RTCSessionDescription(answer));
    }


    function onCandidate(candidate) {
        console.log("执行了onCandidate");
        var i=userArray.length-2;
        yourConnection[i].addIceCandidate(new RTCIceCandidate(candidate));
    }


//和某人挂断
    function onLeave(leaveName) {

        if(userArray.length==1){
            connection=null;
        }
        var i=findUser(leaveName);
        if(i!=-1){
            console.log(userArray);
            userArray.splice(i,1);
            allStreams.splice(i,1);
            i--;
            console.log(userArray);
            console.log(i);
            yourConnection[i].close();
            yourConnection[i].onicecandidate = null;
            yourConnection[i].onaddstream = null;
            yourConnection.splice(i,1);
            for(var j=userArray.length;j>=i;j--){
                var m1="#windows"+j;
                var movevideo=document.querySelector(m1);
                movevideo.srcObject=allStreams[j];
            }
        }
    }


//对getUserMedia在不同浏览器中的兼容
    function hasUserMedia() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUSerMedia;
        return !!navigator.getUserMedia;
    }


//对于webRTC在不同浏览器的支持
    function hasRTCPeerConnection() {
        window.RTCPeerConnection = window.RTCPeerConnection ||
            window.webkitRTCPeerConnection ||
            window.mozRTCPeerConnection;
        window.RTCSessionDescription = window.RTCSessionDescription ||
            window.webkitRTCSessionDescription ||
            window.mozRTCSessionDescription;
        window.RTCIceCandidate = window.RTCIceCandidate||
            window.webkitRTCIceCandidate||
            window.mozRTCIceCandidate
        return !!window.RTCPeerConnection;
    }


//获取当前自己的摄像头，并开始连接通信
    function startConnection() {
        if (hasUserMedia()) {
            navigator.getUserMedia({
                video: true,
                audio: true
            }, function (mystream) {
                allStreams[0] = mystream;
                if (hasRTCPeerConnection()) {
                    speakerVideo.srcObject = allStreams[0];
                } else {
                    alert("对不起，你的浏览器不支持webrtc");
                }
            }, function (error) {
                console.log(error);
            });
        } else {
            alert("对不起，你的浏览器不支持webrtc");
        }
    }


//建立PeerConnection通道
//第一个参数为要加入的本端的流，第二个参数为建立的信道为第几条
    function setupPeerConnection(stream,i) {
        yourConnection[i] = new RTCPeerConnection(configuration);
        //加入本端要发送的流
        yourConnection[i].addStream(stream);
        //设置流的监听
        console.log("停在这里呢");
        yourConnection[i].ontrack = gotRemoteStream;
        //设置ice处理事件
        yourConnection[i].onicecandidate = function (event) {
            if (event.candidate) {
                send({
                    type: "candidate",
                    candidate: event.candidate
                });
            }
        };
    }


//开始建立通信
    function startPeerConnection(user,stream) {
        connectedUser = user;
        var i=userArray.length-2;
        //开始创建offer
        if(yourConnection[i]==null)
        {
            setupPeerConnection(stream,i);
        }
        yourConnection[i].createOffer(function (offer) {
            console.log("执行了creatOffer");
            send({
                type: "offer",
                offer: offer,
                from:usernameInput.value
            });
            //建立本地描述
            yourConnection[i].setLocalDescription(offer);
        }, function (error) {
            alert("发生一个错误--2");
        },offerOptions);
    };


//获得远端媒体流
    function gotRemoteStream(e) {
        var total=userArray.length-1;
        var newId="#windows"+total;
        console.log("i am the"+total);
        var theirVideo=document.querySelector(newId);
        console.log(theirVideo);
        //向窗口中添加获得的对方媒体流
        if (theirVideo.srcObject !== e.streams[0]) {
            //将对方的流添加到allStream数组中
            allStreams.push(e.streams[0]);
            theirVideo.srcObject = e.streams[0];
            console.log("媒体流为"+e.streams[0]);
        }
    }


//寻找userName在userArray中是第几个，如果不存在，返回-1
    function findUser(userName){
        var n=userArray.length;
        for(var i=0;i<n;i++){
            if(userArray[i]==userName)
            {
                return i;
            }
        }
        return -1;
    }


    function onDisconn(name)
    {
        var i=findUser(name);
        if(i!=-1){
            userArray.splice(i,1);
            allStreams.splice(i,1);
            i--;
            yourConnection[i].close();
            yourConnection[i].onicecandidate = null;
            yourConnection[i].onaddstream = null;
            yourConnection.splice(i,1);

            for(var j=userArray.length;j>=i;j--){
                var m1="#windows"+j;
                var movevideo=document.querySelector(m1);
                movevideo.srcObject=allStreams[j];
            }
        }
    }


//网页刷新或者关闭时
    window.onbeforeunload = Leave;
    function Leave() {
        send({
            type: "leave",
            name:userArray[0]
        });
        //connection.close();
    }
};
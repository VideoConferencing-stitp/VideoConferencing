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
};
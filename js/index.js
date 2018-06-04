/**
 * Created by 祥 on 2018/3/11.
 */

//左侧伸缩栏

function slideLeft(){

    var el = document.getElementsByClassName('friendList')[0];
    var individual = document.getElementsByClassName('individual')[0];
    var btn = document.getElementById('stretchBtnL');
    var invite = document.getElementById('invite');

    if(btn.dataset.start === 'true'){

        //移动标题
        individual.classList.remove('move-r');
        individual.classList.add('move-l');

        //好友列表fade in & out
        el.classList.remove('fade-in-l');
        el.classList.add('fade-out-l');

        //翻转图标
        btn.classList.add('trans');
        btn.dataset.start = 'false';

        //修改发起会话按钮的状态
        if(invite.dataset.connecting !== 'true')
            invite.innerHTML = '发起会话';
        invite.dataset.start = 'false';

    }else{

        btn.classList.remove('trans');
        individual.classList.remove('move-l');
        individual.classList.add('move-r');
        el.classList.remove('fade-out-l');
        el.classList.add('fade-in-l');
        btn.dataset.start = 'true';
        if(invite.dataset.connecting !== 'true')
            invite.innerHTML = '确认发起';
        invite.dataset.start = 'true';
    }
}

//右侧伸缩栏

function slideRight(){

    var el = document.getElementsByClassName('chattingList')[0];
    var individual = document.getElementsByClassName('statusList')[0];
    var img = document.getElementById('stretchBtnR');

    //翻转图标
    if (img.classList.contains('trans')) {
        img.classList.remove('trans');
    } else {
        img.classList.add('trans');
    }

    //移动标题
    if (individual.classList.contains('move-l')) {
        individual.classList.remove('move-l');
        individual.classList.add('move-r');
    } else {
        individual.classList.remove('move-r');
        individual.classList.add('move-l');
    }

    //好友列表fade in & out
    if (el.classList.contains('fade-in-r')) {
        el.classList.remove('fade-in-r');
        el.classList.add('fade-out-r');
    } else {
        el.classList.remove('fade-out-r');
        el.classList.add('fade-in-r');
        individual.style.right = 0;
    }
}

//显示/关闭画面、禁言/取消禁言按钮

function setStatus(){
    var span = document.getElementsByClassName('glyphicon');
    var volumeUp = 'glyphicon-volume-up';
    var volumeOff = 'glyphicon-volume-off';
    var eyeOpen = 'glyphicon-eye-open';
    var eyeClose = 'glyphicon-eye-close';

    for(var i in span){

        span[i].onclick = function(){
            if(this.classList.contains(volumeUp)){
                this.classList.remove(volumeUp);
                this.classList.add(volumeOff);
                this.style.color = '#bababa';
            }else if(this.classList.contains(volumeOff)){
                this.classList.remove(volumeOff);
                this.classList.add(volumeUp);
                this.style.color = '#28e0a4';
            }else if(this.classList.contains(eyeOpen)){
                this.classList.remove(eyeOpen);
                this.classList.add(eyeClose);
                this.style.color = '#bababa';
            }else{
                this.classList.remove(eyeClose);
                this.classList.add(eyeOpen);
                this.style.color = '#28e0a4';
            }
        }
    }
}

//被选中发起会话者的小红点

function choose(){

    var selectedFriend = document.getElementsByClassName('friend');

    for(var i in selectedFriend){

        selectedFriend[i].onclick = function(){
            if(this.dataset.selected === 'false'){
                //console.log(this.lastChild);
                this.lastChild.classList.add('selected');
                this.dataset.selected = 'true';
            }else{
                this.lastChild.classList.remove('selected');
                this.dataset.selected = 'false';
            }

        }
    }
}

//展示好友列表（辅助）
function showList(){

    var invite = document.getElementById('invite');
    var el = document.getElementsByClassName('friendList')[0];
    var individual = document.getElementsByClassName('individual')[0];
    var img = document.getElementById('stretchBtnL');

    individual.classList.remove('move-l');
    individual.classList.add('move-r');
    img.classList.remove('trans');
    el.classList.remove('fade-out-l');
    el.classList.add('fade-in-l');
    invite.dataset.start = 'true';
    invite.innerHTML = '确认发起';
}

//发起会话

function invite(){

    var invite = document.getElementById('invite');

    //展开好友列表并判断是否可以直接发起会话

    if(invite.dataset.start !== 'true'){

        showList();
        return 0;

    }else if(invite.dataset.start === 'true'){
        invite.dataset.connecting = 'true';
        invite.innerHTML = '正在连接';
        //跳转
    }
}

//取消发起

function cancel(){

    var invite = document.getElementById('invite');

    invite.dataset.connecting = 'false';
    showList();
}

//受邀弹窗

function popupShow(){

    //获取屏幕宽高、操作元素

    var w = document.documentElement.clientWidth || document.body.clientWidth;
    var h = document.documentElement.clientHeight || document.body.clientHeight;
    var popup = document.getElementById('popup');
    var beginTop = (h - popup.offsetWidth)/3;
    var alpha = 0;

    //计时器，动态效果

    popup.style.left = (w - popup.offsetWidth)/2;
    var timer = setInterval((function(){

        if(beginTop >= (h - popup.offsetHeight)/2)
            clearInterval(timer);

        popup.style.top = beginTop + 'px';
        popup.style.filter = 'alpha(opacity:'+alpha+')';
        popup.style.opacity = alpha;
        beginTop += (h - popup.offsetHeight)/100;
        alpha += 0.06;
    }), 15);
}

//接受邀请

function agree(){

    var popup = document.getElementById('popup');
    var invite = document.getElementById('invite');

    popup.style.display = 'none';
    invite.innerHTML = '正在连接';
}

//拒绝邀请

function refuse(){
    var popup = document.getElementById('popup');
    popup.style.display = 'none';
}

/**
 * Created by 祥 on 2018/3/15.
 */
//左侧伸缩栏

function slideLeft(){

    var el = document.getElementsByClassName('friendList')[0];
    var individual = document.getElementsByClassName('individual')[0];
    var btn = document.getElementById('stretchBtnL');

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

    }else{

        btn.classList.remove('trans');
        individual.classList.remove('move-l');
        individual.classList.add('move-r');
        el.classList.remove('fade-out-l');
        el.classList.add('fade-in-l');
        btn.dataset.start = 'true';
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

//被选中发起会话者的小红点

function choose(){

    var selectedFriend = document.getElementsByClassName('friend');

    for(var i in selectedFriend){

        selectedFriend[i].onclick = function(){
            if(this.dataset.selected == 'false'){
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
            event.stopPropagation();
        }
    }
}

//视频窗口hover效果（图标显隐效果）

function videoWindowHover(){

    var video = document.getElementsByClassName('participant');

    for(var i in video){

        //鼠标点击控制窗口显隐
        video[i].onclick = function(){

            var a = this.getElementsByTagName('a')[0];
            var volume = this.getElementsByClassName('volume')[0];
            var eye = this.getElementsByClassName('eye')[0];
            var h = this.clientHeight;var w = this.clientWidth;
            var nowTop = -50;var nowLeft = -50;var nowRight = -50;

            //若控制窗口当前隐藏，则点击一下显示
            if (this.dataset.isClick == "false"){

                this.dataset.isClick = "true";

                var timer = setInterval((function(){

                    if(nowTop < (h - 110)/2){
                        a.style.display = 'block';
                        a.style.top = nowTop + 'px';
                        nowTop += 3;
                    }
                    if(nowLeft < (w - 140)/2){
                        volume.style.display = 'block';
                        volume.style.left = nowLeft + 'px';
                        nowLeft += 3;
                    }
                    if(nowRight < ((w - 140)/2)){
                        eye.style.display = 'block';
                        eye.style.right = nowRight + 'px';
                        nowRight += 3;
                    }
                }), 1);
            }
            //若控制窗口当前显示，则点击一下隐藏
            else{

                this.dataset.isClick = "false";

                a.style.display = 'none';
                volume.style.display = 'none';
                eye.style.display = 'none';
            }
        };
    }
}
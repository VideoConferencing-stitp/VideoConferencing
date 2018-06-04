/**
 * Created by 祥 on 2018/6/2.
 */
function GetScreenHW(){
    var triCircle = document.getElementById('tri-circle');
    var div = triCircle.getElementsByTagName('div');
    var circleTop = document.getElementById('cir-top');
    var circleRight = document.getElementById('cir-right');
    var circleBottom = document.getElementById('cir-bottom');
    var theHeight = window.innerHeight;//窗口高度
    var theWidth = triCircle.offsetWidth;//动态div宽度

    triCircle.style.height = theHeight + 'px';

    for (var i = 0; i < div.length; i++){
        div[i].style.width = theWidth*1.15 + 'px';
        div[i].style.height = theWidth*1.15 + 'px';
    }

    circleTop.style.top = -theHeight*0.85 + 'px';
    circleTop.style.right = -theWidth*0.23 + 'px';

    circleRight.style.top = -theHeight*0.15 + 'px';
    circleRight.style.right = -theWidth*0.33 + 'px';

    circleBottom.style.top = theHeight*0.68 + 'px';
    circleBottom.style.right = -theWidth*0.22 + 'px';
}

window.onload = function(){
    GetScreenHW();
};
window.onresize = function(){
    GetScreenHW();
};
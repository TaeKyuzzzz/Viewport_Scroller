// html elements
let vpPanel;
let titleBar;
let titleText;

let vpControl;

let distanceViewPanel;
let spText;
let slash;
let epText;

let viewSliderPanel;
let slider;

// global variants

let totalLength = null; // meter 단위.
let startPoint = 0, endPoint = 0;

let canvasCtx = null;

let initialX = 0;
let initialY = 0;
let isMoving = false;

let scrollerWidth = null;
let scrollerHeight = null;
const scrollerTop = 10;
const scrollerLeft = 15;

let scrollButtonLeft = scrollerLeft;
let scrollButtonTop = scrollerTop + 1;
let scrollButtonWidth = null;
let scrollButtonHeight = null;

let scale = 1;
let IsButtonMoving = false;

// variant for event debouncing logic

let eventId = null;

var ViewportControlAction = {
    'init': function (tl, sp, ep) {

        // ==========validation check===============
        if (tl == null || sp == null || ep == null) {
            console.warn('please input all parameters. total length, start point, end point. ', tl, sp, ep);
            return;
        }

        if (tl < 0 || sp < 0 || ep < 0) {
            console.warn("parameters can't be negative value.");
            return;
        }

        if (ep <= sp) {
            console.warn('end point must bigger than start point.');
            return;
        }

        // =======================================

        makeController();

        scrollerWidth = parseInt(slider.style.width.replace('px','')) - 2 * scrollerLeft;
        scrollerHeight = parseInt(slider.style.height.replace('px','')) - 2 * scrollerTop;

        totalLength = tl;
        startPoint = sp;
        endPoint = ep;

        // 총 길이, 시작지점, 끝지점을 기반으로 button 의 초기 property 를 계산해낸다.
        scrollButtonLeft = scrollerWidth * (startPoint / totalLength);
        scrollButtonWidth = scrollerWidth * (endPoint / totalLength) - scrollButtonLeft;
        scrollButtonTop = scrollerTop + 1;
        scrollButtonHeight = scrollerHeight - 2;

        spText.setAttribute("value", `${startPoint}`);
        epText.setAttribute("value", `${endPoint}`);

        titleBar.addEventListener('mousedown', (e) => {
            e.preventDefault();
            initialX = e.clientX;
            initialY = e.clientY;
            isMoving = true;
        });

        titleBar.addEventListener('mousemove', (e) => {
            if (isMoving) {
                e.preventDefault();
                let newX = e.clientX;
                let newY = e.clientY;
                vpPanel.style.left = vpPanel.offsetLeft - (initialX - newX) + 'px';
                vpPanel.style.top = vpPanel.offsetTop - (initialY - newY) + 'px';
                initialY = newY;
                initialX = newX;
            }
        });

        titleBar.addEventListener('mouseup', (e) => {
            isMoving = false;
        });

        vpPanel.addEventListener('wheel', (event) => {
            if (eventId) {
                clearTimeout(eventId);
                eventId = null;
            }
            scale += event.deltaY * -0.01;
            if (scale > 2) {
                scale = 2;
            }
            if (scale < 0.5) {
                scale = 0.5;
            }
            const beforeScaled = scrollButtonWidth;
            scrollButtonWidth *= scale;
            if (scrollButtonWidth > scrollerWidth) {
                scrollButtonWidth = beforeScaled;
            } else if (scrollButtonWidth < 0) {
                scrollButtonWidth = beforeScaled;
            } else if (scrollButtonLeft + scrollButtonWidth > scrollerLeft + scrollerWidth) {
                scrollButtonWidth = beforeScaled;
            }

            // 텍스트 갱신
            startPoint = totalLength * ((scrollButtonLeft - scrollerLeft) / scrollerWidth);
            endPoint = totalLength * ((scrollButtonLeft + scrollButtonWidth - scrollerLeft) / scrollerWidth);

            spText.setAttribute("value", startPoint.toString(10));
            epText.setAttribute("value", endPoint.toString(10));

            eventId = setTimeout(() => {
                ViewportControlAction.eventAlert('scale', [startPoint, endPoint]);
            }, 300);
        })

        slider.onmousedown = CanvasMouseDown;
        slider.onmousemove = CanvasMouseMove;
        slider.onmouseup = CanvasMouseUp;

        draw();
    },

    // overriding function.
    'eventAlert': function () {

    }
};

function makeController () {
    vpPanel = document.createElement('div');
    vpPanel.id = "Viewport-controller";
    vpPanel.style.cssText = "position: fixed; top: 400px; left: 557px; margin: 0px; border: 1px solid rgb(52, 52, 52); padding: 0px; overflow: hidden; background-color: rgb(52, 52, 52); color: rgb(214, 214, 214); z-index: 999; font-family: monospace; font-size: 12px; width: 602px; height: 60px;";

    titleBar = document.createElement('div');
    titleBar.id = "title-bar";
    titleBar.style.cssText = "position: absolute; top: 0px; width: 100%; height: 22px; line-height: 22px; overflow: hidden; border-bottom: 1px solid rgb(83, 83, 83); text-align: center; cursor: move;";

    vpPanel.appendChild(titleBar);

    titleText = document.createElement('span');
    titleText.innerHTML += 'Viewport Scroller 1.0.0-dev';

    titleBar.appendChild(titleText);

    vpControl = document.createElement('div');
    vpControl.style.cssText = "text-align: left; line-height: 1em; position: absolute; top: 22px; width: 602px; height: 40px;";

    distanceViewPanel = document.createElement('div');
    distanceViewPanel.style.cssText = "position: absolute; left: 20px; top: 10px; height: 30px; overflow: hidden; width: 140px;";

    spText = document.createElement('input');
    spText.id = "start-point";
    // 문제가 된 부분.
    // 프로퍼티로 value 를 먼저 설정해주면 setAttribute 로 변경한 value 가 화면에 적용되지 않는다.
    // spText.value = "";
    spText.style.cssText = "text-align: center; font-size: 10px; padding: 1px; cursor: ns-resize; width: 40px; margin: 0px 10px 0px 0px; appearance: none; outline: none; border-width: 0px 0px 1px; border-top-style: initial; border-right-style: initial; border-bottom-style: dotted; border-left-style: initial; border-top-color: initial; border-right-color: initial; border-bottom-color: rgb(184, 184, 184); border-left-color: initial; border-image: initial; background: none; color: rgb(184, 184, 184);";

    slash = document.createElement('span');
    slash.innerHTML += "/";

    epText = document.createElement('input');
    epText.id = "end-point";

    // 위와 동일.
    // setAttribute 로 value 값을 변경하려면 이렇게 프로퍼티로 value 에 먼저 값을 넣으면 안된다.
    // 관련 문서는 아래 주소의 (프로퍼티-속성 동기화) 부분 참고.
    // https://ko.javascript.info/dom-attributes-and-properties

    // epText.value = "";
    epText.style.cssText = "text-align: center; font-size: 10px; padding: 1px; cursor: ns-resize; width: 40px; margin: 0px 10px 0px 0px; appearance: none; outline: none; border-width: 0px 0px 1px; border-top-style: initial; border-right-style: initial; border-bottom-style: dotted; border-left-style: initial; border-top-color: initial; border-right-color: initial; border-bottom-color: rgb(184, 184, 184); border-left-color: initial; border-image: initial; background: none; color: rgb(184, 184, 184);";

    distanceViewPanel.appendChild(spText);
    distanceViewPanel.appendChild(slash);
    distanceViewPanel.appendChild(epText);

    viewSliderPanel = document.createElement('div');
    viewSliderPanel.style.cssText = "position: absolute; top: 0px; left: 160px; width: 442px; height: 35px";

    slider = document.createElement('canvas');
    slider.width = 440;
    slider.height = 35;
    slider.id = "scroll-canvas";
    slider.style.cssText = "width: 440px; height: 35px; position: absolute; top: 0px; left: 2px;";

    viewSliderPanel.appendChild(slider);
    vpControl.appendChild(viewSliderPanel);
    vpControl.appendChild(distanceViewPanel);

    vpPanel.appendChild(vpControl);

    document.getElementById('base').appendChild(vpPanel);

    canvasCtx = slider.getContext('2d');
}

function draw() {
    canvasCtx.clearRect(0, 0, scrollerWidth + 2 * scrollerLeft, scrollerHeight + 2 * scrollerTop);
// 스크롤러 테두리 그리기
    canvasCtx.beginPath();
    canvasCtx.strokeStyle = '#535353';
    canvasCtx.rect(scrollerLeft, scrollerTop, scrollerWidth, scrollerHeight);
    canvasCtx.stroke();

// 스크롤러 버튼 그리기
    canvasCtx.beginPath();
    canvasCtx.fillStyle = '#b8b8b8';
    canvasCtx.rect(scrollButtonLeft, scrollButtonTop + 1, scrollButtonWidth, scrollButtonHeight);
    canvasCtx.stroke();
    canvasCtx.fill();

    requestAnimationFrame(draw);
}

function IsMouseInShape(x, y, shape) {
    const shape_left = shape.x;
    const shape_right = shape.x + shape.width;
    const shape_top = shape.y;
    const shape_bottom = shape.y + shape.height;

    return x > shape_left && x < shape_right && y > shape_top && y < shape_bottom;
}

// https://www.youtube.com/watch?v=7PYvx8u_9Sk 여기 참조
let CanvasMouseDown = function (event) {
    event.preventDefault();

    initialX = parseInt(event.offsetX);
    initialY = parseInt(event.offsetY);

    if (IsMouseInShape(initialX, initialY, {x: scrollButtonLeft, y: scrollButtonTop, width: scrollButtonWidth, height: scrollButtonHeight})) {
        IsButtonMoving = true;
    }
};

let CanvasMouseMove = function (event) {
    if (IsButtonMoving) {

        if (eventId) {
            clearTimeout(eventId);
            eventId = null;
        }

        event.preventDefault();

        let newX = parseInt(event.offsetX);

        scrollButtonLeft = scrollButtonLeft - (initialX - newX);
        initialX = newX;

        if (scrollButtonLeft < scrollerLeft) {
            scrollButtonLeft = scrollerLeft;
        } else if (scrollButtonLeft + scrollButtonWidth > scrollerLeft + scrollerWidth) {
            scrollButtonLeft = scrollerLeft + scrollerWidth - scrollButtonWidth;
        }

        // 텍스트 정보 업데이트
        startPoint = totalLength * ((scrollButtonLeft - scrollerLeft) / scrollerWidth);
        endPoint = totalLength * ((scrollButtonLeft + scrollButtonWidth - scrollerLeft) / scrollerWidth);

        spText.setAttribute("value", startPoint.toString(10));
        epText.setAttribute("value", endPoint.toString(10));

        eventId = setTimeout(() => {
            ViewportControlAction.eventAlert('scale', [startPoint, endPoint]);
        }, 300);
    }
};

let CanvasMouseUp = function (event) {
    event.preventDefault();

    if (IsButtonMoving) {
        IsButtonMoving = false;
    }
};

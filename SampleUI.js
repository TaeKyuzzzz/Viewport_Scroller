const totalLength = 2000; // meter 단위. (2km)
let startPoint = 0, endPoint = 0;

const title_bar = document.getElementById("title-bar");
const viewport_controller = document.getElementById("Viewport-controller");
const startText = document.getElementById("start-point");
const endText = document.getElementById("end-point");
const scroll_canvas = document.getElementById("scroll-canvas");
const ctx = scroll_canvas.getContext('2d');

let initialX = 0;
let initialY = 0;
let isMoving = false;

const scrollerWidth = parseInt(scroll_canvas.style.width.replace('px','')) - 30;
const scrollerHeight = parseInt(scroll_canvas.style.height.replace('px','')) - 20;
const scrollerTop = 10;
const scrollerLeft = 15;

console.log('scroller width: ', scrollerWidth);
console.log('scroller height: ', scrollerHeight);

let scrollButtonLeft = scrollerLeft;
let scrollButtonTop = scrollerTop + 1;
let scrollButtonWidth = 40;
let scrollButtonHeight = scrollerHeight - 2;

let scale = 1;
let initButtonWidth = scrollButtonWidth;
let IsButtonMoving = false;

function draw() {
    ctx.clearRect(0, 0, scrollerWidth + 30, scrollerHeight + 20);
// 스크롤러 테두리 그리기
    ctx.beginPath();
    ctx.strokeStyle = '#535353';
    ctx.rect(scrollerLeft, scrollerTop, scrollerWidth, scrollerHeight);
    ctx.stroke();

// 스크롤러 버튼 그리기
    ctx.beginPath();
    ctx.fillStyle = '#b8b8b8';
    ctx.rect(scrollButtonLeft, scrollButtonTop + 1, scrollButtonWidth, scrollButtonHeight);
    ctx.stroke();
    ctx.fill();

    requestAnimationFrame(draw);
}

draw();

title_bar.addEventListener('mousedown', (e) => {
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    isMoving = true;
});

title_bar.addEventListener('mousemove', (e) => {
    if (isMoving) {
        e.preventDefault();
        let newX = e.clientX;
        let newY = e.clientY;
        viewport_controller.style.left = viewport_controller.offsetLeft - (initialX - newX) + 'px';
        viewport_controller.style.top = viewport_controller.offsetTop - (initialY - newY) + 'px';
        initialY = newY;
        initialX = newX;
    }
});

title_bar.addEventListener('mouseup', (e) => {
    isMoving = false;
});

viewport_controller.addEventListener('wheel', (event) => {
    scale += event.deltaY * -0.01;
    if (scale > 2) {
        scale = 2;
    }
    if (scale < 0.5) {
        scale = 0.5;
    }
    const beforeScaled = scrollButtonWidth;
    scrollButtonWidth *= scale;
    if (scrollButtonWidth > initButtonWidth * 8) {
        scrollButtonWidth = initButtonWidth * 8;
    } else if (scrollButtonWidth < initButtonWidth / 2) {
        scrollButtonWidth = initButtonWidth / 2;
    } else if (scrollButtonLeft + scrollButtonWidth > scrollerLeft + scrollerWidth) {
        scrollButtonWidth = beforeScaled;
    }

    // 텍스트 갱신
    startPoint = 2000 * ((scrollButtonLeft - scrollerLeft) / scrollerWidth);
    endPoint = 2000 * ((scrollButtonLeft + scrollButtonWidth - scrollerLeft) / scrollerWidth);

    startText.setAttribute("value", startPoint.toString(10));
    endText.setAttribute("value", endPoint.toString(10));
})


function IsMouseInShape(x, y, shape) {
    const shape_left = shape.x;
    const shape_right = shape.x + shape.width;
    const shape_top = shape.y;
    const shape_bottom = shape.y + shape.height;

    if (x > shape_left && x < shape_right && y > shape_top && y < shape_bottom) {
        return true;
    }

    return false;
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
        startPoint = 2000 * ((scrollButtonLeft - scrollerLeft) / scrollerWidth);
        endPoint = 2000 * ((scrollButtonLeft + scrollButtonWidth - scrollerLeft) / scrollerWidth);

        startText.setAttribute("value", startPoint.toString(10));
        endText.setAttribute("value", endPoint.toString(10));
    }
};

let CanvasMouseUp = function (event) {
    event.preventDefault();

    if (IsButtonMoving) {
        IsButtonMoving = false;
    }
};

scroll_canvas.onmousedown = CanvasMouseDown;
scroll_canvas.onmousemove = CanvasMouseMove;
scroll_canvas.onmouseup = CanvasMouseUp;

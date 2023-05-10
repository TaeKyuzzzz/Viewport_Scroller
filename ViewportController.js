// html elements
let vpPanel;
let titleBar;
let titleText;

let vpControl;

let distanceViewPanel;
let startPoint;
let slash;
let endPoint;

let viewSliderPanel;
let slider;

var ViewportControlAction = {
    'init': function () {
        makeController();
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
    vpPanel.appendChild(titleBar);

    vpControl = document.createElement('div');
    vpControl.style.cssText = "text-align: left; line-height: 1em; position: absolute; top: 22px; width: 348px; height: 158px;";

    distanceViewPanel = document.createElement('div');
    distanceViewPanel.style.cssText = "position: absolute; left: 20px; top: 10px; height: 158px; overflow: hidden; width: 250px;";

    startPoint = document.createElement('input');
    startPoint.id = "start-point";
    startPoint.value = "";
    startPoint.style.cssText = "text-align: center; font-size: 10px; padding: 1px; cursor: ns-resize; width: 40px; margin: 0px 10px 0px 0px; appearance: none; outline: none; border-width: 0px 0px 1px; border-top-style: initial; border-right-style: initial; border-bottom-style: dotted; border-left-style: initial; border-top-color: initial; border-right-color: initial; border-bottom-color: rgb(184, 184, 184); border-left-color: initial; border-image: initial; background: none; color: rgb(184, 184, 184);";

    slash = document.createElement('span');
    slash.innerHTML += "/";

    endPoint = document.createElement('input');
    endPoint.id = "end-point";
    endPoint.value = "";
    endPoint.style.cssText = "text-align: center; font-size: 10px; padding: 1px; cursor: ns-resize; width: 40px; margin: 0px 10px 0px 0px; appearance: none; outline: none; border-width: 0px 0px 1px; border-top-style: initial; border-right-style: initial; border-bottom-style: dotted; border-left-style: initial; border-top-color: initial; border-right-color: initial; border-bottom-color: rgb(184, 184, 184); border-left-color: initial; border-image: initial; background: none; color: rgb(184, 184, 184);";

    distanceViewPanel.appendChild(startPoint);
    distanceViewPanel.appendChild(slash);
    distanceViewPanel.appendChild(endPoint);

    viewSliderPanel = document.createElement('div');
    viewSliderPanel.style.cssText = "position: absolute; top: 0px; left: 150px;";

    slider = document.createElement('canvas');
    slider.width = 440;
    slider.height = 35;
    slider.id = "scroll-canvas";
    slider.style.cssText = "width: 440px; height: 35px; position: absolute; top: 0px; left: 10px;";

    viewSliderPanel.appendChild(slider);

    vpControl.appendChild(distanceViewPanel);
    vpControl.appendChild(slider);

    vpPanel.appendChild(vpControl);

    document.getElementById('base').appendChild(vpPanel);



    // const controlPanel = document.createElement('div')
}

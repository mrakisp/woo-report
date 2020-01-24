var svg = document.querySelector("#svg");
var mouse = svg.createSVGPoint();

var leftEye = createEye("#left-eye");
var rightEye = createEye("#right-eye");

var requestId = null;

window.addEventListener("mousemove", onMouseMove)

function onFrame() {
  
  var point = mouse.matrixTransform(svg.getScreenCTM().inverse());
  
  leftEye.rotateTo(point);
  rightEye.rotateTo(point);
  
  requestId = null;
}

function onMouseMove(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  
  if (!requestId) {
    requestId = requestAnimationFrame(onFrame);
  }
}

function createEye(selector) {
  
  var element = document.querySelector(selector);
  
  TweenLite.set(element, {
    transformOrigin: "center"
  });
  
  var bbox = element.getBBox();
  var centerX = bbox.x + bbox.width / 2;
  var centerY = bbox.y + bbox.height / 2;
  
  function rotateTo(point) {
    
    var dx = point.x - centerX;
    var dy = point.y - centerY;
    
    var angle = Math.atan2(dy, dx);
    
    TweenLite.to(element, 0.3, {
      rotation: angle + "_rad_short"
    });
  }
  
  return {
    element: element,
    rotateTo: rotateTo
  };
}
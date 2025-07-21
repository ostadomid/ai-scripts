function arePointsEqual(p1, p2) {
  return Math.abs(p1[0] - p2[0]) < 0.01 && Math.abs(p1[1] - p2[1]) < 0.01;
}
function isRectangleGuide(pathItem) {
  if (pathItem.pathPoints.length !== 4) return false;

  var p = pathItem.pathPoints;

  // Ensure all path points are corner points (not curved)
  for (var i = 0; i < 4; i++) {
    var pt = p[i];
    if (
      !arePointsEqual(pt.anchor, pt.leftDirection) ||
      !arePointsEqual(pt.anchor, pt.rightDirection)
    ) {
      return false; // Has curves -> not a rectangle
    }
  }
  return true;
}
function findBorder(template) {
  //var template = app.activeDocument.layers.getByName("Template");
  var rectGuides = [];
  
  for (var i = 0; i < template.pageItems.length; i++) {
    var current = template.pageItems[i];
    if(current.typename!=="PathItem") continue;
    
    if (isRectangleGuide(current)) {
      rectGuides.push({ e: current, area: current.height * current.width });
    }
  }
  var max = rectGuides[0];
  for (var index = 0; index < rectGuides.length; index++) {
    if (rectGuides[index].area > max.area) {
      max = rectGuides[index];
    }
  }
  // alert(rectGuides.length);
  max.e.name = "border";
}

var w = new Window("dialog", "Template Maker");
var p = w.add("panel");
var g = p.add("group");
var contentBtn = g.add("button",undefined,"لایه کانتنت");
var borderBtn = g.add("button",undefined,"پیدا کردن کادر اصلی");
var templateBtn = g.add("button",undefined,"لایه تمپلیت");



p.add("group",[-1,0,-1,12]);
g = p.add("group");
var lastNameBtn = g.add("button",undefined,"نامهای خانوادگی");
var poemBtn = g.add("button",undefined,"شعر");
var firstNamesBtn = g.add("button",undefined,"نام ها");

g = p.add("group");
var phoneBtn = g.add("button",undefined,"شماره تلفن");
var rsvpBtn = g.add("button",undefined,"متن عدم حضور");
var dateBtn = g.add("button",undefined,"تاریخ");


templateBtn.onClick= function(){
  app.activeDocument.activeLayer.name = "Template";
  w.close();
}
contentBtn.onClick= function(){
  app.activeDocument.activeLayer.name = "Content";
  w.close();
}

borderBtn.onClick= function(){
  try {
    var template = app.activeDocument.layers.getByName("Template");    
    findBorder(template)
  } catch (error) {
    alert(error.message);
  }
  w.close();
}
firstNamesBtn.onClick= function(){
  app.activeDocument.selection[0].name = "firstNames";
  w.close();
}
poemBtn.onClick= function(){
  app.activeDocument.selection[0].name = "poem";
  $.writeln("YESS")
  w.close();
}
lastNameBtn.onClick= function(){
  app.activeDocument.selection[0].name = "lastNames";
  w.close();
}

dateBtn.onClick= function(){
  app.activeDocument.selection[0].name = "date";
  w.close();
}
rsvpBtn.onClick= function(){
  app.activeDocument.selection[0].name = "rsvp";
  w.close();
}
phoneBtn.onClick= function(){
  app.activeDocument.selection[0].name = "phone";
  w.close();
}

w.show(); // now it persists because event loop stays alive
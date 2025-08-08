/**
 * Centers a pageItem horizontally inside the given artboard.
 * @param {PageItem} item - The Illustrator object to move.
 * @param {Artboard} artboard - The artboard to center in.
 */
function centerHorizontally(item, artboard) {
  var abBounds = artboard.artboardRect; // [left, top, right, bottom]
  var abCenterX = (abBounds[0] + abBounds[2]) / 2;

  var gb = item.geometricBounds; // [left, top, right, bottom]
  var itemWidth = gb[2] - gb[0];

  item.left = abCenterX - itemWidth / 2;

}

/**
* Centers a pageItem vertically inside the given artboard.
* @param {PageItem} item - The Illustrator object to move.
* @param {Artboard} artboard - The artboard to center in.
*/
function centerVertically(item, artboard) {
  var abBounds = artboard.artboardRect; // [left, top, right, bottom]
  var abCenterY = (abBounds[1] + abBounds[3]) / 2;

  var gb = item.geometricBounds; // [left, top, right, bottom]
  var itemHeight = gb[1] - gb[3];

  item.top = abCenterY + itemHeight / 2;
}

function removeItemFromGroup(group,name){
  if(group){
    for(var i=0;i<group.pageItems.length;i++){
      if(group.pageItems[i].name===name){
        group.pageItems[i].remove();
      }
    }
  }
}
function ungroup(groupItem) {
  if (!(groupItem && groupItem.typename === "GroupItem")) {
    throw new Error("The argument must be a GroupItem.");
  }

  var parent = groupItem.parent;
  var count = groupItem.pageItems.length;

  // Move all pageItems from the group to the parent
  for (var i = count - 1; i >= 0; i--) {
    groupItem.pageItems[i].move(parent, ElementPlacement.PLACEATBEGINNING);
  }

  // Remove the now-empty group
  groupItem.remove();
}

function duplicateSelectionToNewArtboard(selectedItems) {
  var doc = app.activeDocument;

  if (selectedItems.length === 0) {
    alert("Please select at least one object.");
    return;
  }

  // Step 1: Group selected items
  var group = doc.groupItems.add();
  group.name = "Duplicated and Centered Items ";
  for (var i = 0; i < selectedItems.length; i++) {
    selectedItems[i].move(group, ElementPlacement.PLACEATEND);
  }

  // Step 2: Get first artboard bounds
  var ab1 = doc.artboards[0];
  var abBounds = ab1.artboardRect; // [left, top, right, bottom]
  var abWidth = abBounds[2] - abBounds[0];
  var abHeight = abBounds[1] - abBounds[3];

  // Step 3: Create new artboard (to the right of the first one)
  var newAbLeft = abBounds[2] // directly after first artboard's right edge
  var newAbBounds = [newAbLeft, abBounds[1], newAbLeft + abWidth, abBounds[3]];
  var newAb = doc.artboards.add(newAbBounds);

  // Step 4: Duplicate group to new artboard
  var dup = group.duplicate();

  centerHorizontally(dup,newAb);
  removeItemFromGroup(dup,"_expanded");  
  closeIt();
  return group;
}

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
    if (current.typename !== "PathItem") continue;

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

function cmToPt(cm) {
  return cm * 28.3464567;
}

var w = new Window("dialog", "Template Maker");
function closeIt() {
  w.close();
}

var p = w.add("panel");
var g = p.add("group");
var contentBtn = g.add("button", undefined, "لایه کانتنت");
var borderBtn = g.add("button", undefined, "پیدا کردن کادر اصلی");
var templateBtn = g.add("button", undefined, "لایه تمپلیت");

p = w.add("panel", undefined, "Create Border");
p.alignment = "fill";
g = p.add("group");
g.alignment = "fill";
g.alignChildren = "fill";

g.add("statictext", undefined, "Card W=");
var widthText = g.add("edittext");
widthText.characters = 5;

g.add("statictext", undefined, "Card H=");
var heightText = g.add("edittext");
heightText.characters = 5;

g = p.add("group");
g.alignment = "left";
g.alignChildren = "left";
g.add("statictext", undefined, "Each Side Shrink (cm)=");
var shrinkText = g.add("edittext", undefined, "0.5");
shrinkText.characters = 3;

g = p.add("group");
g.alignment = "left";
g.add("statictext", undefined, "Extra Bottom (cm)=");
var extraBottom = g.add("edittext", undefined, "0");
extraBottom.characters = 3;
g.add("statictext", undefined, "Extra Right (cm)=");
var extraRight = g.add("edittext", undefined, "0");
extraRight.characters = 3;

g = p.add("group");
var btnCreateBorder = g.add("button", undefined, "ایجاد");
btnCreateBorder.onClick = function () {
  var doc = app.activeDocument;
  var ab = doc.artboards[doc.artboards.getActiveArtboardIndex()];
  var abBounds = ab.artboardRect; // [left, top, right, bottom]
  var template;
  try {
    template = app.activeDocument.layers.getByName("Template");
  } catch (error) {
    alert("لایه تمپلیت پیدا نشد");
    w.close();
    return;
  }

  // Desired rectangle size
  var rectWidth = cmToPt(Number(widthText.text) - 2 * Number(shrinkText.text));
  var rectHeight = cmToPt(
    Number(heightText.text) - 2 * Number(shrinkText.text)
  );
  var offset = cmToPt(Number(shrinkText.text));

  // Bottom-right corner of the artboard
  var right = abBounds[2] - +cmToPt(Number(extraRight.text)); // x
  var bottom = abBounds[3] + cmToPt(Number(extraBottom.text)); // y

  var top = bottom + rectHeight + offset;
  var left = right - rectWidth - offset;

  // Define corner points (clockwise)
  var points = [
    [left, top], // top-left
    [left + rectWidth, top], // top-right
    [left + rectWidth, top - rectHeight], // bottom-right
    [left, top - rectHeight], // bottom-left
  ];

  // Create editable path

  var guidePath = template.pathItems.add();
  guidePath.setEntirePath(points.concat([points[0]])); // close the path
  guidePath.closed = true;
  guidePath.filled = false;
  guidePath.stroked = true;
  guidePath.name = "border";
  guidePath.guides = true;

  w.close();
};

p = w.add("panel",undefined,"ایجاد آرت بورد وسط چین");
p.alignment = "fill";

g=p.add("group");
g.alignment="center"
g.add("statictext", undefined, "حاشیه در هر سمت کارت به سانتی متر");

g = p.add("group");
var expandText = g.add("edittext", undefined, "0.5");
expandText.characters = 3;


g = p.add("group");
var btnCreateCenteredArtborad = g.add("button", undefined, "ایجاد");

btnCreateCenteredArtborad.onClick = function () {
  var template = null;
  var content = null;
  var border = null;
  try {
    template = app.activeDocument.layers.getByName("Template");
    border = template.pageItems.getByName("border");
  } catch (error) {
    alert("لایه تمپلیت / بوردر پیدا نشد!");
    return;
  }
  if (app.activeDocument.selection.length < 1) {
    alert(
      "باید ابتدا تمامی آیتمهای درون کارت عروسی را انتخاب کنید." +
        "\\r\\n" +
        "توجه داشته باشید که گایدها باید قابل انتخاب باشند!"
    );
    closeIt();
    return;
  }

  var growthFactor = cmToPt(Number(expandText.text) * 2);
  var x = border.geometricBounds[0];
  var y = border.geometricBounds[1];
  var w = border.width;
  var h = border.height;

  // Calculate new dimensions
  var newW = w + growthFactor;
  var newH = h + growthFactor;

  // Calculate position so it stays centered
  var newLeft = x - growthFactor / 2;
  var newTop = y + growthFactor / 2;

  // Create new rectangle
  var newRect = template.pathItems.rectangle(newTop, newLeft, newW, newH);
  // newRect.guides = true;
  newRect.stroked = true;
  newRect.filled = false;
  newRect.name = "_expanded";
  const allOfThem = [];
  for (var i = 0; i < app.activeDocument.selection.length; i++) {
    allOfThem.push(app.activeDocument.selection[i]);
  }
  allOfThem.push(newRect);

  var duplicatedGroup = duplicateSelectionToNewArtboard(allOfThem);
  removeItemFromGroup(duplicatedGroup,"_expanded");
  ungroup(duplicatedGroup);  
  closeIt();
};

p = w.add("panel");
p.add("group", [-1, 0, -1, 12]);
g = p.add("group");
var lastNameBtn = g.add("button", undefined, "نامهای خانوادگی");
var poemBtn = g.add("button", undefined, "شعر");
var firstNamesBtn = g.add("button", undefined, "نام ها");

g = p.add("group");
var phoneBtn = g.add("button", undefined, "شماره تلفن");
var rsvpBtn = g.add("button", undefined, "متن عدم حضور");
var dateBtn = g.add("button", undefined, "تاریخ");

templateBtn.onClick = function () {
  app.activeDocument.activeLayer.name = "Template";
  w.close();
};
contentBtn.onClick = function () {
  app.activeDocument.activeLayer.name = "Content";
  w.close();
};

borderBtn.onClick = function () {
  try {
    var template = app.activeDocument.layers.getByName("Template");
    findBorder(template);
  } catch (error) {
    alert(error.message);
  }
  w.close();
};
firstNamesBtn.onClick = function () {
  app.activeDocument.selection[0].name = "firstNames";
  w.close();
};
poemBtn.onClick = function () {
  app.activeDocument.selection[0].name = "poem";
  $.writeln("YESS");
  w.close();
};
lastNameBtn.onClick = function () {
  app.activeDocument.selection[0].name = "lastNames";
  w.close();
};

dateBtn.onClick = function () {
  app.activeDocument.selection[0].name = "date";
  w.close();
};
rsvpBtn.onClick = function () {
  app.activeDocument.selection[0].name = "rsvp";
  w.close();
};
phoneBtn.onClick = function () {
  app.activeDocument.selection[0].name = "phone";
  w.close();
};

w.show(); // now it persists because event loop stays alive

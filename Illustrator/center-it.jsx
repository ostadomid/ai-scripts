function centerAInB(a, b) {
  a.translate(b.position[0] - a.position[0], b.position[1] - a.position[1]);
  var deltaX = (b.width - a.width) / 2;
  var deltaY = (b.height - a.height) / 2;

  a.translate(deltaX, -deltaY);
}

function alignTopLeft(subject, base) {
  subject.translate(
    base.position[0] - subject.position[0],
    base.position[1] - subject.position[1]
  );
}
function alignTopCenter(subject, base) {
  alignTopLeft(subject, base);
  var deltaX = (base.width - subject.width) / 2;
  subject.translate(deltaX, 0);
}
function alignTopRight(subject, base) {
  alignTopLeft(subject, base);
  var deltaX = base.width - subject.width;
  subject.translate(deltaX, 0);
}

function alignMiddleLeft(subject, base) {
  alignTopLeft(subject, base);
  var deltaY = (base.height - subject.height) / 2;
  subject.translate(0, -deltaY);
}
function alignMiddleCenter(subject, base) {
  centerAInB(subject, base);
}
function alignMiddleRight(subject, base) {
  alignTopLeft(subject, base);
  var deltaX = base.width - subject.width;
  var deltaY = (base.height - subject.height) / 2;
  subject.translate(deltaX, -deltaY);
}

function alignBottomLeft(subject, base) {
  subject.translate(
    base.position[0] - subject.position[0],
    base.position[1] - subject.position[1]
  );
  var deltaY = base.height - subject.height;
  subject.translate(0, -deltaY);
}
function alignBottomCenter(subject, base) {
  centerAInB(subject, base);
  var deltaY = (base.height - subject.height) / 2;
  subject.translate(0, -deltaY);
}
function alignBottomRight(subject, base) {
  alignTopLeft(subject, base);
  var deltaX = base.width - subject.width;
  var deltaY = base.height - subject.height;
  subject.translate(deltaX, -deltaY);
}

function centerUpDown(subject,base){
  var lastX = subject.left;
  alignMiddleLeft(subject,base);
  subject.left = lastX;
}
function centerLeftRight(subject,base){
  var lastY = subject.top;
  alignTopCenter(subject,base);
  subject.top = lastY;
}

function centerFirstnamesPoemLastnames(group, template) {
  if (group) {
    const border = template.pageItems.getByName("border");

    var w = new Window("dialog", "Position");
    var p = w.add("panel", undefined, "چیدمان افقی");
    var g = p.add("group");
    g.alignment = "fill";

    // var leftBtn = g.add("button", undefined, "چپ");
    // var rightBtn = g.add("button", undefined, "راست");
    // ◀ ▶ ▲ ▼ ● ◤ ◥ ◣ ◢
    var tlBtn = g.add("button", undefined, "◤");
    var tcBtn = g.add("button", undefined, "▲");
    var trBtn = g.add("button", undefined, "◥");

    g = p.add("group");
    var mlBtn = g.add("button", undefined, "◀");
    var mcBtn = g.add("button", undefined, "●");
    var mrBtn = g.add("button", undefined, "▶");

    g = p.add("group");
    var blBtn = g.add("button", undefined, "◣");
    var bcBtn = g.add("button", undefined, "▼");
    var brBtn = g.add("button", undefined, "◢");

    g = p.add("group");
    var bottomBtn = g.add("button", undefined, "آدرس - پایین");
    var topBtn = g.add("button", undefined, "آدرس - بالا");

    g = p.add("group");
    var hourBtn = g.add("button", undefined, "ساعت برگزاری");

    p = w.add("panel",undefined,"ترازبندی یکطرفه");
    g = p.add("group");
    var btnUpDown = g.add("button",undefined,"↕")
    var btnLeftRight = g.add("button",undefined,"↔")

    // Center Event Handlers

    tlBtn.onClick = function () {
      alignTopLeft(group, border);
      w.close();
    };
    tcBtn.onClick = function () {
      alignTopCenter(group, border);
      w.close();
    };
    trBtn.onClick = function () {
      alignTopRight(group, border);
      w.close();
    };

    mlBtn.onClick = function () {
      alignMiddleLeft(group, border);
      w.close();
    };
    mcBtn.onClick = function () {
      alignMiddleCenter(group, border);
      w.close();
    };
    mrBtn.onClick = function () {
      alignMiddleRight(group, border);
      w.close();
    };

    blBtn.onClick = function () {
      alignBottomLeft(group, border);
      w.close();
    };
    bcBtn.onClick = function () {
      alignBottomCenter(group, border);
      w.close();
    };
    brBtn.onClick = function () {
      alignBottomRight(group, border);
      w.close();
    };

    btnUpDown.onClick = function(){
      centerUpDown(group,border);      
      w.close();
    }
    btnLeftRight.onClick = function(){
      centerLeftRight(group,border);
      w.close();
    }

    // leftBtn.onClick = function () {
    //   group.translate(
    //     border.position[0] - group.position[0],
    //     border.position[1] - group.position[1]
    //   );
    //   const borderHeight = border.height;
    //   group.translate(15, -borderHeight / 2 + group.height / 2);
    //   w.close();
    // };
    // rightBtn.onClick = function () {
    //   group.translate(
    //     border.position[0] - group.position[0],
    //     border.position[1] - group.position[1]
    //   );
    //   const borderHeight = border.height;
    //   group.translate(
    //     border.width - group.width - 15,
    //     -borderHeight / 2 + group.height / 2
    //   );
    //   w.close();
    // };

    // Address Event Handlers
    topBtn.onClick = function () {
      var subject = app.activeDocument.selection[0];
      var talarGroup;
      try {
        talarGroup = app.activeDocument.layers
          .getByName("Content")
          .pageItems.getByName("date")
          .pageItems.getByName("خالی");
      } catch (e) {
        talarGroup = app.activeDocument.layers
          .getByName("Content")
          .pageItems.getByName("date").pageItems[0];
      }

      var destination = talarGroup.pageItems.getByName("بالا");

      centerAInB(subject, destination);
      destination.hidden = true;

      subject.move(talarGroup, ElementPlacement.PLACEATEND);
      subject.name = "آدرس بالا";
      w.close();
    };
    bottomBtn.onClick = function () {
      var subject = app.activeDocument.selection[0];
      var talarGroup;
      try {
        talarGroup = app.activeDocument.layers
          .getByName("Content")
          .pageItems.getByName("date")
          .pageItems.getByName("خالی");
      } catch (e) {
        talarGroup = app.activeDocument.layers
          .getByName("Content")
          .pageItems.getByName("date").pageItems[0];
      }

      var destination = talarGroup.pageItems.getByName("پایین");

      centerAInB(subject, destination);
      destination.hidden = true;

      subject.move(talarGroup, ElementPlacement.PLACEATEND);
      subject.name = "آدرس پایین";
      w.close();
    };

    hourBtn.onClick = function () {
      var subject = app.activeDocument.selection[0];
      var destination = app.activeDocument.layers
        .getByName("Content")
        .pageItems.getByName("date").pageItems[4];
      centerAInB(subject,destination)
      destination.hidden = true;
      w.close();
    };

    //border.geometricBounds()[3] - border.geometricBounds()[1]
    w.show();
  }
}

(function () {
  try {
    const template = app.activeDocument.layers.getByName("Template");
    if (!app.selection || app.selection.length === 0) {
      alert("Select something first");
    }
    centerFirstnamesPoemLastnames(app.selection[0], template);
  } catch (e) {
    alert("وجود لایه تمپلیت و یا آیتم بوردر الزامیست");
  }
})();

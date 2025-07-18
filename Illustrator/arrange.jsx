function getKeyObjectFromSelection() {
  // Check if there's a selection
  if (app.documents.length === 0 || app.activeDocument.selection.length === 0) {
    alert("No selection or no document open");
    return null;
  }

  var selection = app.activeDocument.selection;
  var keyObject = null;
  app.activeDocument.selection;

  // Loop through all selected items
  for (var i = 0; i < selection.length; i++) {
    var item = selection[i];

    // The key object is the only one that returns true for isKeyObject
    if (item.isKeyObject) {
      keyObject = item;
      break;
    }
  }

  return keyObject;
}

// Usage example:
// var keyObj = getKeyObjectFromSelection();
// if (keyObj) {
//   alert("Key object found: " + keyObj.typename + "\nName: " + (keyObj.name || "unnamed"));
// } else {
//   alert("No key object in selection");
// }
if (app.activeDocument.selection.length !== 0) {
  var maxHeight = 0;
  var clone = [];
  for (var index = 0; index < app.activeDocument.selection.length; index++) {
    clone.push(app.activeDocument.selection[index]);
    if (clone[index].height > maxHeight) {
      maxHeight = clone[index].height;
    }
  }
  clone.sort(function (a, b) {
    return Math.abs(a.top) - Math.abs(b.top);
  });

  var key = clone[0];

  // for (var index = 1; index < clone.length; index++) {
  //   var current = clone[index];
  //   current.left = key.left;
  //   current.top = key.top;
  //   current.translate(key.width - current.width, -1 * index * maxHeight );
  // }
  function cm_to_pt(a) {
    return a * 28.346;
  }

  function reArrange(s) {
    var space = cm_to_pt(s);
    for (var index = 1; index < clone.length; index++) {
      var current = clone[index];
      current.left = key.left;
      current.top = clone[index - 1].top;
      current.translate(
        key.width - current.width,
        -1 * (clone[index - 1].height + space)
      );
    }
  }

  var w = new Window("dialog");
  var p = w.add("panel", undefined, "فاصله بین خطوط");
  
  var g = p.add("group");
  g.preferredSize.height = 50;
  g.margins = 10;
  var btn0 = g.add("button", undefined, "0");
  var btn005 = g.add("button", undefined, "0.05 cm");
  var btn01 = g.add("button", undefined, "0.1 cm");
  var btn02 = g.add("button", undefined, "0.2 cm");
  btn0.onClick = function () {
    reArrange(cm_to_pt(0));
    w.close();
  };
  btn005.onClick = function () {
    reArrange(cm_to_pt(0.0017));
    w.close();
  };
  btn01.onClick = function () {
    reArrange(cm_to_pt(0.0034));
    w.close();
  };
  btn02.onClick = function () {
    reArrange(cm_to_pt(0.0068));
    w.close();
  };
  w.show();
}

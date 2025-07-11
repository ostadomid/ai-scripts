function isRedFill(fillColor) {
  // if(fillColor.typename==="CMYKColor") {
  //    alert(fillColor.cyan+"*"+fillColor.magenta+"*"+fillColor.yellow+"*"+fillColor.black)
  // };
  return (
    (fillColor.typename === "RGBColor" &&
      fillColor.red === 235 &&
      fillColor.green === 33 &&
      fillColor.blue === 39) ||
    (fillColor.typename === "CMYKColor" &&
      (0.78125 - fillColor.cyan <1) &&
      (99.21875 - fillColor.magenta<1)  &&
      (96.875-fillColor.yellow <1) &&
      fillColor.black === 0)
  );
}

function selectRedItemsInContainer(container) {
  for (var i = 0; i < container.pageItems.length; i++) {
    var item = container.pageItems[i];

    if (item.typename === "GroupItem") {
      // Recurse into groups
      selectRedItemsInContainer(item);
    } else if (item.typename === "PathItem" && item.filled) {
      try {
        if (isRedFill(item.fillColor)) {
          item.selected = true;
        }
      } catch (e) {
        // Some items may throw errors when accessing fillColor
      }
    } else if (
      item.typename === "CompoundPathItem" &&
      item.pathItems.length > 0
    ) {
      // Compound paths have nested pathItems
      var subItem = item.pathItems[0];
      if (subItem.filled && isRedFill(subItem.fillColor)) {
        item.selected = true;
      }
    }
  }
}

function selectAllRedItems() {
  if (app.documents.length === 0) {
    alert("No document open.");
    return;
  }

  var doc = app.activeDocument;
  doc.selection = null;

  selectRedItemsInContainer(doc);

  if (doc.selection.length === 0) {
    alert("No red-filled items found.");
  } else {
    alert(doc.selection.length + " red-filled items selected.");
  }
}

selectAllRedItems();

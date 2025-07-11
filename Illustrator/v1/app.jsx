

function centerFirstnamesPoemLastnames(group,template){
  if(group){
    const safeArea = template.pageItems.getByName("safeAreaGuide");
    
    //alert(safeArea.position.join("-"));
    group.translate(safeArea.position[0] - group.position[0],  safeArea.position[1] - group.position[1]);    
    const safeAreaHeight = safeArea.height
    // alert(safeAreaHeight);
    group.translate( safeArea.width - group.width - 15 ,-safeAreaHeight/2 + (group.height/2));
    //safeArea.geometricBounds()[3] - safeArea.geometricBounds()[1]
  }
}

(function () {
  // const content = app.activeDocument.layers[0];
  const template = app.activeDocument.layers[1];

  // const templateItems = template.pageItems;
  // const contentItems = content.pageItems;

  // const firstNames = templateItems.getByName("firstNames");
  // const lastNames = templateItems.getByName("lastNames");

  // const newFirstNames = contentItems[contentItems.length - 1];
  // const newLastNames = contentItems[contentItems.length - 2];



  // if (firstNames) {
  //   newFirstNames.top = firstNames.top;
  //   newFirstNames.left =
  //     firstNames.left + firstNames.width / 2 - newFirstNames.width / 2;
  //   firstNames.hidden = true;
  // }
  // if (lastNames) {
  //   newLastNames.top = lastNames.top;
  //   newLastNames.left =
  //     lastNames.left + lastNames.width / 2 - newLastNames.width / 2;
  //   lastNames.hidden = true;
  // }
  const selection = app.activeDocument.selection;
  centerFirstnamesPoemLastnames(selection[0],template);
  
  // const w = new Window("dialog", "Day",);
  // w.add("statictext").text="Hello and welcome to my fu*cking app. :D"
  // const panel = w.add("panel");
  // panel.alignment="fill"
  // const group = panel.add("group");
  // group.alignment="fill"

  
  // const btn = group.add("button",undefined,"Folder")
  // const text = group.add("statictext", undefined, "Hello Love", { truncate: "none" });
  
  
  // btn.onClick = function(){
  //   text.text="Oops One Two Three Four Five Six Seven Eight"
  // }

  // w.show();
})();

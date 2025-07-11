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

(function(){
  const template = app.activeDocument.layers.getByName("Template")
  centerFirstnamesPoemLastnames(app.selection[0],template);
})()
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
function alignMiddleRight(subject, base) {
  alignTopLeft(subject, base);
  var deltaX = base.width - subject.width;
  var deltaY = (base.height - subject.height) / 2;
  subject.translate(deltaX, -deltaY);
}


(function () {
  // Globals


  var template = app.activeDocument.layers.getByName("Template");
  var content = app.activeDocument.layers.getByName("Content");

  // Template Items
  var monasebat = template.pageItems.getByName("monasebat");
  var motovafa = template.pageItems.getByName("motovafa");
  var when = template.pageItems.getByName("when");
  var tashakkor = template.pageItems.getByName("tashakkor");
  var khanevade = template.pageItems.getByName("khanevade");
  var aramestan = template.pageItems.getByName("aramestan");
  var talar = template.pageItems.getByName("talar");
  var hozoorMazar = template.pageItems.getByName("hozoorMazar");

  // Content Items
  var L = content.pageItems.length
  var contentMonasebat = content.pageItems[L -1 ];
  var contentMotovafa = content.pageItems[L - 2];
  var contentWhen = content.pageItems[L -3 ];
  var contentTashakkor = content.pageItems[L  - 4];
  var contentKhanevade = content.pageItems[L - 5];
  var contentAramestan = content.pageItems[L  - 6 ];
  var contentTalar = content.pageItems[L - 7];

  var contentHozoorMazar = null;
  if (content.pageItems.length >= 8) {
    contentHozoorMazar = content.pageItems[L - 8];
  }

  contentMotovafa.resize(120,120);
  contentMonasebat.resize(80,80);
  contentWhen.resize(80,80);
  contentTashakkor.resize(80,80);
  contentKhanevade.resize(95,95);
  contentAramestan.resize(72,72);
  contentTalar.resize(72,72);
  

  centerAInB(contentMotovafa, motovafa);
  motovafa.hidden=true;
  
  centerAInB(contentMonasebat, monasebat);
  monasebat.hidden=true;
  
  centerAInB(contentWhen, when);
  when.hidden=true;
  
  centerAInB(contentTashakkor, tashakkor);
  tashakkor.hidden=true;
  
  centerAInB(contentKhanevade, khanevade);
  khanevade.hidden=true;
  
  alignMiddleRight(contentAramestan, aramestan);
  aramestan.hidden=true;
  
  alignMiddleRight(contentTalar, talar);
  talar.hidden=true;
  
  if(contentHozoorMazar){
    contentHozoorMazar.resize(68,68);
    centerAInB(contentHozoorMazar, hozoorMazar);
  }
  hozoorMazar.hidden=true;

})();

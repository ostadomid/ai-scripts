function insertPoem(where) {
  const textsFile = File("C:\\Users\\Nymph\\Downloads\\All-V2.ai");
  if (textsFile.exists) {
    const texts = app.open(textsFile);
    $.sleep(1000);
    const poemCode = prompt("Poem Code:", "100");
    const poem = texts.pageItems.getByName(poemCode);
    if (poem) {
      const item = poem.duplicate(where, ElementPlacement.PLACEATBEGINNING);
    }
    texts.close();
    return poemCode;
  }
}

(function () {
  const content = app.activeDocument.layers.getByName("Content");
  const poemCode = insertPoem(content);
  const poem = content.pageItems.getByName(poemCode);
  if (poem) {
    const art = app.activeDocument.artboards[0];
    const artWidth = art.artboardRect[2] - art.artboardRect[0];
    const artHeight = art.artboardRect[3] - art.artboardRect[1];
    const poemWidth = poem.geometricBounds[2] - poem.geometricBounds[0];
    const poemHeight = poem.geometricBounds[3] - poem.geometricBounds[1];

    poem.name = "poem-" + poemCode;
    poem.top = 0;
    poem.left = 0;
    poem.translate((artWidth - poemWidth) / 2, (artHeight - poemHeight) / 2);
  }
})();

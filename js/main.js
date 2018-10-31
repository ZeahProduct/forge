var bars = ["images/bronzebar.png", "images/ironbar.png", "images/silverbar.png", "images/goldbar.png", "images/mithrilbar.png", "images/uraniumbar.png", "images/lavabar.png", "images/lunarbar.png", "images/astralbar.png", "images/duskbar.png", "images/aquaticbar.png"];

function saveData() {
  if (localStorage.getItem("slots") === null) { // If data has not been saved
    localStorage.setItem("slots", JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])); // Create empty save data
  }

  var slotIndex = 0;
  var savedData = JSON.parse(localStorage.getItem("slots"));
  $(".grid-box").each(function() {
    var images = $(this).find(".grid-image");
    if (images.length > 0) { // If there is a bar in the slot
      savedData[slotIndex] = images[0].src; // Save the image
    } else {
      savedData[slotIndex] = 0;
    }
    slotIndex++;
  });
  localStorage.setItem("slots", JSON.stringify(savedData));
}

function loadData() {
  if (localStorage.getItem("slots") !== null) { // If data has been saved
    var slotIndex = 0;
    $(".grid-box").each(function() {
      var savedData = JSON.parse(localStorage.getItem("slots"));
      var savedSlot = savedData[slotIndex];
      if (savedSlot != 0) { // If user has bar saved in the slot
        var sourceArray = savedSlot.split("/");
        var sourceName = sourceArray[sourceArray.length - 1];
        this.innerHTML = '<img src="images/' + sourceName + '" class="grid-image" draggable="false">';
      }
      slotIndex++;
    });
  }

  $(function() {
    $(".grid-image").draggable({ containment:  $(".grid-image").parent().parent(), revert: true });
    $(".grid-box").droppable({drop: function(event, ui) {
      var firstElement = $(ui.draggable)[0];
      var secondElement = $(this).find("img")[0];
      var firstImage = $(ui.draggable).attr("src");
      var secondImage = $(this).find("img").attr("src");

      if (firstImage == secondImage && firstElement !== secondElement) { // If the tiers are the same and the bars are different
        if (firstImage != bars[bars.length - 1]) { // If not highest tier
          firstElement.src = bars[bars.indexOf(firstImage) + 1]; // Upgrade tier by 1
          secondElement.outerHTML = ""; // Remove extra bar
          saveData();
        }
      } else if (!secondImage) { // If dragging to an empty space
        var sourceArray = firstImage.split("/");
        var sourceName = sourceArray[sourceArray.length - 1];
        $(this).html('<img src="images/' + sourceName + '" class="grid-image" draggable="false">');
        $(this).find(".grid-image").draggable({ containment:  $(".grid-image").parent().parent(), revert: true });
        firstElement.outerHTML = "";
      } else if (firstImage != secondImage) { // If the tiers are different
        var firstSrc = firstImage;
        firstElement.src = secondImage;
        secondElement.src = firstSrc;
      }
    }});
  })
}

function newBar() {
  var boxes = document.getElementsByClassName("grid-box");
  var images = document.getElementsByClassName("grid-image");
  if (images.length < boxes.length) {
    var firstWithoutImage = $(".grid-box:not(:has(img))")[0];
    firstWithoutImage.innerHTML = '<img src="images/bronzebar.png" class="grid-image" draggable="false">';
    $(firstWithoutImage).find(".grid-image").draggable({ containment:  $(".grid-image").parent().parent(), revert: true });
  }
  saveData();
}

loadData();

setInterval(newBar, 5000);

var siteWidth = 1280;
var scale = screen.width /siteWidth

document.querySelector('meta[name="viewport"]').setAttribute('content', 'width='+siteWidth+', initial-scale='+scale+'');

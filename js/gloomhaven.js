(function() {
  'use strict';
  generateOptions(monsters);

  // If there is already a monster selected, this function calls on draw card.
  // Otherwise, it toggles the monster select modal.
  $('.monster-card img').click(function (event) {
    var currentDeck = $(event.target).closest('.monster-card');
    if (!currentDeck.attr('data-monster')) {
      $('.monster-select-modal').hide();
      currentDeck.find('.monster-select-modal').toggle();
    } else {
      console.log('Draw a card');
    }
  })

  // This function should listen for a selection on the modal.
  $('.monster-select-modal li').click(function (event) {
    setDeck(event);
  });

  // This function listens for clicks on the clear button.
  $('.clear-monster').click(function (event) {
    clearMonster(event.target.closest('.monster-card'));
  })

  // This function clears the current monster type from a deck.
  function clearMonster(targetDeck) {
    $(targetDeck).attr('data-monster', '');
    $(targetDeck).find('h2').text('Click to Select Monster');
    $(targetDeck).find('.clear-monster').hide();
  }

  // This function should apply the chosen monster to the correct deck.
  function setDeck(event) {
    var monsterSelection = event.target.dataset.value;
    console.log(event);
    var currentDeck = $(event.target).closest('.monster-card');
    currentDeck.attr('data-monster', monsterSelection);
    currentDeck.find('h2').text(monsterSelection);
    currentDeck.find('.clear-monster').show();
    $('.monster-select-modal').hide();
  }

  // This function generates the list of monsters from the data.
  function generateOptions(data) {
    console.log('This is a flag');
    var ul = $('.monster-select-modal ul');

    $.each(data, function (each) {
      var li = $('<li/>').attr('data-value', each).text(each).appendTo(ul);
    })
  }
})();

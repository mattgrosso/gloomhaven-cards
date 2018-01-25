(function() {
  'use strict';
  generateOptions(monsters);

  // If there is already a monster selected, this function calls on draw card.
  // Otherwise, it toggles the monster select modal.
  $('.monster img').click(function (event) {
    var currentMonster = $(event.target).closest('.monster');
    if (!currentMonster.attr('data-monster')) {
      $('.monster-select-modal').hide();
      currentMonster.find('.monster-select-modal').toggle();
    } else {
      drawCard(currentMonster);
    }
  })

  // This function listens for a selection on the modal.
  $('.monster-select-modal li').click(function (event) {
    setDeck(event);
  });

  // This function listens for clicks on the clear button.
  $('.clear-monster').click(function (event) {
    clearMonster(event.target.closest('.monster'));
  })

  // This function clears the current monster type from a deck.
  function clearMonster(targetMonster) {
    delete decksInUse[targetMonster.id];
    $(targetMonster).attr('data-monster', '');
    $(targetMonster).find('h2').text('Click to Select Monster');
    $(targetMonster).find('.clear-monster').hide();
  }

  // This function should apply the chosen monster to the correct deck.
  // The deck is held in 'decksInUse' under it's 'monster-number' ID.
  function setDeck(event) {
    var monsterClass = event.target.dataset.value;
    var currentMonster = $(event.target).closest('.monster');
    var monsterDeckIndex = findMonsterDeckIndex(monsterClass);

    decksInUse[currentMonster[0].id] = {
      class: monsterClass,
      index: monsterDeckIndex,
      remainingValues: [0, 1, 2, 3, 4, 5, 6, 7]
    };

    currentMonster.attr('data-monster', monsterClass);
    currentMonster.find('h2').text(monsterClass);
    currentMonster.find('.clear-monster').show();
    $('.monster-select-modal').hide();
  }

  // This function should look at the deck that was clicked and reveal a random
  // card from that deck's remaining cards.
  function drawCard(currentMonster) {
    var currentDeck = decksInUse[currentMonster[0].id];
    var randomIndex = Math.floor(Math.random() * currentDeck.remainingValues.length);
    var randomValue = currentDeck.remainingValues.splice(randomIndex, 1);
    var randomCard = DECKS[currentDeck.index].cards[randomValue];

    if (randomCard[0]) {
      currentDeck.remainingValues = [0, 1, 2, 3, 4, 5, 6, 7]
    }
    
    return randomCard;
  }

  // This function takes in a monster class and returns the index value for the
  // appropriate monster deck object from the data.
  function findMonsterDeckIndex(monsterClass) {
    let monsterDeckIndex;

    DECKS.forEach(function (each, index) {
      if (each.class === monsterClass) {
        monsterDeckIndex = index;
      }
    })

    return monsterDeckIndex;
  }

  // This function generates the list of monsters from the data.
  function generateOptions(data) {
    var ul = $('.monster-select-modal ul');

    data.forEach(function (each) {
      var li = $('<li/>').attr('data-value', each.class).text(each.name).appendTo(ul);
    })
  }
})();

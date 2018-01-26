(function() {
  'use strict';
  generateOptions(monsters);

  // If there is already a monster selected, this function calls on draw card.
  // Otherwise, it toggles the monster select modal.
  $('.monster').click(function (event) {
    clickDeck(event);
  })

  // This function listens for a selection on the modal.
  $('.monster-select-modal li').click(function (event) {
    setDeck(event);
  });

  // This function listens for clicks on the clear button.
  $('.clear-monster').click(function (event) {
    event.stopPropagation();
    clearMonster(event.target.closest('.monster'));
  })




  // This function should add a new card to the DOM whenever clicked.
  $('.add-deck').click(function (event) {
    var deckCount = $('.monster').length + 1;
    var newDeck = $('#monster-template').clone().attr('id', `monster-${deckCount}`);
    newDeck.click(function (event) {
      clickDeck(event);
    });
    newDeck.find('.monster-select-modal li').click(function (event) {
      setDeck(event)
    });
    newDeck.find('.clear-monster').click(function (event) {
      event.stopPropagation();
      clearMonster(event.target.closest('.monster'));
    })
    $('.decks-wrapper').append($(newDeck));
  })

  // This function triggers on click of a deck
  function clickDeck(event) {
    var currentMonster = $(event.target).closest('.monster');
    if (!currentMonster.attr('data-monster')) {
      $('.monster-select-modal').hide();
      currentMonster.find('.card-back').hide();
      currentMonster.find('.card-front').show();
      currentMonster.find('.monster-select-modal').toggle();
    } else {
      showStats(drawCard(currentMonster), currentMonster);
    }
  }

  // This function clears the current monster type from a deck.
  function clearMonster(targetMonster) {
    delete decksInUse[targetMonster.id];
    $(targetMonster).attr('data-monster', '');
    $(targetMonster).find('h2').text('Click to Select Monster');
    $(targetMonster).find('.card-back').show();
    $(targetMonster).find('.card-front').hide();
    $(targetMonster).find('.clear-monster').hide();
    $(targetMonster).find('.card-stats').children().removeClass('primary secondary');
    $(targetMonster).find('.card-stats').hide();
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

  // This function will display the given stats on the appropriate cards
  function showStats(card, monster) {
    $(monster).find('.card-stats').show().children().text('').removeClass('primary secondary');
    var parsedCard = parseCard(card);
    $(monster).find('.initiative').text(parsedCard.initiative);
    try {
      if (parsedCard.refresh) {
        $(monster)
          .find('.reshuffle')
          .html('<img class="reshuffle" src="/images/icons/shuffle.svg">')
      }
      $(monster)
        .find('.stat-1')
        .html(parseStatContents(parsedCard.line1.content))
        .addClass(parsedCard.line1.primaryOrSecondary);
      $(monster)
        .find('.stat-2')
        .html(parseStatContents(parsedCard.line2.content))
        .addClass(parsedCard.line2.primaryOrSecondary);
      $(monster)
        .find('.stat-3')
        .html(parseStatContents(parsedCard.line3.content))
        .addClass(parsedCard.line3.primaryOrSecondary);
      $(monster)
        .find('.stat-4')
        .html(parseStatContents(parsedCard.line4.content))
        .addClass(parsedCard.line4.primaryOrSecondary);
    } catch (e) {
      // I should probably do something here but, to be honest, it's only failing
      // because the line it is trying to join doesn't exist. It's not a big deal.
    }
  }

  // This function will take in the content of a stat line and return it with the
  // appropriate HTML string to be inserted.
  function parseStatContents(statLine) {
    var parsedContents = [];
    statLine.forEach(function (each) {
      if (each.includes('%')) {
        if (each.includes('use_element')) {
          var useElementSplit = each.split('%');
          parsedContents.push(`<img class="stat-icon" src="/images/icons/use_${useElementSplit[1]}.svg"> :`)
        } else {
          var titleOnly = each.replace(/%/g, '')
          parsedContents.push(`<img class="stat-icon" src="/images/icons/${titleOnly}.svg">`)
        }
      } else {
        parsedContents.push(each)
      }
    })
    return parsedContents.join(' ');
  }

  // This function should determine if something is a primary action or a secondary action
  function parseCard(card) {
    var parsedCard = {
      refresh: card[0],
      initiative: card[1],
    }

    if (card[2]) {
      parsedCard.line1 = {
        primaryOrSecondary: primaryOrSecondary(card[2].split(' ')[0]),
        content: card[2].split(' ').splice(1)
      }
    }
    if (card[3]) {
      parsedCard.line2 = {
        primaryOrSecondary: primaryOrSecondary(card[3].split(' ')[0]),
        content: card[3].split(' ').splice(1)
      }
    }
    if (card[4]) {
      parsedCard.line3 = {
        primaryOrSecondary: primaryOrSecondary(card[4].split(' ')[0]),
        content: card[4].split(' ').splice(1)
      }
    }
    if (card[5]) {
      parsedCard.line4 = {
        primaryOrSecondary: primaryOrSecondary(card[5].split(' ')[0]),
        content: card[5].split(' ').splice(1)
      }
    }
    return parsedCard;
  }

  function primaryOrSecondary(string) {
    if (string === '*') {
      return 'primary';
    } else if (string === '**') {
      return 'secondary';
    } else {
      return false;
    }
  }
})();

#!/bin/bash

# Array of ranks and suits
ranks=("A" "2" "3" "4" "5" "6" "7" "8" "9" "10" "J" "Q" "K")
suits=("H" "D" "C" "S")

# Download each card image
for rank in "${ranks[@]}"; do
  for suit in "${suits[@]}"; do
    echo "Downloading ${rank}${suit}.png..."
    # Special handling for 10 cards
    if [ "$rank" = "10" ]; then
      curl -s "https://deckofcardsapi.com/static/img/0${suit}.png" -o "public/cards/${rank}${suit}.png"
    else
      curl -s "https://deckofcardsapi.com/static/img/${rank}${suit}.png" -o "public/cards/${rank}${suit}.png"
    fi
  done
done

# Download the back of the card
echo "Downloading back.png..."
curl -s "https://deckofcardsapi.com/static/img/back.png" -o "public/cards/back.png"

echo "All card images downloaded successfully!" 
# Game Repository

Per the [assignment](https://docs.google.com/document/d/1WFllqnmhnDbdjO6qw19XHHcWAC97rhAiEx20Nz7_ksI/edit?tab=t.0#heading=h.xprnecc3op0m) this is a custom game. 

This game was created by prompting GPT [here](https://chatgpt.com/share/67aa48ea-6eb0-800e-ae13-de80a1c943b3)

## Game Description
### AI Trick-Taking Grid
- Grid: 5×5 grid
- Deck: Standard deck, face cards only
- Rules:
    - Each turn, players place a face card on the grid.
    - Rows and columns form mini "tricks," and when a row/column fills, the player with the strongest total value wins control of it.
    - Certain patterns grant extra bonuses (e.g., having all four suits in a row gives extra points).
    - The game ends when the board is full, and the player with the most controlled areas wins.


### AI Trick-Taking Grid – Detailed Concept
#### Game Overview
A 5×5 grid-based trick-taking game where you and ChatGPT take turns placing face cards (J, Q, K) to control rows and columns. Each completed row/column is scored like a trick in a trick-taking game, with bonuses for specific patterns.

#### Hidden vs. Visible Information
Mostly visible: The grid and placed cards are always visible.
Some hidden randomness: Players draw cards from a shuffled deck, so you don't always know what the AI has available.

#### Game Mechanics
##### Deck & Setup

The deck consists only of face cards (J, Q, K) from all four suits (12 unique cards, multiple copies).
Each player starts with a hand of 5 random face cards.
The grid starts empty.

##### Turn Structure

Players take turns placing one card onto an empty space on the 5×5 grid.
Once placed, the card's value contributes to the row and column it occupies.

##### Trick-Taking & Scoring

When a row or column is completely filled (5 cards), it resolves as a "trick":
The player who has the highest total strength in the row/column wins control of it.
Strength is determined by face values (J=11, Q=12, K=13).
If tied, control goes to the player with more cards of the winning suit in the row/column.

**Examples**

1. Row Control Example:
```json
{
  "grid": [
    ["KH", "QS", "JD", "KS", "QH"],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null]
  ]
}
```
In this example, the top row is complete. Total value = 61 (K=13, Q=12, J=11, K=13, Q=12). If Player 1 played 3 of these cards and Player 2 played 2, Player 1 would control this row.

2. Suit Tiebreaker Example:
```json
{
  "grid": [
    [null, null, null, null, null],
    ["KH", "KS", "KD", "KC", "QH"],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null]
  ]
}
```
In this row, both players have the same total value (K=13 × 4 + Q=12 = 64). If Player 1 played KH, KD, QH and Player 2 played KS, KC, Player 1 would win control because they played more Hearts.

3. In-Progress Game Example:
```json
{
  "grid": [
    ["KH", "QS", "JD", null, null],
    [null, "KC", null, "QH", "JH"],
    ["KS", null, "QD", null, null],
    [null, null, "KD", null, "QC"],
    ["JC", null, null, null, null]
  ],
  "hands": {
    "player": ["JS", "QS", "JD", "KH", "QD"],
    "ai": ["KS", "QH", "KC", "JH", "JC"]
  },
  "turn": "player"
}
```
This shows a mid-game state where several rows and columns are partially complete. Players must consider both immediate trick completion opportunities and setting up future winning combinations.

### Playing against AI

Example board layout: 

```json
{
  "grid": [
    ["QH", "KS", "JD", null, null],
    [null, "KC", null, "QS", "JH"],
    [null, null, null, null, null],
    ["QH", null, "KH", null, null],
    ["JC", null, null, "KD", "QD"]
  ],
  "hands": {
    "player": ["JC", "QS", "JD", "KH", "KD"],
    "ai": ["KS", "QH", "KC", "JH", "QD"]
  },
  "turn": "player"
}
```

`grid` represents the current state of the board. Each card is stored as `RankSuit` (e.g., `QH` for Queen of Hearts). Empty spaces are null.
`hands` contains each player's remaining cards.
`turn` determines whose turn it is.

#### ChatGPT Interaction Prompt Example
When passing the JSON, you'd prompt GPT like:

"Given the following game state, choose the best move for AI to place one card on the grid: `[JSON_HERE]`. Respond with the row and column where the AI should place its card."

GPT would return something like:

```json
{ "move": [2, 3], "card": "KS" }
```

This means the AI should place its card in row 2, column 3.

# Technical Roadmap

## 1. Core Data Structures [ ]
- [ ] Card class (rank, suit, value)
- [ ] Grid class (5x5)
- [ ] Player class (hand, score)
- [ ] Game State class (grid, players, turn, game phase)

## 2. Game Engine [ ]
- [ ] Deck management
  - [ ] Deck creation (face cards only)
  - [ ] Shuffling mechanism
  - [ ] Card dealing system
- [ ] Game Rules Implementation
  - [ ] Valid move validation
  - [ ] Turn management
  - [ ] Row/Column completion detection
  - [ ] Scoring system
    - [ ] Basic scoring (J=11, Q=12, K=13)
    - [ ] Suit tiebreaker logic
    - [ ] Pattern bonus calculations
- [ ] Game Flow Control
  - [ ] Game initialization
  - [ ] Turn progression
  - [ ] End game detection
  - [ ] Winner determination

## 3. AI Implementation [ ]
- [ ] Basic AI move generation
- [ ] Strategic decision making
  - [ ] Row/Column analysis
  - [ ] Pattern recognition
  - [ ] Score optimization
- [ ] AI difficulty levels (optional)

## 4. User Interface [ ]
- [ ] Grid visualization
- [ ] Card representation
- [ ] Player hand display
- [ ] Score display
- [ ] Turn indicators
- [ ] Move input system
- [ ] Game status messages

## 5. Game State Management [ ]
- [ ] Save/Load game state
- [ ] Game history tracking
- [ ] State serialization (JSON format)
- [ ] Error handling

## 6. Testing [ ]
- [ ] Unit tests for core logic
- [ ] Integration tests
- [ ] AI behavior testing
- [ ] Edge case testing
- [ ] Performance testing

## 7. Documentation [ ]
- [ ] Code documentation
- [ ] API documentation
- [ ] User guide
- [ ] Development guide

## 8. Optional Enhancements [ ]
- [ ] Multiplayer support
- [ ] Statistics tracking
- [ ] Achievement system
- [ ] Different grid sizes
- [ ] Custom rule variations

## 9. Deployment [ ]
- [ ] Build system setup
- [ ] Environment configuration
- [ ] Release management
- [ ] Version control strategy

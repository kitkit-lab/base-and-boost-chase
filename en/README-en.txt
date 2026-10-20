============================================================
Official Game Manual: Base & Boost Chase
============================================================

[1. Game Overview]
The rules of a game that appeared in my dream felt vaguely familiar yet uniquely non-existent, so I decided to bring it to life as a real, playable game.
It somewhat feels like B●latro, and it also echoes the bonus game vibes of a certain Pachislot title (●-Monogatari), but well... that's exactly how dreams are, isn't it?

"Base & Boost Chase" is a blackjack-style blackjack-inspired push-your-luck card game where players compete for the highest total score by alternating through two distinct scoring mechanics: "Base Phase" (addition) and "Boost Phase" (multiplication). 
The core strategy lies in knowing when to push your luck and when to stop, balancing the race to accumulate massive foundation points in the first half against the terrifying risk of losing your multipliers in the second half.

[2. Game Flow]
The match automatically proceeds in a 4-step sequence (STAND is available only in Phase 2):
"Your Base" ➡ "AI's Base" ➡ "Your Boost" ➡ "AI's Boost"

[3. Phase-by-Phase Rules]
● Phase 1: Base Phase (54-Card Mixed Shared Deck / No Confiscation)
Objective: Draw cards continuously to pile up your foundation "Base Points" as high as possible.
- Initial State: Draw the 1st card from the shared deck to establish your initial base score. (If the card is 7 or lower, the phase begins in "UP" mode; if 8 or higher, it automatically begins in "DOWN" mode).
- Match Constraints: Choose to draw (HIT) continuously.
  * "UP" Mode: Succeed by drawing a card with a rank equal to or higher than the previous card.
  * "DOWN" Mode: Succeed by drawing a card with a rank equal to or lower than the previous card.
- Scoring: J = +11 pts, Q = +12 pts, K = +13 pts. Number cards add their face value. JOKER adds +10 pts.
- Special Cards 【A】 & 【7】: Guarantees 100% safety regardless of constraints. Adds its points, reverses the active mode (UP ⇄ DOWN), and grants an absolute free pass (guaranteed success) for the next draw.
- Special Card 【JOKER】: Adds +10 points, resets the target constraint, and grants a free pass for the next draw.
- 【Streak Bonus: Suit Shield】: Every time your total drawn cards reach a multiple of 7 (7, 14, 21, etc.), you earn a Suit Shield (Barrier) that stacks infinitely to protect your multipliers in Phase 2.
- Ending the Phase: Drawing a card that breaks the constraints immediately ends your phase. All Base Points accumulated up to that point are permanently locked and saved (never lost).

● Phase 2: Boost Phase (Face Card Only Deck / Multiplier Reset)
Objective: Risk everything to multiply the Base Points you secured in Phase 1.
- Initial State: Both you and the AI start with a completely fresh, independent 13-card Face Deck (4 each of J, Q, K + 1 JOKER).
- First Card Rule: If your initial card is a Q (+1x) or K (+2x), it establishes that multiplier. Drawing a J or number card sets your starting multiplier to 1.0x.
- Match Constraints: Succeed by drawing a card of the SAME suit or a STRONGER suit (♠ ＞ ♥ ＞ ♦ ＞ ♣) than the previous card.
- Multiplier Gains: Upon a successful match, the following multipliers are added:
  * J = +0x (Does not increase multiplier, but safely extends your suit streak)
  * Q = +1x
  * K = +2x
  * JOKER = +3x (Includes an automatic constraint reset)
- Safety via 【STAND】: Before drawing, you can STAND at any time to lock in your current multipliers safely and secure your final score.
- 【Multiplier Reset Penalty】: If you draw a weaker suit and fail a match, your multiplier is instantly crushed back to 1.0x and your turn ends. However, the Base Points you earned in Phase 1 are safely protected!
- 【Shield Activation】: If you earned any Shield stocks during Phase 1, one Shield will automatically break upon failure, completely negating the penalty and letting you continue the combo (the suit target is reset to the weakest status).

[4. Core System: Hold Slot (Absolute Defense)]
- You can use the Hold function once per phase, independently.
- HOLD (Save): Move your current card into the slot and deal a new card to the field.
- USE HOLD (Activate): Overwrite the dangerous field card with your held card.
- Activation Effect: Completely ignores rank constraints (in Phase 1) or suit constraints (in Phase 2) for an absolute 100% success, resetting the field target to maximum safety for the next turn.
*In other words, the moment a card is moved into the Hold slot, it gains the exact same absolute defense power as a JOKER.*

[5. Score Calculation & Victory]
Once all phases conclude, the final score is calculated:
Final Score = Total Base Points × Final Multiplier
The player with the highest total score wins the match.

[6. Infinite Reshuffle]
In both phases, if a deck runs out of cards, a brand-new identical deck is automatically generated and reshuffled into the game, allowing streaks to continue infinitely.

[7. Terms of Use & Publishing Conditions]
- Intellectual Property: The core game concept, innovative mechanics, and original rules belong entirely to the user.
- AI Collaboration Credit: The program code construction, code refactoring, and game balance tuning were co-developed with Google's AI assistant (LLM) serving as a collaborative partner.
- License: Open and completely free for both commercial and non-commercial usage. You are fully authorized to modify the rules, host the code on web platforms, develop standalone applications, manufacture physical indie board games, or stream gameplay videos. No prior permission or attribution is strictly required. However, a mention such as "A game materialized from a dream idea in collaboration with AI" would be deeply appreciated!

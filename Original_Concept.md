KAIROS’ COUNCIL
A Living Card Game of Cosmic Power
COMPLETE GAME DESIGN DOCUMENT
Version 4.0  ·  The Factory  ·  Confidential

"Timing is everything."
WHAT THIS GAME IS
A mobile-first living card game where players assemble councils of historical figures — calculated using real astronomical data — and compete using a power system governed by actual planetary transits. The cosmos is not background. The cosmos is the game master.
Entertainment on the surface. Skill development in the middle. Philosophical formation underneath.


PART I — BUILD PHILOSOPHY: THE BALATRO LESSON
1.1  The North Star Case Study
One anonymous developer. Two and a half years as a side project. Built in Lua while holding a day job. Never expected commercial success. Started as something to put on a resume.

Balatro Milestone
Timeline
What This Proves
First prototype
Dec 2021 — vacation from work
Core mechanic discoverable in days, not months
Shared with friends
~6 months in
Community validation before any polish
Friend plays for dozens of hours
~12 months in
The only signal that matters
Went full-time
Jan 2023 — 13 months in
Only after documented human validation
Launch day
Feb 20, 2024
$1M revenue in 8 hours. Profitable in 1 hour.
5 million copies sold
Jan 2025
7M+ by late 2025. Best Indie + Best Mobile at TGA 2024


The constraint is not team size. The constraint is whether the core loop generates the "holy shit" moment. Everything else is downstream of that.

1.2  Your Advantages Over LocalThunk
Existing engine: The Jean Meeus astronomical engine already lives in Prime Self. The hardest technical piece is 60% built.
Existing audience: The Prime Self practitioner network already thinks in this framework. LocalThunk had friends. You have practitioners.
Existing stack: Cloudflare Workers + Neon + Stripe — infrastructure you know, at near-zero cost at prototype scale.
The Factory: This is what The Factory exists to build. It directly monetizes everything built in Prime Self philosophy.

Your constraint vs. LocalThunk: Full-time employment at Herc Rentals. Multiple active projects. The build must fit reality, not ambition.

1.3  The Non-Negotiable Build Sequence
THE KAIROS’ COUNCIL BUILD SEQUENCE
  PHASE 0 ─────────────────────────────────────────────────────────────
  Port Meeus Engine → Generate 10 Cards → Local 2-Player Transit Match
  Target: 6-8 weeks on evenings/weekends                               
  Success gate: 1 human says "wait, this power is REAL?" and means it  
  ─────────────────────────────────────────────────────────────────────
  ↓ ONLY proceed after gate is passed                                   
  PHASE 1 ─────────────────────────────────────────────────────────────
  PWA. Cosmos display. Matchmaking. Account system. Staged onboarding. 
  Target: 3 months. 50 Prime Self practitioners in closed beta.         
  Success gate: D7 retention > 30%. Players explain why they won/lost.  
  ─────────────────────────────────────────────────────────────────────
  ↓ ONLY proceed after gate is passed                                   
  PHASE 2 ─────────────────────────────────────────────────────────────
  Economy. Pack opening. Stripe. Daily free pack. Battle pass.          
  Target: 2 months. First revenue. 500 players.                        
  ─────────────────────────────────────────────────────────────────────
  PHASE 3 ─────────────────────────────────────────────────────────────
  Live Events. Push notifications. Eclipse cooperative (2-player).      
  Target: 3 months.                                                     
  ─────────────────────────────────────────────────────────────────────
  PHASE 4 ─────────────────────────────────────────────────────────────
  Auto-battler Chart mode. Full 200-card set. Native iOS + Android.     
  Target: 4 months.                                                     
  ─────────────────────────────────────────────────────────────────────


PART II — THE PLAY EXPERIENCE
2.1  What Players Are Actually Doing
Kairos’ Council is a tactical card game where a third actor — the cosmos — constantly intervenes on a schedule both players can read in advance. Skilled players anticipate it. Casual players experience it as drama. Both are satisfied.

THREE SIMULTANEOUS LAYERS OF EVERY MATCH
  ┌──────────────────────────────────────────────────────────────┐     
  │  LAYER 1: THE COSMOS                                         │     
  │  What the sky is doing RIGHT NOW — visible to both players.  │     
  │  Neither player controls this. Both must respond to it.      │     
  └──────────────────────────────────┬───────────────────────────┘     
                                     │ governs                         
  ┌──────────────────────────────────▼───────────────────────────┐     
  │  LAYER 2: THE COUNCIL                                        │     
  │  Historical figures on your battlefield.                     │     
  │  Power = base floor + live transit calculation.              │     
  │  Aspect bonds form automatically when cosmos confirms.       │     
  └──────────────────────────────────┬───────────────────────────┘     
                                     │ drives                          
  ┌──────────────────────────────────▼───────────────────────────┐     
  │  LAYER 3: THE CLOCK                                          │     
  │  Your Transit Clock vs. opponent's. Race to 13.             │     
  │  Urgency engine that makes every turn matter.                │     
  └──────────────────────────────────────────────────────────────┘     


2.2  The Three Session Types
Mode
Duration
What You Are Doing
Core Feeling
1v1 Transit (PvP)
8–12 min
Racing Transit Clock to 13 while disrupting your opponent's. 3–4 decisions per turn: summon/hold, attack/respond, spend CE/bank, read Forecast.
Chess with a shifting board.
Eclipse (Co-op PvE)
20–30 min
Coordinating against Shadow AI during a real eclipse event. Every archetype role is necessary. No single deck wins alone.
Raid boss energy. Collective triumph.
Chart (Auto-Battler)
2 min async
Submit deck. Engine simulates. Receive narrative result + shareable card. Check it like a daily horoscope.
Daily ritual. High personality.


PART III — THE SKILL TRANSFER LAYER
3.1  Why This Is Not Accidental
Transfer learning through gameplay is documented and real. Skills transfer when the cognitive structure of the game is structurally identical to the cognitive structure of the real-world application. Guitar Hero does not teach guitar. Rocksmith — which requires actual guitar — does. Kairos’ Council is designed so that playing well IS practicing the skills required to navigate life effectively.

3.2  The Five Forge Schools as Life Force Archetypes

CHRONOS
Time & Consequence → In Life: Systemic Obstruction
Chronos damage delays, erodes, causes decay over time. This is how bureaucracy, procrastination, and institutional resistance actually work. Learning to counter Chronos trains recognition of: when systems are used to exhaust rather than decide, when delay is itself the strategy. Skill developed: long-horizon thinking, strategic patience.


EROS
Bond & Relationship → In Life: Isolation Tactics
Eros damage severs connections — cuts support networks, isolates powerful figures from their council. This maps to how power is wielded through relationship management. Skill developed: relational intelligence, alliance building, recognizing when communities are being strategically divided.


AETHER
Identity & Form → In Life: Gaslighting & Institutional Pressure
Aether attacks transform identity — strip alignment, force archetype shifts, make figures become something other than what they are. Playing against Aether teaches: naming and resisting identity erosion under pressure. Skill developed: identity stability, self-awareness under sustained pressure.


LUX
Clarity & Vision → In Life: Information Asymmetry as Weapon
Lux attacks distort information — show ranges instead of exact values, blur rather than remove. Learning to play through Lux attacks builds the most critical real-world skill: making good decisions when you don't have full information. Skill developed: probabilistic thinking, comfort with uncertainty.


PHOENIX
Vital Force → In Life: Strategic Sacrifice & Renewal
Phoenix is the only school with voluntary self-immolation. The lesson: sometimes the most powerful move is letting something die so it can return transformed. Most people never learn this. Skill developed: non-attachment to current form, trust in regeneration, strategic endings.


3.3  Archetype-to-Life-Skill Matrix
Archetype
Game Identity
Life Skill
Real-World Application
Sovereign
Clock suppression, authority stacks
Decisive leadership, accountability
Executive function, team leadership
Mystic
Information warfare, hidden engines
Pattern recognition, comfort with not-knowing
Strategic intelligence, systems analysis
Warrior
Phoenix chains, aggressive tempo
Risk tolerance, committed action
Entrepreneurship, athletic performance
Poet
Bond cultivation, CE compounding
Relational intelligence, community building
Team culture, creative leadership
Philosopher
Long-game engines, Chronos mastery
Long-horizon thinking, structural advantage
Research, strategic planning
Healer
Damage conversion, restoration
Transforming adversity into resource
Coaching, conflict resolution, community leadership


3.4  The Match Narrative as Skill Mirror
Format (v3 update — brevity fix): One headline line. One insight sentence. Fits a push notification. Gets read. Gets shared.

"You won during Jupiter Ascension.""You prepared before the window opened — timing beat force."
"Napoleon burned fast. The transit closed before your Clock hit 13.""Phoenix energy requires knowing when to sustain, not just when to strike."
"You fell during Mercury Fracture.""When information becomes unreliable, redundancy is the strategy."

PART IV — THE CARD SYSTEM
4.1  Transit Power Formula
TRANSIT POWER CALCULATION
  TRANSIT POWER = Base Floor + Transit Bonus + Aspect Bonus + Dignity Bonus
                                                                            
  Base Floor:    40  (equal for ALL figures — no raw tier bias)            
  Transit Bonus: Sum of (Exactness Score × Aspect Weight)                  
    Exactness:   10 at exact (0° orb) → 0 at 3° orb (linear decay)       
    Weights:     Conjunction 3.0×  |  Opposition 2.0×  |  Trine 1.8×      
                 Square 1.5×       |  Sextile 1.2×                        
  Aspect Bonus:  0–20 (natal aspect bonds active on battlefield)          
  Dignity Bonus: +10 domicile/exaltation  |  −5 detriment/fall            
  Retrograde:    Transit Bonus halved  |  Aether Forge Intensity ×2        
  Solar Return:  Within 7 days of birthday → automatic Ascendant status    
  RANGE:  40 (no transits) → 100 (exact conjunction, dignified, solar return)


4.2  Combat Damage — How Numbers Work
NEW v3: This section is new in v3. The v2 GDD specified suppression conditions but never defined base attack damage. This is the complete combat resolution system.

Base Attack Damage: A figure's attack deals damage equal to its current Transit Power × Forge Intensity (1–3). Forge Intensity is determined by how strongly the ruling planet is currently activated.

COMBAT DAMAGE RESOLUTION
  ATTACK DAMAGE = Transit Power × Forge Intensity × Forge Matchup Modifier
                                                                            
  Example:                                                                  
  Napoleon (Transit Power 78) attacks with Phoenix Forge (Intensity 2)     
  Target: Nostradamus (Aether Forge) → neutral matchup (1.0×)              
  Damage = 78 × 2 × 1.0 = 156                                             
                                                                            
  Nostradamus current Transit Power: 95                                    
  156 < 95? No. 156 ≥ 95. SUPPRESSED.                                      
                                                                            
  Forge Matchup Modifier:                                                   
    Strong against:  1.1×   |   Neutral: 1.0×   |   Weak against: 0.9×   
                                                                            
  Dormant figures defending:  damage threshold = Transit Power × 0.5       
  (Dormant figures require half the damage to suppress — they are weaker)  


Forge Intensity (1–3) is determined by the Event Mapper: 1 = ruling planet more than 5° from any exact aspect. 2 = ruling planet within 5° of an exact aspect. 3 = ruling planet within 1° of exact aspect or a named Celestial Event is active.

4.3  Visible Causality Display
VISIBLE CAUSALITY DISPLAY — Card Detail View
  ┌─ NAPOLEON BONAPARTE ─────────────────────── TRANSIT POWER: 78 ──┐  
  │  Base Floor                                 +40                  │  
  │  Mars conjunct natal Sun (0.4°)             +24  [Phoenix ×2]   │  
  │  Dignity Bonus (Mars in Aries)              +10                  │  
  │  Solar Return window (4 days remaining)     + 4                  │  
  │                                             ────                 │  
  │  STATUS: ASCENDANT  ████████████████░░  78/100                  │  
  │  FORGE INTENSITY: 2  (Mars within 3° of exact aspect)           │  
  │  BASE ATTACK DAMAGE: 78 × 2 = 156 before matchup modifier       │  
  │  TRANSIT WINDOW: 3 days remaining                                │  
  │  ASPECT BONDS: Joan of Arc (Square — volatile, 30% misfire)     │  
  └──────────────────────────────────────────────────────────────────┘  


4.4  Chart Confidence Tiers
Tier
Criteria
Stat Treatment
Verified
Documented birth date + time + location
Full chart — all 12 houses, all aspects calculated
Estimated
Date known, location known, time uncertain
Planetary positions only — house system locked
Attributed
Historical consensus date, uncertain accuracy
Sun sign and dominant aspects only
Legendary
Mythological or traditional attribution only
Fixed traditional stats — not transit-modified


PART V — THE SIX KNOWLEDGE ARCHETYPES
5.1  The Knowledge Wheel
THE KNOWLEDGE WHEEL — Archetype Adjacency
                      ┌─────────────┐                                 
                      │  SOVEREIGN  │                                 
                      │  Authority  │                                 
            ┌─────────┤   Control   ├─────────┐                      
            │         └─────────────┘         │                      
   ┌────────┴───┐                       ┌─────┴──────────┐           
   │ PHILOSOPHER│                       │    WARRIOR     │           
   │  Systems   │                       │  Aggression    │           
   │   Logic    │                       │  Sacrifice     │           
   └────────┬───┘                       └─────┬──────────┘           
   ┌────────┴───┐                       ┌─────┴──────────┐           
   │   MYSTIC   │                       │     POET       │           
   │  Hidden    │                       │     Bond       │           
   │ Knowledge  │                       │   Synergy      │           
   └────────┬───┘                       └─────┬──────────┘           
            │         ┌─────────────┐         │                      
            └─────────┤   HEALER    ├─────────┘                      
                      │  Restore    │                                 
                      │  Convert    │                                 
                      └─────────────┘                                 
   ─── = adjacent archetypes (legal cross-archetype deckbuilding)    


5.2  Archetype Profiles
Archetype
Primary Forge
Combo Identity
Signature Combo
Life Skill
Sovereign
Lux / Phoenix
Clock Suppression — suppress figures to stall opponent Clock; Authority Stack — 3+ Ascendant simultaneously
Silent Authority Burst: opponent Clock frozen during Jupiter Ascension
Decisive leadership
Mystic
Aether / Lux
Mercury Web — Fracture + Aether strips; Hidden Engine — conceal effects until late-game reveal
Dark Station Burst: opponent cannot see your Transit Power for 2 turns
Pattern recognition, comfort with uncertainty
Warrior
Phoenix
Phoenix Cascade — chain self-immolations, each returning Ascendant; Crimson Rush — stack Crimson Alignment for multi-attack
Eternal March Burst: second attack after suppression during Crimson Alignment
Risk tolerance, committed action
Poet
Eros
Bond Garden — maintain 3+ bonds for compounding CE; Venus Lock — Court of Desire during Venus Ascendant
Burning Word Burst: all bonds generate CE simultaneously
Relational intelligence, community building
Philosopher
Chronos / Aether
Chronos Engine — delay opponent bonds while building Transit lead; Grand Proof — Grand Confluence spike
Harmonic Proof Burst: full council power spike + hand reveal
Long-horizon thinking
Healer
Eros / Aether
Shadow Inversion — convert Eclipse damage into Harmonic; Phoenix Restoration — restore Suppressed at peak transit
Green World Burst: all Suppressed figures return Dormant simultaneously (once per match)
Transforming adversity into resource


PART VI — THE FIVE FORGE SCHOOLS
6.1  School Definitions

CHRONOS
Time & Consequence
The ONLY school that can interfere with automatic aspect triggers. Chronos players burn time resources (CE) to delay what fate has already set in motion. Max 3 delays — then fate asserts regardless. Saturn/Capricorn archetype.


EROS
Bond & Relationship
Attacks connections. Severs aspect bonds, disrupts synergy chains, isolates powerful figures from their network. Most devastating against tightly-bonded Poet decks. Most powerful in cooperative Eclipse mode for building cross-council bonds. Venus/Libra archetype.


AETHER
Identity & Form
Attacks intrinsic nature. Reduces stats, strips Forge alignments. Doubled during retrograde of ruling planet. New v3: Lux effects show distorted ranges (not exact values) — challenging but not unfair. Mercury/Uranus archetype.


LUX
Clarity & Vision (Distortion, Not Removal)
Distorts information rather than hiding it completely. Opponent sees Transit Power as a range (65–80) not an exact value (73). Opponent sees Forecast as general mood, not exact event name. Players feel challenged, not cheated. Sun/Jupiter archetype.


PHOENIX
Vital Force & Regeneration
Direct Transit arc damage. Voluntary self-immolation: sacrifice current power state to return next turn at Floor+15, always Ascendant, with 2 turns of Eros/Aether immunity. The only school that can win by losing first. Mars/Pluto archetype.


6.2  Forge Interaction Matrix
FORGE INTERACTION MATRIX (applied to base attack damage)
                │ vs CHRONOS │ vs EROS  │ vs AETHER │  vs LUX  │ vs PHOENIX│
  ──────────────┼────────────┼──────────┼───────────┼──────────┼───────────┤
  CHRONOS att.  │     —      │ neutral  │  neutral  │ WEAK .9× │ STRONG 1.1│
  EROS att.     │ WEAK  .9×  │    —     │ STRONG 1.1│ neutral  │  neutral  │
  AETHER att.   │  neutral   │ WEAK .9× │     —     │ STRONG 1.1│  neutral │
  LUX att.      │ STRONG 1.1 │ neutral  │  neutral  │    —     │ WEAK  .9× │
  PHOENIX att.  │  neutral   │ STRONG 1.1│ WEAK .9× │ neutral  │    —      │


PART VII — OFFICIAL GAME RULES
7.1  Deck Construction
Exactly 20 cards.
All cards: same primary archetype OR one adjacent archetype (Knowledge Wheel).
Maximum 2 copies of any single historical figure.
Minimum 4 distinct historical figures.
Maximum 4 Event cards.
Maximum 2 Transit Anchor cards.
No Forge school restrictions.

7.2  Match Setup
Both players reveal their Council Leader before match begins. Placed face-up in Command Zone.
Each player draws 5 cards.
First player: higher Transit Power Council Leader goes first. Ties: Solar Return proximity.
The Cosmos displays to both players. All Transit states are public information.
Transit Clock set to 0.

7.3  Turn Structure
TURN STRUCTURE
  PHASE 1 — CELESTIAL UPDATE                                              
  Cosmos recalculates. New transits announced. Power states update.        
  Cannot be skipped or modified by any effect.                            
  ↓                                                                        
  PHASE 2 — THE DRAW                                                       
  Draw 1 card. Empty deck: no draw, no penalty.                           
  ↓                                                                        
  PHASE 3 — THE COUNCIL (Main Phase)                                       
  Any order, any combination:                                              
    Summon figures (cost: Forge Intensity in CE)                          
    Forge attacks (Ascendant figures only)                                
    Play Event cards (cost: printed CE)                                   
    Chronos delay: 2 CE to delay one aspect bond by 1 turn               
  Aspect bonds activate AUTOMATICALLY — no action, no CE required.        
  ↓                                                                        
  PHASE 4 — THE RECKONING                                                  
  Check win conditions. If met: game ends.                                
  ↓                                                                        
  PHASE 5 — THE PASS                                                       
  End turn. Transit Clock +1. Opponent begins their Celestial Update.     


7.4  Celestial Energy (CE)
NEW v3: v3 adds 1 CE carryover maximum. Eliminates early-game constraint without breaking economy.

CE Rule
Value
Base per turn
3 CE
Carryover (NEW v3)
Maximum 1 unused CE carries to next turn
Live event bonus
+1 CE per active named celestial event (max total: 7 CE)
Summon cost
CE = figure's current Forge Intensity (1, 2, or 3)
Event card cost
Printed on card (1–5 CE)
Chronos delay cost
2 CE per turn delayed
Aspect bond activation
FREE — fate costs nothing


7.5  Figure States
NEW v3: v3 adds Dormant actions. Figures below 60 Transit Power are no longer completely locked out.

State
Condition
Can Attack
Can Defend
Dormant Actions (NEW v3)
Can Form Bonds
Ascendant
Transit Power ≥ 60
Yes
Yes
N/A
Yes
Dormant
Transit Power < 60
No
Yes (threshold ×0.5)
Generate 1 CE per turn OR apply weak Forge support to one allied figure
Yes (passive only)
Suppressed
Damage received ≥ Transit Power
No
No
None
No


A Dormant figure may choose ONE dormant action per turn: either generate 1 CE for its controller, or apply a support effect to one allied Ascendant figure (+5 Transit Power for 1 turn, or +1 to that figure's Forge Intensity). This keeps players engaged even when their transits are unfavorable.

7.6  Aspect Bond Rules
The Fundamental Law: Aspects activate automatically when two compatible figures share your Council AND The Cosmos confirms the aspect is within 3° orb. No action. No CE. Fate moves without your permission.

Aspect
Angle
Bond Effect When Active
Volatility
Conjunction
0°
Both figures +15 Transit Power. Forge attacks combine into dual-Forge strike.
Stable
Trine
120°
Both figures +10 Transit Power. Generate 1 bonus CE per turn while active.
Stable
Sextile
60°
Both figures +7 Transit Power. One may defend while other attacks same turn.
Stable
Opposition
180°
Tension bond: one figure +20, other -10. Controller chooses each turn.
Managed tension
Square
90°
Both +12 Transit Power. 30% chance per attack of striking bonded ally instead of declared target. Uses deterministic seed — not random.
Volatile — high risk/reward


Square Bond Misfire (30%) — How It Works: The 30% misfire uses the match's deterministic seed system, not true randomness. The result is reproducible and verifiable. Players know the risk before committing to a Square bond deck. This is a strategic choice, not bad luck.

Chronos Interference: 2 CE to delay any aspect bond by 1 turn. Maximum 3 consecutive delays. After 3: bond activates regardless, Chronos figure loses 10 Transit Power. Fate always wins — eventually.

7.7  Phoenix Self-Immolation
Phoenix-affinity figure voluntarily enters Suppression during Council phase.
Removed from battlefield. Opponent knows where it is — Suppressed Zone is visible.
Next turn: returns at Floor (40) + 15 = 55. Always enters Ascendant.
Phoenix Reborn status for 2 turns: immune to Eros bond severing and Aether stripping.
Strategic use: reset a figure to Ascendant when Transit Power has degraded below 60.

7.8  Lux Distortion Rules (v3 Update)
NEW v3: Lux never hides values completely. It distorts them. Players feel challenged, not cheated.

Lux Effect
What Opponent Sees (Distorted)
What Is Hidden
Transit Power distortion
A range: "65–80" instead of exact "73"
Exact value only
Forecast distortion
General mood: "expansive energy incoming" instead of "Jupiter Ascension"
Exact event name only
Transit Clock distortion
Range: "6–8 ticks" instead of exact "7"
Exact count only
Forge Intensity distortion
Descriptor: "high" instead of exact "3"
Exact intensity only


7.9  Win Conditions
The Transit (1v1 PvP)
Transit Clock Advances +1 When:
Transit Clock Returns -1 When:
Turn ends (automatic)
All your figures simultaneously Dormant or Suppressed
3+ Ascendant figures in Council simultaneously
Your Council Leader is Suppressed
An aspect bond activates during Celestial Update
Opponent Chronos effect explicitly targets your Clock
You successfully suppress an opponent's Ascendant figure
—


Simultaneous Tiebreaker: If both players reach 13 on the same turn, the player whose Council Leader has the higher current Transit Power wins. If still tied, the player who went second wins — compensation for going second.
The Eclipse (Cooperative PvE)
Triggered by a real eclipse event. Team of 2–4 faces Shadow AI. Win by advancing Harmonic Clock to 12 before any player's Transit Clock hits 0. No single archetype wins Eclipse alone — role interdependence is structural.

The Chart (Auto-Battler)
Submit deck. Engine simulates match using deterministic seed. Result: highest Chart Signature Expression score + 2-line narrative. Designed for social sharing.

7.10  Comeback Mechanics
Desperation Threshold: Trailing by 4+ Clock ticks: next named celestial event generates +1 bonus CE for trailing player only.
Celestial Inversion: Once per match (trailing by 5+): all Transit Power values equalize to midpoint for 1 turn. Cost: all current CE.
Unstable Sky All-In: During Mercury Fracture or Silent Eclipse: voluntarily randomize all your Transit Power values. Uses deterministic seed. Hail mary mechanic.
Phoenix Cascade: Chain self-immolations sequentially. Each resurrection is independent. A 3-figure cascade is a complete comeback.
Opposition Bond Flip: Active Opposition bond: focus the +20 surge on whichever figure is most needed each turn.

7.11  Staged Onboarding (v3 Addition)
NEW v3: Progressive reveal across first 3 matches. Same system — staged learning. Reduces cognitive overload without reducing scope.

Match
Systems Active
Systems Hidden
Match 1 (Tutorial)
Cosmos display, card summoning, basic attacks, Transit Clock, Visible Causality Display
Bursts, Forecast strip, Event cards, Aspect bonds (auto-activate but not explained)
Match 2 (Expanded)
All above + 2-turn Forecast strip + Event cards + Aspect bond explanation
Bursts, Comeback mechanics
Match 3 (Full)
All systems active including Bursts, Comeback mechanics, full Lux distortion rules
Nothing — full game from here


PART VIII — NAMED EVENTS & BURST SYSTEM
8.1  Named Celestial Events
Raw astronomical calculations translate into named dramatic states through the Event Mapper. The math remains fully visible in the Visible Causality System. The name is the drama layer on top.

Event Name
Astronomical Trigger
Gameplay Effect
Rarity
Crimson Alignment
Mars within 1° of natal Mars or Sun
Phoenix Forge +30%, Warrior archetype +8 Transit Power
Medium
Venus Ascendant
Venus in domicile or exact trine
Eros bonds generate double CE, Poet combos cost -1 CE
High
Silent Eclipse
Solar/Lunar Eclipse within 3° of natal Sun/Moon
Lux distortion doubled (ranges wider), Suppressed cannot be restored this turn
Rare
Mercury Fracture
Mercury within 1° of station retrograde
Aether effects randomized ±20%, Mystic gains hidden card draw
Rare
Jupiter Ascension
Jupiter in Sagittarius/Pisces or exact conjunction
All Transit Clocks +1 bonus, CE maximum +2 for 2 turns
Medium
Saturn's Return
Saturn within 2° of any figure's natal Saturn
Chronos interference costs 0 CE, delayed bonds cannot be force-triggered
Rare
Grand Confluence
3+ planets forming grand trine or T-square
All active bonds generate double effects, Harmonic Clock +3 in Eclipse
Very Rare


8.2  In-Match 2-Turn Forecast Strip
FREE for all players. Part of the core game. Premium Transit Forecast = 30-day planning intelligence — entirely different product.

IN-MATCH 2-TURN CELESTIAL FORECAST STRIP
  ┌──────────────────────────────────────────────────────────────────────┐
  │  NOW              TURN +1            TURN +2                         │
  │  Crimson          Venus              Mercury                         │
  │  Alignment        Ascendant          Fracture                        │
  │  Phoenix +30%     Eros bonds ×2      Aether ±20%                    │
  │  3 turns left     Next turn           2 turns out                    │
  └──────────────────────────────────────────────────────────────────────┘


8.3  Burst System — Full Definition
What Makes a Burst Trigger
Three conditions must align simultaneously:
A specific named figure is Ascendant in your Council.
A compatible named celestial event is currently active in The Cosmos.
You declare an attack using the resonant Forge school — defined as the PRIMARY Forge school listed on that specific figure's card. Not any figure with that school: the specific figure named in the Burst definition.

NEW v3: v3 clarifies the Burst trigger definition. "Resonant Forge school" = the primary Forge school printed on that specific historical figure's card. This is deterministic, not interpretive.

Burst Name
Trigger Conditions
Effect
Court of Desire
Cleopatra Ascendant + Venus Ascendant + Eros Forge (Cleopatra's primary)
Attack ignores Forge resistance. Target's bonds severed 2 turns. +3 CE.
The Eternal March
Napoleon Ascendant + Crimson Alignment + Phoenix Forge (Napoleon's primary)
If attack suppresses target, Napoleon does not exhaust. May attack again this turn.
Harmonic Proof
Pythagoras Ascendant + Grand Confluence + Aether Forge (Pythagoras' primary)
All council figures +5 Transit Power. Reveal opponent hand for 1 turn.
The Burning Word
Rumi Ascendant + Venus Ascendant + Eros Forge + 2 active bonds in council
All bonds generate Burst CE (5 total). Harmonic Clock +2 in Eclipse.
Silent Authority
Caesar Ascendant + Jupiter Ascension + Lux Forge (Caesar's primary)
Opponent Transit Clock frozen 1 turn. Their Forecast distortion doubled.
Dark Station
Nostradamus Ascendant + Mercury Fracture + Aether Forge (Nostradamus' primary)
Opponent cannot see your Transit Power ranges (full blackout) for 2 turns. Next summon costs 0 CE.


PART IX — ECONOMY & MONETIZATION
9.1  Economy Health: Sources and Sinks
NEW v3: v3 adds explicit sink mechanisms. Without sinks, Celestial Credits inflate and become worthless. This is the most common economy failure in TCGs.

Economy Flow
Mechanism
Rate
SOURCE: Daily pack
1 free Era Pack per day per player (5 cards)
Daily — controlled
SOURCE: Match rewards
Celestial Credits awarded for wins, streaks, first loss of day
Gameplay — controlled
SOURCE: Event rewards
Credits and cards for participating in live celestial events
Event-driven — controlled
SINK: Pack opening
All credit spending on packs removes credits from circulation
Player choice
SINK: Marketplace tax
3% house cut on all peer-to-peer card trades (once marketplace is live)
Transaction — automatic
SINK: Cosmetic upgrades
Alternate art, animated borders, council aesthetics — no gameplay effect
Player choice
SINK: Transit Anchors
Purchased with credits, single-use event cards — consumed on play
Gameplay consumption


9.2  Free-to-Play Entitlements
1 free Era Pack daily (5 cards, standard drop rates)
Full access to 1v1 Transit mode and auto-battler Chart mode
Full access to all live celestial events
In-match 2-turn Celestial Forecast strip
Basic Cosmos display (current planetary positions)
Standard card art for all owned cards

9.3  Revenue Streams
Stream
Product
Price
Celestial Credits
Premium currency — packs, cosmetics, Transit Anchors
$0.99–$99.99 bundles
Stellar Pass
Monthly: bonus rewards, 3 premium packs, exclusive art
$4.99/month
Transit Forecast
30-day advance celestial intelligence for competitive planning
$7.99/month
Council Pass
Stellar Pass + Transit Forecast + Eclipse co-op early access
$9.99/month
Era Packs
5 cards, historical era. All rarities earnable free through play.
100 CC (~$0.99)
Constellation Packs
10 cards, guaranteed 1 cosmetically distinct figure
500 CC (~$4.99)
Alternate Art
Animated borders, historical portraits, Forge effect animations
200–800 CC
Council Aesthetics
Custom battlefield themes, Cosmos display skins
500–2000 CC
NFT Export (optional)
Mint any owned card on-chain via embedded wallet. No gameplay advantage.
Gas-sponsored


PART X — THE FIRST 10 CARDS
10.1  Design Criteria
Each card must be mechanically distinct, teachable through play, and a vehicle for demonstrating one core system. Together the 10 cover all six archetypes and all five Forge schools. The starter set intentionally includes one card that demonstrates every major mechanic.

Figure
Archetype
Forge
Mechanical Role
What It Teaches
Burst Name
Julius Caesar
Sovereign
Lux
Control / Authority
Clock suppression; Lux distortion as weapon
Silent Authority
Napoleon Bonaparte
Warrior
Phoenix
Tempo / Aggression
Self-immolation timing; Phoenix Cascade
Eternal March
Cleopatra VII
Sovereign
Eros
Influence / Manipulation
Eros bond severing; reading opponent synergies
Court of Desire
Pythagoras
Philosopher
Aether
Scaling / Logic
Aether compounding; Grand Confluence timing
Harmonic Proof
Sappho
Poet
Eros
Support / Synergy
Bond generation; CE economy management
The Burning Word
Hannibal Barca
Warrior
Phoenix
Chaos Wildcard
High-risk Phoenix; Alpine Gambit comeback
None — by design
Hypatia
Mystic
Aether
Defensive Anchor
Aether resistance; Chronos delay at 0 CE
Logos Barrier
Rumi
Poet
Eros
Combo Enabler
Multi-bond synergy; bond transparency as power
The Burning Word
Sun Tzu
Mystic
Lux
Strategic Flex
Lux information warfare; Transit Clock hiding
Empty Fortress
Hildegard von Bingen
Healer
Eros
Dual Archetype Flex
Healer restoration; retrograde immunity
Green World


10.2  Archetype Balance Check
Archetype
Count in Phase 0 Set
Coverage
Sovereign
2 (Caesar, Cleopatra)
Strong — both primary roles covered
Warrior
2 (Napoleon, Hannibal)
Strong — aggressor + wildcard covered
Philosopher
1 (Pythagoras)
Adequate for Phase 0 — single-figure teaching is enough
Poet
2 (Sappho, Rumi)
Strong — support + combo both present
Mystic
2 (Hypatia, Sun Tzu)
Strong — defensive + aggressive Mystic both present
Healer
1 (Hildegard)
Adequate for Phase 0 — Healer is hardest to demo solo, needs Eclipse mode to fully shine


10.3  Demo Success Criteria
"Players can explain why they won or lost." — Legibility test.
"At least one Burst per match, referenced by name afterward." — Drama test.
"Players immediately want to try a different strategy." — Depth test.

PART XI — THE LIVE COSMOS EVENT SYSTEM
Event Tier
Trigger
Game Effect
Duration
Ingress
Planet enters new sign
All figures ruled by that planet +10 Transit Power. New faction bonus cards available.
Days to years
Retrograde Station
Planet stations retrograde
All Aether effects double. Eclipse cooperative mode unlocks.
Weeks to months
Direct Station
Planet stations direct
Aether returns to normal. Suppressed figures with ruling planet now direct may return at +5.
1 week
Solar Eclipse
New Moon eclipse
Lux distortion doubled. Shadow appears. 72-hour mission available.
72 hours
Lunar Eclipse
Full Moon eclipse
Eros bonds generate double CE. Bond-focused cards gain abilities. Collector packs drop.
72 hours
Grand Aspect
3+ planets form major pattern
Cross-archetype bonuses. Special event cards. Community challenge.
Days
Solar Return
Sun returns to natal position
Any figure within 7 days of birthday auto-Ascendant regardless of Transit Power.
7-day window


PART XII — TECHNICAL ARCHITECTURE
12.1  Two-Layer Calculation Model
TWO-LAYER CALCULATION ARCHITECTURE
  ┌──────────────────────────────────────────────────────────────────────┐
  │  CORE LAYER (Meeus Engine)                                           │
  │  Planetary positions, aspect orbs, dignity states, retrograde status │
  │  Eclipse detection, station detection, solar return proximity        │
  │  OUTPUT: Pure numbers. Never touched for balance.                   │
  └───────────────────────────────┬──────────────────────────────────────┘
                                  │ ephemeris data                        
  ┌───────────────────────────────▼──────────────────────────────────────┐
  │  EVENT MAPPER                                                         │
  │  "Mars 0.4° conjunct natal Sun" → "Crimson Alignment"                │
  │  "Mercury 0.8° pre-station" → "Mercury Fracture"                     │
  │  ALL balance tuning happens HERE. Never in the engine above.         │
  │  Forge Intensity (1/2/3) assigned here based on orb thresholds.     │
  └───────────────────────────────┬──────────────────────────────────────┘
                                  │ named game states + Forge Intensity   
  ┌───────────────────────────────▼──────────────────────────────────────┐
  │  GAMEPLAY LAYER                                                       │
  │  Consumes named states. Resolves combat. Triggers Bursts.            │
  │  Advances Clocks. Generates 2-line narrative. Renders UI.            │
  └──────────────────────────────────────────────────────────────────────┘


12.2  Technology Stack
Layer
Technology
Responsibility
Astronomical Engine
Jean Meeus algorithms (ported from Prime Self)
Transit Power calculation, aspect detection, dignity evaluation, eclipse/station detection
API / Game Logic
Cloudflare Workers (TypeScript)
Match state, card effects, turn resolution, economy transactions, Event Mapper, Forge Intensity assignment
Real-Time Match
Cloudflare Durable Objects + WebSockets
Live match state sync — proven viable in <48hr game jams
Database
Neon Postgres (serverless)
Player accounts, card ownership, match history, economy ledger, Transit cache, seed storage
Payments
Stripe
Premium currency, subscription billing, marketplace transactions with 3% house cut
Mobile Client
PWA (Phase 0–3) → React Native (Phase 4)
Browser-first for validation speed. Native apps after validation.
Push Notifications
Firebase / Expo Push
Transit alerts, Eclipse events, daily pack, Burst opportunity notifications
NFT Layer (Phase 4)
Base L2 / Privy embedded wallet
Gasless minting, email-based wallet — blockchain invisible to casual players
Analytics
PostHog (self-hosted on CF)
D7/D30 retention, economy health, Burst trigger frequency, funnel analysis


12.3  Deterministic Seed System
Every match locked to timestamp + seed at initiation. All probabilistic elements — pack draws, Square bond 30% misfire, Unstable Sky randomization — seeded from this value. Every match fully reproducible. Critical for debugging, competitive integrity, and post-match narrative accuracy.

12.4  Transit Cache SLA
Transit Power recalculated and cached for all active figures every 4 hours minimum.
Cosmos state refreshes at match start and at start of each turn's Celestial Update phase.
Exact transit moments (sub-1° orb) trigger push notifications within 15 minutes.
All calculations server-side — client receives calculated values only, never raw ephemeris.

PART XIII — GO-TO-MARKET STRATEGY
13.1  The Balatro Parallel
LocalThunk shared with friends for months before any public launch. "I have played the beta for dozens of hours" was the only signal that mattered. The Prime Self practitioner network is your equivalent. They already think in this framework.

13.2  Seed Community Sequence
Phase
Community
Target
Validation Gate
Phase 0 (private)
10 Prime Self practitioners
Prototype. Real natal charts. Play together.
1 person says "this power is REAL?" and means it
Phase 1 (closed beta)
50 Prime Self practitioners
PWA with full rules. Track D7 retention.
D7 > 30%. Players explain why they won/lost.
Phase 2 (limited public)
500 players
First revenue. Astrology TikTok creator outreach.
First Celestial Credits purchase. Chart shares on TikTok.
Phase 3 (public launch)
Open
Launch during eclipse season. Live events active day 1.
Players arrive during an Eclipse event and immediately experience the full concept.


13.3  TikTok Organic Acquisition
One-tap share from Chart result screen — formatted card, not screenshot
Creator Program: 10 astrology TikTok creators with Phase 1 access during Mercury Retrograde
"My Cleopatra card went Ascendant during the Venus ingress" is a sentence that travels

13.4  Positioning
"A competitive strategy card game where real celestial mechanics shape every match — master the sky, or be ruled by it."
"Timing is everything."

APPENDIX A — COMPLETE QUICK REFERENCE
Rule
Value / Definition
Deck size
20 cards
Opening hand
5 cards
Base CE per turn
3 (max 7 with live events) + 1 carryover maximum (NEW v3)
Ascendant threshold
Transit Power ≥ 60
Dormant — can do
Defend (threshold ×0.5) + 1 dormant action per turn (NEW v3)
Power range
40 (floor) → 100 (ceiling)
Aspect orb
3 degrees
Forge Intensity
1 = planet >5° from aspect | 2 = within 5° | 3 = within 1° or named event active
Base attack damage
Transit Power × Forge Intensity × Forge Matchup Modifier
Suppression condition
Damage received ≥ target's Transit Power (Dormant threshold is TP × 0.5)
Forge matchup
Strong: 1.1× | Neutral: 1.0× | Weak: 0.9×
Transit win condition
Clock reaches 13 first
Eclipse win condition
Harmonic Clock reaches 12 before any player hits 0
Aspect bond activation
FREE — automatic — only Chronos can delay (2 CE, max 3 consecutive)
Chronos max delays
3 turns — then bond fires regardless, Chronos figure -10 Transit Power
Phoenix return
Floor (40) + 15 = 55. Always Ascendant. 2 turns Eros/Aether immune.
Square bond misfire
30% — uses deterministic seed, not true randomness
Lux effect
Distorts values to ranges — never removes information completely
Burst trigger
Named figure Ascendant + compatible live event + figure's primary Forge school declared
Event cards per deck
Maximum 4
Transit Anchors per deck
Maximum 2
Economy sink (marketplace)
3% house cut on all peer-to-peer trades


APPENDIX B — ARCHETYPE ADJACENCY
Archetype
Adjacent (legal cross-archetype deckbuilding)
Sovereign
Warrior, Philosopher
Mystic
Philosopher, Healer
Warrior
Sovereign, Poet
Poet
Warrior, Healer
Philosopher
Sovereign, Mystic
Healer
Mystic, Poet


APPENDIX C — PHASE 0 CARD ROSTER
Figure
Birth Data
Confidence
Archetype
Primary Forge
Ruling Planet
Julius Caesar
13 July 100 BC, Rome
Estimated
Sovereign
Lux
Sun (Cancer)
Napoleon Bonaparte
15 August 1769, Ajaccio
Verified
Warrior
Phoenix
Sun (Leo)
Cleopatra VII
69 BC, Alexandria
Attributed
Sovereign
Eros
Moon (attributed)
Pythagoras
570 BC, Samos
Attributed
Philosopher
Aether
Saturn (attributed)
Sappho
630 BC, Mytilene
Attributed
Poet
Eros
Venus (attributed)
Hannibal Barca
247 BC, Carthage
Attributed
Warrior
Phoenix
Mars (attributed)
Hypatia of Alexandria
360 AD, Alexandria
Estimated
Mystic
Aether
Mercury (Virgo)
Rumi
30 Sept 1207, Balkh
Verified
Poet
Eros
Venus (Libra)
Sun Tzu
544 BC (attributed)
Legendary
Mystic
Lux
Mercury (Legendary)
Hildegard von Bingen
16 Sept 1098, Bermersheim
Verified
Healer
Eros
Moon (Virgo)


APPENDIX D — V3 CHANGES LOG
Every change made in v3, with rationale:

Change
Section
Rationale
Added base attack damage formula (Transit Power × Forge Intensity × matchup modifier)
Part IV 4.2
v2 specified suppression condition but never defined how damage is calculated. Unplayable without this.
Defined Forge Intensity (1/2/3) based on orb thresholds
Part IV 4.2, Part XII 12.1
Forge Intensity was referenced in Visible Causality Display but never defined. Now deterministic.
Added 1 CE carryover maximum
Part VII 7.4
Early-game constraint was too tight. 1 CE carryover eliminates lockout without breaking economy.
Added Dormant figure actions (1 CE generation or weak Forge support)
Part VII 7.5
Dormant figures doing nothing created frustrating sessions. Now they weather the storm productively.
Lux defined as distortion not removal
Part VI 6.1, Part VII 7.8
Hiding information completely feels unfair. Showing ranges instead of exact values achieves same strategic effect without frustration.
Match narrative shortened to 2 lines
Part III 3.4
Long narrative gets skipped on mobile. Headline + 1 insight sentence fits a push notification and gets shared.
Staged onboarding across first 3 matches
Part VII 7.11
7 systems introduced simultaneously overwhelms new players. Progressive reveal costs nothing architecturally.
Burst trigger definition clarified
Part VIII 8.3
"Resonant Forge school" was ambiguous. Now explicitly defined as the primary Forge school printed on that specific figure's card.
Economy sink mechanisms added
Part IX 9.1
v2 specified credit sources but no sinks. Without sinks, credits inflate. 3% marketplace tax and Transit Anchor consumption added.
Square bond misfire clarified as deterministic seed
Part VII 7.6, Part XII 12.3
30% misfire using true randomness would undermine the game's deterministic trust model. Seed-based keeps it fair and reproducible.


THE NORTH STAR
LocalThunk built Balatro as a side project for 13 months before going full-time.
He shared it with friends. One of those friends played for dozens of hours.
That reaction was the signal. That is the only signal that matters.

Port the engine. Make 10 cards. Play it with a Prime Self practitioner.
Watch their face when the transit activates.

Then decide.

Kairos’ Council  ·  kairoscouncil.com  ·  The Factory  ·  v4.0  ·  Confidential

# Technical Stack Justification

## Game Engine Selection - Phaser 3 (2025-11-19)

Zdecydowaliśmy się na **Phaser 3** jako główny silnik gry. Kluczowe powody tej decyzji:

- **All-in-one solution** - chcemy mieć wszystkie możliwe fajne rzeczy z silnika gry dostępne out-of-the-box
- **Game development, not low-level coding** - developować po bożemu, bardziej jak w prawdziwym game devie, zamiast rzeźbić niskopoziomowe rozwiązania
- **Free built-in features**:
  - Fizyka (Arcade Physics, Matter.js)
  - System efektów wizualnych
  - System dźwięku
  - Sprite management i animacje
  - Input handling
- **Istniejący POC** - mamy już dostępny proof-of-concept z Phaserem, który będziemy rozwijać równolegle

Ta decyzja pozwala nam skupić się na mechanikach gry i gameplay'u zamiast tracić czas na implementację podstawowych funkcjonalności silnika.

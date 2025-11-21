<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# jak napisac dobry indy arcade shooter game w ts + html canvas + vite? kompletny poradnik, kluczowe potrzeby: szybkie prototypowanie, wersja przegladarkowa

Aby napisać dobry indy arcade shooter w TypeScript, HTML Canvas i Vite, warto podejść do projektu etapami, korzystając ze sprawdzonych praktyk z naciskiem na szybkie prototypowanie i wersję działającą w przeglądarce.[^1_1][^1_2][^1_3]

### Kluczowe założenia

- Stack: TypeScript + HTML Canvas + Vite zapewnia szybki refresh i lekką konfigurację.
- Szybkie prototypowanie wymaga prostoty kodu, minimalnej struktury plików i efektywnego loopa gry.
- Kod i logika gry muszą być czytelne i łatwe do rozbudowy.[^1_4][^1_5]

***

### Podstawy projektu i konfiguracji

1. **Zainicjuj projekt za pomocą Vite:**

```
npm init vite@latest shooter-game -- --template vanilla-ts
cd shooter-game
npm install
npm run dev
```

Vite automatycznie skonfiguruje szybki hot-reload.[^1_6]
2. **Tworzenie kanwy i szkieletu gry:**

```
- W pliku `index.html` dodaj `<canvas id="game"></canvas>`.
```

    - W pliku `main.ts` pobierz referencję do canvas i ustaw jej rozmiar na pełen ekran:[^1_1]

```typescript
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
```


***

### Pętla gry (Game Loop)

- Wykorzystaj `requestAnimationFrame` do renderowania – to najlepsza metoda do płynnych animacji.[^1_2][^1_1]
- Implementuj rozdzielenie update i render:

```typescript
function gameLoop(time:number) {
  update(); // logika gry
  render(); // rysowanie obiektów
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
```


#### Uwaga: Stałe tempo (fixed timestep)

- Rozważ używanie delta time (różnica czasu między klatkami), by ruchy postaci były niezależne od FPS.[^1_2]

***

### Proste prototypowanie obiektów gry

- Zacznij od stworzenia klas takich jak `Player`, `Projectile`, `Enemy` z podstawowymi właściwościami (x, y, prędkość, metoda update i render).[^1_7][^1_1]
- Stwórz listę pocisków i przeciwników, aktualizując je w każdej klatce.

***

### Obsługa wejścia (input)

- Odbieraj klawisze za pomocą eventów JS (`keydown`, `keyup`) i ustawiaj flagi ruchu/strzału.[^1_8]

***

### Prototypowanie \& Testowanie

- Najszybciej iteruj nad grą zmieniając pojedyncze pliki – Vite zapewnia hot reload.
- Na prototypie skup się na funkcjonalności, nie grafice – używaj prostych kształtów (prostokąty, koła).

***

### Dobre praktyki performance \& architektura

- Minimalizuj ilość obliczeń i rysowań w każdej klatce – tylko "widoczne" na ekranie obiekty.
- Zoptymalizuj pętlę gry za pomocą `requestAnimationFrame` i, w razie potrzeby, delta time (stały krok logiki i osobno render).[^1_3][^1_2]
- Oddziel logikę update od renderu – update operuje na danych, render tylko rysuje.

***

### Przykładowy skeleton gry TypeScript + Canvas

```typescript
class Player { /* ... */ }
class Projectile { /* ... */ }
class Enemy { /* ... */ }

function update() { /* aktualizuj pozycje, kolizje, usuwaj niepotrzebne obiekty */ }
function render() { /* rysuj tło, gracza, pociski, przeciwników */ }

function gameLoop(time:number) {
  update();
  render();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
```


***

### Polecane praktyki prototypowania

- Zacznij od MVP – prototypuj najpierw ruch, potem strzały, na końcu AI przeciwników.[^1_7][^1_1]
- Wersja browserowa działa natychmiast po `npm run dev` – rozsyłaj link z localhosta lub deployuj do Vercel/Netlify.
- Na testy/logikę wykorzystaj tablice obiektów i prostą detekcję kolizji (np. bounding box).

***

### Częste błędy i jak ich uniknąć

- Unikaj złożonych assetów na starcie – szybkie prototypowanie wymaga prostoty.[^1_1]
- Staraj się nie mieszać logiki gry i renderowania – to ułatwi rozbudowę prototypu.[^1_3]

***

### Przydatne linki i źródła

- Seria tutoriali TypeScript + Canvas: "Building a space shooter game with HTML5 canvas \& Typescript"[^1_1]
- O game-loopie i optymalnej architekturze: "Building a Professional Game Loop in TypeScript"[^1_2]
- Kompletny przewodnik prototypowania: "Complete Guide to Building Games in the Browser"[^1_5]

***

Z takiego fundamentu możesz iteracyjnie rozwijać grę: dodając nowe typy broni, efekty specjalne czy system punktacji. Ważne jest proste MVP, architektura rozdzielająca logikę od renderu i szybka iteracja dzięki Vite i czystemu kodowi TypeScript + Canvas.[^1_3][^1_2][^1_1]
<span style="display:none">[^1_10][^1_11][^1_12][^1_13][^1_14][^1_15][^1_16][^1_17][^1_18][^1_19][^1_20][^1_9]</span>

<div align="center">⁂</div>

[^1_1]: https://itnext.io/building-a-space-shooter-game-with-html5-canvas-typescript-part-1-20663025c7f5

[^1_2]: https://dev.to/stormsidali2001/building-a-professional-game-loop-in-typescript-from-basic-to-advanced-implementation-eo8

[^1_3]: https://playgama.com/blog/general/master-browser-based-game-development-with-three-js/

[^1_4]: https://javascript.plainenglish.io/gamedev-patterns-and-algorithms-in-action-with-typescript-d29b913858e

[^1_5]: https://dev.to/zippcodder/complete-guide-to-building-games-in-the-browser-kp6

[^1_6]: https://www.youtube.com/watch?v=HmxNrlPx8iY

[^1_7]: https://www.youtube.com/watch?v=eI9idPTT0c4

[^1_8]: https://itnext.io/building-a-game-with-typescript-input-system-1-3-46d0b3dd7662

[^1_9]: https://www.youtube.com/watch?v=gCa0z4B-CRo

[^1_10]: https://www.youtube.com/watch?v=vyqbNFMDRGQ

[^1_11]: https://iamschulz.com/writing-a-game-in-typescript/

[^1_12]: https://stackoverflow.com/questions/5650535/how-can-i-make-a-3d-shooting-game-using-html5-canvas

[^1_13]: https://www.reddit.com/r/gamedev/comments/1fw6q1r/my_experience_doing_2d_games_in_typescript_and/

[^1_14]: https://jslegenddev.substack.com/p/how-to-start-making-games-in-javascript

[^1_15]: https://nicolashery.com/prototyping-with-typescript/

[^1_16]: https://www.html5gamedevs.com/topic/10569-best-practice-for-canvas-game-development/

[^1_17]: https://www.facebook.com/groups/javascriptgames/posts/2286856264771910/

[^1_18]: https://www.reddit.com/r/gamedev/comments/1ix65ak/gamedev_in_html5_is_incredibly_underrated_and/

[^1_19]: https://stackoverflow.com/questions/58500139/tool-for-prototyping-typescript-types-faster

[^1_20]: https://www.html5gamedevs.com/topic/26500-typescript-vs-javascript/


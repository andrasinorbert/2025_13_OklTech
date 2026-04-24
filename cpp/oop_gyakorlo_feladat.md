# OOP gyakorló feladat – Állatmenhely nyilvántartó rendszer

## Cél

Készíts egy egyszerű konzolos programot, amely egy állatmenhely nyilvántartását kezeli.  
A feladat célja, hogy kezdő szinten gyakorolható legyen benne:

- objektumok létrehozása,
- konstruktorok írása,
- fájlból olvasás,
- öröklődés,
- alapvető metódusok használata.

---

## Feladat leírása

A program egy szöveges fájlból olvassa be a menhely állatait, majd objektumokat hoz létre belőlük.

A menhelyen többféle állat lehet, például:

- kutya
- macska

Minden állatnak vannak közös adatai, ezért készíts egy **ősosztályt**, és abból származtasd a konkrét állattípusokat.

---

## Osztályok

### 1. `Allat` / `Animal` ősosztály

Az ősosztály tárolja az összes közös adatot.

Javasolt adattagok:

- név
- életkor
- bekerülési év
- örökbefogadható-e

Javasolt műveletek:

- konstruktor
- egy metódus, amely szövegesen visszaadja az állat adatait
- egy metódus, amely megmondja, hány éve van a menhelyen

---

### 2. `Kutya` / `Dog` leszármazott osztály

A kutya osztály örököljön az `Allat` / `Animal` osztályból.

Plusz adattag például:

- fajta

Plusz művelet például:

- egy metódus, amely visszaad egy kutyára jellemző hangot vagy üzenetet

---

### 3. `Macska` / `Cat` leszármazott osztály

A macska osztály szintén az `Allat` / `Animal` osztályból származzon.

Plusz adattag például:

- benti macska-e

Plusz művelet például:

- egy metódus, amely visszaad egy macskára jellemző hangot vagy üzenetet

---

## Fájlból olvasás

A program egy szöveges fájlból dolgozzon: `allatok.txt`

### Példa fájltartalom

```text
kutya;Bodri;5;2022;igen;Labrador
macska;Cirmi;3;2024;igen;igen
kutya;Morzsi;8;2020;nem;Beagle
macska;Pamacs;2;2025;igen;nem
```

### A sorok jelentése

#### Kutya esetén

```text
kutya;név;életkor;bekerülési_év;örökbefogadható;fajta
```

#### Macska esetén

```text
macska;név;életkor;bekerülési_év;örökbefogadható;benti_macska
```

A program olvassa be a fájlt soronként, darabolja fel az adatokat, majd a típus alapján hozza létre a megfelelő objektumot.

---

## Elvárt működés

A program:

1. beolvassa a fájl tartalmát,
2. létrehozza az objektumokat,
3. eltárolja őket egy listában,
4. kiírja az összes állat adatait,
5. külön listázza az örökbefogadható állatokat.

---

## Minimum követelmények

A megoldás tartalmazza az alábbiakat:

- legalább **1 ősosztály**
- legalább **2 leszármazott osztály**
- minden osztályhoz **konstruktor**
- fájlból történő beolvasás
- objektumok létrehozása a beolvasott adatok alapján
- lista vagy tömb használata az objektumok tárolására
- legalább 1 közös metódus az ősosztályban
- legalább 1 saját metódus valamelyik leszármazott osztályban

---

## Feladatok

### Statisztika

Írd ki:

- hány kutya van,
- hány macska van,
- átlagosan hány évesek az állatok.

### Szűrés

Listázd ki csak azokat az állatokat, amelyek egy adott év után kerültek be a menhelyre.

### Mentés fájlba

A program készítsen külön fájlt az örökbefogadható állatokról.

### Felülírás

Írj olyan metódust, amelyet a leszármazott osztályok saját módon valósítanak meg  
(például `hangotAd()` / `MakeSound()`).

---

## Javasolt lépések a megoldáshoz

1. Készítsd el az `Allat` / `Animal` osztályt.
2. Írd meg a konstruktorát.
3. Készítsd el a `Kutya` / `Dog` és `Macska` / `Cat` osztályokat öröklődéssel.
4. Hozz létre kézzel néhány objektumot teszteléshez.
5. Ezután olvass be adatokat fájlból.
6. A beolvasott sorok alapján hozd létre a megfelelő objektumokat.
7. Tárold őket listában.
8. Írd ki az eredményeket.
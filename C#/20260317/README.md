# Allatmenhely nyilvantarto rendszer - C#

Ez a mappa a `oop_gyakorlo_feladat.md` feladat C# megoldasat tartalmazza.

## Fajlok

- `Allatmenhely.sln`: solution fajl
- `Allatmenhely/Program.cs`: a program belepesi pontja
- `Allatmenhely/Allat.cs`: ososztaly
- `Allatmenhely/Kutya.cs`: kutya osztaly
- `Allatmenhely/Macska.cs`: macska osztaly
- `Allatmenhely/FajlKezelo.cs`: fajlkezelo osztaly
- `Allatmenhely/allatok.txt`: a beolvasott adatok

## Mukodes

A program:

- beolvassa az `allatok.txt` fajlt
- letrehozza az allat objektumokat
- kiirja az osszes allatot
- kulon megjeleniti az orokbefogadhato allatokat
- statisztikat keszit
- ev alapjan szuri a bekerult allatokat
- kulon fajlba menti az orokbefogadhato allatokat

## Futtatas

Lepj be ebbe a mappaba, majd futtasd:

```powershell
dotnet run --project .\Allatmenhely\Allatmenhely.csproj
```

A program beker egy evet a szureshez.

## Build

```powershell
dotnet build .\Allatmenhely.sln
```

## Kimeneti fajl

Futtatas utan letrejon:

- `Allatmenhely/bin/Debug/net8.0/orokbefogadhato_allatok.txt`

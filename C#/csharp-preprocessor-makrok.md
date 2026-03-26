# C# „makrók” konzol alkalmazásban – preprocessor direktívák (Markdown)

C#-ban nincsenek C/C++-hoz hasonló, szöveghelyettesítős makrók (pl. `#define FOO(x) ...`). Ami a gyakorlatban „makróként” szokott előjönni, az a **fordítás előtti (preprocessor) direktívák** használata: ezek **feltételes fordítást**, figyelmeztetést/hibát, régiókat, illetve néhány fordítói beállítást tudnak vezérelni.

> **Fontos:** a preprocessor direktívák *nem futásidőben* működnek, hanem **fordításkor**. Nem tudnak kódot „generálni”, és nem tudnak paraméteres makrókat.

---

## Gyors áttekintés – milyen direktívák vannak?

Gyakoriak:

- `#define`, `#undef` – fordítási szimbólumok definiálása/eltávolítása
- `#if`, `#elif`, `#else`, `#endif` – feltételes fordítás (szimbólumok alapján)
- `#warning`, `#error` – fordítási figyelmeztetés/hiba kiadása
- `#region`, `#endregion` – kódrészek összecsukása IDE-ben (pl. Visual Studio)
- `#line` – a hibák/figyelmeztetésekben megjelenő fájl/sorszám befolyásolása
- `#pragma warning` – warningok engedélyezése/tiltása adott tartományban
- `#nullable` – nullable reference types kontextus vezérlése (`enable/disable/restore`)
- (szkripteknél) `#r`, `#load` – assembly hivatkozás és fájl betöltés **C# scriptben** (`.csx`), nem tipikus konzol appban

A legfontosabb konzol app fejlesztéskor általában: **`#if` + build szimbólumok** (pl. `DEBUG`, `TRACE`), és néha `#warning/#error`, `#pragma warning`.

---

## 1) `#define` és `#undef`

Fordítási szimbólumot (feltételes fordításhoz) hozol létre vagy törölsz.

### Szabályok

- A `#define` / `#undef` **csak a fájl elején** lehet (a `using`-ok előtt, vagy legalábbis az első nem-direktíva kód előtt).
- Nem értéket ad, csak **logikai létezést**: a szimbólum vagy létezik, vagy nem.

### Példa

```csharp
#define FEATURE_X
// #undef FEATURE_X

using System;

class Program
{
    static void Main()
    {
#if FEATURE_X
        Console.WriteLine("FEATURE_X be van kapcsolva.");
#else
        Console.WriteLine("FEATURE_X ki van kapcsolva.");
#endif
    }
}
```

---

## 2) `#if / #elif / #else / #endif` – feltételes fordítás

Kódblokkok **belekerülnek-e** a fordított binárisba. Tipikus use case:

- debug-only logolás
- platform/target specifikus kódrészek
- kísérleti funkciók kapcsolása (feature flags build-time)

### Példa: `DEBUG` és `TRACE`

A .NET projekt template-ekben általában:

- **Debug konfigurációban**: `DEBUG` és `TRACE` szimbólumok definiálva vannak
- **Release konfigurációban**: tipikusan csak `TRACE`

```csharp
using System;

class Program
{
    static void Main()
    {
#if DEBUG
        Console.WriteLine("Debug build: extra diagnosztika fut.");
#endif

#if TRACE
        Console.WriteLine("Trace build: követés engedélyezett.");
#endif
    }
}
```

### Összetett feltételek

Használhatsz `&&`, `||`, `!` operátorokat, és zárójeleket:

```csharp
#if DEBUG && !EXPERIMENTAL
    // csak DEBUG-ban és ha nincs EXPERIMENTAL
#endif
```

> Megjegyzés: itt **szimbólumokat** kombinálsz, nem futásidejű változókat.

---

## 3) `#warning` és `#error`

Fordításkor üzenetet adsz (warning), vagy letiltod a buildet (error).

- Deprecated/ideiglenes kód jelölése
- Biztonsági „kapuk”: pl. tiltsd meg, hogy valaki Release-ben bekapcsolt debug funkcióval fordítson

### Példa: Release-ben tiltott debug funkció

```csharp
#define ENABLE_VERBOSE_LOGGING
using System;

class Program
{
    static void Main()
    {
#if !DEBUG && ENABLE_VERBOSE_LOGGING
#error Release buildben nem engedélyezett az ENABLE_VERBOSE_LOGGING!
#endif

        Console.WriteLine("Hello");
    }
}
```

### Példa: figyelmeztetés

```csharp
#warning Ezt a fájlt még refaktorálni kell a következő sprintben.
```

---

## 4) `#region / #endregion`

Csak szerkesztői/IDE cél: kód összecsukás.

```csharp
#region Helpers
static int Add(int a, int b) => a + b;
#endregion
```

---

## 5) `#pragma warning` – warningok kontrollja

Egy adott warningot (pl. `CS0162` – unreachable code) letiltasz/engedélyezel egy blokkban.

```csharp
using System;

class Program
{
    static void Main()
    {
#pragma warning disable CS0162
        if (false)
        {
            Console.WriteLine("Unreachable");
        }
#pragma warning restore CS0162
    }
}
```

> Best practice: csak kis hatókörben használd, és dokumentáld, miért szükséges.

---

## 6) `#nullable` – nullable kontextus kapcsolása

Ha a projektedben be van kapcsolva a Nullable Reference Types, fájlszinten finomhangolhatod:

```csharp
#nullable enable
using System;

class Program
{
    static void Main()
    {
        string? s = null;
        Console.WriteLine(s?.Length);
    }
}
```

Vagy kikapcsolás:

```csharp
#nullable disable
```

---

## 7) `#line` – sorszám/fájlnév befolyásolása

Ritka, de generált kódnál hasznos (pl. source generatorok, templating). A hibák/stack trace-ek „más” sorszámot/fájlt mutathatnak.

```csharp
#line 100 "GeneratedFile.g.cs"
Console.WriteLine("Mintha a 100. sorban lenne");
#line default
```

---

## Hogyan „kapcsolom be” a szimbólumokat projekt szinten?

### A) `.csproj`-ban (ajánlott)

A legtisztább, ha **Build Configuration** szerint adod meg:

```xml
<PropertyGroup Condition="'$(Configuration)'=='Debug'">
  <DefineConstants>DEBUG;TRACE;EXPERIMENTAL</DefineConstants>
</PropertyGroup>

<PropertyGroup Condition="'$(Configuration)'=='Release'">
  <DefineConstants>TRACE</DefineConstants>
</PropertyGroup>
```

### B) Visual Studio-ban

Project → Properties → Build → **Conditional compilation symbols**

### C) `dotnet build` parancssorból

MSBuild propertyként:

```bash
dotnet build -c Release -p:DefineConstants="TRACE;EXPERIMENTAL"
```

---

## Gyakori minták konzol appban

### 1) Debug-only diagnosztika (build-time)

```csharp
#if DEBUG
Console.WriteLine("Debug-only log");
#endif
```

### 2) Feature flag (build-time)

```csharp
#if FEATURE_NEW_PARSER
RunNewParser();
#else
RunOldParser();
#endif
```

### 3) Release „guardrail”

```csharp
#if !DEBUG && USE_FAKE_DATA
#error Release-ben nem mehet fake data!
#endif
```

---

## Alternatívák, ha valódi „makró” jelleg kell

Ha paraméterezhető, újrafelhasználható, típusbiztos „makró” logikára vágysz:

- **metódusok** (pl. `static` helper), **extension method**
- **generikus** segédfüggvények
- **source generator** (ha kódgenerálás a cél)
- **configuration + runtime feature flags** (ha futásidőben akarod kapcsolni)

---

## Rövid best practice összefoglaló

- Feltételes fordítást (`#if`) csak indokolt esetben használj; túl sok ág csökkenti az olvashatóságot.
- Logolásra gyakran jobb az `ILogger` + log level (runtime), mint a build-time `#if`.
- `#pragma warning disable` csak kicsi blokkokban, konkrét indokkal.
- `#define` helyett inkább projekt-szinten `DefineConstants` (csproj) – átláthatóbb.

---

## Mini „cheat sheet”

| Direktíva | Fő cél |
| --- | --- |
| `#define SYMBOL` | Szimbólum definiálása |
| `#undef SYMBOL` | Szimbólum törlése |
| `#if / #elif / #else / #endif` | Feltételes fordítás |
| `#warning` | Fordítási warning |
| `#error` | Fordítási hiba, build megáll |
| `#region / #endregion` | IDE kódösszecsukás |
| `#pragma warning disable/restore` | Warningok ki/be kapcsolása |
| `#nullable enable/disable/restore` | Nullable kontextus |
| `#line` | Sorszám/fájlnév „átírása” hibákhoz |

---

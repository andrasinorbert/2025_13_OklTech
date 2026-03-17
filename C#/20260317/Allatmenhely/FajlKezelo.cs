namespace Allatmenhely;

public class FajlKezelo
{
    private readonly string _fajlUtvonal;

    public FajlKezelo(string fajlUtvonal)
    {
        _fajlUtvonal = fajlUtvonal;
    }

    private static bool IgenNemToBool(string ertek)
    {
        return ertek.Trim().Equals("igen", StringComparison.OrdinalIgnoreCase);
    }

    public List<Allat> BeolvasAllatok()
    {
        var allatok = new List<Allat>();

        foreach (var sor in File.ReadLines(_fajlUtvonal))
        {
            if (string.IsNullOrWhiteSpace(sor))
            {
                continue;
            }

            var adatok = sor.Split(';', StringSplitOptions.TrimEntries);
            var tipus = adatok[0].ToLowerInvariant();
            var nev = adatok[1];
            var eletkor = int.Parse(adatok[2]);
            var bekerulesiEv = int.Parse(adatok[3]);
            var orokbefogadhato = IgenNemToBool(adatok[4]);

            if (tipus == "kutya")
            {
                allatok.Add(new Kutya(nev, eletkor, bekerulesiEv, orokbefogadhato, adatok[5]));
            }
            else if (tipus == "macska")
            {
                allatok.Add(new Macska(nev, eletkor, bekerulesiEv, orokbefogadhato, IgenNemToBool(adatok[5])));
            }
            else
            {
                throw new InvalidOperationException($"Ismeretlen allattipus: {tipus}");
            }
        }

        return allatok;
    }

    public void OrokbefogadhatoakMentese(string celFajl, IEnumerable<Allat> allatok)
    {
        var sorok = allatok
            .Where(allat => allat.Orokbefogadhato)
            .Select(allat => allat.AdatokSzovegesen());

        File.WriteAllLines(celFajl, sorok);
    }
}

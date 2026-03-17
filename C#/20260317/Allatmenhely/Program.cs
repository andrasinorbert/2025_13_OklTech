namespace Allatmenhely;

public static class Program
{
    public static void Main()
    {
        var alapMappa = AppContext.BaseDirectory;
        var forrasFajl = Path.Combine(alapMappa, "allatok.txt");
        var celFajl = Path.Combine(alapMappa, "orokbefogadhato_allatok.txt");

        var fajlKezelo = new FajlKezelo(forrasFajl);
        var allatok = fajlKezelo.BeolvasAllatok();

        Console.WriteLine("Osszes allat:");
        foreach (var allat in allatok)
        {
            Console.WriteLine(allat.AdatokSzovegesen());
        }

        Console.WriteLine();
        Console.WriteLine("Orokbefogadhato allatok:");
        var orokbefogadhatoak = allatok.Where(allat => allat.Orokbefogadhato).ToList();
        foreach (var allat in orokbefogadhatoak)
        {
            Console.WriteLine(allat.AdatokSzovegesen());
        }

        Console.WriteLine();
        StatisztikaKiirasa(allatok);

        var szuresiEv = BekeresiEvBekerese();
        var szurtAllatok = BekerulesSzerintiSzures(allatok, szuresiEv);
        Console.WriteLine();
        Console.WriteLine($"A {szuresiEv} utan bekerult allatok:");
        foreach (var allat in szurtAllatok)
        {
            Console.WriteLine(allat.AdatokSzovegesen());
        }

        fajlKezelo.OrokbefogadhatoakMentese(celFajl, allatok);
        Console.WriteLine();
        Console.WriteLine($"Az orokbefogadhato allatok elmentve: {Path.GetFileName(celFajl)}");
    }

    private static void StatisztikaKiirasa(IEnumerable<Allat> allatok)
    {
        var allatLista = allatok.ToList();
        var kutyakSzama = allatLista.Count(allat => allat is Kutya);
        var macskakSzama = allatLista.Count(allat => allat is Macska);
        var atlagEletkor = allatLista.Count == 0 ? 0 : allatLista.Average(allat => allat.Eletkor);

        Console.WriteLine("Statisztika:");
        Console.WriteLine($"Kutyak szama: {kutyakSzama}");
        Console.WriteLine($"Macskak szama: {macskakSzama}");
        Console.WriteLine($"Atlag eletkor: {atlagEletkor:F2} ev");
    }

    private static List<Allat> BekerulesSzerintiSzures(IEnumerable<Allat> allatok, int ev)
    {
        return allatok.Where(allat => allat.BekerulesiEv > ev).ToList();
    }

    private static int BekeresiEvBekerese()
    {
        Console.Write("Adj meg egy evet a szureshez: ");
        var beirtErtek = Console.ReadLine();

        if (int.TryParse(beirtErtek, out var ev))
        {
            return ev;
        }

        Console.WriteLine("Ervenytelen ertek, a program a 2022-es evet hasznalja.");
        return 2022;
    }
}

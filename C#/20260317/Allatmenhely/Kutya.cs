namespace Allatmenhely;

public class Kutya : Allat
{
    public string Fajta { get; }

    public Kutya(string nev, int eletkor, int bekerulesiEv, bool orokbefogadhato, string fajta)
        : base(nev, eletkor, bekerulesiEv, orokbefogadhato)
    {
        Fajta = fajta;
    }

    public override string HangotAd()
    {
        return "Vau vau!";
    }

    public override string AdatokSzovegesen()
    {
        return $"Kutya - {base.AdatokSzovegesen()}, fajta: {Fajta}, hang: {HangotAd()}";
    }
}

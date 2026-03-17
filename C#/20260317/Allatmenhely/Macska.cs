namespace Allatmenhely;

public class Macska : Allat
{
    public bool BentiMacska { get; }

    public Macska(string nev, int eletkor, int bekerulesiEv, bool orokbefogadhato, bool bentiMacska)
        : base(nev, eletkor, bekerulesiEv, orokbefogadhato)
    {
        BentiMacska = bentiMacska;
    }

    public override string HangotAd()
    {
        return "Miau!";
    }

    public override string AdatokSzovegesen()
    {
        var bentiSzoveg = BentiMacska ? "igen" : "nem";
        return $"Macska - {base.AdatokSzovegesen()}, benti macska: {bentiSzoveg}, hang: {HangotAd()}";
    }
}

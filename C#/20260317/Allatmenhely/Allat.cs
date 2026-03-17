namespace Allatmenhely;

public abstract class Allat
{
    public string Nev { get; }
    public int Eletkor { get; }
    public int BekerulesiEv { get; }
    public bool Orokbefogadhato { get; }

    protected Allat(string nev, int eletkor, int bekerulesiEv, bool orokbefogadhato)
    {
        Nev = nev;
        Eletkor = eletkor;
        BekerulesiEv = bekerulesiEv;
        Orokbefogadhato = orokbefogadhato;
    }

    public int MenhelyenToltottEvek()
    {
        return DateTime.Now.Year - BekerulesiEv;
    }

    public abstract string HangotAd();

    public virtual string AdatokSzovegesen()
    {
        var orokbefogadhatoSzoveg = Orokbefogadhato ? "igen" : "nem";
        return $"Nev: {Nev}, eletkor: {Eletkor} ev, bekerulesi ev: {BekerulesiEv}, orokbefogadhato: {orokbefogadhatoSzoveg}, menhelyen toltott ido: {MenhelyenToltottEvek()} ev";
    }
}

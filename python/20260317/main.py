from __future__ import annotations

from pathlib import Path

from fajlkezelo import FajlKezelo
from kutya import Kutya
from macska import Macska


def statisztika_kiirasa(allatok: list) -> None:
    kutyak_szama = sum(isinstance(allat, Kutya) for allat in allatok)
    macskak_szama = sum(isinstance(allat, Macska) for allat in allatok)
    atlag_eletkor = sum(allat.eletkor for allat in allatok) / len(allatok) if allatok else 0

    print("Statisztika:")
    print(f"Kutyak szama: {kutyak_szama}")
    print(f"Macskak szama: {macskak_szama}")
    print(f"Atlag eletkor: {atlag_eletkor:.2f} ev")


def bekerules_szerinti_szures(allatok: list, ev: int) -> list:
    return [allat for allat in allatok if allat.bekerulesi_ev > ev]


def bekeresi_ev_bekerese() -> int:
    beirt_ertek = input("Adj meg egy evet a szureshez: ").strip()
    try:
        return int(beirt_ertek)
    except ValueError:
        print("Ervenytelen ertek, a program a 2022-es evet hasznalja.")
        return 2022


def main() -> None:
    alap_mappa = Path(__file__).resolve().parent
    forras_fajl = alap_mappa / "allatok.txt"
    cel_fajl = alap_mappa / "orokbefogadhato_allatok.txt"

    fajl_kezelo = FajlKezelo(str(forras_fajl))
    allatok = fajl_kezelo.beolvas_allatok()

    print("Osszes allat:")
    for allat in allatok:
        print(allat.adatok_szovegesen())

    print("\nOrokbefogadhato allatok:")
    orokbefogadhatoak = [allat for allat in allatok if allat.orokbefogadhato]
    for allat in orokbefogadhatoak:
        print(allat.adatok_szovegesen())

    print()
    statisztika_kiirasa(allatok)

    szuresi_ev = bekeresi_ev_bekerese()
    szurt_allatok = bekerules_szerinti_szures(allatok, szuresi_ev)
    print(f"\nA {szuresi_ev} utan bekerult allatok:")
    for allat in szurt_allatok:
        print(allat.adatok_szovegesen())

    fajl_kezelo.orokbefogadhatoak_mentese(str(cel_fajl), allatok)
    print(f"\nAz orokbefogadhato allatok elmentve: {cel_fajl.name}")


if __name__ == "__main__":
    main()

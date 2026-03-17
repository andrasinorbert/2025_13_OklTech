from __future__ import annotations

from pathlib import Path

from kutya import Kutya
from macska import Macska


class FajlKezelo:
    def __init__(self, fajl_utvonal: str) -> None:
        self.fajl_utvonal = Path(fajl_utvonal)

    @staticmethod
    def _igen_nem_to_bool(ertek: str) -> bool:
        return ertek.strip().lower() == "igen"

    def beolvas_allatok(self) -> list:
        allatok = []
        with self.fajl_utvonal.open("r", encoding="utf-8") as fajl:
            for sor in fajl:
                tisztitott_sor = sor.strip()
                if not tisztitott_sor:
                    continue

                adatok = tisztitott_sor.split(";")
                tipus = adatok[0].strip().lower()
                nev = adatok[1].strip()
                eletkor = int(adatok[2].strip())
                bekerulesi_ev = int(adatok[3].strip())
                orokbefogadhato = self._igen_nem_to_bool(adatok[4])

                if tipus == "kutya":
                    allatok.append(Kutya(nev, eletkor, bekerulesi_ev, orokbefogadhato, adatok[5].strip()))
                elif tipus == "macska":
                    benti_macska = self._igen_nem_to_bool(adatok[5])
                    allatok.append(Macska(nev, eletkor, bekerulesi_ev, orokbefogadhato, benti_macska))
                else:
                    raise ValueError(f"Ismeretlen allattipus: {tipus}")

        return allatok

    def orokbefogadhatoak_mentese(self, cel_fajl: str, allatok: list) -> None:
        cel_utvonal = Path(cel_fajl)
        with cel_utvonal.open("w", encoding="utf-8") as fajl:
            for allat in allatok:
                if allat.orokbefogadhato:
                    fajl.write(allat.adatok_szovegesen() + "\n")

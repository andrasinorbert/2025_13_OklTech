from __future__ import annotations

from datetime import datetime


class Allat:
    def __init__(self, nev: str, eletkor: int, bekerulesi_ev: int, orokbefogadhato: bool) -> None:
        self.nev = nev
        self.eletkor = eletkor
        self.bekerulesi_ev = bekerulesi_ev
        self.orokbefogadhato = orokbefogadhato

    def menhelyen_toltott_evek(self) -> int:
        return datetime.now().year - self.bekerulesi_ev

    def hangot_ad(self) -> str:
        raise NotImplementedError("A leszarmazott osztaly valositja meg.")

    def adatok_szovegesen(self) -> str:
        orokbefogadhato_szoveg = "igen" if self.orokbefogadhato else "nem"
        return (
            f"Nev: {self.nev}, eletkor: {self.eletkor} ev, bekerulesi ev: {self.bekerulesi_ev}, "
            f"orokbefogadhato: {orokbefogadhato_szoveg}, menhelyen toltott id: {self.menhelyen_toltott_evek()} ev"
        )

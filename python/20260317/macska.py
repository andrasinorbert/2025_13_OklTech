from allat import Allat


class Macska(Allat):
    def __init__(
        self,
        nev: str,
        eletkor: int,
        bekerulesi_ev: int,
        orokbefogadhato: bool,
        benti_macska: bool,
    ) -> None:
        super().__init__(nev, eletkor, bekerulesi_ev, orokbefogadhato)
        self.benti_macska = benti_macska

    def hangot_ad(self) -> str:
        return "Miau!"

    def adatok_szovegesen(self) -> str:
        benti_szoveg = "igen" if self.benti_macska else "nem"
        return f"Macska - {super().adatok_szovegesen()}, benti macska: {benti_szoveg}, hang: {self.hangot_ad()}"

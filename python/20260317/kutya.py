from allat import Allat


class Kutya(Allat):
    def __init__(self, nev: str, eletkor: int, bekerulesi_ev: int, orokbefogadhato: bool, fajta: str) -> None:
        super().__init__(nev, eletkor, bekerulesi_ev, orokbefogadhato)
        self.fajta = fajta

    def hangot_ad(self) -> str:
        return "Vau vau!"

    def adatok_szovegesen(self) -> str:
        return f"Kutya - {super().adatok_szovegesen()}, fajta: {self.fajta}, hang: {self.hangot_ad()}"

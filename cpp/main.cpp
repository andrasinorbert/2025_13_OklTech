#include <cctype>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <memory>
#include <sstream>
#include <stdexcept>
#include <string>
#include <utility>
#include <vector>

class Allat {
protected:
    std::string nev;
    int eletkor;
    int bekerulesiEv;
    bool orokbefogadhato;

public:
    Allat(std::string nev, int eletkor, int bekerulesiEv, bool orokbefogadhato)
        : nev(std::move(nev)),
          eletkor(eletkor),
          bekerulesiEv(bekerulesiEv),
          orokbefogadhato(orokbefogadhato) {}

    virtual ~Allat() = default;

    int getEletkor() const {
        return eletkor;
    }

    int getBekerulesiEv() const {
        return bekerulesiEv;
    }

    bool getOrokbefogadhato() const {
        return orokbefogadhato;
    }

    int menhelyenToltottEvek(int aktualisEv) const {
        return aktualisEv - bekerulesiEv;
    }

    virtual std::string tipus() const = 0;
    virtual std::string hangotAd() const = 0;
    virtual std::string extraAdat() const = 0;

    virtual std::string leiras(int aktualisEv) const {
        std::ostringstream ki;
        ki << tipus() << " | nev: " << nev << " | eletkor: " << eletkor
           << " | bekerulesi ev: " << bekerulesiEv
           << " | orokbefogadhato: " << (orokbefogadhato ? "igen" : "nem")
           << " | " << extraAdat()
           << " | hang: " << hangotAd()
           << " | menhelyen toltott evek: " << menhelyenToltottEvek(aktualisEv);
        return ki.str();
    }
};

class Kutya : public Allat {
private:
    std::string fajta;

public:
    Kutya(const std::string& nev, int eletkor, int bekerulesiEv, bool orokbefogadhato, const std::string& fajta)
        : Allat(nev, eletkor, bekerulesiEv, orokbefogadhato), fajta(fajta) {}

    std::string tipus() const override {
        return "Kutya";
    }

    std::string hangotAd() const override {
        return "Vau vau";
    }

    std::string extraAdat() const override {
        return "fajta: " + fajta;
    }
};

class Macska : public Allat {
private:
    bool bentiMacska;

public:
    Macska(const std::string& nev, int eletkor, int bekerulesiEv, bool orokbefogadhato, bool bentiMacska)
        : Allat(nev, eletkor, bekerulesiEv, orokbefogadhato), bentiMacska(bentiMacska) {}

    std::string tipus() const override {
        return "Macska";
    }

    std::string hangotAd() const override {
        return "Miau";
    }

    std::string extraAdat() const override {
        return std::string("benti macska: ") + (bentiMacska ? "igen" : "nem");
    }
};

bool szovegbolLogikaiErtek(std::string ertek) {
    for (char& c : ertek) {
        c = static_cast<char>(std::tolower(static_cast<unsigned char>(c)));
    }
    return ertek == "igen" || ertek == "true" || ertek == "1";
}

std::vector<std::string> felbont(const std::string& sor, char elvalaszto) {
    std::vector<std::string> mezok;
    std::stringstream ss(sor);
    std::string resz;

    while (std::getline(ss, resz, elvalaszto)) {
        mezok.push_back(resz);
    }

    return mezok;
}

std::vector<std::unique_ptr<Allat>> allatokBeolvasasa(const std::string& fajlnev) {
    std::ifstream bemenet(fajlnev);
    if (!bemenet) {
        throw std::runtime_error("Nem sikerult megnyitni a fajlt: " + fajlnev);
    }

    std::vector<std::unique_ptr<Allat>> allatok;
    std::string sor;

    while (std::getline(bemenet, sor)) {
        if (sor.empty()) {
            continue;
        }

        std::vector<std::string> mezok = felbont(sor, ';');
        if (mezok.size() != 6) {
            std::cerr << "Hibas sor, kihagyva: " << sor << '\n';
            continue;
        }

        const std::string& tipus = mezok[0];
        const std::string& nev = mezok[1];
        int eletkor = std::stoi(mezok[2]);
        int bekerulesiEv = std::stoi(mezok[3]);
        bool orokbefogadhato = szovegbolLogikaiErtek(mezok[4]);

        if (tipus == "kutya") {
            allatok.push_back(std::make_unique<Kutya>(nev, eletkor, bekerulesiEv, orokbefogadhato, mezok[5]));
        } else if (tipus == "macska") {
            bool bentiMacska = szovegbolLogikaiErtek(mezok[5]);
            allatok.push_back(std::make_unique<Macska>(nev, eletkor, bekerulesiEv, orokbefogadhato, bentiMacska));
        } else {
            std::cerr << "Ismeretlen allattipus, kihagyva: " << sor << '\n';
        }
    }

    return allatok;
}

void allatokKiirasa(const std::vector<std::unique_ptr<Allat>>& allatok, int aktualisEv, const std::string& cim) {
    std::cout << "\n" << cim << "\n";
    for (const auto& allat : allatok) {
        std::cout << "- " << allat->leiras(aktualisEv) << '\n';
    }
}

void orokbefogadhatoAllatokMentese(const std::vector<std::unique_ptr<Allat>>& allatok, int aktualisEv, const std::string& fajlnev) {
    std::ofstream kimenet(fajlnev);
    if (!kimenet) {
        throw std::runtime_error("Nem sikerult letrehozni a fajlt: " + fajlnev);
    }

    for (const auto& allat : allatok) {
        if (allat->getOrokbefogadhato()) {
            kimenet << allat->leiras(aktualisEv) << '\n';
        }
    }
}

int main() {
    const std::string bemenetiFajl = "allatok.txt";
    const std::string kimenetiFajl = "orokbefogadhato_allatok.txt";
    const int aktualisEv = 2026;
    const int szuresiEv = 2022;

    try {
        std::vector<std::unique_ptr<Allat>> allatok = allatokBeolvasasa(bemenetiFajl);

        if (allatok.empty()) {
            std::cout << "Nem talalhato allat a nyilvantartasban.\n";
            return 0;
        }

        allatokKiirasa(allatok, aktualisEv, "Osszes allat:");

        std::cout << "\nOrokbefogadhato allatok:\n";
        for (const auto& allat : allatok) {
            if (allat->getOrokbefogadhato()) {
                std::cout << "- " << allat->leiras(aktualisEv) << '\n';
            }
        }

        int kutyakSzama = 0;
        int macskakSzama = 0;
        int eletkorOsszeg = 0;

        for (const auto& allat : allatok) {
            eletkorOsszeg += allat->getEletkor();
            if (allat->tipus() == "Kutya") {
                ++kutyakSzama;
            } else if (allat->tipus() == "Macska") {
                ++macskakSzama;
            }
        }

        double atlagEletkor = static_cast<double>(eletkorOsszeg) / allatok.size();

        std::cout << "\nStatisztika:\n";
        std::cout << "- Kutyak szama: " << kutyakSzama << '\n';
        std::cout << "- Macskak szama: " << macskakSzama << '\n';
        std::cout << std::fixed << std::setprecision(2);
        std::cout << "- Atlag eletkor: " << atlagEletkor << " ev\n";

        std::cout << "\nSzures - " << szuresiEv << " utan bekerult allatok:\n";
        for (const auto& allat : allatok) {
            if (allat->getBekerulesiEv() > szuresiEv) {
                std::cout << "- " << allat->leiras(aktualisEv) << '\n';
            }
        }

        orokbefogadhatoAllatokMentese(allatok, aktualisEv, kimenetiFajl);
        std::cout << "\nAz orokbefogadhato allatok mentese kesz: " << kimenetiFajl << '\n';
    } catch (const std::exception& ex) {
        std::cerr << "Hiba: " << ex.what() << '\n';
        return 1;
    }

    return 0;
}

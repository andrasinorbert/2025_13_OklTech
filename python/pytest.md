# Python unit tesztelés

## Jó unit teszt jellemzői

- kicsi
- gyors
- független
- olvasható
- egy dolgot teszteljen

## package

```sh
pip install pytest
```

## Mapparendszer

project/
│
├── calculator.py
└── test_calculator.py

```py
# calculator.py:
def multiply(a, b):
    return a * b
```

```py
# test_calculator.py
from calculator import multiply

def test_multiply():
    assert multiply(3, 4) == 12
```

Futtatás:

```sh
pytest
```

## Fájl elnevezések

- a fájl neve legyen pl. test_*.py
- a tesztfüggvény neve kezdődjön test_-tel

## Lehetőségek

### Assert

Megvizsgálja, hogy a kulcsszó utáni feltétel igaz-e

ha a feltétel True → a teszt átmegy
ha False → a teszt elhasal (AssertionError)

```py
# calculator.py:
def is_even(n):
    return n % 2 == 0
```

```py
# test_calculator.py:
from calculator import is_even

def test_is_even_with_even_number():
    assert is_even(4) is True

def test_is_even_with_odd_number():
    assert is_even(5) is False
```

#### de akár testreszabhatjuk a hibaüzenetet

```py
def test_add():
    assert add(2, 2) == 5, "Az összeadás hibás!"
```

Kimenet: AssertionError: Az összeadás hibás!

### Többféle bemenet tesztelése

Ne csak “szép” bemenetet teszteljünk, hanem:

- normál eset
- szélsőérték
- hibás bemenet
- üres bemenet

> nem csak helyes működést, hanem hibakezelést is tesztelünk

```py
# calculator.py
def divide(a, b):
    return a / b
```

```py
# test_calculator.py
from calculator import divide
import pytest

def test_divide_normal_case():
    assert divide(10, 2) == 5

def test_divide_by_one():
    assert divide(8, 1) == 8

def test_divide_by_zero():
    with pytest.raises(ZeroDivisionError):
        divide(10, 0)
```

### Kivételek tesztelése

> az exception üzenetét is ellenőrizhetjük

```py
# calculator.py
def get_first_item(items):
    if not items:
        raise ValueError("A lista üres")
    return items[0]
```

```py
# test_calculator.py
from calculator import get_first_item
import pytest

def test_get_first_item_returns_first():
    assert get_first_item([10, 20, 30]) == 10

def test_get_first_item_with_empty_list():
    with pytest.raises(ValueError, match="A lista üres"):
        get_first_item([])
```

### Paraméterezett tesztek

> ugyanazt a logikát több adattal elegánsan lehet tesztelni

```py
# calculator.py
def square(n):
    return n * n
```

```py
# test_calculator.py
import pytest
from calculator import square

@pytest.mark.parametrize("input_value, expected", [
    (2, 4),
    (3, 9),
    (-1, 1),
    (0, 0),
])
def test_square(input_value, expected):
    assert square(input_value) == expected
```

### Tesztadat előkészítése

```py
# test_calculator.py
import pytest

@pytest.fixture
def sample_user():
    return {"name": "Anna", "age": 25}

def test_user_name(sample_user):
    assert sample_user["name"] == "Anna"

def test_user_age(sample_user):
    assert sample_user["age"] == 25
```

### Mocking

> helyettesíted a valódi függőségeket egy kontrollált “kamu” (mock) objektummal

> “Kiveszem a valódi világot a tesztből, és én mondom meg mi történjen.”

> A mockolás során a valódi függőségeket helyettesítjük kontrollált objektumokkal, hogy izoláltan teszteljük a kódot.

#### Miért kell mockolni?

- Unit teszt célja: izoláció
- Nem akarjuk, hogy a teszt:
  - adatbázist hívjon
  - HTTP kérést küldjön
  - fájlt olvasson
  - külső API-t használjon

Miért nem?

- lassúak
- nem determinisztikusak
- hibázhatnak külső okok miatt

#### példa

van egy függvény, ami külső függvényre támaszkodik

```py
def get_username_from_db(user_id):
    # külső erőforrás
    return "Anna"

def format_username(user_id):
    username = get_username_from_db(user_id)
    return username.upper()
```

```py
from unittest.mock import patch
from mymodule import format_username

@patch("mymodule.get_username_from_db") # lecseréltük a get_user_from_db függvényt => nem fut le
def test_format_username(mock_get_username):
    mock_get_username.return_value = "bela" # helyette ezt adja vissza: "bela"
    assert format_username(1) == "BELA"     # csak az adott egységet vizsgáljuk
```

#### Lehetőségek mock objektummal

##### visszatérési érték

```py
mock_func.return_value = 10
```

##### kivétel dobása

```py
mock_func.side_effect = ValueError("Hiba")
```

##### több hívás különböző értékekkel

```py
mock_func.side_effect = [1, 2, 3]
```

##### Interakció ellenőrzése

Nem csak az eredményt tesztelheted, hanem azt is, hogyan hívták meg a függvényt

```py
@patch("mymodule.get_user_from_db")
def test_called_with_correct_id(mock_get_user):
    mock_get_user.return_value = {"name": "Anna"}

    get_uppercase_name(42)

    mock_get_user.assert_called_once_with(42)
```
# Python unit tesztelés

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

## Fájl elneezések

- a fájl neve legyen pl. test_*.py
- a tesztfüggvény neve kezdődjön test_-tel

## Assert

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
from mymodule import is_even

def test_is_even_with_even_number():
    assert is_even(4) is True

def test_is_even_with_odd_number():
    assert is_even(5) is False
˙˙˙

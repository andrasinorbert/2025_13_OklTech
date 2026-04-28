# TDD

## Feladat

írjunk egy függvényt, ami eldönti, hogy egy jelszó elég erős-e

### elvárás

Legalább 8 karakter hosszú legyen

### 1. Tesztet írunk először

```py
# test_password.py
from password import is_strong_password

def test_password_is_strong_if_at_least_8_characters():
    assert is_strong_password("abcdefgh") is True
```

Futtatás:

```sh
pytest
```

Eredmény: piros, mert még nincs password.py vagy nincs is_strong_password().

### 2. Minimális kód, hogy átmenjen

```py
# password.py
def is_strong_password(password):
    return True
```

A cél: minimális kód a zöld állapothoz.

```sh
pytest
```

Eredmény: zöld.

### 3. Új teszt: rövid jelszó legyen gyenge

```py
from password import is_strong_password

def test_password_is_strong_if_at_least_8_characters():
    assert is_strong_password("abcdefgh") is True

def test_password_is_weak_if_shorter_than_8_characters():
    assert is_strong_password("abc") is False
```

Futtatás: piros, mert a függvény mindig True.

### 4. Kód javítása

```py
def is_strong_password(password):
    return len(password) >= 8
```

Futtatás: zöld.

### 5. Új szabály: legyen benne szám is

Teszt:

```py
def test_password_is_weak_without_number():
    assert is_strong_password("abcdefgh") is False

def test_password_is_strong_with_number():
    assert is_strong_password("abcdefg1") is True
```

Most a teszt elbukik, mert a kód csak a hosszt nézi.

### 6. Kód bővítése

```py
def is_strong_password(password):
    has_minimum_length = len(password) >= 8
    has_number = any(char.isdigit() for char in password)

    return has_minimum_length and has_number
```

Most ismét zöld.

### 7. Refaktor látványosan

```py
def has_minimum_length(password):
    return len(password) >= 8

def has_number(password):
    return any(char.isdigit() for char in password)

def is_strong_password(password):
    return has_minimum_length(password) and has_number(password)
```

Teszt újra: Ha zöld, a refaktor sikeres.

## Hasznos tipp

Futtatáshoz használhatod ezeket a kapcsolókat, így részletesebb eredményt fogsz látni

```sh
pytest -v
pytest -vv
```
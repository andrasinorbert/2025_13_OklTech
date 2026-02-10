# Mermaid UML

A másik lehetőség a PlantUML, ami bonyolultabb, de több lehetőséget biztosít.

---

## 1. Class Diagram

### Alap példa

```mermaid
classDiagram
    class User {
        +int id
        +string name
        +login()
    }

    class Order {
        +float total
        +create()
    }

    User --> Order
```

### Láthatóság

| Jelölés | Jelentés         |
| ------- | ---------------- |
| +       | public           |
| -       | private          |
| #       | protected        |
| ~       | package/internal |

---

### Kapcsolatok

| Típus                   | Jelölés |
| ----------------------- | ------- |
| Association             | `-->`   |
| Dependency              | `..>`   |
| Inheritance             | `<--`   |
| Realization (interface) | `<..`   |
| Aggregation             | `o--`   |
| Composition             | `*--`   |

#### Példa

```mermaid
classDiagram
    class Engine
    class Car
    class Vehicle

    Vehicle <|-- Car
    Car *-- Engine
```

---

### Multiplicity

```mermaid
classDiagram
    User "1" --> "*" Order
```

---

## 2. Sequence Diagram

Objektumok közötti kommunikáció időrendben.

```mermaid
sequenceDiagram
    participant User
    participant API
    participant DB

    User->>API: Login request
    API->>DB: Check user
    DB-->>API: OK
    API-->>User: Token
```

### Nyíl típusok

| Jel    | Jelentés                             |
| ------ | ------------------------------------ |
| `->>`  | szinkron hívás                       |
| `-->>` | válasz                               |
| `-x`   | megszakítás                          |
| `->>`  | aszinkron (általában így használják) |

---

## 3. State Diagram

Állapotgépekhez (embedded rendszereknél különösen hasznos).

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : start
    Processing --> Idle : done
    Processing --> Error : fail
    Error --> Idle : reset
```

---

## 4. Flowchart (Activity Diagram helyett)

```mermaid
flowchart TD
    A[Start] --> B{Valid?}
    B -->|Yes| C[Process]
    B -->|No| D[Error]
    C --> E[End]
    D --> E
```

---

## 5. Component Diagram (egyszerű architektúra)

```mermaid
flowchart LR
    UI --> API
    API --> Service
    Service --> Database
```

---

## 6. Interface használat

```mermaid
classDiagram
    class Logger {
        <<interface>>
        +log()
    }

    class FileLogger
    class ConsoleLogger

    Logger <|.. FileLogger
    Logger <|.. ConsoleLogger
```

---

## 7. Notes (megjegyzések)

```mermaid
classDiagram
    class User
    note for User "Stores user data"
```

---

## 8. Packages / Namespace

```mermaid
classDiagram
    namespace Core {
        class User
        class Order
    }

    namespace Services {
        class AuthService
    }

    AuthService --> User
```

---

## 9. GitHub-kompatibilis alap sablon

```mermaid
classDiagram
    class Sensor {
        read()
    }

    class Controller {
        process()
    }

    Sensor --> Controller
```

---

## 11. Mikor melyiket használd?

| Cél | Diagram |
| --- | --- |
| OOP tervezés | Class |
| API / folyamat | Sequence |
| Embedded / FSM | State |
| Logika | Flowchart |
| Rendszer architektúra | Component (flowchart) |

---

## 12. Hasznos eszközök

* GitHub README (natív támogatás)
* Obsidian (Mermaid plugin)
* VS Code (Markdown Preview Mermaid)
* [online editor](https://mermaid.live)

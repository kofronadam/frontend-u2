# React + Vite nákupní seznam (Listify)

Jednoduchá aplikace nákupního seznamu postavená na React + Vite. Minimalistický a čistý interface - Apple-style Design. Správa uživatelů, nákupních seznamů a položek. Žádost o přístup k nákupnímu seznamu, Real-time notifikace. Mock data uživatelů, nákupních seznamů a položek.

Funkce:

- úprava názvu nákupního seznamu (pouze vlastník)
- vlastník může přidávat/odebírat členy
- člen může "odejít" z nákupního seznamu
- zobrazení položek nákupního seznamu
- přidání / odebrání položky
- nastavit položku jako vyřešenou (mám ji)
- filtrovat položky (jen nevyřešené)

Spuštění:

```bash
# Clone repository
git clone https://github.com/kofronadam/frontend-u2.git
cd frontend-u2

# Install dependencies
npm install

# Start development server
npm run dev
```

Aplikace bude dostupná na: `http://localhost:5173`

Poté otevři adresu, kterou Vite vypíše (obvykle http://localhost:5173).

### **První kroky**

1. 🔐 **Přihlaste se** pomocí některého z testovacích uživatelů:

   - `jan.novak`
   - `marie.svoboda`
   - `petr.dvorak`
   - `anna.kratka`

2. 📝 **Vytvořte svůj první seznam** kliknutím na "Vytvořit nový seznam"

3. ➕ **Přidejte položky** a **pozvěte členy** do svého seznam

### **Testovací uživatelé:**

- `jan.novak` - Vlastník seznamu "Nákup do Tesca"
- `marie.svoboda` - Vlastník seznamu "Dárky k Vánocům"
- `petr.dvorak` - Vlastník seznamu "Víkendový výlet"
- `anna.kratka` - Vlastník seznamu "Domácí projekty"

### **Předpřipravená data:**

- 📝 4 testovací seznamy s položkami
- 👥 Různé kombinace členů a vlastníků
- 🔔 Ukázkové notifikace a žádosti
- ✅ Dokončené i nedokončené položky

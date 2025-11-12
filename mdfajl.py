class MDFajl():
    def __init__(self):
        """létrehoz egy listát, ebbe pakolja majd ba a sorokat."""
        self.rows=[]
        
    def empty_line(self):
        """üres sor"""
        self.rows.append("\n")
        
    def new_header(self, cimsor_szama:int, text:str):
        """egy cimsort készít. A cimsor_szama a #-ek számát várja"""
        ret="#"*cimsor_szama+" "+str(text)+"\n"
        self.rows.append(ret)
        self.empty_line()
        
    def new_paragraph(self, text):
        """bekezdést készít a szövegből"""
        self.rows.append(text+"\n")
        self.empty_line()
        
    def list_item(self, text:str, pre_str:str, szamozott):
        """egy listaelemet készít"""
        ret=pre_str
        if szamozott:
            ret+="1."
        else:
            ret+="-"
        ret+=" "+text+"\n"
        return ret
        
    def new_list(self, lista:list, depth=0, szamozott:bool=False):
        """depth: hány space szerepeljen (x2) a listaelem előtt"""
        if depth!=0:
            pre=" "*2*depth
        else:
            pre=""
        for i in lista:
            self.rows.append(self.list_item(i, pre, szamozott))
        self.empty_line()

    def run(self):
        """teszt"""
        self.new_header(1, "cimsor1")
        self.new_paragraph("egy bekezdes")
        self.new_paragraph("masik bekezdes")
        self.new_header(2, "cimsor2")
        self.new_paragraph("egy bekezdes")
        self.new_paragraph("masik bekezdes")
        l=["vdaks", "hdkahks", "dhkagdk", "hdkagkgdk"]
        self.new_list(l,0)
        self.new_list(l,1, True)
        
    def fajlbair(self, name:str):
        """name+.md fájlba irja az eltárolt elemeket új fájlt hozva létre"""
        f=open(name+".md", mode="w", encoding="utf-8")
        f.writelines(self.rows[:-1])
        f.close()
        
        
    def kiir(self):
        for i in self.rows:
            print(i, end="")
"""
f=MDFajl()
f.run()
f.kiir()
f.fajlbair("elso")
"""        
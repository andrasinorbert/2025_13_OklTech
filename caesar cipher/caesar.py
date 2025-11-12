from mdfajl import MDFajl

def generate_all(filename, ABC:str="abcdefghijklmnopqrstuvwxyz", isprint:bool=False):
    ret=[]
    for SHIFT in range(len(ABC)):
        lista = ["".join(ABC[(ABC.index(c)+SHIFT)%len(ABC)] if c in ABC else ABC[(ABC.index(c.lower())+SHIFT)%len(ABC)].upper() if c in ABC.upper() else c for c in s) for s in [list(x.rstrip()) for x in open(filename,'r')]]
        if isprint:
            print(lista)
            print(f"\tSHIFT={(len(ABC)-SHIFT)%len(ABC)}")
        
        ret.append(((len(ABC)-SHIFT)%len(ABC), "\n".join(lista)))
    return ret
            
lista=generate_all("caesar_cipher_text.txt", "abcdefghijklmnopqrstuvwxyz")
md=MDFajl()
md.new_header(1,"Caesar cipher")
for item in lista:
    md.new_header(2,f"SHIFT {item[0]}")
    md.new_paragraph(item[1])
md.fajlbair("output")
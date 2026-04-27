from mdfajl import MDFajl

import time
def timer(f):
    def wrapper(*args, **kwargs):
        start_time=time.time()
        result=f(*args, **kwargs)
        stop_time=time.time()
        dt=stop_time-start_time
        print(f"Δt = {dt}")
        return result
    
    return wrapper

def generate_all(filename, ABC:str="abcdefghijklmnopqrstuvwxyz", isprint:bool=False):

    f=open(filename,'r')
    input_file=f.readlines()
    feldolgozott=[]
    for i in input_file:
        x=i.strip()
        feldolgozott.append(x)
    
    
    ret_lista=[]
    for SHIFT in range(len(ABC)):
        ret_string=""
        new_lista=[]
        for s in feldolgozott:
            new_bekezdes=[]
            for c in s:
                new_char=""
                if c in ABC:
                    new_char=ABC[(ABC.index(c)+SHIFT)%len(ABC)]
                elif c in ABC.upper():
                    new_char=ABC[(ABC.index(c.lower())+SHIFT)%len(ABC)].upper()
                else:
                    new_char=c
                new_lista.append(new_char)
            new_bekezdes.append(new_lista)
        for i in new_lista:
            for j in i:
                ret_string+=j
        eredeti_shift=(len(ABC)-SHIFT)%len(ABC)
        egyelem=(eredeti_shift, ret_string)
        ret_lista.append(egyelem)

    return ret_lista

def main():
    lista=generate_all("caesar_cipher_text.txt", "abcdefghijklmnopqrstuvwxyz")
    md=MDFajl()
    md.new_header(1,"Caesar cipher")
    for item in lista:
        md.new_header(2,f"SHIFT {item[0]}")
        md.new_paragraph(item[1])
    md.fajlbair("output")


generate_meres=timer(main)
result=generate_meres()
print(result)

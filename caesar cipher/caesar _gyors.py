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

# generator
def generate_all_cipher(filename, ABC:str="abcdefghijklmnopqrstuvwxyz"):
    for SHIFT in range(len(ABC)):
        yield ((len(ABC)-SHIFT)%len(ABC), "\n".join(["".join(ABC[(ABC.index(c)+SHIFT)%len(ABC)] if c in ABC else ABC[(ABC.index(c.lower())+SHIFT)%len(ABC)].upper() if c in ABC.upper() else c for c in s) for s in [list(x.rstrip()) for x in open(filename,'r')]]))

def main():
    md=MDFajl()
    md.new_header(1,"Caesar cipher")
    for item in generate_all_cipher("caesar_cipher_text.txt"):
        md.new_header(2,f"SHIFT {item[0]}")
        md.new_paragraph(item[1])
    md.fajlbair("output")
    
generate_meres=timer(main)
result=generate_meres()
print(result)

"""
x=[]

x.append([2,3,4])
x.append([2,3,4])
x.append([2,3,4])

print(type(x))
print(type(x[0]))

s=0
for sor in x:
    for elem in sor:
        s+= elem
        
print(s)
"""
class Matrix:
    def __init__(self):
        self.elemek=[]
        
    def hozzaad(self, lista:list):
        self.elemek.append(lista)
        
    def elemekosszege(self):
        s=0
        for sor in self.elemek:
            for elem in sor:
                s+=elem
        return s
    
    def aggregacio_soron(self,sor, fuggveny):
        s=self.elemek[sor][0]
        for i in range(1,len(self.elemek[sor])):
            s=fuggveny(s, self.elemek[sor][i])
        return s
        
x=Matrix()

x.hozzaad([2,3,4])
x.hozzaad([2,3,4])
x.hozzaad([2,3,4])

print(x.elemekosszege())
print(x.aggregacio_soron(0, lambda x,y: x+y))
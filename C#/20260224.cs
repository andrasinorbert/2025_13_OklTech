

namespace _13_okl_tech
{
    class Matrix
    {
        private int elemszam;

        List< List<int> > elemek;

        public int Elemszam{
            get {
                return elemszam;
            }
            set
            {
                elemszam = value;
            }
        }

        public void kiir()
        {
            for (int i = 0; i < elemek.Count; i++)
            {
                for (int j = 0; j < elemek[i].Count; j++)
                {
                    Console.Write($"{elemek[i][j]} ");
                }
                Console.WriteLine();
            }
        }

        public int osszeg()
        {
            int s = 0;
            for (int i = 0; i < elemek.Count; i++)
            {
                for (int j = 0; j < elemek[i].Count; j++)
                {
                    s += elemek[i][j];
                }
            }
            return s;
        }

        public int szorzat()
        {
            int s = 1;
            for (int i = 0; i < elemek.Count; i++)
            {
                for (int j = 0; j < elemek[i].Count; j++)
                {
                    s *= elemek[i][j];
                }
            }
            return s;
        }

        public int aggregacio(Func<int, int, int> f, int kezdoertek)
        {
            int s = kezdoertek;
            for (int i = 0; i < elemek.Count; i++)
            {
                for (int j = 0; j < elemek[i].Count; j++)
                {
                    s=f(s,  elemek[i][j]);
                }
            }
            return s;
        }

        public double atlag()
        {
            return osszeg()/(double)elemszam;
        }

        public int getElemszam()
        {
            return elemszam;
        }
        public Matrix() { 
            elemszam = 0;
        }

        public Matrix(int elemszam)
        {
            this.elemszam = elemszam;
        }

        public Matrix(int[][] m)
        {
            elemek = new List<List<int>>();
            for (int i = 0; i < m.Length; i++)
            {
                List<int> list = new List<int>();
                for (int j = 0; j < m[i].Length; j++)
                {
                    list.Add(m[i][j]);
                    elemszam++;
                }
                elemek.Add(list);
            }
        }
    }

    internal class Program
    {
        static int osszeg(int[] ints)
        {
            int s = 0;
            for (int i = 0; i < ints.Length; i++)
            {
                s += ints[i];
            }
            return s;
        }

        static void Main(string[] args)
        {
            int[] tomb = {2,3,4,5};

            int[] tomb2 = new int[4];

            for (int i = 0; i < tomb.Length; i++)
            {
                Console.WriteLine(tomb[i]);
            }

            if(tomb[1]>2)
                Console.WriteLine("nagyobb mint 2");

            Console.WriteLine(osszeg(tomb));

            Matrix m= new Matrix();
            Matrix m2= new Matrix(5);

            Console.WriteLine(m.Elemszam);
            m.Elemszam = 5;
            Console.WriteLine(m.Elemszam);
            Console.WriteLine(m.getElemszam());

            int[][] m1 = [
                [2,3,4],
                [3,2,1],
                [4,3,2]
                ];

            Matrix matrix = new Matrix(m1);

            matrix.kiir();

            Console.WriteLine(matrix.osszeg());
            Console.WriteLine(matrix.atlag());
            Console.WriteLine(matrix.szorzat());

            Console.WriteLine(matrix.aggregacio( (x,y)=> x+y , 0));
            Console.WriteLine(matrix.aggregacio((x, y) => x * y, 1));

            Console.ReadLine();
        }
    }
}
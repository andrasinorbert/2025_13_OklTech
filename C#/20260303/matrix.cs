using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace _20260303
{
    internal class Matrix<T> where T : INumber<T>
    {
        private int elemszam;

        List<List<T>> elemek;

        // property
        public int Elemszam
        {
            get
            {
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

        private T sorosszeg(int row)
        {
            T s = elemek[row][0];
            for (int i = 1; i < elemek[row].Count; i++)
            {
                s += elemek[row][i];
            }
            return s;
        }

        public T osszeg()
        {
            T s = sorosszeg(0);
            for (int i = 1; i < elemek.Count; i++)
            {
                s += sorosszeg(i);
            }
            return s;
        }

        private T sor_aggregacio(int row, Func<T,T,T> f)
        {
            T s = elemek[row][0];
            for (int i = 1; i < elemek[row].Count; i++)
            {
                s=f(s, elemek[row][i]);
            }
            return s;
        }

        public T aggregacio(Func<T, T, T> f)
        {
            T s = sor_aggregacio(0, f);
            for (int i = 1; i < elemek.Count; i++)
            {
                s = f(s, sor_aggregacio(i, f));
            }
            return s;
        }

        public int getElemszam()
        {
            return elemszam;
        }
        public Matrix()
        {
            elemszam = 0;
        }

        public Matrix(int elemszam)
        {
            this.elemszam = elemszam;
        }

        public Matrix(T[][] m)
        {
            elemek = new List<List<T>>();
            for (int i = 0; i < m.Length; i++)
            {
                List<T> list = new List<T>();
                for (int j = 0; j < m[i].Length; j++)
                {
                    list.Add(m[i][j]);
                    elemszam++;
                }
                elemek.Add(list);
            }
        }
    }
}

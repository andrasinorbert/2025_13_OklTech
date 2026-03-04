namespace _20260303
{
    internal class Program
    {
        static void Main(string[] args)
        {
            int[][] m1 = [
                [2,3,4],
                [3,2,1],
                [4,3,2]
                ];

            Matrix<int> matrix = new Matrix<int>(m1);

            matrix.kiir();

            Console.WriteLine(matrix.aggregacio( (x,y) => x+y));

            double[][] m2 = [
                [2.2,3,4],
                [3,2,1],
                [4,3.3,2]
                ];

            Matrix<double> matrix2= new Matrix<double>(m2);
            matrix2.kiir();
            Console.WriteLine(matrix2.aggregacio((x, y) => x + y));

        }
    }
}

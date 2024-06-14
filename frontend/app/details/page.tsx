import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const Details = () => {
  return (
    <main className='mt-2 z-10'>
      <h1 className='text-3xl font-semibold text-white pb-4 z-10'>Details</h1>
      <Card className='relative bg-white shadow-lg sm:rounded-3xl p-10 bg-clip-padding bg-opacity-80 border border-gray-100'>
        <CardTitle>Abstract</CardTitle>
        <CardContent className='mt-4'>
          This research introduces an innovative method to enhance modular
          system configurations by addressing several critical aspects. It
          focuses on optimizing modular configurations to efficiently solve
          compatibility challenges between new and older components. Emphasizing
          the importance of backward compatibility, the study reveals hidden
          solutions that are often overlooked. Additionally, it highlights the
          role of an interactive user interface, providing the flexibility
          needed for users to make informed decisions throughout the
          configuration process. This approach ensures seamless integration of
          current and legacy components without compromising performance or
          flexibility.
        </CardContent>
        <CardTitle>References</CardTitle>
        <CardContent className='mt-4'>
          <ul className='flex flex-col gap-y-2 list-disc'>
            <li>
              Yoo, J. (2023). Computational modular system configuration with
              backward compatibility. International Journal of Advanced
              Manufacturing Technology, 125, pp. 3349-3362.
            </li>
            <li>
              Zhang, N., Yang, Y., Zheng, Y., & Su, J. (2019). Module partition
              of complex mechanical products based on weighted complex networks.
              Journal of Intelligent Manufacturing, 30(4), pp. 1973-1998.
            </li>
            <li>
              Kusiak, A. (2018). Smart manufacturing. International Journal of
              Production Research, 56(1-2), pp. 508-517.
            </li>
            <li>
              Yoo, J., Kumara, S., & Simpson, T. W. (2012). Modular product
              design using cyberinfrastructure for global manufacturing. Journal
              of Computer and Information Science in Engineering, 12(3), pp.
              031008-1~10.
            </li>
            <li>
              Ong, S. K., & Nee, A. Y. C. (2006). Modular product design: a
              conceptualization from customization perspective. Journal of
              Intelligent Manufacturing, 17(6), pp. 729-741.
            </li>
            <li>
              Lee, J. H., & Kim, S. H. (2006). A review of modular design in
              product development. International Journal of Precision
              Engineering and Manufacturing, 7(3), pp. 1-13.
            </li>
            <li>
              Bohm, M. R., Stone, R. B., Simpson, T. W., & Streva, E. D. (2008).
              Introduction of a data schema to support a design repository.
              Computer Aided Design, 40(7), pp. 801-811.
            </li>
            <li>
              Ong, S. K., & Nee, A. (2009). Modular product design: a review and
              future research directions. International Journal of Production
              Research, 47(4), pp. 963-997.
            </li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
};

export default Details;

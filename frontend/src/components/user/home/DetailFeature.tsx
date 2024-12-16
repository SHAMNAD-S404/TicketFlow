import React from "react";

type FeatureProps = {
  header: string;
  text: string;
  subHeader1: string;
  subText1: string;
  subHeader2: string;
  subText2: string;
  image: string;
  reverse?: boolean;
};

const DetailFeature: React.FC<FeatureProps> = ({
  header,
  text,
  subHeader1,
  subText1,
  subHeader2,
  subText2,
  image,
  reverse = false,
}) => {
  return (
    <section
      className={`bg-blue-50 flex flex-col items-center justify-between gap-8 lg:flex-row 
            ${
              reverse ? "lg:flex-row-reverse" : "lg:flex-row"
            } py-6 px-6 md:px-12`}
    >
      {/* Text section */}
      <div className="lg:w-1/2 text-center p-2 space-y-6">
        <h2 className="phone:text-xl sm:text-3xl font-bold">{header}</h2>
        <p className=" phone:text-sm sm:text-base font-medium text-gray-700">
          {text}
        </p>
        <div className="flex  gap-4 lg:gap-6">
          {/*Sub Section1 */}
          <div>
            <h3 className="phone:text-lg sm:text-xl font-semibold">
              {subHeader1}
            </h3>
            <p className="phone:text-sm sm:text-base text-gray-700">
              {subText1}
            </p>
          </div>
          {/* Sub Section2 */}
          <div>
            <h3 className="phone:text-lg sm:text-xl font-semibold">
              {subHeader2}
            </h3>
            <p className="phone:text-sm sm:text-base text-gray-700">
              {subText2}
            </p>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="lg:w-1/2">
        <img src={image} alt="images" className="w-full " />
        {/*rounded-lg shadow-lg */}
      </div>
    </section>
  );
};

export default DetailFeature;

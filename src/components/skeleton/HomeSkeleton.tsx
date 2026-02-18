"use client";
import Skeleton from "./Skeleton";

export default function HomeSkeleton() {
  return (
    <div className="flex flex-col pt-4 sm:pt-6 md:pt-8 lg:pt-10 px-4 md:pl-8 lg:pl-12 md:pr-[70px] lg:pr-[100px] pb-24 md:pb-8 w-full max-w-[100vw]">
      {/* Hero and Featured Section */}
      <div className="flex flex-col lg:flex-row mt-2 gap-8 lg:gap-12">
        {/* Hero Text Skeleton */}
        <div className="flex flex-col lg:w-3/5 xl:w-[60%]">
          <Skeleton className="h-10 sm:h-12 md:h-16 lg:h-20 w-3/4 mb-4" />
          <Skeleton className="h-8 sm:h-10 md:h-12 lg:h-14 w-1/2 mb-6" />
          
          <div className="space-y-2 max-w-2xl">
            <Skeleton className="h-3 sm:h-4 w-full" />
            <Skeleton className="h-3 sm:h-4 w-5/6" />
            <Skeleton className="h-3 sm:h-4 w-4/6" />
          </div>

          {/* Search Bar Skeleton */}
          <Skeleton className="h-11 sm:h-12 rounded-full mt-8 md:mt-10 w-full max-w-[560px]" />
        </div>
        
        {/* Featured Song Skeleton */}
        <div className="flex flex-col lg:w-2/5 xl:w-[40%] items-center lg:items-start mt-6 lg:mt-0">
          <div className="w-full flex flex-col items-center lg:items-start">
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-6" />
          </div>
          <Skeleton className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px] rounded-full" />
        </div>
      </div>

      {/* Grid Section */}
      <div className="mt-10 sm:mt-12">
        <div className="flex flex-row items-center gap-2 mb-4 sm:mb-6">
          <Skeleton className="h-7 w-32" />
        </div>
        
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 sm:gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`flex flex-col ${i === 7 ? 'lg:hidden' : ''}`}>
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4 mt-3" />
              <Skeleton className="h-3 w-1/2 mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import ShinyText from "@/components/ShinyText";
import Image from "next/image";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const params = await searchParams;
  const guestName = params.name || "Guest";

  return (
    <div className="w-screen h-screen">
      <div className="relative flex flex-col md:flex-row w-full h-full">
        <div className="hidden md:flex relative md:w-5/12 xl:w-3/12 h-full flex flex-col items-center justify-center">
          <Image src="/logo.png" alt="Logo" width={200} height={200} />

          {/* Event Details */}
          <div className="flex flex-col items-center mt-8 gap-6 w-full px-8">
            {/* Date */}
            <div className="border-2 border-gray-200 rounded-lg p-4 w-full">
              <div className="text-sm uppercase ubuntu text-gray-600 mb-2">
                Date & Time
              </div>
              <div className="text-lg md:text-xl dancing-script text-center">
                Saturday, December 15th, 2025
                <br />
                4:00 PM - 10:00 PM
              </div>
            </div>

            {/* Venue */}
            <a
              href="https://maps.app.goo.gl/zSdMFPQRfDsyv9ej9"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-gray-200 rounded-lg p-4 w-full hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div className="text-sm uppercase ubuntu text-gray-600 mb-2">
                Venue
              </div>
              <div className="text-lg md:text-xl dancing-script text-center group-hover:text-blue-600 transition-colors">
                Cordela Hotel Cirebon
                <br />
                Jl. Cipto Mangunkusumo No.111
                <br />
                Kota Cirebon, Jawa Barat 45133
              </div>
              <div className="text-xs text-gray-500 text-center mt-2">
                Click to view in Google Maps
              </div>
            </a>
          </div>

          {/* RSVP Button */}
          <button className="mt-8 px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-xl dancing-script font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            RSVP Now
          </button>
        </div>
        <div className="relative w-full flex md:hidden items-center justify-between py-2 px-4">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />

          <button className="px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-md dancing-script font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            RSVP Now
          </button>
        </div>
        <div className="relative w-full md:w-7/12 xl:w-9/12 h-full">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg.jpg')] bg-cover bg-center">
            <div className="block md:hidden absolute top-2 left-0 w-full h-[2px] bg-white"></div>
            <div className="hidden md:block absolute top-0 left-2 w-[2px] h-full bg-white"></div>
            <div className="block md:hidden absolute bottom-2 left-0 w-full h-[2px] bg-white"></div>
          </div>
          <div className="w-full h-full relative flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-8">
              <div className="text-3xl md:text-4xl dancing-script text-center">
                Dear
              </div>
              <ShinyText
                text={guestName}
                disabled={false}
                speed={3}
                className="text-6xl md:text-8xl dancing-script font-bold text-center"
              />
              <div className="text-3xl md:text-4xl dancing-script text-center">
                You are cordially invited
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex md:hidden w-full items-center justify-center py-4 px-4">
          {/* Event Details */}
          <div className="flex flex-col items-center gap-6 w-full">
            {/* Date */}
            <div className="border-2 border-gray-200 rounded-lg p-4 w-full">
              <div className="text-sm uppercase ubuntu text-gray-600 mb-2">
                Date & Time
              </div>
              <div className="text-lg md:text-xl dancing-script text-center">
                Saturday, December 15th, 2025
                <br />
                4:00 PM - 10:00 PM
              </div>
            </div>

            {/* Venue */}
            <a
              href="https://maps.app.goo.gl/zSdMFPQRfDsyv9ej9"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-gray-200 rounded-lg p-4 w-full hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div className="text-sm uppercase ubuntu text-gray-600 mb-2">
                Venue
              </div>
              <div className="text-lg md:text-xl dancing-script text-center group-hover:text-blue-600 transition-colors">
                Cordela Hotel Cirebon
                <br />
                Jl. Cipto Mangunkusumo No.111
                <br />
                Kota Cirebon, Jawa Barat 45133
              </div>
              <div className="text-xs text-gray-500 text-center mt-2">
                Click to view in Google Maps
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

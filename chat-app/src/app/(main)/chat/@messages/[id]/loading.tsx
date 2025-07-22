const messageWidths = [ 'w-80', 'w-150', 'w-50', 'w-100' ]

export default function Loading() {
    return <div className="w-full h-full relative flex flex-col">
            <div className="flex justify-between items-center bg-gray-400 shadow-sm absolute top-0 left-0 w-full height-max p-5 h-35 z-5">
                <div className="flex items-center">
                    <div className="w-25 h-25 rounded-full bg-gray-300 animate-pulse"></div>
                    <div className="w-50 h-4 rounded-full bg-gray-300 animate-pulse ml-5"></div>
                </div>
            </div>
            <div className="w-full h-200 px-5 pb-5 pt-40 flex flex-col flex-grow gap-y-5 overflow-y-hidden z-3">
                {
                    Array(10).fill(true).map((v, i) =>                 
                        <div key={`loadingchatroommessagelistiten${i}`} className={`flex flex-col gap-y-2 bg-gray-300 text-white p-5 relative rounded-r-xl rounded-tl-xl ${messageWidths[i % 4]}`}>
                            <div className=" h-4 rounded-full bg-gray-200 animate-pulse ml-5"></div>
                            <div className="w-2/3 h-4 rounded-full bg-gray-200 animate-pulse ml-5"></div>
                            <div className="w-1/4 h-4 rounded-full bg-gray-200 animate-pulse ml-5"></div>
                        </div>
                    ) 
                }
            </div>
            <div className="bg-gray-300 w-full p-5 h-30 flex items-center">
                <div className="flex items-center w-full">
                    <div className="bg-gray-400 rounded-xl flex-grow h-16 animate-pulse"></div>
                    <div className="text-white bg-gray-400 rounded-full w-15 h-15 ml-5 animate-pulse"></div>
                </div>
            </div>
        </div>
}
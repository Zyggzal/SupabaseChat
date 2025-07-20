export default function Loading() {
    return <div className="flex flex-col relative h-full overflow-y-hidden">
        {
            Array(10).fill(true).map((v, i) =>                 
                <div key={`loadingchatroomlistiten${i}`} className="p-5 flex items-center">
                    <div className="w-25 h-25 rounded-full bg-gray-300 animate-pulse"></div>
                    <div className="pl-8 flex-grow h-max">
                        <div className="w-full h-4 rounded-full bg-gray-300 animate-pulse mb-3"></div>
                        <div className="w-50 h-3 rounded-full bg-gray-300 animate-pulse"></div>
                    </div>
                </div>
            ) 
        }
    </div>
}
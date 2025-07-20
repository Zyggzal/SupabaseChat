export default function Loading() {
    return <div className="w-full h-full relative">
        <div className="flex justify-between items-center bg-gray-400 shadow-xl absolute top-0 left-0 w-full height-max p-5 h-35">
            <div className="flex items-center">
                <div className="w-25 h-25 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="w-50 h-4 rounded-full bg-gray-300 animate-pulse ml-5"></div>
            </div>
        </div>
    </div>
}
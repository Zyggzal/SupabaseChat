import Image from "next/image";

export default function NoMessages() {
    return <div className="bg-gray-400/50 w-full h-full flex justify-center">
        <div className="flex flex-col items-center pt-40">
            <Image src='/images/graffiti/startChatting.png' alt="start chatting pic" width={2000} height={2000} className="w-180 h-80"/>
            <p className="text-white mt-10 animate-bounce">Right noooooooooooowwwwwwww....</p>
        </div>
    </div>
}
import Image from "next/image"

export default function Layout({ children, messages }: 
    Readonly<{
        children: React.ReactNode,
        messages: React.ReactNode
    }>
) {
  return <div className="h-full w-full wall">
      <div className="grid grid-cols-[500px_8fr] h-full w-full">
        <div className="col-1 row-1 z-2">
            {children}
        </div>
        <div className="col-2 row-1 z-2">
            {messages}
        </div>
    </div>
  </div>
}
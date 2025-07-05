export default function Layout({ children, messages }: 
    Readonly<{
        children: React.ReactNode,
        messages: React.ReactNode
    }>
) {
  return <div className="h-full w-full">
      <div className="grid grid-rows-[8fr_200px] grid-cols-[500px_8fr] h-full w-full">
        <div className="col-1 row-1 row-span-2">
            {children}
        </div>
        <div className="col-2 row-1">
            {messages}
        </div>
    </div>
  </div>
}
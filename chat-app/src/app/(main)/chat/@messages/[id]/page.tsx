export default async function MessagesPage({ params } : { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    return <div className="w-full h-full border-2 border-black">
        <h1>Chat id: {id}</h1>
    </div>
}
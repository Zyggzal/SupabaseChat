import Navbar from "@/components/navbar/navbar"
import ProfileProvider from "@/contexts/profile"

export default function Layout({ children }: 
    Readonly<{
        children: React.ReactNode
    }>
) {
  return <ProfileProvider>
    <Navbar/>
    <div className="w-full h-full relative pt-30">
        {children}
    </div>
  </ProfileProvider>
}
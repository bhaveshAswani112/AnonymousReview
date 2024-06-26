
"use client"
import Navbar from "@/components/Navbar";
import { RecoilRoot } from "recoil";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
       <RecoilRoot>
         <Navbar></Navbar>
         {children}
       </RecoilRoot>
        
      

  
    
  );
}

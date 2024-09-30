'use client'

import { useSession } from '@/context';

export default function AppWrapper({ children }: Readonly<{ children: React.ReactNode }>) {

    return (
        <main className="w-full h-screen flex flex-col lg:justify-center lg:flex-row lg:gap-2 overflow-hidden md:ease-in-out md:duration-500">
                {children}
        </main >
    )
}
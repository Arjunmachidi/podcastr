'use client';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { Button } from './ui/button';
import { useAudio } from '@/providers/AudioProvider';

const LeftSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { audio } = useAudio();
  const { user } = useUser();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <section className={cn("left_sidebar h-[calc(100vh-5px)]", {
      'h-[calc(100vh-140px)]': audio?.audioUrl
    })}>
      <nav className="flex flex-col gap-6">
        {/* Logo */}
        <Link href="/" className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center">
          <Image src="/icons/logo.svg" alt="logo" width={23} height={27} />
          <h1 className="text-24 font-extrabold text-white max-lg:hidden">Podcastr</h1>
        </Link>

        {/* Sidebar Links */}
        {sidebarLinks.map(({ route, label, imgURL }) => {
          const dynamicRoute = label === "My Profile"
            ? (user ? `/profile/${user.id}` : "/sign-in") // Dynamically generate profile route
            : route;

          const isActive = pathname === dynamicRoute || pathname.startsWith(`${dynamicRoute}/`);

          return (
            <Link 
              href={dynamicRoute} 
              key={label} 
              className={cn("flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start", {
                "bg-nav-focus border-r-4 border-orange-1": isActive,
              })}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <p className="max-lg:hidden">{label}</p>
            </Link>
          );
        })}
      </nav>  

      {/* Signed Out: Show Sign In Button */}
      <SignedOut>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button asChild className="text-16 w-full bg-orange-1 font-extrabold">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </SignedOut>

      {/* Signed In: Show Logout Button */}
      <SignedIn>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button className="text-16 w-full bg-orange-1 font-extrabold" onClick={handleSignOut}>
            Log Out
          </Button>
        </div>
      </SignedIn>
    </section>
  );
};

export default LeftSidebar;

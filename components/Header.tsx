'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Settings } from '@/lib/content';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Brand from './Brand';
import { cn } from '@/lib/utils';

type NavItem = { pageKey: string; navLabel: string; path: string };
export default function Header({ settings, navigation }: { settings: Settings; navigation: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the sheet whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Elevate the sticky header once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = navigation.filter(item => item.pageKey !== 'contact');
  const isCurrent = (path: string) => (path === '/' ? pathname === '/' : pathname.startsWith(path));

  return (
    <>
      <div className="top-strip">
        <div className="wrap top-strip-inner">
          <span>TRADING HOUSE <span className="top-separator">/</span> PROJECT OFFICE</span>
          <span className="top-right">
            {process.env.NEXT_PUBLIC_DRAFT_MODE !== 'false'
              ? <>CONCEPT PREVIEW <span className="top-separator">/</span> CONTENT SUBJECT TO APPROVAL</>
              : <>NIGERIA <span className="top-separator">/</span> WEST AFRICA</>}
          </span>
        </div>
      </div>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="wrap nav-inner">
          <Brand settings={settings} />
          <nav className="hidden flex-1 items-center justify-center gap-[clamp(13px,1.9vw,29px)] min-[901px]:flex" aria-label="Main navigation">
            {navItems.map(item => (
              <Link
                key={item.pageKey}
                href={item.path}
                aria-current={isCurrent(item.path) ? 'page' : undefined}
                className={cn(
                  'whitespace-nowrap text-[12px] font-semibold text-[#334c43] transition-colors hover:text-[#3f5a37]',
                  isCurrent(item.path) && 'text-primary underline underline-offset-8 decoration-2 decoration-lime'
                )}
              >
                {item.navLabel}
              </Link>
            ))}
          </nav>
          <Button asChild size="sm" className="ml-auto hidden h-11 px-5 text-[12.5px] min-[701px]:inline-flex min-[901px]:ml-0">
            <Link href="/contact">Get in touch <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" /></Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="ml-auto min-[701px]:ml-0 min-[901px]:hidden" aria-label="Open menu" aria-expanded={open}>
                <Menu size={22} aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent aria-describedby="mobile-nav-description">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription id="mobile-nav-description" className="sr-only">LeSeft Nigeria site navigation</SheetDescription>
                <Brand settings={settings} />
              </SheetHeader>
              <SheetBody>
                <nav aria-label="Mobile navigation" className="flex flex-col">
                  {navigation.map(item => (
                    <Link
                      key={item.pageKey}
                      href={item.path}
                      aria-current={isCurrent(item.path) ? 'page' : undefined}
                      className="sheet-nav-link"
                    >
                      <span>{item.navLabel}</span>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </Link>
                  ))}
                </nav>
              </SheetBody>
              <SheetFooter>
                <Button asChild className="w-full">
                  <Link href="/contact">Get in touch <ArrowUpRight size={16} aria-hidden="true" /></Link>
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}

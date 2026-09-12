import Link from "next/link";
import { Container } from "../ui/Container";

export function Footer() {
  return (
    <footer className="bg-navy-900 text-white/80">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-1">
          <h3 className="font-display text-lg font-bold text-white">
            Taraba State University
          </h3>
          <p className="mt-3 text-md">
            Harnessing Nature&apos;s Gift. ATC, 660213, Jalingo, Taraba State.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white">Explore</h4>
          <ul className="mt-3 space-y-2 text-md">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/academics">Academics</Link>
            </li>
            <li>
              <Link href="/admissions">Admissions</Link>
            </li>
            <li>
              <Link href="/research">Research</Link>
            </li>
            <li>
              <Link href="/news">News</Link>
            </li>
            <li>
              <Link href="/events">Events</Link>
            </li>
            <li>
              <Link href="/giving">Give</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Campus Life</h4>
          <ul className="mt-3 space-y-2 text-md">
            <li>
              <Link href="/student-life">Student Life</Link>
            </li>
            <li>
              <Link href="/alumni">Alumni</Link>
            </li>
            <li>
              <Link href="/campuses">Campuses</Link>
            </li>
            <li>
              <Link href="/careers">Careers</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Resources</h4>
          <ul className="mt-3 space-y-2 text-md">
            <li>
              <Link href="/academic-calendar">Academic Calendar</Link>
            </li>
            <li>
              <Link href="/library">Library</Link>
            </li>
            <li>
              <Link href="/portals">Portals</Link>
            </li>
            <li>
              <Link href="/tetfund">TETFund</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/staff-directory">Staff Directory</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Contact</h4>
          <p className="mt-3 text-md">registrar@tsuniversity.edu.ng</p>
          <Link href="/search" className="mt-3 inline-block text-md hover:text-white hover:underline">
            Search the site →
          </Link>
        </div>
      </Container>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Taraba State University. All rights
        reserved. ·{" "}
        <Link href="/privacy-policy" className="hover:text-white/80 hover:underline">
          Privacy Policy
        </Link>
        {/* <p className="text-sm text-tsu-text-muted">
          <a
            href="https://www.kmfenterprise.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-red-500 transition-colors"
          >
            Built and Maintained by KMFenterprise
          </a>
        </p> */}
      </div>
    </footer>
  );
}

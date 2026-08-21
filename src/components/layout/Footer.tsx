import Link from "next/link";
import { Container } from "../ui/Container";

export function Footer() {
  return (
    <footer className="bg-navy-900 text-white/80">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
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
              <Link href="/news">News</Link>
            </li>
            <li>
              <Link href="/events">Events</Link>
            </li>
            <li>
              <Link href="/tetfund">TETFund</Link>
            </li>
            <li>
              <Link href="/giving">Give</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Portals</h4>
          <ul className="mt-3 space-y-2 text-md">
            <li>
              <Link href="/portals">All Portals</Link>
            </li>
            <li>
              <Link href="/admissions">Admissions</Link>
            </li>
            <li>
              <Link href="/library">Library</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Contact</h4>
          <p className="mt-3 text-md">registrar@tsuniversity.edu.ng</p>
        </div>
      </Container>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Taraba State University. All rights
        reserved.
        <p className="text-sm text-tsu-text-muted">
          <a
            href="https://www.kmfenterprise.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-red-500 transition-colors"
          >
            Built and Maintained by KMFenterprise
          </a>
        </p>
      </div>
    </footer>
  );
}

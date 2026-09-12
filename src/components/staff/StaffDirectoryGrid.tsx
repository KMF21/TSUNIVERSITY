'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { urlFor } from '@/sanity/image'

type StaffMember = {
  _id: string
  name: string
  slug: { current: string }
  title: string
  staffType: 'academic' | 'non-academic'
  photo?: any
  specialization?: string
  department?: { name: string; slug: { current: string }; facultySlug?: string } | null
}

function StaffCard({ staff }: { staff: StaffMember }) {
  return (
    <Link
      href={`/staff-directory/${staff.slug.current}`}
      className="block overflow-hidden rounded-card border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full bg-navy/10">
        {staff.photo ? (
          <Image
            src={urlFor(staff.photo).width(300).height(300).url()}
            alt={staff.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-2xl font-bold text-navy/40">
            {staff.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="truncate font-display text-sm font-semibold text-navy">{staff.name}</p>
        <p className="mt-0.5 truncate text-xs font-medium text-crimson">{staff.title}</p>
        {staff.department && (
          <p className="mt-0.5 truncate text-xs text-ink-muted">{staff.department.name}</p>
        )}
      </div>
    </Link>
  )
}

export function StaffDirectoryGrid({ staff }: { staff: StaffMember[] }) {
  const [query, setQuery] = useState('')
  const [staffType, setStaffType] = useState<'all' | 'academic' | 'non-academic'>('all')
  const [department, setDepartment] = useState('all')

  const departments = useMemo(() => {
    const names = new Set(staff.filter((s) => s.department).map((s) => s.department!.name))
    return Array.from(names).sort()
  }, [staff])

  const filtered = staff.filter((s) => {
    const matchesQuery = s.name.toLowerCase().includes(query.toLowerCase())
    const matchesType = staffType === 'all' || s.staffType === staffType
    const matchesDept = department === 'all' || s.department?.name === department
    return matchesQuery && matchesType && matchesDept
  })

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search staff by name..."
            className="w-full rounded-full border border-black/10 py-3 pl-11 pr-4 text-md text-ink focus:outline-none focus:ring-2 focus:ring-crimson"
          />
        </div>

        <select
          value={staffType}
          onChange={(e) => setStaffType(e.target.value as typeof staffType)}
          aria-label="Filter by staff type"
          className="rounded-full border border-black/10 px-4 py-3 text-md text-ink focus:outline-none focus:ring-2 focus:ring-crimson"
        >
          <option value="all">All Staff</option>
          <option value="academic">Academic</option>
          <option value="non-academic">Non-Academic</option>
        </select>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          aria-label="Filter by department"
          className="rounded-full border border-black/10 px-4 py-3 text-md text-ink focus:outline-none focus:ring-2 focus:ring-crimson"
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-sm text-ink-muted">
        {filtered.length} staff member{filtered.length === 1 ? '' : 's'}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-ink-muted">No staff match your search.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((staff) => (
            <StaffCard key={staff._id} staff={staff} />
          ))}
        </div>
      )}
    </div>
  )
}

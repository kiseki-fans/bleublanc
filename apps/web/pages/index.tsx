import Link from 'next/link'

export default function Web() {
  return (
    <div>
      Go to{' '}
      <Link href="/MockDashBoard">
        <a>MockDashBoard!</a>
      </Link>
    </div>
  )
}

import { redirect } from 'next/navigation'

export default function Page() {
  // Server-side redirect so requests to /about-us land on the new design
  redirect('/designs/about-us-2')
}

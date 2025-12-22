import { redirect } from 'next/navigation';

export default function Page() {
  // Redirect the app route to the public static HTML so GET /designs/about-us-1 serves index.html
  redirect('/designs/about-us-1/index.html');
}

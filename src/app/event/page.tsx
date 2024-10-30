'use client';
// Example of checking user session in /event page
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

const EventPage: React.FC = () => {
  
  
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Redirect to sign-in page if not authenticated
        router.push('/signin');
      } else {
        setUser(session.user);
      }
    });
  }, [router]);

  if (!user) {
    return <p>Loading...</p>; // or a loader component
  }

  return (
    <div>
      <h1>Event Page</h1>
      {/* Render your event content here */}
    </div>
  );
};

export default EventPage;

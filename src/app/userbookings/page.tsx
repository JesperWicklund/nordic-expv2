'use client'
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";


type Booking = {
  id: number;
  details: string;
  date: string;
  event_id: string;
  accommodation_id: string;
  accommodation_name: string;
  accommodation_date: string;
  event_title?: string;
  event?: string;
  event_date?: string; 
  booking_date: string;
};

export default function UserBookings() {
  const [user, setUser] = useState<any | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user session and bookings
  useEffect(() => {
    const getUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);
        fetchUserBookings(data.session.user.id); // Fetch bookings for the logged-in user
      }
    };

    getUserSession();
  }, []);

  // Fetch bookings for the logged-in user from Supabase
  const fetchUserBookings = async (userId: string) => {
    setLoading(true); // Start loading
    const { data: bookingsData, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userId);

    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
      setLoading(false);
      return;
    }

    // Fetch event titles and accommodation names for each booking
    const bookingsWithDetails = await Promise.all(
      bookingsData.map(async (booking: Booking) => {
        // Fetch event details if event_id exists
        if (booking.event_id) {
          const { data: eventData, error: eventError } = await supabase
            .from("events")
            .select("title, date") // Select both title and date
            .eq("id", booking.event_id)
            .single();

          if (eventError) {
            console.error("Error fetching event title and date:", eventError);
          } else {
            booking.event_title = eventData?.title;
            booking.event_date = eventData?.date; // Store event date
          }
        }

        // Fetch accommodation details if accommodation_id exists
        if (booking.accommodation_id) {
          const { data: accommodationData, error: accommodationError } = await supabase
            .from("accommodations")
            .select("name, date") // Assuming date field also exists in accommodations
            .eq("id", booking.accommodation_id)
            .single();

          if (accommodationError) {
            console.error("Error fetching accommodation details:", accommodationError);
          } else {
            booking.accommodation_name = accommodationData?.name;
            booking.accommodation_date = accommodationData?.date;
          }
        }

        return booking;
      })
    );

    console.log("Bookings with event details:", bookingsWithDetails);

    setBookings(bookingsWithDetails || []);
    setLoading(false); // Stop loading
  };

  // Group bookings by booking_date
  const groupedBookings = bookings.reduce((groups: any, booking: Booking) => {
    const date = booking.booking_date; // Use booking_date to group
    if (!groups[date]) {
      groups[date] = { event: [], accommodation: [] };
    }

    // Group by event and accommodation
    if (booking.event_title) {
      groups[date].event.push(booking);
    } else if (booking.accommodation_name) {
      groups[date].accommodation.push(booking);
    }

    return groups;
  }, {});

  // Function to delete a booking
  const deleteBooking = async (bookingId: number) => {
    // Confirm with the user before deleting
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) return;

    // Perform delete operation on Supabase
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId);

    if (error) {
      console.error("Error deleting booking:", error);
    } else {
      // Remove the deleted booking from the state
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
      alert("Booking deleted successfully");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Bookings</h2>
      {user ? (
        <>
          <p className="text-gray-700 mb-4">
            Welcome, <span className="font-bold">{user.email}</span>
          </p>
          {Object.keys(groupedBookings).length > 0 ? (
            <ul>
              {Object.entries(groupedBookings).map(([date, group]) => (
                <li key={date} className="mb-6">
                  <div className="text-gray-800">
                    <h3 className="font-semibold text-lg mb-2">
                      Booking made: {new Date(date).toLocaleDateString()}
                    </h3>
                    {group.event.length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-700">Events:</h4>
                        {group.event.map((booking: Booking) => (
                          <div key={booking.id} className="mb-2 text-gray-600">
                            <div>Event: {booking.event_title}</div>
                            <div className="text-sm">Event Date: {new Date(booking.event_date!).toLocaleDateString()}</div>
                            <div className="text-sm">Booking Made: {new Date(booking.booking_date).toLocaleDateString()}</div>
                            <button
                              className="text-red-500 mt-2"
                              onClick={() => deleteBooking(booking.id)}
                            >
                              Remove Booking
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {group.accommodation.length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-700">Accommodations:</h4>
                        {group.accommodation.map((booking: Booking) => (
                          <div key={booking.id} className="mb-2 text-gray-600">
                            <div>Accommodation: {booking.accommodation_name}</div>
                            <div className="text-sm">Accommodation Date: {new Date(booking.accommodation_date).toLocaleDateString()}</div>
                            <div className="text-sm">Booking Made: {new Date(booking.booking_date).toLocaleDateString()}</div>
                            <button
                              className="text-red-500 mt-2"
                              onClick={() => deleteBooking(booking.id)}
                            >
                              Remove Booking
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No bookings found.</p>
          )}
        </>
      ) : (
        <p>You need to be logged in to view your bookings.</p>
      )}
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import DeleteBookingModal from "@/components/DeleteBookingModal";

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
  total_price: number;
  quantity: number;
  start_date: string;
  end_date: string;
};

type User = {
  id: string;
  email: string;
};

export default function UserBookings() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

  useEffect(() => {
    const getUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || "",
        });
        fetchUserBookings(data.session.user.id);
      }
    };
    getUserSession();
  }, []);

  const fetchUserBookings = async (userId: string) => {
    setLoading(true);
    const { data: bookingsData, error: bookingsError } = await supabase
      .from("bookings")
      .select("*, total_price, quantity, start_date, end_date")
      .eq("user_id", userId);

    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
      setLoading(false);
      return;
    }

    const bookingsWithDetails = await Promise.all(
      bookingsData.map(async (booking: Booking) => {
        if (booking.event_id) {
          const { data: eventData, error: eventError } = await supabase
            .from("events")
            .select("title, date")
            .eq("id", booking.event_id)
            .single();

          if (eventError) {
            console.error("Error fetching event details:", eventError);
          } else {
            booking.event_title = eventData?.title;
            booking.event_date = eventData?.date;
          }
        }

        if (booking.accommodation_id) {
          const { data: accommodationData, error: accommodationError } =
            await supabase
              .from("accommodations")
              .select("name, date")
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

    setBookings(bookingsWithDetails || []);
    setLoading(false);
  };

  const groupedBookings = bookings.reduce((groups: { [key: string]: { event: Booking[]; accommodation: Booking[] } }, booking: Booking) => {
    const date = booking.booking_date;
    if (!groups[date]) {
      groups[date] = { event: [], accommodation: [] };
    }

    if (booking.event_title) {
      groups[date].event.push(booking);
    } else if (booking.accommodation_name) {
      groups[date].accommodation.push(booking);
    }

    return groups;
  }, {});

  // Function to calculate total price for each group
  const calculateGroupTotal = (group: { event: Booking[]; accommodation: Booking[] }) => {
    const eventTotal = group.event.reduce((total, booking) => total + booking.total_price, 0);
    const accommodationTotal = group.accommodation.reduce((total, booking) => total + booking.total_price, 0);
    return eventTotal + accommodationTotal;
  };

  const deleteBooking = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setIsModalOpen(true);
  };

  const confirmDeleteBooking = async (bookingId: number) => {
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId);

    if (error) {
      console.error("Error deleting booking:", error);
    } else {
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
      setIsModalOpen(false);
    }
  };

  const cancelDeleteBooking = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="text-center">Loading your bookings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">My Bookings</h2>
      {user ? (
        <>
          {Object.keys(groupedBookings).length > 0 ? (
            <div>
              {Object.entries(groupedBookings).map(([date, group]) => (
                <div key={date} className="mb-8">
                  <div className="text-gray-800 border-b-2 pb-3">
                    <h3 className="font-semibold text-lg mb-3">
                      Bookings on {new Date(date).toLocaleDateString()}
                    </h3>
                    {/* Display the total price right under the booking date */}
                    <div className="font-semibold text-md text-gray-700 mb-4">
                      Total Price: ${calculateGroupTotal(group).toFixed(2)}
                    </div>

                    {group.event.length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-700 mb-2">
                          Events:
                        </h4>
                        {group.event.map((booking: Booking) => (
                          <div
                            key={booking.id}
                            className="p-4 mb-4 bg-gray-50 border rounded-md shadow-sm"
                          >
                            <div className="font-semibold">{booking.event_title}</div>
                            <div>
                              Dates: {new Date(booking.start_date).toLocaleDateString()} to{" "}
                              {new Date(booking.end_date).toLocaleDateString()}
                            </div>
                            <div className="text-sm">Attendees: {booking.quantity}</div>
                            <div className="text-sm">
                              Total Price: ${booking.total_price.toFixed(2)}
                            </div>
                            <button
                              onClick={() => deleteBooking(booking.id)}
                              className="text-red-500 mt-2 hover:text-red-700"
                            >
                              Remove Booking
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {group.accommodation.length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-700 mb-2">
                          Apartment:
                        </h4>
                        {group.accommodation.map((booking: Booking) => (
                          <div
                            key={booking.id}
                            className="p-4 mb-4 bg-gray-50 border rounded-md shadow-sm"
                          >
                            <div className="font-semibold">
                              {booking.accommodation_name}
                            </div>
                            <div>
                              Dates: {new Date(booking.start_date).toLocaleDateString()} to{" "}
                              {new Date(booking.end_date).toLocaleDateString()}
                            </div>
                            <div className="text-sm">
                              Total Price: ${booking.total_price.toFixed(2)}
                            </div>
                            <button
                              onClick={() => deleteBooking(booking.id)}
                              className="text-red-500 mt-2 hover:text-red-700"
                            >
                              Remove Booking
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No bookings found.</p>
          )}
        </>
      ) : (
        <p>You need to be logged in to view your bookings.</p>
      )}

      <DeleteBookingModal
        isOpen={isModalOpen}
        onConfirm={confirmDeleteBooking}
        onCancel={cancelDeleteBooking}
        bookingId={selectedBookingId!}
      />
    </div>
  );
}

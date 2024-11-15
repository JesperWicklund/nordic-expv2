"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
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
  start_date: string; // Add start date
  end_date: string; // Add end date
};

type User = {
  id: string;
  email: string;
  // name: string; // Remove the name property if it's not provided by Supabase
};

export default function UserBookings() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Track modal state
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  ); // Track selected booking for deletion

  useEffect(() => {
    const getUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || "",
          // name: data.session.user.user_metadata.full_name, // Map the name if available
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
      .select("*, total_price, quantity, start_date, end_date") // Ensure to include `quantity`
      .eq("user_id", userId);

    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
      setLoading(false);
      return;
    }

    const bookingsWithDetails = await Promise.all(
      bookingsData.map(async (booking: Booking) => {
        // Fetch event details if it exists
        if (booking.event_id) {
          const { data: eventData, error: eventError } = await supabase
            .from("events")
            .select("title, date")
            .eq("id", booking.event_id)
            .single();

          if (eventError) {
            console.error("Error fetching event title and date:", eventError);
          } else {
            booking.event_title = eventData?.title;
            booking.event_date = eventData?.date;
          }
        }

        // Fetch accommodation details if it exists
        if (booking.accommodation_id) {
          const { data: accommodationData, error: accommodationError } =
            await supabase
              .from("accommodations")
              .select("name, date")
              .eq("id", booking.accommodation_id)
              .single();

          if (accommodationError) {
            console.error(
              "Error fetching accommodation details:",
              accommodationError
            );
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

  const groupedBookings = bookings.reduce(
    (
      groups: { [key: string]: { event: Booking[]; accommodation: Booking[] } },
      booking: Booking
    ) => {
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
    },
    {}
  );

  const deleteBooking = async (bookingId: number) => {
    setSelectedBookingId(bookingId); // Set the selected booking ID
    setIsModalOpen(true); // Open the modal
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
      setIsModalOpen(false); // Close the modal
    }
  };

  const cancelDeleteBooking = () => {
    setIsModalOpen(false); // Close the modal without deleting
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Bookings</h2>
      {user ? (
        <>
          <p className="text-gray-700 mb-4">Upcoming</p>
          {Object.keys(groupedBookings).length > 0 ? (
            <ul>
              {Object.entries(groupedBookings).map(([date, group]) => (
                <li key={date} className="mb-6">
                  <div className="text-gray-800 border-b-2">
                    <h3 className="font-semibold text-lg mb-2">
                      Booking made: {new Date(date).toLocaleDateString()}
                    </h3>

                    {group.event.length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-700">
                          Events:
                        </h4>
                        {group.event.map((booking: Booking) => (
                          <div key={booking.id} className="mb-2 text-gray-600">
                            <div>Event: {booking.event_title}</div>
                            <div>
                              Start Date:{" "}
                              {new Date(
                                booking.start_date
                              ).toLocaleDateString()}
                            </div>{" "}
                            {/* Display start date */}
                            <div>
                              End Date:{" "}
                              {new Date(booking.end_date).toLocaleDateString()}
                            </div>{" "}
                            {/* Display end date */}
                            <div>Attendees: {booking.quantity}</div>
                            <div className="text-sm">
                              Total Price: ${booking.total_price.toFixed(2)}
                            </div>
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
                        <h4 className="text-md font-semibold text-gray-700">
                          Accommodations:
                        </h4>
                        {group.accommodation.map((booking: Booking) => (
                          <div key={booking.id} className="mb-2 text-gray-600">
                            <div>
                              Accommodation: {booking.accommodation_name}
                            </div>
                            <div>
                              Start Date:{" "}
                              {new Date(
                                booking.start_date
                              ).toLocaleDateString()}
                            </div>{" "}
                            {/* Display start date */}
                            <div>
                              End Date:{" "}
                              {new Date(booking.end_date).toLocaleDateString()}
                            </div>{" "}
                            {/* Display end date */}
                            <div className="text-sm">
                              Total Price: ${booking.total_price.toFixed(2)}
                            </div>
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
      <DeleteBookingModal
        isOpen={isModalOpen}
        onConfirm={confirmDeleteBooking}
        onCancel={cancelDeleteBooking}
        bookingId={selectedBookingId!}
      />
    </div>
  );
}

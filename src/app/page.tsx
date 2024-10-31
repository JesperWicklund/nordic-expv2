import EventsList from '@/components/EventList'
import Header from '@/components/mobile/Header'
import Tags from '@/components/Tags'
import React from 'react'

export default function home() {
  return (
    <div>
      <Header />
      <Tags></Tags>
      <div className='p-4'>

      <EventsList />
      </div>
    </div>
  )
}

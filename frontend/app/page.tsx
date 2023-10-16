import React from 'react'
import { getChildCares } from "@/app/utilities/childcares-service";
import ChildCaresWrapper from '@/app/components/ChildCaresWrapper';

interface ChildCare {
  uuid: string,
  name: string,
  type: string,
  address: string,
  city: string,
  province: string,
  postalCode: string,
  phoneNumber: string,
  googleMapsLink: string,
  capacity: number,
  placeId: string,
  latitude: number,
  longitude: number,
  website: string,
  googleRating: number,
  createdAt: string,
  updatedAt: string,
}

const HomePage = async () => {

  let childCares: ChildCare[] = await getChildCares()
  // Filter out childCares with non-null latitudes and longitudes
  childCares = [...childCares.filter(
    (childCare) => childCare.latitude !== null && childCare.longitude !== null
  )];
  return <ChildCaresWrapper childCares={childCares} />

}

export default HomePage
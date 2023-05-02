import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { getServicesFee } from 'pages/BikeDetails/BikeDetails.utils';
import { OverviewContainer } from './BikeRent.styles';
import apiClient from 'services/api';
import { BikeRentForm } from '../BikeRentForm/BikeRentForm.component';
import { BikeRentConfirmation } from '../BikeRentConfirmation/BikeRentConfirmation.component';
import Bike from 'models/Bike';
import { AxiosError } from 'axios';

interface BikeRentProps { 
  rateByDay: number
  bike: Bike
}

type Rent = {
  rentAmount: number
  fee: number
  totalAmount: number
}

type DataToRent = {
  bikeId: number
  userId: number
  dateFrom: string
  dateTo: string
}

export const BikeRent = ({ bike, rateByDay }: BikeRentProps) => {
  const [rent, setRent] = useState<Rent>()
  const [submitError, setSubmitError] = useState<'SERVER_ERROR' | 'UNAVAILABLE_BIKE_ERROR' | undefined>()
  const userId = Number(process.env.REACT_APP_BOILERPLATE_USER_ID)

  async function submitRent(dataToRent: DataToRent) {
    try {
      const rentResponse = await apiClient.post('bikes/rent', { ...dataToRent, userId })
      setRent(rentResponse.data)
    } catch (error) {
      const { response } = error as AxiosError<{ errorType: string, message: string }>
      if (response?.data?.errorType === 'UnavailableBikeError') {
        setSubmitError('UNAVAILABLE_BIKE_ERROR')
      } else {
        setSubmitError('SERVER_ERROR')
      }
    }
  }

  return <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <OverviewContainer variant='outlined' data-testid='bike-overview-container'>
        { 
          rent ? (
            <BikeRentConfirmation bike={bike} />
          ) : (
            <BikeRentForm rateByDay={rateByDay} bikeId={bike.id} onSubmit={submitRent} submitError={submitError} />
          )
        }
      </OverviewContainer>
    </LocalizationProvider>
  </>
}
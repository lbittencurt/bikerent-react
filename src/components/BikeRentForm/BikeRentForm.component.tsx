import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { getServicesFee } from 'pages/BikeDetails/BikeDetails.utils';
import apiClient from 'services/api';
import { BookingButton, InfoIcon, PriceRow } from './BikeRent.styles';

export const BikeRentForm = ({ rateByDay, bikeId, onSubmit, submitError }: any) => {
  const TODAY = dayjs(new Date())
  const [startDate, setStartDate] = useState<Dayjs | null>(TODAY);
  const [endDate, setEndDate] = useState<Dayjs | null>(TODAY);
  const [subtotal, setSubTotal] = useState(rateByDay)
  const [servicesFee, setServicesFee] = useState(getServicesFee(rateByDay))
  const [total, setTotal] = useState(rateByDay + getServicesFee(rateByDay))

  async function updateAmount() {
    const newAmount = await apiClient.post('/bikes/amount', {
      bikeId,
      dateFrom: startDate?.format('YYYY-MM-DD'),
      dateTo: endDate?.format('YYYY-MM-DD')
    })

    setSubTotal(newAmount.data.rentAmount)
    setServicesFee(newAmount.data.fee)
    setTotal(newAmount.data.totalAmount)
  }

  function handleSubmit() {
    onSubmit({
      bikeId,
      dateFrom: startDate?.format('YYYY-MM-DD'),
      dateTo: endDate?.format('YYYY-MM-DD')
    })
  }
  
  return (
    <>
      <Typography variant='h1' fontSize={16} marginBottom={2} paddingBottom={1}>
        Select date and time
      </Typography>
      <Stack direction="row" gap="1rem" marginBottom="2.5rem" marginTop="1rem">
        <DatePicker
          label="Start date"
          value={startDate}
          minDate={TODAY}
          onChange={(newValue) => {
            setStartDate(newValue);
            if (newValue?.isAfter(endDate)) {
              setEndDate(newValue);
            }
            updateAmount()
          }}
          renderInput={(params) => <TextField data-testid="start-date-picker" fullWidth {...params} />}
        />
        <DatePicker
          label="End date"
          value={endDate}
          minDate={startDate}
          onChange={(newValue) => {
            setEndDate(newValue);
            updateAmount()
          }}
          renderInput={(params) => <TextField data-testid="end-date-picker" error fullWidth {...params} />}
        />
      </Stack>
      
      <Typography variant='h2' fontSize={16} marginBottom={1.25}>
        Booking Overview
      </Typography>

      <Divider />

      <PriceRow marginTop={1.75} data-testid='bike-overview-single-price'>
        <Box display='flex' alignItems='center'>
          <Typography marginRight={1}>Subtotal</Typography>
          <InfoIcon fontSize='small' />
        </Box>

        <Typography>{Number(subtotal).toFixed(2)} €</Typography>
      </PriceRow>

      <PriceRow marginTop={1.5} data-testid='bike-overview-single-price'>
        <Box display='flex' alignItems='center'>
          <Typography marginRight={1}>Service Fee</Typography>
          <InfoIcon fontSize='small' />
        </Box>

        <Typography>{Number(servicesFee).toFixed(2)} €</Typography>
      </PriceRow>

      <PriceRow marginTop={1.75} data-testid='bike-overview-total'>
        <Typography fontWeight={800} fontSize={16}>
          Total
        </Typography>
        <Typography variant='h2' fontSize={24} letterSpacing={1}>
          {Number(total).toFixed(2)} €
        </Typography>
      </PriceRow>

      <BookingButton
        fullWidth
        disableElevation
        variant='contained'
        data-testid='bike-booking-button'
        onClick={handleSubmit}
      >
        Add to booking
      </BookingButton>

      {
        submitError && (
          <Typography variant='h4' fontSize={14} marginTop={2} marginBottom={2} color="red" textAlign="center">
            { submitError === 'UNAVAILABLE_BIKE_ERROR' ? 'Bike is not available for the days selected.' : 'Sorry but went something wrong, please try again latter.'}
          </Typography>
        )
      }
    </>
  )
}
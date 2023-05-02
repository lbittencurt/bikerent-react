import { render, screen, fireEvent } from '@testing-library/react'
import { BikeRentForm } from './BikeRentForm.component'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import userEvent from '@testing-library/user-event'
import dayjs from 'dayjs';
import apiClient from 'services/api';
import { act } from 'react-dom/test-utils'

jest.mock('services/api');

describe('BikeRentForm component', () => {
  const defaultComponentRender = () => {
    const rateByDay = 100
    const bikeId = 1
    const submitRent = jest.fn()
    const submitError = undefined

    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BikeRentForm rateByDay={rateByDay} bikeId={bikeId} onSubmit={submitRent} submitError={submitError} />
      </LocalizationProvider>
    )
  }

  it('should render date selection for start date and end date', () => {
    defaultComponentRender()
    const startDatePicker = screen.getByTestId('start-date-picker')
    expect(startDatePicker).toBeInTheDocument()
    const endDatePicker = screen.getByTestId('end-date-picker')
    expect(endDatePicker).toBeInTheDocument()
  })

  it('should render subtotal, serviceFee and total correctly', () => {
    defaultComponentRender()
    
    const subtotal = screen.getByText('100.00 €')
    const serviceFee = screen.getByText('15.00 €')
    const total = screen.getByText('115.00 €')

    expect(subtotal).toBeInTheDocument()
    expect(serviceFee).toBeInTheDocument()
    expect(total).toBeInTheDocument()
  })

  it('should render "Add to booking" button and call submitRent method when button was clicked', () => {
    const TODAY = dayjs(new Date())

    const rateByDay = 100
    const bikeId = 1
    const submitRent = jest.fn()
    const submitError = undefined

    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BikeRentForm rateByDay={rateByDay} bikeId={bikeId} onSubmit={submitRent} submitError={submitError} />
      </LocalizationProvider>
    )
    
    const submitButton = screen.getByRole('button', { name: 'Add to booking'})
    expect(submitButton).toBeInTheDocument()

    userEvent.click(submitButton)
    expect(submitRent).toHaveBeenCalledWith({
      bikeId: 1,
      dateFrom: TODAY.format('YYYY-MM-DD'),
      dateTo: TODAY.format('YYYY-MM-DD'),
    })
  })

  it('should render new subtotal, serviceFee and total values when rent date is changed', async () => {
    const TODAY = dayjs(new Date())
    const TODAY_PLUS_TWO_DAYS = TODAY.add(2, 'day')

    const rateByDay = 100
    const bikeId = 1
    const submitRent = jest.fn()
    const submitError = undefined

    jest.spyOn(apiClient, 'post').mockResolvedValue({ data: {
      rentAmount: 130,
      fee: 19.5,
      totalAmount: 149.5
    }})

    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BikeRentForm rateByDay={rateByDay} bikeId={bikeId} onSubmit={submitRent} submitError={submitError} />
      </LocalizationProvider>
    )
    
    const subtotal = screen.getByText('100.00 €')
    const serviceFee = screen.getByText('15.00 €')
    const total = screen.getByText('115.00 €')

    expect(subtotal).toBeInTheDocument()
    expect(serviceFee).toBeInTheDocument()
    expect(total).toBeInTheDocument()

    const endDateInput = screen.getByRole('textbox', { name: 'End date' })
    expect(endDateInput).toHaveValue(TODAY.format('MM/DD/YYYY'))
    
    await act(() => {
      fireEvent.change(endDateInput, { target: { value: TODAY_PLUS_TWO_DAYS.format('MM/DD/YYYY') } })
    })

    expect(endDateInput).toHaveValue(TODAY_PLUS_TWO_DAYS.format('MM/DD/YYYY'))
    const newSubtotal = screen.getByText('130.00 €')
    const newServiceFee = screen.getByText('19.50 €')
    const newTotal = screen.getByText('149.50 €')

    expect(newSubtotal).toBeInTheDocument()
    expect(newServiceFee).toBeInTheDocument()
    expect(newTotal).toBeInTheDocument()
  })

  it('should set end date equal to start date when start date is changed to date after the end date', async () => {
    const TODAY = dayjs(new Date())
    const TODAY_PLUS_TWO_DAYS = TODAY.add(2, 'day')

    const rateByDay = 100
    const bikeId = 1
    const submitRent = jest.fn()
    const submitError = undefined

    jest.spyOn(apiClient, 'post').mockResolvedValue({ data: {
      rentAmount: 130,
      fee: 19.5,
      totalAmount: 149.5
    }})

    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BikeRentForm rateByDay={rateByDay} bikeId={bikeId} onSubmit={submitRent} submitError={submitError} />
      </LocalizationProvider>
    )

    const startDateInput = screen.getByRole('textbox', { name: 'Start date' })
    const endDateInput = screen.getByRole('textbox', { name: 'End date' })
    
    expect(startDateInput).toHaveValue(TODAY.format('MM/DD/YYYY'))
    expect(endDateInput).toHaveValue(TODAY.format('MM/DD/YYYY'))
    
    await act(() => {
      fireEvent.change(startDateInput, { target: { value: TODAY_PLUS_TWO_DAYS.format('MM/DD/YYYY') } })
    })

    expect(startDateInput).toHaveValue(TODAY_PLUS_TWO_DAYS.format('MM/DD/YYYY'))
    expect(endDateInput).toHaveValue(TODAY_PLUS_TWO_DAYS.format('MM/DD/YYYY'))
  })

  it('should change start date and keep current end date when new start date is before end date', async () => {
    const TODAY = dayjs(new Date())
    const TODAY_PLUS_TWO_DAYS = TODAY.add(2, 'day')
    const TODAY_PLUS_FIVE_DAYS = TODAY.add(5, 'day')

    const rateByDay = 100
    const bikeId = 1
    const submitRent = jest.fn()
    const submitError = undefined

    jest.spyOn(apiClient, 'post').mockResolvedValue({ data: {
      rentAmount: 130,
      fee: 19.5,
      totalAmount: 149.5
    }})

    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BikeRentForm rateByDay={rateByDay} bikeId={bikeId} onSubmit={submitRent} submitError={submitError} />
      </LocalizationProvider>
    )

    const startDateInput = screen.getByRole('textbox', { name: 'Start date' })
    const endDateInput = screen.getByRole('textbox', { name: 'End date' })
    
    expect(startDateInput).toHaveValue(TODAY.format('MM/DD/YYYY'))
    expect(endDateInput).toHaveValue(TODAY.format('MM/DD/YYYY'))

    await act(() => {
      fireEvent.change(endDateInput, { target: { value: TODAY_PLUS_FIVE_DAYS.format('MM/DD/YYYY') } })
    })
    await act(() => {
      fireEvent.change(startDateInput, { target: { value: TODAY_PLUS_TWO_DAYS.format('MM/DD/YYYY') } })
    })

    expect(startDateInput).toHaveValue(TODAY_PLUS_TWO_DAYS.format('MM/DD/YYYY'))
    expect(endDateInput).toHaveValue(TODAY_PLUS_FIVE_DAYS.format('MM/DD/YYYY'))
  })

  it('should show message "Bike is not available for the days selected." when submit error is UNAVAILABLE_BIKE_ERROR', () => {
    const UNAVAILABLE_BIKE_ERROR_MESSAGE = 'Bike is not available for the days selected.'

    const rateByDay = 100
    const bikeId = 1
    const submitRent = jest.fn()
    const submitError = 'UNAVAILABLE_BIKE_ERROR'

    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BikeRentForm rateByDay={rateByDay} bikeId={bikeId} onSubmit={submitRent} submitError={submitError} />
      </LocalizationProvider>
    )

    expect(screen.getByText(UNAVAILABLE_BIKE_ERROR_MESSAGE)).toBeInTheDocument()
  })

  it('should show message "Sorry but went something wrong, please try again latter." when submit error is a generic error', () => {
    const GENERIC_ERROR_MESSAGE = 'Sorry but went something wrong, please try again latter.'

    const rateByDay = 100
    const bikeId = 1
    const submitRent = jest.fn()
    const submitError = 'GENERIC_ERROR'

    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BikeRentForm rateByDay={rateByDay} bikeId={bikeId} onSubmit={submitRent} submitError={submitError} />
      </LocalizationProvider>
    )

    expect(screen.getByText(GENERIC_ERROR_MESSAGE)).toBeInTheDocument()
  })
})
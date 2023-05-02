import { act, fireEvent, render, screen } from '@testing-library/react'
import { BikeRent } from './BikeRent.component'
import apiClient from 'services/api';

jest.mock('services/api');

const bikeMock = {
  id: 431,
  candidateId: 27,
  name: 'Johnson LLC',
  type: 'Recumbent Bicycle',
  bodySize: 24,
  maxLoad: 90,
  rate: 131,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  ratings: 4.5,
  imageUrls: [
      'https://cremecycles.com/images/glowne/15.jpg',
      'https://cremecycles.com/images/glowne/12.jpg',
      'https://cremecycles.com/images/glowne/13.jpg'
  ]
}

describe('BikeRent component', () => {
  it('should render component correctly', () => {
    const rateByDay = 100
    render(<BikeRent bike={bikeMock} rateByDay={rateByDay} />)
    expect(screen.getByRole('heading', {name: 'Select date and time'})).toBeInTheDocument()
  })

  it('should call endpoint "/bikes/rent" when submit button was clicked and show rent confirmation for success', async () => {
    jest.spyOn(apiClient, 'post').mockResolvedValue({ data: {
      rentAmount: 130,
      fee: 19.5,
      totalAmount: 149.5
    }})

    const rateByDay = 100
    render(<BikeRent bike={bikeMock} rateByDay={rateByDay} />)

    const submitButton = screen.getByRole('button', { name: 'Add to booking'})

    await act(() => {
      fireEvent.click(submitButton)
    })

    expect(screen.getByRole('heading', { name: 'Thank you!' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Your bike is booked.' })).toBeInTheDocument()
  })

  it('should show bike unavailable message when endpoint "/bikes/rent" return error of type UnavailableBikeError', async () => {
    const UNAVAILABLE_BIKE_ERROR_MESSAGE = 'Bike is not available for the days selected.'
    
    jest.spyOn(apiClient, 'post').mockRejectedValue({
      response: {
        data: {
          errorType: 'UnavailableBikeError'
        }
      }
    })

    const rateByDay = 100
    render(<BikeRent bike={bikeMock} rateByDay={rateByDay} />)

    const submitButton = screen.getByRole('button', { name: 'Add to booking'})

    await act(() => {
      fireEvent.click(submitButton)
    })

    expect(screen.getByText(UNAVAILABLE_BIKE_ERROR_MESSAGE)).toBeInTheDocument()
  })

  it('should show generic error message when endpoint "/bikes/rent" return error different of type UnavailableBikeError', async () => {
    const GENERIC_ERROR_MESSAGE = 'Sorry but went something wrong, please try again latter.'
    
    jest.spyOn(apiClient, 'post').mockRejectedValue({
      response: {
        data: {
          errorType: 'ServerError'
        }
      }
    })

    const rateByDay = 100
    render(<BikeRent bike={bikeMock} rateByDay={rateByDay} />)

    const submitButton = screen.getByRole('button', { name: 'Add to booking'})

    await act(() => {
      fireEvent.click(submitButton)
    })

    expect(screen.getByText(GENERIC_ERROR_MESSAGE)).toBeInTheDocument()
  })
})
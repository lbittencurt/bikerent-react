import { render, screen } from '@testing-library/react'
import { BikeRentConfirmation } from './BikeRentConfirmation.component'

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

describe('BikeRentConfirmation component', () => {
  it('should render component correctly', () => {
    render(<BikeRentConfirmation bike={bikeMock} />)
    
    expect(screen.getByRole('heading', { name: 'Thank you!' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Your bike is booked.' })).toBeInTheDocument()
    expect(screen.getByTestId('bike-image-rent-confirmation')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: bikeMock.name })).toBeInTheDocument()
    expect(screen.getByText(bikeMock.type)).toBeInTheDocument()
  })
})
import { Box, Typography } from '@mui/material'
import { Container } from './BikeRentConfirmation.styles'
import { BikeImage } from 'components/BikeCard/BikeCard.styles'
import { useState } from 'react'
import BikeType from 'components/BikeType'
import Bike from 'models/Bike'

interface BikeRentConfirmationProps {
  bike: Bike
}

export const BikeRentConfirmation = ({ bike }: BikeRentConfirmationProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const handleIsImageLoaded = (isLoading: boolean) => {
    setIsImageLoaded(isLoading)
  }

  return (
    <Container>
      <Typography variant='h1' fontSize={30} marginBottom={2} paddingBottom={1}>
        Thank you!
      </Typography>
      <Typography variant='h3' fontSize={20} marginBottom={2} paddingBottom={2}>
        Your bike is booked.
      </Typography>
      <BikeImage
        src={bike.imageUrls[0]}
        isLoaded={isImageLoaded}
        width='50%'
        alt='Bike Image'
        data-testid='bike-image-rent-confirmation'
        onLoadStart={() => handleIsImageLoaded(false)}
        onLoad={() => handleIsImageLoaded(true)}
      />
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography
          variant='h3'
          fontSize={20}
          fontWeight={600}
          marginTop={3}
          marginBottom={0.5}
          data-testid='bike-name-details-rent-confirmation'
        >
          {bike.name}
        </Typography>

        <BikeType type={bike.type} />
      </Box>
    </Container>
  )
}
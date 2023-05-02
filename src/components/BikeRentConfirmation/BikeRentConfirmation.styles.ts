import { Box, BoxProps, styled } from '@mui/material';

export const Container = styled(Box)<BoxProps>(({ theme }) => ({
  paddingTop: '2rem',
  paddingBottom: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}))
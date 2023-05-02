import {
  Card,
  CardProps,
  styled,
} from '@mui/material'

export const OverviewContainer = styled(Card)<CardProps>(({ theme }) => ({
  borderColor: theme.palette.grey[500],
  padding: 34,
  maxHeight: 500,
  height: 460
}))
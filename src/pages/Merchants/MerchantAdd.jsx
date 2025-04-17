import React from 'react'
import { Container } from '@mui/material'
import CreateMerchantForm from '../../components/Merchants/CreateMerchantForm'

function MerchantAdd() {
  return (
    <Container sx={{ maxWidth:{xs: '100%', md: '95%', lg: '75%', xl: '60%'}  }} maxWidth={false}>
      <CreateMerchantForm />
    </Container >
  )
}

export default MerchantAdd
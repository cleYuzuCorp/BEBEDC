const axios = require('axios')

exports.main = async (context = {}) => {
  const { value, objectId, dealId } = context.parameters

  const baseUrl = process.env.BASE_URL_HUBAPI

  try {
    const response = await axios.patch(
      `${baseUrl}/crm/v3/objects/deals/${dealId}`,
      {
        properties: {
          [objectId]: value
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY_BEBEDC}`
        }
      }
    )
    return (response.data)
  } catch (e) {
    if (e.response) {
      return {
        status: 'ERROR',
        message: e.response.data.message || 'Une erreur s\'est produite',
        statusCode: e.response.status
      }
    } else {
      return {
        status: 'ERROR',
        message: 'Une erreur inattendue s\'est produite',
        statusCode: 500
      }
    }
  }
}
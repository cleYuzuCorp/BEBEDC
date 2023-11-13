const axios = require('axios')

exports.main = (context = {}, sendResponse) => {
  const { value, objectId, dealId } = context.parameters
  const token = "pat-na1-7f355bc7-e8cb-4e2b-84b0-efb2eb3bdf64"
  return updateProps(token, dealId, objectId, value)
    .then(() => {
      sendResponse({ status: 'success' })
    })
    .catch((e) => {
      sendResponse({ status: 'error', message: e.message })
    })
}

const updateProps = (token, dealId, objectId, value) => {
  return axios.patch(
    `https://api.hubapi.com/crm/v3/objects/deals/${dealId}`,
    {
      properties: {
        [objectId]: value,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  )
}